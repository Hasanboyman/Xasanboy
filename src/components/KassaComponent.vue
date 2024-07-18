<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from './services/apiService';
import { useAbility } from '@casl/vue';

// Reactive variables
const rows = ref([]);
const services = ref([]);
const qolidiqlar = ref(0);
const currentPage = ref(1);
const rowsPerPage = 8;

const ability = useAbility();

const fetchData = async () => {
  try {
    console.log('Fetching data...');
    const [cashboxResponse, servicesResponse, totalResponse] = await Promise.all([
      apiService.showCashBox(),
      apiService.getAllServices(),
      apiService.getTotal()
    ]);

    if (cashboxResponse.data && Array.isArray(cashboxResponse.data)) {
      rows.value = cashboxResponse.data.map(item => ({
        xolat: item.action,
        pul: item.amount,
        izoh: item.comment || '',
        sanna: item.timestamp
      }));
    } else {
      rows.value = [];
    }

    if (servicesResponse.data && Array.isArray(servicesResponse.data)) {
      services.value = servicesResponse.data.map(service => ({
        ...service,
        price_of_service: service.price_of_service !== null ? `${service.price_of_service} sum` : 'No Price'
      }));
    } else {
      services.value = [];
    }

    qolidiqlar.value = totalResponse.data.total_price || 0;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const withdrawFromCashbox1 = async () => {
  try {
    await apiService.resetCashBox();
    qolidiqlar.value = 0;
    console.log('Withdrawal successful');
    location.reload()
  } catch (error) {
    console.error('Withdrawal failed:', error);
  }
};

const totalPages = computed(() => Math.ceil(rows.value.length / rowsPerPage));

const paginatedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return rows.value.slice(startIndex, startIndex + rowsPerPage);
});

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

// Fetch data on component mount
onMounted(fetchData);
</script>

<template>
  <div>
    <section class="flex justify-around py-4">
      <input type="date" class="pl-10 pr-4 h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500" placeholder="Sanani kiriting"/>
      <div class="right-btn flex items-start justify-center gap-4">
        <RouterLink to="/cash" 
          class="bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300"
          v-if="ability.can('use', 'PulYechish')">
          Pul olish
        </RouterLink>
        <button @click="withdrawFromCashbox1"
          class="bg-red-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-red-400 hover:shadow-md transition-all ease-in-out duration-300"
          v-if="ability.can('use', 'Inkassa')">
          Inkassa
        </button>
      </div>
        <!-- <div class="relative top-5 left-72">
          <pre>
             
          </pre>
        </div>  for date not moving -->
        <h4 class="rounded-lg bg-blue-500 border-blue-500 border-x-2 text-white text-xl font-bold px-3 py-2 shadow-inner" style="width: 150px; display: flex; justify-content: center;"
        v-if="ability.can('view', 'qoldiqlar')">
          {{ qolidiqlar }} sum
        </h4>
    </section>
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <section id="table">
        <div class="flex justify-center">
          <table class="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
            <thead class="bg-white text-black border-b-2 border-black">
              <tr>
                <th class="px-4 py-3">Xolati</th>
                <th class="px-4 py-3">PUL</th>
                <th class="px-4 py-3">IZOH</th>
                <th class="px-4 py-3">SANNA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in paginatedRows" :key="index" class="border-b text-gray-700 bg-white">
                <th class="px-4 py-3">{{ row.xolat }}</th>
                <th class="px-4 py-3 text-blue-500">{{ row.pul }} sum</th>
                <th class="px-4 py-3 text-red-500">{{ row.izoh }}</th>
                <th class="px-4 py-3">{{ row.sanna }}</th>
              </tr>
            </tbody>
          </table>
        </div>

      <div class="flex space-x-2">
        <div class="flex justify-center pl-36 relative left-36 text-gray-600">
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
  </div>
</template>
