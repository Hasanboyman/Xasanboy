<template>
  <div>
    <section id="log-in" class="flex justify-center min-h-52 py-20">
      <form @submit.prevent="submitForm" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <label for="fio" class="block text-base text-xl font-bold mb-2">F.I.O</label>
        <input type="text" id="fio" v-model="formData.fio" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Ism uchun joy">

        <div class="mt-8 text-xl font-bold">Tug'ulgan kun</div>
        <label for="dob" class="block text-base mb-2"></label>
        <input type="date" id="dob" v-model="formData.dob" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="">

        <label for="address" class="block text-base mb-2 mt-8 text-xl font-bold">Manzil</label>
        <input type="text" id="address" v-model="formData.address" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Yashash joyingiz">

        <label for="tel" class="block text-base mb-2 mt-8 text-xl font-bold">Tel</label>
        <input type="text" id="tel" v-model="formData.tel" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="telefon nomer">

        <div class="mt-16 flex justify-end items-center">
          <div class="flex justify-between space-x-14 text-nowrap">
            <button type="button" class="bg-violet-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-violet-500 hover:shadow-md transition-all ease-in-out duration-300">
              Orqaga Qaytish
            </button>
            <button type="button" @click="addService" class="bg-red-500 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-red-500 hover:shadow-md transition-all ease-in-out duration-300">
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
          <p class="font-bold text-2xl">Hammasi: 90 000 UZS</p>
        </div>
        <div class="flex justify-between items-center border-t border-gray-300 mt-4 py-4 px-4">
          <p class="font-bold text-gray-500 text-xl">Xizmat turlari haqida ma'lumotlar</p>
          <p class="font-bold text-gray-500 text-xl">Soni</p>
          <p class="font-bold text-gray-500 text-xl">Summa</p>
          <p class="font-bold text-gray-500 text-xl">Jami</p>
        </div>
        <div class="grid-cols-3 items-center text-xl flex justify-between bg-sky-200 px-4 py-4 rounded-lg overflow-hidden">
          <p class="font-bold">Terapevt ko'rigi</p>
          <div class="flex items-center pl-52">
            <button type="button" @click="decrementQuantity" class="-ml-px inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-l-md text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">-</button>
            <div class="px-2">
              <p>{{ serviceQuantity }}</p>
            </div>
            <button type="button" @click="incrementQuantity" class="-ml-px inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-r-md text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">+</button>
          </div>
          <p>30000 UZS</p>
          <p>90000 UZS</p>
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
    </div>

    <section id="log-in" class="flex justify-center min-h-52 py-12 hiden">
      <form @submit.prevent="addServiceCategory" class="bg-white shadow-md border-black rounded overflow-hidden items-center w-1/4 p-8">
        <div class="mb-5">
          <h1 class="text-xl font-bold">Buyurtma uchun xizmat turini qo'shish</h1>
        </div>
        <hr class="py-2">
        <div>Katigorya</div>
        <select v-model="serviceCategory" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option>Terapiya</option>
          <option>hullas</option>
          <option>Ambulatoriya</option>
        </select>
        <div>Xizmat Turi</div>
        <select v-model="serviceType" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 mb-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option>stamatologiya</option>
          <option>uzi</option>
          <option>Ambulatoriya</option>
        </select>
        <label for="quantity" class="block text-base mb-2">Soni</label>
        <input type="number" id="quantity" v-model.number="serviceQuantity" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Soni kirting">
        <label for="price" class="block text-base mb-2 mt-8">Narxi</label>
        <input type="number" id="price" v-model.number="servicePrice" class="border w-full text-base px-2 py-1 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300" placeholder="Narxni belgilang">
        <div class="mt-8">Discount</div>
        <select v-model="serviceDiscount" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option>Javohirbek</option>
          <option>qudratillo</option>
          <option>Isroiljon</option>
        </select>
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

<script>
import apiService from './services/apiService';

let api = apiService
export default {
  data() {
    return {
      formData: {
        fio: '',
        dob: '',
        address: '',
        tel: '',
      },
      serviceQuantity: 3,
      serviceCategory: '',
      serviceType: '',
      servicePrice: '',
      serviceDiscount: '',
    };
  },
  methods: {
    submitForm() {
      api.createCustomer(this.formData)
          .then(response => {
            console.log('Customer created:', response.data);
          })
          .catch(error => {
            console.error('Error creating customer:', error);
          });
    },
    addService() {
      const serviceData = {
        category: this.serviceCategory,
        type: this.serviceType,
        quantity: this.serviceQuantity,
        price: this.servicePrice,
        discount: this.serviceDiscount,
      };
      api.createOrder(serviceData)
          .then(response => {
            console.log('Service added:', response.data);
          })
          .catch(error => {
            console.error('Error adding service:', error);
          });
    },
    confirmService() {
      // Implement confirmation logic
    },
    addServiceCategory() {
      const categoryData = {
        category: this.serviceCategory,
        type: this.serviceType,
        quantity: this.serviceQuantity,
        price: this.servicePrice,
        discount: this.serviceDiscount,
      };
      api.createCategory(categoryData)
          .then(response => {
            console.log('Service category added:', response.data);
          })
          .catch(error => {
            console.error('Error adding service category:', error);
          });
    },
    cancelService() {
      // Implement cancel logic
    },
    incrementQuantity() {
      this.serviceQuantity++;
    },
    decrementQuantity() {
      if (this.serviceQuantity > 1) {
        this.serviceQuantity--;
      }
    },
  },
};
</script>

<style>
.active-link {
  font-weight: bold;
  color: blue;
}
</style>
