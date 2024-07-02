<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiService from '../services/apiService';

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const serviceId = route.params.id;

const serviceData = ref({
  name: '',
  description: ''
});

const fetchService = async () => {
  try {
    const response = await apiService.getAllServices();
    const service = response.data.find(s => s.id == serviceId);
    if (service) {
      serviceData.value = service;
      isEdit.value = true;
    }
  } catch (error) {
    console.error('Failed to fetch service:', error);
  }
};

const saveService = async () => {
  try {
    if (isEdit.value) {
      await apiService.updateService(serviceId, serviceData.value);
    } else {
      await apiService.createService(serviceData.value);
    }
    router.push('/xizmatlar');
  } catch (error) {
    console.error('Failed to save service:', error);
  }
};

onMounted(() => {
  if (serviceId) {
    fetchService();
  }
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section class="bg-white shadow-md rounded-lg p-8 w-full">
      <h2 class="text-2xl font-bold mb-4">{{ isEdit ? 'Edit Service' : 'Create Service' }}</h2>
      <form @submit.prevent="saveService">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="serviceData.name" type="text" id="name" required
            class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="serviceData.description" id="description" required
            class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="button" @click="router.back()"
            class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
          <button type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md">{{ isEdit ? 'Update' : 'Create' }}</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
</style>
