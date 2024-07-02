<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService';

// Reactive variables for form data
const serviceData = ref({
  name: '',
  price: '',
  permissions: [],
  typeOf: ''
});

const categories = ref([]);
const router = useRouter();

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await apiService.getAllCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

// Function to create a new service
const createService = async () => {
  try {
    await apiService.createService(serviceData.value);
    alert('Service created successfully');
    router.push('/xizmatlar');
  } catch (error) {
    console.error('Error creating service:', error);
    if (error.response) {
      alert('Failed to create service: ' + error.response.data.detail);
    } else {
      alert('Failed to create service. Please try again later.');
    }
  }
};

onMounted(fetchCategories);
</script>



<template>
  <div class="bg-white py-6 shadow-md">
    <span class="py-12 px-48 font-bold text-2xl">Update Service</span>
  </div>

  <section id="log-in" class="flex justify-center min-h-52 py-20">
    <form @submit.prevent="createService" method="post"
      class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
      <label for="name" class="block text-base mb-2">Service Name</label>
      <input v-model="serviceData.name" type="text" id="name"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Service Name">

      <label for="price" class="block text-base mb-2 mt-8">Price</label>
      <input v-model="serviceData.price" type="number" id="price"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Service Price">

      <label for="typeOf" class="block text-base mb-2 mt-8">Type Of</label>
      <select v-model.number="serviceData.typeOf" id="typeOf"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
        <option value="">Select Type</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>

      <label for="permissions" class="block text-base mb-2 mt-8">Permissions</label>
      <select v-model="serviceData.permissions" multiple
        class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
        <option value="1">Kassadan pul olish</option>
        <option value="2">Inkassa qilish</option>
        <option value="3">Kassani ko'rish</option>
        <option value="4">Buyurtmalarni ko'rish</option>
      </select>

      <div class="mt-16 flex justify-end items-center">
        <button type="submit"
          class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
          Create
        </button>
      </div>
    </form>
  </section>
</template>
