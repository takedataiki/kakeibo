<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const { $supabase } = useNuxtApp()
const expenses = ref([])
const title = ref('')
const amount = ref('')
const category = ref('Food')

const fetchExpenses = async () => {
  const { data } = await $supabase.from('expenses').select('*').order('created_at', { ascending: false })
  expenses.value = data || []
}

const addExpense = async () => {
  if (!title.value || !amount.value) return
  await $supabase.from('expenses').insert([
    { title: title.value, amount: parseInt(amount.value), category: category.value }
  ])
  title.value = ''
  amount.value = ''
  await fetchExpenses()
}

onMounted(fetchExpenses)

const chartData = computed(() => {
  const categories = expenses.value.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  return {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']
      }
    ]
  }
})
</script>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">家計簿アプリ</h1>

    <!-- 入力フォーム -->
    <form @submit.prevent="addExpense" class="flex gap-2 mb-6">
      <input v-model="title" placeholder="内容" class="border p-2 flex-1" />
      <input v-model="amount" type="number" placeholder="金額" class="border p-2 w-24" />
      <select v-model="category" class="border p-2">
        <option>食費</option>
        <option>交通費</option>
        <option>家賃</option>
        <option>水道光熱費</option>
        <option>支払い</option>
        <option>娯楽</option>
        <option>その他</option>
      </select>
      <button type="submit" class="bg-blue-500 text-white px-3 py-2 rounded">追加</button>
    </form>

    <!-- グラフ -->
    <Pie :data="chartData" class="mb-6" />

    <!-- 履歴 -->
    <ul>
      <li v-for="e in expenses" :key="e.id" class="border-b py-2">
        {{ e.title }} - {{ e.amount }}円 ({{ e.category }})
      </li>
    </ul>
  </div>
</template>
