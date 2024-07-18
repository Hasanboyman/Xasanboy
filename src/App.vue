<template>
    <section v-if="$route.name !== 'ErrorComponents' && $route.name !== 'login'" class="bg-white shadow-md w-full h-auto flex justify-center py-4">
      <nav class="flex justify-between items-center w-full max-w-screen-xl px-8">
        <span class="logo transform transition-transform duration-500">
          <img src="./components/img/logo2-removebg-preview.png" class="w-48" alt="logo">
        </span>
        <ul class="flex gap-8 items-center font-bold text-lg">
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/kassa" class="nav-link">Kassa</RouterLink>
          </li>
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/mijozlar" class="nav-link">Mijozlar</RouterLink>
          </li>
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/Xodimlar" class="nav-link">Xodimlar</RouterLink>
          </li>
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/kategoriya" class="nav-link">Kategoryalar</RouterLink>
          </li>
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/xizmatlar" class="nav-link">Xizmatlar</RouterLink>
          </li>
          <li
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/Shifokor" class="nav-link">Shifokorlar</RouterLink>
          </li>
          <li v-if="ability.can('view', 'RoliComponent')"
            class="nav-item px-4 py-2 transition-all ease-in-out duration-300 hover:text-primary1 rounded-md">
            <RouterLink to="/roliComponent" class="nav-link">Roli</RouterLink>
          </li>
        </ul>
        <div class="right-btn flex items-center px-4">
          <RouterLink to="/"
            class="exit-btn bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:bg-blue-700 hover:shadow-lg transition-all ease-in-out duration-300">
            Chiqish
          </RouterLink>
        </div>
      </nav>
    </section>
  <router-view />
</template>

<script setup>
import { useAbility } from '@casl/vue';
import { onMounted } from 'vue';

const ability = useAbility();

onMounted(() => {
  let docTitle = document.title;

  window.addEventListener("blur", () => {
    document.title = 'GOOD BYE';
  });

  window.addEventListener("focus", () => {
    document.title = docTitle;
  });
});
</script>


