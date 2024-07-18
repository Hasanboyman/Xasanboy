<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService';

// Reactive variable to store doctor details
const doctor = ref({
  id: '',
  full_name: '',
  age: '',
  address: '',
  phone_number: '',
  specialization: '',
  savedM: 0
});

const router = useRouter();

// Function to create doctor
const createDoctor = async () => {
  try {
    await apiService.createDoctor(doctor.value);
    router.push('/Shifokor'); // Navigate back to the doctors list
  } catch (error) {
    console.error('Error creating doctor:', error);
  }
};
</script>


<template>

  <div class="bg-white py-6 shadow-md" >
    <span class="py-12 px-48 font-bold text-2xl">Create Doctor</span>
  </div>

  <section id="log-in" class="flex justify-center min-h-52 py-20">
    <form @submit.prevent="createDoctor" method="post"
      class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
      <label for="full_name" class="block text-base mb-2 text-xl font-bold">Full name</label>
      <input type="text" id="full_name" v-model="doctor.full_name"
        class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Full name">

      <label for="age" class="block text-base mb-2 mt-8 text-xl font-bold">Age</label>
      <input type="number" id="age" v-model="doctor.age"
        class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Age">

      <label for="address" class="block text-base mb-2 mt-8 text-xl font-bold">Address</label>
      <input type="text" id="address" v-model="doctor.address"
        class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Address">

      <label for="phone_number" class="block text-base mb-2 mt-8 text-xl font-bold">Phone number</label>
      <input type="text" id="phone_number" v-model="doctor.phone_number"
        class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Phone number">

      <label for="specialization" class="block text-base mb-2 mt-8 text-xl font-bold">Specialization</label>
      <input type="text" id="specialization" v-model="doctor.specialization"
        class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Specialization">


      <div class="mt-16 flex justify-end items-center">
        <div class="flex justify-end">
          <button type="submit"
            class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
            Create
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
