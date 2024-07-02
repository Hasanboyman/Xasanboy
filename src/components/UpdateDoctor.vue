<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from './services/apiService'; // Adjust the path as necessary

const route = useRoute();
const router = useRouter();
const doctor = ref({
  id: null,
  full_name: '',
  age: '',
  phone_number: '',
  address: '',
  specialization: ''
});
const error = ref(null);

const fetchDoctor = async () => {
  try {
    const response = await apiService.getDoctor(route.params.id);
    doctor.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch doctor';
  }
};

const updateDoctor = async () => {
  try {
    await apiService.updateDoctor(doctor.value.id, doctor.value);
    router.push('/Shifokor');
  } catch (err) {
    error.value = 'Failed to update doctor';
  }
};

onMounted(fetchDoctor);
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Edit Doctor</h1>
      <form @submit.prevent="updateDoctor" method="post">
        <label for="full_name" class="block text-base mb-2">Full Name</label>
        <input v-model="doctor.full_name" type="text" id="full_name" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1" placeholder="Full Name">

        <label for="age" class="block text-base mb-2 mt-8">Age</label>
        <input v-model="doctor.age" type="number" id="age" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1" placeholder="Age">

        <label for="phone_number" class="block text-base mb-2 mt-8">Phone Number</label>
        <input v-model="doctor.phone_number" type="text" id="phone_number" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1" placeholder="Phone Number">

        <label for="address" class="block text-base mb-2 mt-8">Address</label>
        <input v-model="doctor.address" type="text" id="address" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1" placeholder="Address">

        <label for="specialization" class="block text-base mb-2 mt-8">Specialization</label>
        <input v-model="doctor.specialization" type="text" id="specialization" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1" placeholder="Specialization">

        <div class="mt-8 flex justify-end">
          <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
