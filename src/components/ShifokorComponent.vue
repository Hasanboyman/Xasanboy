<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService'; // Adjust the path as necessary
import { useAbility } from '@casl/vue';

const users = ref([]);
const showModal = ref(false);
const selectedUserId = ref(null);
const ability = useAbility();

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = 8;

const fetchUsers = async () => {
  try {
    const response = await apiService.getAllDoctors(); // Fetch all doctors
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const confirmDeleteRow = async () => {
  try {
    await apiService.deleteDoctor(selectedUserId.value); // Delete doctor by selected ID
    fetchUsers(); // Refresh the users list after deletion
    showModal.value = false;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const cancelDeleteRow = () => {
  showModal.value = false;
};

const openDeleteModal = (userId) => {
  selectedUserId.value = userId;
  showModal.value = true;
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

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
      <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
          <RouterLink to="/add_user_create" v-if="ability.can('use', 'Add user')"
            class="bg-blue-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-600 hover:shadow-md transition-all ease-in-out duration-300">
            Add User</RouterLink>
        </div>
      </div>
    </div>
  </section>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section id="table">
      <div class="flex justify-center">
        <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
          <thead class="bg-white text-white border-b-2 border-black">
            <tr>
              <th class="px-4 py-5 text-black">ID</th>
              <th class="px-4 py-3 text-black">F.I.O</th>
              <th class="px-4 py-3 text-black">Yoshi</th>
              <th class="px-4 py-3 text-black">TEL</th>
              <th class="px-4 py-3 text-black">Manzil</th>
              <th class="px-4 py-3 text-black">Ish turi</th>
              <th class="px-4 py-3 text-black">Xisobdagi Mablag'i</th>
              <th class="px-4 py-3 text-black" v-if="ability.can('view', 'Actions')">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="border-b text-gray-600">
              <th class="px-4 py-3">{{ user.id }}</th>
              <th class="px-4 py-3">{{ user.full_name }}</th>
              <th class="px-4 py-3">{{ user.age }}</th>
              <th class="px-4 py-3">{{ user.phone_number }}</th>
              <th class="px-4 py-3">{{ user.address }}</th>
              <th class="px-4 py-3">{{ user.specialization }}</th>
              <th class="px-4 py-3 text-red-500">
                <RouterLink :to="`/noname/${user.id}`">{{ user.savedM }}</RouterLink>
              </th>
              <th class="px-4 py-3 flex justify-center gap-4">
                <RouterLink :to="`/update_person/${user.id}`" v-if="ability.can('view', 'Actions')">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 fill-blue-600" viewBox="0 0 576 512">
                    <path
                      d="M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8V232c0 13.3-10.7 24-24 24s-24-10.7-24-24V220.6c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z" />
                  </svg>
                </RouterLink>
                <RouterLink to="/update_doctor${}" class="text-blue-500 cursor-pointer"
                  v-if="ability.can('use', 'Edit')">Edit</RouterLink>
                <span @click="openDeleteModal(user.id)" class="text-red-500 cursor-pointer"
                  v-if="ability.can('use', 'Delete')">Delete</span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="flex space-x-2 justify-center mt-4">
        <div class="flex justify-center text-gray-600">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="{ 'bg-gray-300': currentPage === page }" class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">{{
              page }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this row?</p>
        <div class="mt-4 flex justify-end">
          <button class="bg-red-600 text-white px-4 py-2 rounded mr-2" @click="confirmDeleteRow">Yes</button>
          <button class="bg-gray-300 px-4 py-2 rounded" @click="cancelDeleteRow">No</button>
        </div>
      </div>
    </div>
  </div>
</template>