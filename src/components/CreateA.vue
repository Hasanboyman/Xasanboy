<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService';

// Reactive variables for form data
const userData = ref({
  full_name: '',
  age: '',
  address: '',
  phone_number: '',
  role_id: ''
});

const roles = ref([]);
const errors = ref({});
const router = useRouter();

// Fetch roles (assuming roles are categories)
const fetchRoles = async () => {
  try {
    const response = await apiService.getAllCategories();
    roles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch roles:', error);
  }
};

// Function to create a new user
const createUser = async () => {
  try {
    const selectedRole = roles.value.find(role => role.name === userData.value.role_id);
    if (!selectedRole) {
      alert('Please select a valid role');
      return;
    }
    await apiService.createUsers({
      ...userData.value,
      role_id: selectedRole.id // Send role ID to the backend
    });
    router.push('/Xodimlar');
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.response) {
      errors.value = error.response.data;
    }
  }
};

onMounted(fetchRoles);
</script>

<template>
  <div class="bg-white py-6 shadow-md"> 
    <span class="py-12 px-48 font-bold text-2xl">Create User</span>
  </div>

  <section id="log-in" class="flex justify-center min-h-52 py-20">
    <form @submit.prevent="createUser" method="post" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
      <label for="full_name" class="block text-base mb-2">Full Name</label>
      <input v-model="userData.full_name" type="text" id="full_name" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Full Name">
      <div v-if="errors.full_name" class="text-red-500 text-xs">{{ errors.full_name[0] }}</div>

      <label for="age" class="block text-base mb-2 mt-8">Age</label>
      <input v-model="userData.age" type="number" id="age" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Age">
      <div v-if="errors.age" class="text-red-500 text-xs">{{ errors.age[0] }}</div>

      <label for="address" class="block text-base mb-2 mt-8">Address</label>
      <input v-model="userData.address" type="text" id="address" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Address">
      <div v-if="errors.address" class="text-red-500 text-xs">{{ errors.address[0] }}</div>

      <label for="phone_number" class="block text-base mb-2 mt-8">Phone Number</label>
      <input v-model="userData.phone_number" type="text" id="phone_number" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Phone Number">
      <div v-if="errors.phone_number" class="text-red-500 text-xs">{{ errors.phone_number[0] }}</div>

      <label for="role_id" class="block text-base mb-2 mt-8">Role</label>
      <select v-model="userData.role_id" id="role_id" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
        <option value="">Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
      </select>
      <div v-if="errors.role_id" class="text-red-500 text-xs">{{ errors.role_id[0] }}</div>

      <div class="mt-16 flex justify-end items-center">
        <button type="submit" class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
          Create
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.active-link {
  border-color: blue;
}
</style>
