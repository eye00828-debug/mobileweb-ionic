<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- 🔹 สรุปผลรวม -->
      <ion-card>
        <ion-card-content>
          <p>รายรับรวม: <b class="income">{{ totalIncome }}</b> บาท</p>
          <p>รายจ่ายรวม: <b class="expense">{{ totalExpense }}</b> บาท</p>
          <p>คงเหลือ: <b>{{ totalIncome - totalExpense }}</b> บาท</p>
        </ion-card-content>
      </ion-card>

      <!-- 🔹 แสดงรายการแบบ Realtime -->
      <ion-list>
        <ion-item
          v-for="item in expenses"
          :key="item.id"
          button
          @click="goEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>
              {{ item.amount }} บาท |
              {{ item.type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
              <br />
              หมวด: {{ item.category }}
            </p>
          </ion-label>

          <ion-badge
            :color="item.type === 'income' ? 'success' : 'danger'"
          >
            {{ item.type }}
          </ion-badge>
        </ion-item>
      </ion-list>

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
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/vue';

import { ref, onMounted } from "vue";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const expenses = ref<any[]>([]);
const totalIncome = ref(0);
const totalExpense = ref(0);

onMounted(() => {
  const q = query(
    collection(db, "expenses"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    expenses.value = [];
    totalIncome.value = 0;
    totalExpense.value = 0;

    snapshot.forEach(doc => {
      const data:any = { id: doc.id, ...doc.data() };
      expenses.value.push(data);

      if (data.type === "income") {
        totalIncome.value += data.amount;
      } else {
        totalExpense.value += data.amount;
      }
    });
  });
});

const goEdit = (id: string) => {
  router.push(`/edit/${id}`);
};
</script>

<style scoped>
.income {
  color: green;
}
.expense {
  color: red;
}
</style>
