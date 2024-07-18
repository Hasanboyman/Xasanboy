<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import apiService from '@/components/services/apiService';

// Reactive variables for form data and errors
const errors = ref({});
const allGroup = ref([]);
const user = ref({username: '', full_name: '', age: '', address: '', phone_number: '', group: '', password: ''});

const router = useRouter();

// Fetch all groups data from API
const fetchGroups = async () => {
  try {
    const response = await apiService.getAllRoles();
    allGroup.value = response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

// Function to create a new user
const createUser = async () => {
  try {
    if (!user.value.group) {
      user.value.group = '1';
    }

    await apiService.createUsers(user.value);
    router.push('/Xodimlar');
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.response) {
      alert('Failed to create user: ' + JSON.stringify(error.response.data));
      errors.value = error.response.data.errors;
    }
  }
};

onMounted(() => {
  fetchGroups();
});
</script>

<template>
  <div class="bg-gradient-to-r from-primary1 to-black py-6">
    <span class="block text-center text-white font-bold text-3xl">User Create</span>
  </div>
  <div class="flex justify-center py-12">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-1/3 transform transition-transform duration-300 ease-in-out hover:scale-105">
      <form @submit.prevent="createUser" method="post">
        <label for="username" class="block text-base mb-2 text-black">Username</label>
        <input v-model="user.username" type="text" id="username"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Username">
        <div v-if="errors.username" class="text-red-500 text-sm">{{ errors.username[0] }}</div>

        <label for="full_name" class="block text-base mb-2 text-black">Full Name</label>
        <input v-model="user.full_name" type="text" id="full_name"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Full Name">
        <div v-if="errors.full_name" class="text-red-500 text-sm">{{ errors.full_name[0] }}</div>

        <label for="age" class="block text-base mb-2 text-black">Age</label>
        <input v-model="user.age" type="number" id="age"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Age">
        <div v-if="errors.age" class="text-red-500 text-sm">{{ errors.age[0] }}</div>

        <label for="address" class="block text-base mb-2 text-black">Address</label>
        <input v-model="user.address" type="text" id="address"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Address">
        <div v-if="errors.address" class="text-red-500 text-sm">{{ errors.address[0] }}</div>

        <label for="phone_number" class="block text-base mb-2 text-black">Phone Number</label>
        <input v-model="user.phone_number" type="text" id="phone_number"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Phone Number">
        <div v-if="errors.phone_number" class="text-red-500 text-sm">{{ errors.phone_number[0] }}</div>

        <label for="group" class="block text-base mb-2 text-black">Group</label>
        <select v-model="user.group" id="group"
                class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option v-for="group in allGroup" :key="group.id" :value="group.id">{{ group.id }}</option>
        </select>
        <div v-if="errors.group" class="text-red-500 text-sm">{{ errors.group[0] }}</div>

        <label for="password" class="block text-base mb-2 text-black">Password</label>
        <input v-model="user.password" type="password" id="password"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Password">
        <div v-if="errors.password" class="text-red-500 text-sm">{{ errors.password[0] }}</div>

        <div class="mt-16 flex justify-end items-center">
          <button type="button" @click="router.push('/Xodimlar')"
                  class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-primary1 hover:shadow-lg">
            Cancel
          </button>
          <button type="submit"
                  class="bg-black border-btnColor border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-primary1 hover:shadow-md transition-all ease-in-out duration-300">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
}
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>
