<template>
  <ion-page>
    <ion-tabs>

      <!-- 🔹 outlet สำหรับแท็บ -->
      <ion-router-outlet></ion-router-outlet>

      <!-- 🔹 tab bar -->
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="add" href="/tabs/add">
          <ion-icon :icon="addCircle" />
          <ion-label>เพิ่ม</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="list" href="/tabs/list">
          <ion-icon :icon="list" />
          <ion-label>รายการ</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet
} from '@ionic/vue';

import {
  addCircle,
  list,
  pieChart
} from 'ionicons/icons';
</script>
