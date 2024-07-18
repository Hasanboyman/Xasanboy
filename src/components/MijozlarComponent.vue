<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from './services/apiService';
import { RouterLink } from 'vue-router';
import { useAbility } from '@casl/vue';

// Reactive variables
const orders = ref([]);
const customers = ref([]);
const doctors = ref([]);
const services = ref([]);
const showModal = ref(false);
const selectedOrder = ref({
  id: "",
  price: null,
  customer: { id: null },
  doctor: { id: null },
  service: { id: null }
});

// Pagination variables
const currentPage = ref(1);
const rowsPerPage = 8;

const ability = useAbility();

// Fetch all orders with pagination
const fetchOrders = async () => {
  try {
    const response = await apiService.allOrders();
    orders.value = response.data.map(order => ({
      ...order,
      customer: customers.value.find(c => c.id === order.customer),
      doctor: doctors.value.find(d => d.id === order.doctor),
      service: services.value.find(s => s.id === order.service)
    }));
    console.log('Orders data fetched successfully');
  } catch (error) {
    console.error('Failed to get orders:', error);
  }
};

// Fetch data for customers, doctors, and services
const fetchData = async () => {
  try {
    const [customersResponse, doctorsResponse, servicesResponse] = await Promise.all([
      apiService.getAllCustomers(),
      apiService.getAllDoctors(),
      apiService.getAllServices()
    ]);
    customers.value = customersResponse.data;
    doctors.value = doctorsResponse.data;
    services.value = servicesResponse.data;

    // Fetch orders after customers, doctors, and services are fetched
    await fetchOrders();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Computed property for total pages
const totalPages = computed(() => Math.ceil(orders.value.length / rowsPerPage));

// Computed property for paginated orders
const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return orders.value.slice(startIndex, startIndex + rowsPerPage);
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

// Select an order to edit
const selectOrder = (order) => {
  selectedOrder.value = {
    ...order,
    customer: { id: order.customer.id },
    doctor: { id: order.doctor.id },
    service: { id: order.service.id }
  };
  showModal.value = true;
};

// Update an order
const updateOrder = async () => {
  try {
    await apiService.updateOrder(selectedOrder.value.id, {
      ...selectedOrder.value,
      customer: selectedOrder.value.customer.id,
      doctor: selectedOrder.value.doctor.id,
      service: selectedOrder.value.service.id
    });
    fetchOrders();
    showModal.value = false;
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Failed to update order. Please try again later.');
  }
};

// Delete an order
const deleteOrder = async (orderId) => {
  try {
    await apiService.deleteOrder(orderId);
    orders.value = orders.value.filter(order => order.id !== orderId);
    console.log('Order deleted successfully');
  } catch (error) {
    console.error('Failed to delete order:', error);
  }
};

// Fetch orders and other data on mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <section class="flex justify-start">
    <div class="flex justify-start items-center">
      <div class="flex justify-start relative left-64">
        <div class="right-btn pt-4 flex items-start justify-start px-32 gap-4">
          <RouterLink to="/create_kategoriya" v-if="ability.can('view', 'Add')"
                      class="bg-blue-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-600 hover:shadow-md transition-all ease-in-out duration-300">
            Buyurtma Qo'shish
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <section id="table">
      <div class="pt-8 flex justify-center">
        <table class="bg-white text-nowrap shadow-md rounded-lg overflow-hidden w-full max-w-51xl">
          <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-3 font-bold">ID</th>
            <th class="px-4 py-3 font-bold">Narxi</th>
            <th class="px-4 py-3 font-bold">Customer</th>
            <th class="px-4 py-3 font-bold">Doctor</th>
            <th class="px-4 py-3 font-bold">Service</th>
            <th class="px-4 py-3 font-bold" v-if="ability.can('view','Actions')">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id" class="border-b text-gray-700">
            <th class="px-4 py-3">{{ order.id }}</th>
            <th class="px-4 py-3">{{ order.price }}</th>
            <th class="px-4 py-3">{{ order.customer.full_name }}</th>
            <th class="px-4 py-3">{{ order.doctor.full_name }}</th>
            <th class="px-4 py-3">{{ order.service.name }}</th>
            <th class="px-4 py-3">
              <button @click="selectOrder(order)" class="text-blue-500 pr-4" v-if="ability.can('use', 'Edit')">Edit</button>
              <RouterLink to="/mijozlarni_korish" class="text-blue-500 pr-4" v-if="ability.can('view', 'view')">View</RouterLink>
              <button @click="deleteOrder(order.id)" class="text-red-600" v-if="ability.can('use', 'Delete')">Delete</button>
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

  <!-- Modal for Editing Order -->
  <div v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div
      class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
      <h2 class="text-xl font-bold mb-4 text-primary1">Edit Order</h2>
      <form @submit.prevent="updateOrder" method="post">
        <label for="price" class="block text-base mb-2 text-black">Price</label>
        <input v-model="selectedOrder.price" type="number" id="price"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
          placeholder="Price">

        <label for="customer" class="block text-base mb-2 mt-8 text-black">Customer</label>
        <select id="customer" v-model="selectedOrder.customer.id"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option value="">Select Customer</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.full_name }}
          </option>
        </select>

        <label for="doctor" class="block text-base mb-2 mt-8 text-black">Doctor</label>
        <select id="doctor" v-model="selectedOrder.doctor.id"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option value="">Select Doctor</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.full_name }}</option>
        </select>

        <label for="service" class="block text-base mb-2 mt-8 text-black">Service</label>
        <select id="service" v-model="selectedOrder.service.id"
          class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <option value="">Select Service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
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

<style scoped>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
