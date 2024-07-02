<script setup>
import { ref, onMounted } from 'vue';
import apiService from './services/apiService';
import { RouterLink } from 'vue-router';

// Reactive variables
const orders = ref([]);
const customers = ref([]);
const doctors = ref([]);
const services = ref([]);

// Fetch all orders
const fetchOrders = async () => {
  try {
    const response = await apiService.allOrders();
    orders.value = response.data.orders;
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
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Get name by ID
const getCustomerName = (customerId) => {
  const customer = customers.value.find(customer => customer.id === customerId);
  return customer ? customer.full_name : 'Unknown';
};

const getDoctorName = (doctorId) => {
  const doctor = doctors.value.find(doctor => doctor.id === doctorId);
  return doctor ? doctor.full_name : 'Unknown';
};

const getServiceName = (serviceId) => {
  const service = services.value.find(service => service.id === serviceId);
  return service ? service.name : 'Unknown';
};

// Fetch orders and other data on mount
onMounted(() => {
  fetchOrders();
  fetchData();
});

// Print page method
const printPage = () => {
  window.print();
};
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
    <section id="table">
      <div class="pt-8 flex justify-center">
        <table class="bg-white text-nowrap shadow-md rounded-lg overflow-hidden w-full max-w-5xl">
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b text-gray-700">
              <td class="px-4 py-3 font-bold bg-gray-50">ID</td>
              <td class="px-4 py-3 font-bold">{{ order.id }}</td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="border-b text-gray-700">
              <td class="px-4 py-3 font-bold bg-gray-50">F.I.O</td>
              <td class="px-4 py-3 font-bold">{{ getDoctorName(order.doctor) }}</td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="border-b text-gray-700">
              <td class="px-4 py-3 font-bold bg-gray-50">Customer</td>
              <td class="px-4 py-3 font-bold">{{ getCustomerName(order.customer) }}</td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="border-b text-gray-700">
              <td class="px-4 py-3 font-bold bg-gray-50">Narxi</td>
              <td class="px-4 py-3 font-bold">{{ order.price }}</td>
            </tr>
            <tr v-for="order in orders" :key="order.id" class="border-b text-gray-700">
              <td class="px-4 py-3 font-bold bg-gray-50">XIZMAT TURLARI</td>
              <th class="px-4 py-3 font-bold justify-center">
                <div class="bg-gray-100 flex justify-between px-4 py-3 rounded-md">
                  {{ getServiceName(order.service) }}
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between mt-8">
        <div class="py-6">
          <RouterLink to="/mijozlar">
            <button
              class="bg-red-500 hover:bg-red-600 hover:border-red-700 text-white font-bold py-2 px-3 border-b-4 w-80 border-red-600 rounded-full transition duration-200 transform hover:scale-105 active:border-t-4 active:border-b-0 flex justify-center">
              🔙
              <pre>  </pre> Orqaga
            </button>
          </RouterLink>
        </div>
        <div class="py-6">
          <button @click="printPage"
            class="bg-violet-500 hover:bg-violet-600 hover:border-violet-700 text-white font-bold py-2 px-3 border-b-4 w-80 border-violet-600 rounded-full transition duration-200 transform hover:scale-105 active:border-t-4 active:border-b-0 flex justify-center">
            PRINTERDAN CHIQISH
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
