<template>


  <!-- Main Content Section -->
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section id="table">
      <div class="flex justify-center">
        <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
          <thead class="bg-white text-white border-b-2 border-black">
            <tr>
              <th class="px-4 py-5 text-black">ID</th>
              <th class="px-4 py-3 text-black">NAME</th>
              <th class="px-4 py-3 text-black">USERNAME</th>
              <th class="px-4 py-3 text-black">ROLE</th>
              <th class="px-4 py-3 text-black">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <!-- User Data Rows (Replace with dynamic data rendering) -->
            <tr v-for="(user, index) in users" :key="user.id" class="border-b text-gray-950 bg-white">
              <th class="px-4 py-3" style="">{{ user.id }}</th>
              <th class="px-4 py-3">
                <input v-model="user.name" class="border p-1 w-full">
              </th>
              <th class="px-4 py-3">{{ user.username }}</th>
              <th class="px-4 py-3">
                <select v-model="user.role" class="border p-1">
                  <option value="Super Admin">Super Admin</option>
                  <option value="Kassir">Kassir</option>
                  <option value="Admin">Admin</option>
                </select>
              </th>
              <t class="px-4 py-3">
                <!-- Save and Cancel Buttons -->
                <button @click="saveChanges(index)" class="text-blue-500 pr-2">Save</button>
                <button @click="cancelEdit(index)" class="text-red-600">Cancel</button>
              </t>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample user data (replace with your actual data fetching logic)
const users = ref([
  { id: 1, name: 'Javohirbek', username: 'javohir', role: 'Super Admin' },
  { id: 2, name: 'Abduholikova Dildora G\'ulomjonova', username: 'Dildora', role: 'Kassir' },
  { id: 3, name: 'ABDUFAZILOV Elbek', username: 'Elbek', role: 'Admin' },
  { id: 4, name: 'QOZIYEVa Ominahon', username: 'Ominahon', role: 'Kassir' },
]);

// Function to save changes to a user
function saveChanges(index) {
  // Simulate saving changes to backend (replace with your actual API call)
  console.log(`Saving changes for user with ID ${users.value[index].id}`);
  console.log(`New Name: ${users.value[index].name}`);
  console.log(`New Role: ${users.value[index].role}`);
  alert(`User ${users.value[index].id} // ${users.value[index].name} //  ${users.value[index].role}  // saved!`);
}

// Function to cancel editing
function cancelEdit(index) {
  // For simplicity, we are not reverting changes here
  console.log(`Cancelled editing for user at index ${index}`);
  alert(`Editing for user ${users.value[index].id} cancelled!`);
}
</script>

<style scoped>
/* Scoped styles for this component */
</style>
