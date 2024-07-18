<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService'; // Importing the API service
import { useAbility } from '@casl/vue';

// Reactive variables to store users
const users = ref([]);
const ability = useAbility();

const currentPage = ref(1);
const rowsPerPage = 8;

const showEditModal = ref(false);
const user = ref({ id: null, username: '', full_name: '', age: '', address: '', phone_number: '', group: '', password: '' });
const errors = ref({});
const allGroup = ref([]);

// Fetch users data from API
const fetchUsers = async () => {
  try {
    const response = await apiService.getAllUsers();
    users.value = response.data;
    console.log("Users fetched successfully");
  } catch (error) {
    console.error('Failed to get users:', error);
  }
};

// Fetch all groups data from API
const fetchGroups = async () => {
  try {
    const response = await apiService.getAllRoles();
    allGroup.value = response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

// Delete user function
const deleteUser = async (userId) => {
  try {
    await apiService.deleteUser(userId); // Call to delete user
    users.value = users.value.filter(user => user.id !== userId);
    console.log("User deleted successfully");
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

// Open edit modal
const openEditModal = (selectedUser) => {
  user.value = { ...selectedUser };
  showEditModal.value = true;
};

// Update user method
const updateUser = async () => {
  try {
    // Ensure group is not empty
    if (!user.value.group) {
      user.value.group = '1'; // Set default group to '1'
    }
    if (!user.value.password) {
      user.value.password = '123';
    }

    await apiService.updateUser(user.value.id, user.value);
    fetchUsers(); // Refresh the user list after update
    showEditModal.value = false;
  } catch (error) {
    if (error.response && error.response.data) {
      errors.value = error.response.data;
    } else {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again later.');
    }
  }
};

const totalPages = computed(() => Math.ceil(users.value.length / rowsPerPage));

// Computed property for paginated users
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return users.value.slice(startIndex, startIndex + rowsPerPage);
});

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

onMounted(() => {
  fetchUsers();
  fetchGroups();
});
</script>

<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
      <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
          <RouterLink to="/create" v-if="ability.can('use', 'Add orders')"
                      class="bg-blue-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-600 hover:shadow-md transition-all ease-in-out duration-300">
            Foydalanuvchi qo'shish
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section id="table">
      <div class="flex justify-center">
        <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
          <thead class="bg-white text-black border-b-2 border-black">
          <tr>
            <th class="px-4 py-5">ID</th>
            <th class="px-4 py-3">Toliq Ismi</th>
            <th class="px-4 py-3">Yoshi</th>
            <th class="px-4 py-3">Manzili</th>
            <th class="px-4 py-3">Telefon raqami</th>
            <th class="px-4 py-3">Roli</th>
            <th class="px-4 py-3" v-if="ability.can('view','Actions')">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-b text-gray-950 bg-white">
            <th class="px-4 py-3">{{ user.id }}</th>
            <th class="px-4 py-3 text-blue-500">{{ user.full_name }}</th>
            <th class="px-4 py-3 text-red-500">{{ user.age }}</th>
            <th class="px-4 py-3 text-red-500">{{ user.address }}</th>
            <th class="px-4 py-3 text-red-500">{{ user.phone_number }}</th>
            <th class="px-4 py-3">{{ user.role }}</th>
            <th class="px-4 py-3">
              <button @click="openEditModal(user)" class="text-blue-500 pr-2" v-if="ability.can('use', 'Edit')">Tahrirlash</button>
              <span @click="deleteUser(user.id)" class="text-red-600 cursor-pointer" v-if="ability.can('use', 'Delete')">O'chirish</span>
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>

  <!-- Modal for Editing User -->
  <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
      <h2 class="text-xl font-bold mb-4 text-primary1">Edit User</h2>
      <form @submit.prevent="updateUser" method="post">
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
        <select v-model="user.group" id="group" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option v-for="group in allGroup" :key="group.id" :value="group.id">{{ group.name }}</option>
        </select>
        <div v-if="errors.group" class="text-red-500 text-sm">{{ errors.group[0] }}</div>

        <label for="password" class="block text-base mb-2 text-black">Password</label>
        <input v-model="user.password" type="password" id="password"
               class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
               placeholder="Password">
        <div v-if="errors.password" class="text-red-500 text-sm">{{ errors.password[0] }}</div>

        <div class="mt-16 flex justify-end items-center">
          <button type="button" @click="showEditModal = false"
                  class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-primary1 hover:shadow-lg">Cancel</button>
          <button type="submit"
                  class="bg-black border-btnColor border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-primary1 hover:shadow-md transition-all ease-in-out duration-300">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
