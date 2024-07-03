<template>
  <div>
    <section id="log-in" class="flex justify-center min-h-52 py-20">
      <form @submit.prevent="submitForm" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <label for="fio" class="block text-base text-xl font-bold mb-2">F.I.O</label>
        <input type="text" id="fio" v-model="formData.full_name" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Ism uchun joy">

        <div class="mt-8 text-xl font-bold">Tug'ulgan kun</div>
        <label for="dob" class="block text-base mb-2"></label>
        <input type="date" id="dob" v-model="formData.dob" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="">

        <label for="address" class="block text-base mb-2 mt-8 text-xl font-bold">Manzil</label>
        <input type="text" id="address" v-model="formData.address" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Yashash joyingiz">

        <label for="tel" class="block text-base mb-2 mt-8 text-xl font-bold">Tel</label>
        <input type="text" id="tel" v-model="formData.phone_number" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="telefon nomer">

        <div class="mt-16 flex justify-end items-center">
          <div class="flex justify-between space-x-14 text-nowrap">
            <button type="button" class="bg-violet-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-500 hover:shadow-md transition-all ease-in-out duration-300">
              Orqaga Qaytish
            </button>
            <button type="submit" class="bg-red-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-red-500 hover:shadow-md transition-all ease-in-out duration-300">
              Xizmat turini qoshish
            </button>
          </div>
        </div>
      </form>
    </section>
  
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 hidn">
      <div class="bg-white shadow-md rounded-lg p-8 w-full">
        <div class="flex justify-between">
          <h2 class="text-2xl font-bold mb-4">Xizmat turlari</h2>
          <p class="font-bold text-2xl">Hammasi: {{ totalSum }} UZS</p>
        </div>
        <div class="flex justify-between items-center border-t border-gray-300 mt-4 py-4 px-4">
          <p class="font-bold text-gray-500 text-xl">Xizmat turlari haqida ma'lumotlar</p>
          <p class="font-bold text-gray-500 text-xl">Soni</p>
          <p class="font-bold text-gray-500 text-xl">Summa</p>
          <p class="font-bold text-gray-500 text-xl">Jami</p>
        </div>
        <div v-for="service in services" :key="service.id" class="grid-cols-3 items-center text-xl flex justify-between bg-sky-200 px-4 py-4 rounded-lg overflow-hidden">
          <p class="font-bold">{{ service.name }}</p>
          <div class="flex items-center pl-52">
            <button type="button" @click="decrementQuantity(service)" class="-ml-px inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-l-md text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">-</button>
            <div class="px-2">
              <p>{{ service.quantity }}</p>
            </div>
            <button type="button" @click="incrementQuantity(service)" class="-ml-px inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-r-md text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">+</button>
          </div>
          <p>{{ service.price }} UZS</p>
          <p>{{ service.quantity * service.price }} UZS</p>
        </div>
      </div>
      <div class="flex justify-between pt-4">
        <div class="mt-4">
          <button type="button" @click="addService" class="bg-red-500 hover:bg-red-600 hover:border-red-700 text-white font-bold py-3 px-4 border-b-4 border-red-600 rounded-lg transition duration-200 transform hover:scale-105 active:border-t-4 active:border-b-0 w-80 flex justify-center">
            Xizmat turini qoshish
          </button>
        </div>
        <div class="mt-4">
          <button type="button" @click="confirmService" class="bg-violet-600 hover:bg-violet-600 hover:border-violet-700 text-white font-bold py-3 px-4 border-b-4 w-80 border-violet-500 rounded-lg transition duration-200 transform hover:scale-105 active:border-t-4 active:border-b-0 flex justify-center">
            Tasdiqlash
          </button>
        </div>
    </div>
    <section id="log-in" class="flex justify-center min-h-52 py-20">
      <form @submit.prevent="addServiceCategory" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <div class="mb-5">
          <h1 class="text-xl font-bold">Buyurtma uchun xizmat turini qo'shish</h1>
        </div>
        <hr class="py-2">
        <div>Katigorya</div>
        <select v-model="serviceCategory" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <div>Xizmat Turi</div>
        <select v-model="serviceType" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
        </select>
        <label for="quantity" class="block text-base mb-2">Soni</label>
        <input type="number" id="quantity" v-model.number="serviceQuantity" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Soni kirting">
        <label for="price" class="block text-base mb-2 mt-8">Narxi</label>
        <input type="number" id="price" v-model.number="servicePrice" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Narxni belgilang">
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
  </div>
</template>






<script setup>
import { ref, onMounted } from 'vue';
import apiService from './services/apiService';

const formData = ref({
  full_name: '',
  dob: '',
  address: '',
  phone_number: ''
});

const submitForm = async () => {
  try {
    const response = await apiService.createCustomer(formData.value);
    alert('Customer created: ' + JSON.stringify(response.data));
  } catch (error) {
    console.error('Error creating customer:', error);
  }
};

const services = ref([]);
const categories = ref([]);
const totalSum = ref(0);

const serviceCategory = ref('');
const serviceType = ref('');
const serviceQuantity = ref(1);
const servicePrice = ref(0);
const serviceDiscount = ref('');

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
    services.value = response.data.map(service => ({
      ...service,
      quantity: 1
    }));
    updateTotalSum();
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const updateTotalSum = () => {
  totalSum.value = services.value.reduce((acc, service) => acc + (service.price * service.quantity), 0);
};

const incrementQuantity = (service) => {
  service.quantity++;
  updateTotalSum();
};

const decrementQuantity = (service) => {
  if (service.quantity > 1) {
    service.quantity--;
    updateTotalSum();
  }
};

const addService = async () => {
  const serviceData = {
    category: serviceCategory.value,
    type: serviceType.value,
    quantity: serviceQuantity.value,
    price: servicePrice.value,
    discount: serviceDiscount.value,
  };
  try {
    const response = await apiService.createService(serviceData);
    services.value.push({ ...response.data, quantity: 1 });
    updateTotalSum();
  } catch (error) {
    console.error('Error adding service:', error);
  }
};

const confirmService = () => {
  // Implement confirmation logic here
};

const cancelService = () => {
  // Implement cancel logic here
};

onMounted(() => {
  fetchCategories();
  fetchServices();
});
</script>
