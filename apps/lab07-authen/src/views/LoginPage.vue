<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- EMAIL LOGIN -->
      <ion-item>
        <ion-input v-model="email" placeholder="Email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input v-model="password" type="password" placeholder="Password"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="loginEmail">
        LOGIN EMAIL
      </ion-button>

      <!-- GOOGLE LOGIN -->
      <ion-button expand="block" @click="loginGoogle">
        LOGIN GOOGLE
      </ion-button>

      <!-- PHONE LOGIN -->
      <ion-item>
        <ion-input v-model="phone" placeholder="+66812345678"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="sendOTP">
        SEND OTP
      </ion-button>

      <ion-item>
        <ion-input v-model="otp" placeholder="OTP"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="confirmOTP">
        CONFIRM OTP
      </ion-button>

      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");

const phone = ref("");
const otp = ref("");
const verificationId = ref("");

// EMAIL
async function loginEmail() {
  try {
    await authService.loginWithEmailPassword({
      email: email.value.trim(),
      password: password.value,
    });
    router.push("/tabs/tab1");
  } catch (e:any) {
    alert(e.message);
  }
}

// GOOGLE
async function loginGoogle() {
  try {
    await authService.loginWithGoogle();
    router.push("/tabs/tab1");
  } catch (e:any) {
    alert(e.message);
  }
}

// PHONE STEP 1
async function sendOTP() {
  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });
    verificationId.value = result.verificationId;
    alert("OTP sent");
  } catch (e:any) {
    alert(e.message);
  }
}

// PHONE STEP 2
async function confirmOTP() {
  try {
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otp.value,
    });
    router.push("/tabs/tab1");
  } catch (e:any) {
    alert(e.message);
  }
}
</script>