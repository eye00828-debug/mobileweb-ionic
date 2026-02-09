<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>เพิ่มรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="form-card">
        <ion-card-header>
          <ion-card-title>บันทึกรายการ</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-input
            label="ชื่อรายการ"
            label-placement="floating"
            fill="outline"
            v-model="title"
          />

          <ion-input
            label="จำนวนเงิน"
            label-placement="floating"
            fill="outline"
            type="number"
            class="mt"
            v-model="amount"
          />

          <ion-select
            label="ประเภท"
            label-placement="floating"
            fill="outline"
            class="mt"
            v-model="type"
          >
            <ion-select-option value="income">รายรับ</ion-select-option>
            <ion-select-option value="expense">รายจ่าย</ion-select-option>
          </ion-select>

          <ion-input
            label="หมวดหมู่"
            label-placement="floating"
            fill="outline"
            class="mt"
            v-model="category"
          />

          <ion-textarea
            label="หมายเหตุ"
            label-placement="floating"
            fill="outline"
            class="mt"
            auto-grow
            v-model="note"
          />

          <ion-button
            expand="block"
            size="large"
            color="success"
            class="mt-lg"
            @click="saveExpense"
          >
            บันทึกข้อมูล
          </ion-button>
        </ion-card-content>
      </ion-card>
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton
} from '@ionic/vue';

import { ref } from "vue";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  if (!title.value || amount.value === null) {
    alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
    return;
  }

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: serverTimestamp()
    });

    alert("บันทึกข้อมูลเรียบร้อยแล้ว");

    // reset form
    title.value = "";
    amount.value = null;
    type.value = "expense";
    category.value = "";
    note.value = "";

  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};
</script>

<style scoped>
.form-card {
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.mt {
  margin-top: 12px;
}

.mt-lg {
  margin-top: 24px;
}
</style>
