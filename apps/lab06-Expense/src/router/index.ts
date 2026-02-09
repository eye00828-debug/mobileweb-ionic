import { createRouter, createWebHashHistory, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
   {
    path: '/',
    redirect: '/tabs/add' // 🔥 เข้าเว็บปุ๊บ → หน้าเพิ่ม
  },
 {
  path: '/tabs',
  component: TabsPage,
  children: [
    {
      path: '',
      redirect: '/tabs/add'
    },
    {
      path: 'add',
      component: () => import('@/views/AddExpense.vue')
    },
    {
      path: 'list',
      component: () => import('@/views/ExpenseList.vue')
    },{
  path: '/edit/:id',
  component: () => import('@/views/EditExpense.vue')
}
  ]
}

]

const router = createRouter({
  // 🔥 สำคัญมาก
  history: createWebHashHistory(),
  routes
})

export default router
