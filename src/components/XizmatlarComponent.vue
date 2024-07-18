<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService';
import { useAbility } from '@casl/vue';

// Reactive variables to store services and modal state
const services = ref([]);
const showModal = ref(false);
const selectedService = ref({ id: null, name: '', price_of_service: '' });
const error = ref(null);
const ability = useAbility();

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = 8;

// API call to fetch services
const fetchServices = async () => {
  try {
    const response = await apiService.getAllServices();
    services.value = response.data;
    console.log("Services fetched successfully");
  } catch (error) {
    console.error('Failed to get services:', error);
  }
};

// Delete service function
const deleteService = async (serviceId) => {
  try {
    await apiService.deleteService(serviceId);
    services.value = services.value.filter(service => service.id !== serviceId);
    console.log("Service deleted successfully");
  } catch (error) {
    console.error('Failed to delete service:', error);
  }
};

// Select a service to edit
const selectService = (service) => {
  selectedService.value = { ...service };
  showModal.value = true;
};

// Update service function
const updateService = async () => {
  try {
    await apiService.updateService(selectedService.value.id, selectedService.value);
    fetchServices();
    showModal.value = false;
  } catch (err) {
    error.value = 'Failed to update service';
  }
};

// Computed property for total pages
const totalPages = computed(() => Math.ceil(services.value.length / rowsPerPage));

// Computed property for paginated services
const paginatedServices = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return services.value.slice(startIndex, startIndex + rowsPerPage);
});

// Pagination methods
const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Fetch services on component mount
onMounted(fetchServices);
</script>


<template>
  <div class="flex justify-start relative left-64">
    <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
      <RouterLink to="/updatecategoriya" v-if="ability.can('use','Add service')"
        class="mt-1 bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
        Servis qo'shish
      </RouterLink>
    </div>
  </div>

  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section id="table">
      <div class="flex justify-center">
        <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
          <thead class="bg-white text-black border-b-2 border-black">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">NOMI</th>
              <th class="px-4 py-3">NARXI</th>
              <th class="px-4 py-3" v-if="ability.can('view','Actions')">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in paginatedServices" :key="service.id" class="border-b text-gray-700 bg-white">
              <th class="px-4 py-3">{{ service.id }}</th>
              <th class="px-4 py-3">{{ service.name }}</th>
              <th class="px-4 py-3">{{ service.price_of_service }}</th>
              <th class="px-4 py-3">
                <span @click="selectService(service)" class="text-blue-500 cursor-pointer pr-2" v-if="ability.can('use','Edit')">Tahrirlash</span>
                <span @click="deleteService(service.id)" class="text-red-600 cursor-pointer" v-if="ability.can('use','Delete')">O'chirish</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="flex space-x-2 justify-center mt-4">
        <div class="flex justify-center text-gray-600">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ 'bg-gray-300': currentPage === page }" class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">{{ page }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>

  <!-- Modal for Editing Service -->
  <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div
      class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
      <h2 class="text-xl font-bold mb-4 text-primary1">Edit Service</h2>
      <form @submit.prevent="updateService" method="post">
        <label for="name" class="block text-base mb-2 text-black">Name</label>
        <input v-model="selectedService.name" type="text" id="name"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
          placeholder="Name">

        <label for="price" class="block text-base mb-2 mt-8 text-black">Price</label>
        <input v-model="selectedService.price_of_service" type="number" id="price"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
          placeholder="Price">

        <div class="mt-16 flex justify-end items-center">
          <button type="button" @click="showModal = false"
            class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-gray-600 hover:shadow-lg">Cancel</button>
          <button type="submit"
            class="bg-black border-gray-500 border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-gray-600 hover:shadow-md transition-all ease-in-out duration-300">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
