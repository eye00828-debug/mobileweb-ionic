import type { AccelSample, WorkoutState } from "./types";


export class ArmWorkoutEngine {
  
  private listeners = new Set<(s: WorkoutState) => void>();

  private lastUpTime = 0;
  private lastRepTime = 0;

  private peak = -999;
  private valley = 999;

  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach(cb => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.state.status = "RUNNING";
    this.state.repDisplay = 0;
    this.state.stats = {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
    };

    this.phase = "WAIT_UP";
    this.peak = -999;
    this.valley = 999;
    this.lastRepTime = Date.now();

    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    const y = sample.ay;              // แกนแนวตั้ง
    const side = Math.abs(sample.ax) + Math.abs(sample.az); // แกนข้าง

    /* ⭐ debug sensor */
console.log("Y:", y);
console.log("side:", side);


    const UP_TH = 2.0;
    const DOWN_TH = -1.5;
    const MIN_ROM = 3.0;
    const MIN_MS = 700;
    const MAX_MS = 3500;

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);

      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
        this.lastUpTime = sample.t;
      }

      return;
    }

    // WAIT_DOWN
    this.valley = Math.min(this.valley, y);

    if (y < DOWN_TH) {
      const repMs = sample.t - this.lastRepTime;
      this.lastRepTime = sample.t;

      this.state.stats.repsTotal++;

      const rom = this.peak - this.valley;
console.log("ROM:", rom);
console.log("repMs:", repMs);
      

      let ok = true;
      let msg = "ดีมาก";

      if (rom < MIN_ROM) {
        ok = false;
        msg = "ยกแขนต่ำเกินไป";
      } else if (repMs < MIN_MS) {
        ok = false;
        msg = "เร็วเกินไป";
      } else if (repMs > MAX_MS) {
        ok = false;
        msg = "ช้าเกินไป";
      } else if (side > 5) {
        ok = false;
        msg = "กรุณายกแนวตั้ง";
      }

      if (ok) {
        this.state.repDisplay++;
        this.state.stats.repsOk++;
        this.state.stats.score++;

        // ค่าเฉลี่ยแบบสะสม
        const n = this.state.stats.repsOk;
        this.state.stats.avgRepMs =
          Math.round(
            (this.state.stats.avgRepMs * (n - 1) + repMs) / n
          );
      } else {
        this.state.stats.repsBad++;
      }

      this.state.stats.lastMessage = msg;

      // reset สำหรับรอบถัดไป
      this.phase = "WAIT_UP";
      this.peak = -999;
      this.valley = 999;

      this.emit();
    }
  }
}