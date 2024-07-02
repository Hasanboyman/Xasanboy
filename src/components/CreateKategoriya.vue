<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from './services/apiService';

const orderData = ref({
  price: '',
  customer: null,
  doctor: null,
  service: null,
});

const customers = ref([]);
const doctors = ref([]);
const services = ref([]);
const router = useRouter();

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

// Function to create order
const createOrder = async () => {
  try {
    if (orderData.value.price && orderData.value.customer && orderData.value.doctor && orderData.value.service) {
      await apiService.createOrder(orderData.value);
      alert('Order created successfully');
      router.push('/mijozlar');
    } else {
      alert('Please fill in all fields.');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.response) {
      alert('Failed to create order: ' + error.response.data.detail);
    } else {
      alert('Failed to create order. Please try again later.');
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="bg-white py-6 shadow-md">
      <span class="py-12 px-48 font-bold text-2xl">Create Order</span>
    </div>
    <section id="log-in" class="flex justify-center min-h-52 py-36">
      <form @submit.prevent="createOrder" method="post" class="bg-white shadow-md border-black rounded-lg overflow-hidden items-center w-1/4 p-8">
        <label for="price" class="block text-base mb-2">Price</label>
        <input type="number" id="price" v-model="orderData.price" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Price">

        <label for="customer" class="block text-base mb-2 mt-8">Customer</label>
        <select id="customer" v-model.number="orderData.customer" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
          <option value="">Select Customer</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.full_name }}</option>
        </select>

        <label for="doctor" class="block text-base mb-2 mt-8">Doctor</label>
        <select id="doctor" v-model.number="orderData.doctor" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
          <option value="">Select Doctor</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.full_name }}</option>
        </select>

        <label for="service" class="block text-base mb-2 mt-8">Service</label>
        <select id="service" v-model.number="orderData.service" class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300">
          <option value="">Select Service</option>
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
        </select>

        <div class="mt-16 flex justify-end items-center">
          <div class="flex justify-end">
            <button type="submit" class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
              Create
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
