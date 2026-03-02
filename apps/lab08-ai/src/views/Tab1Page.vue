<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08 Gemini Vision</ion-title>
      </ion-toolbar>
    </ion-header>

     <ion-content class="ion-padding">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

      <ion-button expand="block" @click="fileEl?.click()">เลือกภาพ</ion-button>
      
      <video ref="videoEl" autoplay playsinline style="width:100%" v-if="showCamera"></video>
<canvas ref="canvasEl" hidden></canvas>
<ion-button v-if="showCamera" expand="block" @click="capturePhoto">
  📸 ถ่ายภาพ
</ion-button>
      <ion-button expand="block" @click="onTakePhoto">ถ่ายภาพ</ion-button>

      <ion-img v-if="previewUrl" :src="previewUrl" />

      <ion-button expand="block" :disabled="!img || loading" @click="onAnalyze">
        วิเคราะห์ภาพ
      </ion-button>

      <ion-spinner v-if="loading" />
      <pre v-if="result">{{ result }}</pre>
    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

import { Capacitor } from "@capacitor/core";

const fileEl = ref<HTMLInputElement | null>(null);
const videoEl = ref<HTMLVideoElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

const showCamera = ref(false);
let stream: MediaStream | null = null;

const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
}

async function onTakePhoto() {
  if (Capacitor.isNativePlatform()) {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
  } else {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      showCamera.value = true;
      await nextTick();

      if (videoEl.value) {
        videoEl.value.srcObject = stream;
      }
    } catch (err) {
      alert("ไม่สามารถเปิดกล้องได้ — โปรดอนุญาต camera");
    }
  }
}
function capturePhoto() {
  const video = videoEl.value!;
  const canvas = canvasEl.value!;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(video, 0, 0);

  const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

  img.value = {
    base64,
    mimeType: "image/jpeg"
  };

  previewUrl.value = `data:image/jpeg;base64,${base64}`;

  // ปิดกล้อง
  stream?.getTracks().forEach(track => track.stop());
  showCamera.value = false;
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  result.value = await GeminiVisionService.analyze(img.value);
  loading.value = false;
}
</script>