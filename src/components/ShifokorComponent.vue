<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService'; // Adjust the path as necessary
import { useAbility } from '@casl/vue';

const users = ref([]);
const showModal = ref(false);
const showEditModal = ref(false);
const selectedUserId = ref(null);
const selectedUser = ref({});
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
    alert('Error deleting user:', error)
  }
};

const cancelDeleteRow = () => {
  showModal.value = false;
};

const openDeleteModal = (userId) => {
  selectedUserId.value = userId;
  showModal.value = true;
};

const openEditModal = (user) => {
  selectedUser.value = { ...user };
  showEditModal.value = true;
};

const updateUser = async () => {
  try {
    await apiService.updateDoctor(selectedUser.value.id, selectedUser.value); // Update doctor by selected ID
    fetchUsers(); // Refresh the users list after update
    showEditModal.value = false;
  } catch (error) {
    console.error('Error updating user:', error);
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
            Shifokor qoshish
          </RouterLink>
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
              <span class="text-blue-500 cursor-pointer" @click="openEditModal(user)" v-if="ability.can('use', 'Edit')">Tahrirlash</span>
              <span @click="openDeleteModal(user.id)" class="text-red-500 cursor-pointer" v-if="ability.can('use', 'Delete')">O'chirish</span>
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
    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h2 class="text-xl font-bold mb-4">Ochirishga rozmizsiz</h2>
        <p>Siz bu qatorni o'chirirshga rozimisiz?</p>
        <div class="mt-4 flex justify-end">
          <button class="bg-red-600 text-white px-4 py-2 rounded mr-2" @click="confirmDeleteRow">Ha</button>
          <button class="bg-gray-300 px-4 py-2 rounded" @click="cancelDeleteRow">Yo'q</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-1/3">
        <h2 class="text-xl font-bold mb-4">Foydalanuvchini tahrirlash</h2>
        <form @submit.prevent="updateUser">
          <label for="full_name" class="block text-base mb-2">Toliq Ismi</label>
          <input type="text" id="full_name" v-model="selectedUser.full_name" class="border w-full text-base px-2 py-1 rounded mb-4" placeholder="Toliq Ismi">

          <label for="age" class="block text-base mb-2">Yoshi</label>
          <input type="number" id="age" v-model="selectedUser.age" class="border w-full text-base px-2 py-1 rounded mb-4" placeholder="Yoshi">

          <label for="phone_number" class="block text-base mb-2">Telefon raqami</label>
          <input type="text" id="phone_number" v-model="selectedUser.phone_number" class="border w-full text-base px-2 py-1 rounded mb-4" placeholder="Telefon raqami">

          <label for="address" class="block text-base mb-2">Manzili</label>
          <input type="text" id="address" v-model="selectedUser.address" class="border w-full text-base px-2 py-1 rounded mb-4" placeholder="Manzili">

          <label for="specialization" class="block text-base mb-2">Ish Turi</label>
          <input type="text" id="specialization" v-model="selectedUser.specialization" class="border w-full text-base px-2 py-1 rounded mb-4" placeholder="Ish turi">

          <div class="flex justify-end">
            <button type="button" @click="showEditModal = false" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Bekor qilish</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
