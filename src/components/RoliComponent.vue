<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
      <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
          <RouterLink to="/create"
            class="bg-blue-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-600 hover:shadow-md transition-all ease-in-out duration-300">
            Add User
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section id="table">
    <div class="pt-8 flex justify-center">
      <table class="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
        <thead class="bg-violet-500 text-black">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">NAME</th>
            <th class="px-4 py-3">PERMISSIONS</th>
            <th class="px-4 py-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b border-gray-200 text-gray-600">
            <th class="px-4 py-3">{{ user.id }}</th>
            <th class="px-4 py-3 text-black">{{ user.full_name }}</th>
            <th class="py-0 text-gray-800">
              <div class="bg-blue-200 border-none rounded relative bottom">
                <p v-for="permission in user.role.permissions" :key="permission.id" class="py-4 text-start px-2">{{ permission.name }}</p>
              </div>
            </th>
            <th class="px-4 py-3">
              <span class="pr-2 text-blue-500 cursor-pointer" @click="openEditModal(user)">Edit</span>
              <span @click="confirmDelete(user.id)" class="text-red-500 cursor-pointer">Delete</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div class="bg-white p-6 rounded-lg shadow-xl w-1/3">
      <h2 class="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this user?</p>
      <div class="mt-4 flex justify-end">
        <button @click="showDeleteModal = false" class="bg-gray-500 text-white font-bold px-4 py-2 rounded mr-2">Cancel</button>
        <button @click="deleteUser(userIdToDelete)" class="bg-red-600 text-white font-bold px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  </div>

  <!-- Modal for Editing User -->
  <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
      <h2 class="text-xl font-bold mb-4 text-primary1">Edit User</h2>
      <form @submit.prevent="updateUser" method="post">
        <label for="full_name" class="block text-base mb-2 text-black">Full Name</label>
        <input v-model="user.full_name" type="text" id="full_name"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
          placeholder="Full Name">
        
        <label for="permissions" class="block text-base mb-2 mt-8 text-black">Permissions</label>
        <select id="permissions" v-model="user.permissions"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option value="">Select Permissions</option>
          <option v-for="permission in allPermissions" :key="permission.id" :value="permission.id">{{ permission.name }}</option>
        </select>

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

<script setup>
import { ref, onMounted } from 'vue';
import apiService from './services/apiService';

// Reactive variables
const users = ref([]);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const userIdToDelete = ref(null);
const user = ref({ id: null, full_name: '', permissions: [] });
const allPermissions = ref([]);

// Fetch users data from API
const fetchUsers = async () => {
  try {
    const response = await apiService.getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Confirm delete method to show modal
const confirmDelete = (userId) => {
  userIdToDelete.value = userId;
  showDeleteModal.value = true;
};

// Delete user method
const deleteUser = async (userId) => {
  try {
    await apiService.deleteUser(userId);
    users.value = users.value.filter(user => user.id !== userId);
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error deleting user:', error);
    showDeleteModal.value = false;
    alert('Failed to delete user. Please try again later.');
  }
};

// Open edit modal
const openEditModal = (selectedUser) => {
  user.value = { ...selectedUser, permissions: selectedUser.role.permissions.map(p => p.id) };
  showEditModal.value = true;
};

// Fetch all permissions
const fetchPermissions = async () => {
  try {
    const response = await apiService.listPermissions();
    allPermissions.value = response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
};

// Update user method
const updateUser = async () => {
  try {
    await apiService.updateUser(user.value.id, user.value);
    fetchUsers(); // Refresh the user list after update
    showEditModal.value = false;
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user. Please try again later.');
  }
};

// Fetch users and permissions on component mount
onMounted(() => {
  fetchUsers();
  fetchPermissions();
});
</script>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
