<script setup>
import { ref, reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService';

// Reactive variable to store services
const services = ref([]);

// Reactive variable to manage edit states
const editStates = reactive({});

// API call to fetch services
const fetchServices = async () => {
  try {
    const response = await apiService.getAllServices();
    services.value = response.data;
    console.log('Data fetched successfully');
  } catch (error) {
    console.error('Failed to get services:', error);
  }
};

// Handle edit toggle
const toggleEdit = (id) => {
  editStates[id] = !editStates[id];
};

// Handle form submission to update service
const handleUpdate = async (service) => {
  try {
    await apiService.updateService(service.id, service);
    alert('Service updated successfully');
    toggleEdit(service.id);
  } catch (error) {
    console.error('Failed to update service:', error);
    alert('Failed to update service.');
  }
};

onMounted(fetchServices);
</script>




<template>
  <div class="bg-white py-6" >
    <span class="py-12 px-48 font-bold text-2xl">Show Kategoriya</span>
  </div>

  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
    <section id="table">
      <div class="pt-8 flex justify-center">
        <table class="bg-white text-nowrap shadow-md rounded-lg overflow-hidden w-full max-w-5xl">
          <thead>
            <tr class="border-b text-gray-700">
              <th class="px-4 py-3 font-bold bg-gray-100">ID</th>
              <th class="px-4 py-3 font-bold bg-gray-100">Name</th>
              <th class="px-4 py-3 font-bold bg-gray-100">Description</th>
              <th class="px-4 py-3 font-bold bg-gray-100" v-if="ability.can('view','Actions')">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id" class="border-b text-gray-700">
              <th class="px-4 py-3">
                <template v-if="editStates[service.id]">
                  <input v-model="service.id" type="text" class="border rounded px-2 py-1 w-full" />
                </template>
                <template v-else>
                  {{ service.id }}
                </template>
              </th>
              <th class="px-4 py-3">
                <template v-if="editStates[service.id]">
                  <input v-model="service.name" type="text" class="border rounded px-2 py-1 w-full" />
                </template>
                <template v-else>
                  {{ service.name }}
                </template>
              </th>
              <th class="px-4 py-3">
                <template v-if="editStates[service.id]">
                  <input v-model="service.description" type="text" class="border rounded px-2 py-1 w-full" />
                </template>
                <template v-else>
                  {{ service.description }}
                </template>
              </th>
              <th class="px-4 py-3">
                <template v-if="editStates[service.id]">
                  <button @click="handleUpdate(service)" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded">
                    Save
                  </button>
                  <button @click="toggleEdit(service.id)" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded">
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button @click="toggleEdit(service.id)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded">
                    Edit
                  </button>
                </template>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="flex justify-between">
      <div class="py-6">
        <RouterLink to="/kategoriya">
          <button class="bg-red-500 hover:bg-red-600 hover:border-red-700 text-white font-bold py-3 px-4 border-b-4 border-red-600 rounded-full transition duration-200 transform hover:scale-105 active:border-t-4 active:border-b-0 w-80 flex justify-center">
            Orqaga
          </button>
        </RouterLink>
        <RouterLink>
        
        </RouterLink>
      </div>
    </div>
  </div>
</template>
