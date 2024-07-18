<template>
  <div>
    <section id="log-in" class="flex justify-center min-h-52 py-20" v-if="!showModal">
      <form @submit.prevent="submitForm" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <label for="fio" class="block text-base text-xl font-bold mb-2">F.I.O</label>
        <input type="text" id="fio" v-model="formData.full_name" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Ism uchun joy">

        <div class="mt-8 text-xl font-bold">Tug'ulgan kun</div>
        <label for="dob" class="block text-base mb-2"></label>
        <input type="date" id="dob" v-model="formData.dob" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="">

        <label for="address" class="block text-base mb-2 mt-8 text-xl font-bold">Manzil</label>
        <input type="text" id="address" v-model="formData.address" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Yashash joyingiz">

        <label for="phone_number" class="block text-base mb-2 mt-8 text-xl font-bold">Telefon Raqam</label>
        <input type="text" id="phone_number" v-model="formData.phone_number" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Telefon nomerni kiriting">

        <div class="mt-16 flex justify-end items-center">
          <div class="flex justify-between space-x-14 text-nowrap">
            <RouterLink to="/mijozlar" type="button" class="bg-violet-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-500 hover:shadow-md transition-all ease-in-out duration-300">
              Orqaga Qaytish
            </RouterLink>
            <button type="submit" class="bg-red-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-red-500 hover:shadow-md transition-all ease-in-out duration-300">
              Xizmat turini qoshish
            </button>
          </div>
        </div>
      </form>
    </section>

    <section v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form @submit.prevent="addServiceCategory" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <div class="mb-5">
          <h1 class="text-xl font-bold">Buyurtma uchun xizmat turini qo'shish</h1>
        </div>
        <hr class="py-2">
        <div>Katigorya</div>
        <select v-model="orderData.category" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <div>Xizmat Turi</div>
        <select v-model="orderData.service" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
        </select>
        <div>Customer</div>
        <select v-model="orderData.customer" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.full_name }}</option>
        </select>
        <div>Doctor</div>
        <select v-model="orderData.doctor" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.full_name }}</option>
        </select>
        <label for="price" class="block text-base mb-2 mt-8">Narxi</label>
        <input type="number" id="price" v-model.number="orderData.price" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Narxni belgilang">
        <div class="flex justify-between mt-10">
          <button type="button" @click="cancelService" class="bg-red-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-red-400 hover:shadow-md transition-all ease-in-out duration-300">
            Bekor qilish
          </button>
           <button type="submit" class="bg-violet-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-400 hover:shadow-md transition-all ease-in-out duration-300">
            Qoshish
        </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from './services/apiService';
import {useRouter} from "vue-router";

const formData = ref({
  full_name: '',
  dob: '',
  address: '',
  phone_number: ''
});

const orderData = ref({
  customer: null,
  doctor: null,
  service: null,
  category: '',
  price: 0
});

const showModal = ref(false);
const router = useRouter();

const submitForm = async () => {
  try {
    const response = await apiService.createCustomer(formData.value);
    orderData.value.customer = response.data.id; // Set the created customer's ID to orderData
    showModal.value = true;
  } catch (error) {
    console.error('Error creating customer:', error);
    alert(`Failed to create katigory ${error}`)
  }
};

const services = ref([]);
const categories = ref([]);
const customers = ref([]);
const doctors = ref([]);

const fetchCategories = async () => {
  try {
    const response = await apiService.getAllCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchServices = async () => {
  try {
    const response = await apiService.getAllServices();
    services.value = response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const fetchCustomers = async () => {
  try {
    const response = await apiService.getAllCustomers();
    customers.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

const fetchDoctors = async () => {
  try {
    const response = await apiService.getAllDoctors();
    doctors.value = response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};

const addServiceCategory = async () => {
  try {
    await apiService.createOrder(orderData.value);
    router.push('/mijozlar');
    cancelService();
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

const cancelService = () => {
  orderData.value = {
    customer: null,
    doctor: null,
    service: null,
    category: '',
    quantity: 1,
    price: 0
  };
  showModal.value = false;
};

onMounted(() => {
  fetchCategories();
  fetchServices();
  fetchCustomers();
  fetchDoctors();
});
</script>
