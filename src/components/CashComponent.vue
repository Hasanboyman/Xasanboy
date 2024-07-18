<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService';

const withdrawData = ref({
  amount: '',
  comment: ''
});

const router = useRouter();

const handleSubmit = async () => {
  if (!withdrawData.value.comment) {
    alert('Please write a note');
    return;
  }

  try {
    await apiService.withdrawMoney({
      amount: parseFloat(withdrawData.value.amount),
      comment: withdrawData.value.comment
    });
    await router.push('/kassa'); // Navigate to another page after successful withdrawal
  } catch (error) {
    console.error('Failed to withdraw money:', error);
  }
};
</script>

<template>
  <div style="box-shadow: 1px 0 8px black;" class="bg-white py-6">
    <span class="py-12 px-48 font-bold text-2xl">Cash Withdrawal</span>
  </div>

  <section id="log-in" class="flex justify-center min-h-52 py-36">
    <form @submit.prevent="handleSubmit" method="post"
      class="bg-white shadow-md border-black rounded-lg overflow-hidden items-center w-1/5 p-8">
      <label for="Summa" class="block text-base mb-2">Summa</label>
      <input type="number" id="Summa" v-model="withdrawData.amount"
        class="border w-full text-base px-2 py-1 rounded-full shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Summa kiriting">

      <label for="Izoh" class="block text-base mb-2 pt-6">Izoh</label>
      <input type="text" id="Izoh" v-model="withdrawData.comment"
        class="border w-full text-base px-2 py-1 rounded-full shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Izoh uchun joy">

      <div class="flex justify-center mt-5">
        <button type="submit"
          class="bg-violet-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
          Tasdiqlash
        </button>
      </div>
    </form>
  </section>
</template>