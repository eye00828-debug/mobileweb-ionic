<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>💪 Lab09 Arm Workout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- จำนวนรอบ -->
      <ion-card class="rep-card">
        <ion-card-content class="ion-text-center">
          <div class="rep-number">
            {{ state?.repDisplay ?? 0 }}
          </div>
          <div class="rep-label">REPS</div>
        </ion-card-content>
      </ion-card>

      <!-- สถิติ -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>📊 สถิติการออกกำลัง</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">รอบทั้งหมด</ion-col>
              <ion-col size="6" class="value">
                {{ state?.stats.repsTotal ?? 0 }}
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">รอบถูก</ion-col>
              <ion-col size="6" class="value ok">
                {{ state?.stats.repsOk ?? 0 }}
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">รอบผิด</ion-col>
              <ion-col size="6" class="value bad">
                {{ state?.stats.repsBad ?? 0 }}
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">คะแนน</ion-col>
              <ion-col size="6" class="value">
                {{ state?.stats.score ?? 0 }}
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">ความเร็วเฉลี่ย</ion-col>
              <ion-col size="6" class="value">
                {{ state?.stats.avgRepMs ?? 0 }} ms
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">เปอร์เซ็นต์ถูก</ion-col>
              <ion-col size="6" class="value">
                {{
                  state?.stats.repsTotal
                    ? Math.round(
                        (state.stats.repsOk /
                          state.stats.repsTotal) *
                          100
                      )
                    : 0
                }} %
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- สถานะ -->
      <ion-card>
        <ion-card-content class="ion-text-center">
          <h2>สถานะ</h2>

          <!-- ⭐ แสดงสถานะการทำงาน -->
          <div class="status-text">
            <span v-if="state?.status === 'RUNNING'">กำลังออกกำลังกาย</span>
            <span v-else-if="state?.status === 'STOPPED'">⛔ หยุดแล้ว</span>
            <span v-else>พร้อมเริ่ม</span>
          </div>

          <!-- ข้อความ feedback -->
          <div class="status-text">
            {{ state?.stats.lastMessage }}
          </div>

          <p class="sensor-text">{{ accelText }}</p>
        </ion-card-content>
    </ion-card>

      <!-- ปุ่มควบคุม -->
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button expand="block" color="success" @click="start">
              ▶ Start
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button expand="block" color="danger" @click="stop">
              ■ Stop
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- <ion-button expand="block" color="warning" @click="simulateRep">
        🧪 Test 1 Rep
      </ion-button> -->

    </ion-content>

    <ion-footer class="ion-padding ion-text-center">
      673380210-3 นางสาวชัญญานุช นิ่มน้อย
    </ion-footer>

  </ion-page>
</template>

<style scoped>

.rep-card {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.rep-number {
  font-size: 64px;
  font-weight: bold;
}

.rep-label {
  font-size: 18px;
  letter-spacing: 2px;
}

.value {
  text-align: right;
  font-weight: bold;
}

.ok {
  color: #2dd36f;
}

.bad {
  color: #eb445a;
}

.status-text {
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
}

.sensor-text {
  font-size: 12px;
  color: gray;
  margin-top: 10px;
}

</style>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,

  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,

  IonGrid,
  IonRow,
  IonCol

} from '@ionic/vue';
import { ref, onMounted } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";
import { HapticsService } from "../core/HapticsService";


const haptic = new HapticsService();
const state = ref<WorkoutState | null>(null);
const accelText = ref("no data");

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

onMounted(() => {
  engine.onChange(async (s) => {
    state.value = s;

    const msg = s.stats.lastMessage;
    if (!msg) return;

    try {
      await tts.stop();   // ⭐ หยุดก่อนพูด

      if (msg === "ดีมาก") {
        await haptic.success();
      } else {
        await tts.speak(msg);
        await haptic.warning();
      }

    } catch (e) {
      console.log("TTS skip", e);
    }
  });
});

async function start() {
  // รีเซ็ตสถานะก่อนเริ่ม (กันค่าค้างจากรอบก่อน)
  await motion.stop();
   await tts.stop();   // ⭐ เพิ่ม
  await tts.speak(
    "เริ่มกายบริหารแขน เริ่มจากแนบลำตัว แล้วยกขึ้นจนสุด จากนั้นลดลง"
  );

  engine.start();

  
  await motion.start((s) => {
    // (ตัวเลือก) แสดงค่า sensor บนจอเพื่อเช็คว่าทำงาน
    accelText.value =
      "X:" + s.ax.toFixed(2) +
      " Y:" + s.ay.toFixed(2) +
      " Z:" + s.az.toFixed(2);

    engine.process(s);
  });
}

async function stop() {
  await motion.stop();
  await tts.stop();   // ⭐ เพิ่ม
    await tts.speak("หยุด"); // ⭐ ให้พูดว่า "หยุด"
  engine.stop();
}

function simulateRep() {
  const now = Date.now();

  const samples = [
    { ay: 0, t: now },
    { ay: 1, t: now + 100 },
    { ay: 3, t: now + 200 },   // ขึ้นสุด
    { ay: 1, t: now + 400 },
    { ay: -2, t: now + 800 },  // ลงสุด
  ];

  samples.forEach((s) => {
    engine.process({
      ax: 0,
      az: 0,
      ay: s.ay,
      t: s.t,
    });
  });
}

function simulateWorkout() {
  engine.start();

  for (let i = 0; i < 5; i++) {
    const base = Date.now() + i * 1200;

    engine.process({ ax: 0, ay: 0, az: 0, t: base });
    engine.process({ ax: 0, ay: 3, az: 0, t: base + 200 });
    engine.process({ ax: 0, ay: -2, az: 0, t: base + 900 });
  }
}



</script>
