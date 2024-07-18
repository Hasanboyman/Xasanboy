<template>
  <section id="log-in" class="flex justify-center min-h-screen items-center" style="background: url('background.jpg'); background-size: cover;">
    <form @submit.prevent="login" v-if="!isLoading" class="bg-white shadow-md border-black rounded-lg overflow-hidden w-96 p-8 animate__animated animate__fadeIn">
      <div class="mb-8">
        <h1 class="text-3xl block text-center font-semibold mt-5 animate__animated animate__bounceIn">
          <i class="fa-solid fa-user pr-4"></i> Hush kelibsiz
        </h1>
      </div>
      <hr class="mt-3">
      <div class="mt-3 animate__animated animate__fadeInUp">
        <label for="email" class="block text-base mb-2">Email address</label>
        <input type="text" id="email" v-model="email"
               class="border w-full text-base px-2 py-1 rounded-3xl focus:outline-none focus:ring-0 focus:border-blue-300"
               placeholder="Email address" :disabled="isLoading">
      </div>
      <div class="mt-3 animate__animated animate__fadeInUp">
        <label for="password" class="block text-base mb-2">Parol</label>
        <input type="password" id="password" v-model="password"
               class="border w-full text-base px-2 py-1 rounded-3xl focus:outline-none focus:ring-0 focus:border-blue-300"
               placeholder="Password" :disabled="isLoading">
      </div>
      <div class="mt-16 flex justify-between items-center animate__animated animate__fadeInUp">
        <div class="flex justify-center">
          <button type="submit"
                  class="bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300"
                  :disabled="isLoading">
            Kirish
          </button>
        </div>
      </div>
    </form>
    <div v-if="isLoading" class="mt-5 flex justify-center">
      <h1 style="position: absolute; bottom: 590px; left: 890px; font-size: 50px;">Loading...</h1>
      <div class="loader"></div> <!-- Loader element -->
    </div>
  </section>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px dotted #3498db; /* Blue */
  border-left: 4px dotted #3498db; /* Blue */
  border-radius: 50%;
  width: 65px;
  height: 65px;
  animation: spin 2s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -20px 0 0 -20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService'; // Ensure this path is correct

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.login({
      username: email.value,
      password: password.value,
    });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    router.push('/kassa');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid credentials, please try again.');
    isLoading.value = false;
  }
};
</script>
