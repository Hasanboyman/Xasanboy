<template>

<section class="bg-white shadow w-full h-auto flex justify-around">
      <nav class="flex justify-between items-center w-full max-w-screen-xl">
        <span>
          <img src="./components/img/logo2-removebg-preview.png" class="w-48" alt="logo1">
        </span>
        <ul class="flex gap-16 items-center font-bold">
          <li class="px-4 py-2">
            <RouterLink to="/kassa">Kassa</RouterLink>
          </li>
          <li>
            <RouterLink to="/mijozlar">Mijozlar</RouterLink>
          </li>
          <li>
            <RouterLink to="/Xodimlar">Xodimlar</RouterLink>
          </li>
          <li>
            <RouterLink to="/kategoriya">Kategoryalar</RouterLink>
          </li>
          <li>
            <RouterLink to="/xizmatlar">Xizmatlar</RouterLink>
          </li>
          <li>
            <RouterLink to="/Shifokor">Shifokorlar</RouterLink>
          </li>
          <li>
            <RouterLink to="/roliComponent" v-if="ability.can('view', 'RoliComponent')">Roli</RouterLink>
          </li>
        </ul>
        <div class="right-btn flex items-center gap-4">
          <RouterLink to="/" class="bg-blue-600 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300">
            Chiqish
          </RouterLink>
        </div>
      </nav>
    </section>
</template>