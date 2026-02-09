<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>แก้ไขรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>

          <ion-input
            label="ชื่อรายการ"
            label-placement="floating"
            fill="outline"
            v-model="title"
          />

          <ion-input
            label="จำนวนเงิน"
            type="number"
            label-placement="floating"
            fill="outline"
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

          <!-- 🔹 ปุ่มบันทึก -->
          <ion-button
            expand="block"
            color="success"
            class="mt-lg"
            @click="updateExpense"
          >
            บันทึกการแก้ไข
          </ion-button>

          <!-- 🔥 ปุ่มลบ -->
          <ion-button
            expand="block"
            color="danger"
            fill="outline"
            class="mt"
            @click="confirmDelete"
          >
            ลบรายการนี้
          </ion-button>

        </ion-card-content>
      </ion-card>

      <!-- 🔥 Alert ยืนยันการลบ -->
      <ion-alert
        :is-open="showAlert"
        header="ยืนยันการลบ"
        message="คุณต้องการลบรายการนี้ใช่หรือไม่?"
        :buttons="alertButtons"
        @didDismiss="showAlert = false"
      />
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
  IonButton,
  IonCard,
  IonCardContent,
  IonAlert
} from '@ionic/vue';

import { ref, onMounted } from "vue";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

// 🔹 alert
const showAlert = ref(false);

onMounted(async () => {
  const snap = await getDoc(doc(db, "expenses", id));
  if (snap.exists()) {
    const data: any = snap.data();
    title.value = data.title;
    amount.value = data.amount;
    type.value = data.type;
    category.value = data.category;
    note.value = data.note;
  }
});

// 🔹 update
const updateExpense = async () => {
  if (!title.value || amount.value === null) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  await updateDoc(doc(db, "expenses", id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    updatedAt: serverTimestamp()
  });

  alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
  router.replace("/tabs/list");
};

// 🔥 confirm delete
const confirmDelete = () => {
  showAlert.value = true;
};

// 🔥 delete จริง
const deleteExpense = async () => {
  await deleteDoc(doc(db, "expenses", id));
  alert("ลบข้อมูลเรียบร้อยแล้ว");
  router.replace("/tabs/list");
};

// ปุ่มใน alert
const alertButtons = [
  {
    text: "ยกเลิก",
    role: "cancel"
  },
  {
    text: "ลบ",
    role: "destructive",
    handler: deleteExpense
  }
];
</script>

<style scoped>
.mt {
  margin-top: 12px;
}
.mt-lg {
  margin-top: 24px;
}
</style>
