<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="user">

        <p><b>UID:</b> {{ user.uid }}</p>

        <p v-if="user.email">
          <b>Email:</b> {{ user.email }}
        </p>

        <p v-if="user.phoneNumber">
          <b>Phone:</b> {{ user.phoneNumber }}
        </p>

        <p v-if="user.displayName">
          <b>Name:</b> {{ user.displayName }}
        </p>

        <div v-if="user.photoUrl">
          <img :src="user.photoUrl" width="120" />
        </div>

        <!-- 🔥 ปุ่ม Logout -->
        <ion-button expand="block" color="danger" @click="logout">
          LOGOUT
        </ion-button>

      </div>

      <div v-else>
        <p>Loading user...</p>
      </div>

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
  IonButton
} from "@ionic/vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

const router = useRouter();
const user = ref<any>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

// 🔥 logout function
async function logout() {
  await authService.logout();
  router.replace("/login");
}
</script>