<script setup>
import { ref, onMounted } from 'vue';
import apiClient from './services/apiService';

// Reactive variables
const users = ref([]);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const userIdToDelete = ref(null);
const user = ref({ id: null, username: '', full_name: '', age: '', address: '', phone_number: '', group: '', password: '' });
const errors = ref({});
const allGroup = ref([]);

// Fetch users data from API
const fetchUsers = async () => {
  try {
    const response = await apiClient.getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Fetch all groups data from API
const fetchGroups = async () => {
  try {
    const response = await apiClient.getAllRoles();
    allGroup.value = response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

// Open edit modal
const openEditModal = (selectedUser) => {
  user.value = { ...selectedUser };
  showEditModal.value = true;
};

// Confirm delete method to show modal
const confirmDelete = (userId) => {
  userIdToDelete.value = userId;
  showDeleteModal.value = true;
};

// Delete user method
const deleteUser = async (userId) => {
  try {
    await apiClient.deleteUser(userId);
    users.value = users.value.filter(user => user.id !== userId);
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error deleting user:', error);
    showDeleteModal.value = false;
  }
};

// Update user method
const updateUser = async () => {
  try {
    // Ensure group is not empty
    if (!user.value.group) {
      user.value.group = '1'; // Set default group to '1'
    }

    await apiClient.updateUser(user.value.id, user.value);
    fetchUsers(); // Refresh the user list after update
    showEditModal.value = false;
  } catch (error) {
    if (error.response && error.response.data) {
      errors.value = error.response.data;
    } else {
      console.error('Error updating user:', error);
      alert(`${error}`)
    }
  }
};

// Fetch users and groups on component mount
onMounted(() => {
  fetchUsers();
  fetchGroups();
});
</script>


<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
    </div>
  </section>

  <section id="table">
    <div class="pt-8 flex justify-center">
      <table class="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-6xl">
        <thead class="bg-violet-500 text-black">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">ISMI</th>
            <th class="px-4 py-3">GROUPS & PERMISSIONS</th>
            <th class="px-4 py-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b border-gray-200 text-gray-600">
            <th class="px-2 py-3">{{ user.id }}</th>
            <th class="px-2 py-3  text-red-600 "><span>{{ user.full_name }}</span></th>
            <th class="py-2 text-gray-800 bg-blue-200 ">
              <div v-if="user.groups && user.groups.length">
                <div v-for="group in user.groups" :key="group.id">
                  <p class="font-bold" style="font-size:30px">Group role: {{ group.name }}</p>
                  <hr>
                  <ul>
                    <li v-for="permission in group.permissions" :key="permission.id">{{ permission.codename }}</li>
                  </ul>
                </div>
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
          <option v-for="group in allGroup" :key="group.id" :value="group.id">{{ group.id }}</option>
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
