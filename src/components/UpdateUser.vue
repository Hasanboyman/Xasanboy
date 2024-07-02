<template>
  <!-- Modal for Editing User -->
  <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
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
          <button type="button" @click="showModal = false"
            class="bg-$btnColor border border-gray-400 rounded-full text-$white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-$primary1 hover:shadow-lg">Cancel</button>
          <button type="submit"
            class="bg-$black border-$btnColor border-x-2 border-y-2 rounded-full text-$white font-bold px-4 py-2 shadow-inner hover:border-$primary1 hover:shadow-md transition-all ease-in-out duration-300">
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
import { useRoute, useRouter } from 'vue-router';

// Reactive variables
const user = ref({ id: null, full_name: '', permissions: [] });
const allPermissions = ref([]);
const showModal = ref(true); // Set to true to show the modal on load
const route = useRoute();
const router = useRouter();

// Fetch user data from API
const fetchUser = async () => {
  try {
    const response = await apiService.getUser(route.params.id);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// Fetch all permissions
const fetchPermissions = async () => {
  try {
    const response = await apiService.getAllPermissions();
    allPermissions.value = response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }
};

// Update user method
const updateUser = async () => {
  try {
    await apiService.updateUser(user.value.id, user.value);
    router.push('/users');
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user. Please try again later.');
  }
};

// Fetch user and permissions on component mount
onMounted(() => {
  fetchUser();
  fetchPermissions();
});
</script>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
