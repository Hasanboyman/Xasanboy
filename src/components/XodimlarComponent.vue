<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService'; // Importing the API service
import { useAbility } from '@casl/vue';

// Reactive variables to store users
const users = ref([]);
const ability = useAbility();

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = 8;

// API call to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiService.getAllUsers(); // Call to fetch users
    users.value = response.data;
    console.log("Users fetched successfully");
  } catch (error) {
    console.error('Failed to get users:', error);
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

// Computed property for total pages
const totalPages = computed(() => Math.ceil(users.value.length / rowsPerPage));

// Computed property for paginated users
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return users.value.slice(startIndex, startIndex + rowsPerPage);
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

// Fetch users on component mount
onMounted(fetchUsers);
</script>



<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
      <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
          <RouterLink to="/create" v-if="ability.can('use', 'Add orders')"
            class="bg-blue-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-600 hover:shadow-md transition-all ease-in-out duration-300">
            Add User
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
              <th class="px-4 py-3">Full Name</th>
              <th class="px-4 py-3">Age</th>
              <th class="px-4 py-3">Address</th>
              <th class="px-4 py-3">Phone Number</th>
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
              <th class="px-4 py-3">
                <div class="bg-blue-300 border-none rounded-lg py-1">{{ user.role.name }}</div>
              </th>
              <th class="px-4 py-3">
                <RouterLink :to="'/update-user/' + user.id" class="text-blue-500 pr-2"  v-if="ability.can('use', 'view')">View Edit</RouterLink>
                <span @click="deleteUser(user.id)" class="text-red-600 cursor-pointer" v-if="ability.can('use', 'delete')">Delete</span>
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

  <router-view></router-view>
</template>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
