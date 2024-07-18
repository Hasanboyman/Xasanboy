<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService';
import { useAbility } from '@casl/vue';

// Reactive variables to store categories and modal state
const categories = ref([]);
const showModal = ref(false);
const selectedCategory = ref({ id: null, name: '' });
const error = ref(null);
const ability = useAbility();

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = 8;

// API call to fetch categories
const fetchCategories = async () => {
  try {
    const response = await apiService.getAllCategories();
    categories.value = response.data;
    console.log("Categories fetched successfully");
  } catch (error) {
    console.error('Failed to get categories:', error);
  }
};

// Delete category function
const deleteCategory = async (categoryId) => {
  try {
    await apiService.deleteCategory(categoryId);
    categories.value = categories.value.filter(category => category.id !== categoryId);
    console.log("Category deleted successfully");
  } catch (error) {
    console.error('Failed to delete category:', error);
  }
};

// Select a category to edit
const selectCategory = (category) => {
  selectedCategory.value = { ...category };
  showModal.value = true;
};

// Update category function
const updateCategory = async () => {
  try {
    await apiService.updateCategory(selectedCategory.value.id, selectedCategory.value);
    fetchCategories();
    showModal.value = false;
  } catch (err) {
    error.value = 'Failed to update category';
  }
};

// Computed property for total pages
const totalPages = computed(() => Math.ceil(categories.value.length / rowsPerPage));

// Computed property for paginated categories
const paginatedCategories = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return categories.value.slice(startIndex, startIndex + rowsPerPage);
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

// Fetch categories on component mount
onMounted(fetchCategories);
</script>


<template>
  <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
      <RouterLink to="/create_kategoriya1" v-if="ability.can('use','Add Category')"
        class="mt-1 bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
        Katigoriya qo'shish
      </RouterLink>
    </div>
  </div>

  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <section id="table">
      <div class="flex justify-center">
        <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
          <thead class="bg-white text-black border-b-2 border-black">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Ismi</th>
              <th class="px-4 py-3" v-if="ability.can('view','Actions')">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in paginatedCategories" :key="category.id" class="border-b text-gray-700 bg-white">
              <th class="px-4 py-3">{{ category.id }}</th>
              <th class="px-4 py-3 text-blue-500">{{ category.name }}</th>
              <th>
                <button @click="selectCategory(category)" class="text-blue-500" style="padding-right: 15px;" v-if="ability.can('use','Edit')">Edit</button>
                <button @click="deleteCategory(category.id)" class="text-red-600" v-if="ability.can('use','Delete')">Delete</button>
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

  <!-- Modal for Editing Category -->
  <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div
      class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
      <h2 class="text-xl font-bold mb-4 text-primary1">Edit Category</h2>
      <form @submit.prevent="updateCategory" method="post">
        <label for="name" class="block text-base mb-2 text-black">Name</label>
        <input v-model="selectedCategory.name" type="text" id="name"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
          placeholder="Name">

        <div class="mt-16 flex justify-end items-center">
          <button type="button" @click="showModal = false"
            class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-gray-600 hover:shadow-lg">Cancel</button>
          <button type="submit"
            class="bg-black border-gray-500 border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-gray-600 hover:shadow-md transition-all ease-in-out duration-300">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
