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
  role_id: '2',
  permissions: []
});

const roles = ref([]);
const router = useRouter();

// Fetch roles
const fetchRoles = async () => {
  try {
    const response = await apiService.listPermissions();
    roles.value = response.data;
  } catch (error) {
    console.error('Failed to fetch roles:', error);
  }
};

// Function to create a new user
const createUser = async () => {
  try {
    await apiService.createUsers(userData.value);
    alert('User created successfully');
    router.push('/roliComponent');
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.response) {
      alert('Failed to create user: ' + error.response.data.detail);
    } else {
      alert('Failed to create user. Please try again later.');
    }
  }
};

onMounted(fetchRoles);
</script>

<template>
  <div class="bg-white py-6">
    <span class="py-12 px-48 font-bold text-2xl">User Create</span>
  </div>

  <section id="log-in" class="flex justify-center min-h-52 py-36">
    <form @submit.prevent="createUser" method="post"
      class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
      <label for="full_name" class="block text-base mb-2">Full Name</label>
      <input v-model="userData.full_name" type="text" id="full_name"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Full Name">

      <label for="age" class="block text-base mb-2 mt-8">Age</label>
      <input v-model="userData.age" type="number" id="age"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Age">

      <label for="address" class="block text-base mb-2 mt-8">Address</label>
      <input v-model="userData.address" type="text" id="address"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Address">

      <label for="phone_number" class="block text-base mb-2 mt-8">Phone Number</label>
      <input v-model="userData.phone_number" type="text" id="phone_number"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        placeholder="Phone Number">

      <label for="role_id" class="block text-base mb-2 mt-8">Role</label>
      <select v-model="userData.role_id" id="role_id"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
        <option value="">Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
      </select>
      <label for="role_id" class="block text-base mb-2 mt-8">Role ID</label>
      <select v-model="userData.role_id" id="role_id"
        class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
        <option value="">Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.id }}</option>
      </select>

      <div class="mt-16 flex justify-end items-center">
        <div class="flex justify-center">
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
