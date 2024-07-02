import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { abilitiesPlugin } from '@casl/vue';
import defineAbilitiesFor from './abilities';

import Shifokor from './components/ShifokorComponent.vue';
import Xodimlar from './components/XodimlarComponent.vue';
import add_user_create2 from './components/AddUserCreat2.vue';
import add_user_create from './components/AddUserCreate.vue';
import cash from './components/CashComponent.vue';
import create_kategoriya from './components/CreateKategoriya.vue';
import create_kategoriya1 from './components/CreateKtigoriya1.vue';
import create from './components/CreateComponent.vue';
import kassa from './components/KassaComponent.vue';
import kategoriya from './components/KategoriyaComponent.vue';
import login from './components/LoginComponent.vue';
import mijozlar from './components/MijozlarComponent.vue';
import mijozlarni_korish from './components/MijozlarniKorish.vue';
import roli from './components/RoliComponent.vue';
import update_doctor from './components/UpdateDoctor.vue';
import updatecategoriya from './components/UpdateKategoriya.vue';
import view_edite_katgoriya from './components/ViewEditKategoriya.vue';
import xizmatlar from './components/XizmatlarComponent.vue';
import AddOrder from './components/AddOrder.vue';
import create_1 from './components/create_1.vue';
import update_user from './components/UpdateUser.vue'


const routes = [
  { path: '/', component: login, name: 'login' },
  { path: '/Shifokor', component: Shifokor, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/Xodimlar', component: Xodimlar, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/add_user_create2', component: add_user_create2, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/add_user_create', component: add_user_create, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cash', component: cash, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/create_kategoriya', component: create_kategoriya, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/create_kategoriya1', component: create_kategoriya1, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/create', component: create, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/kategoriya', component: kategoriya, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/mijozlar', component: mijozlar, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/mijozlarni_korish', component: mijozlarni_korish, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/kassa', component: kassa, meta: { requiresAuth: true, role: 'kassa' } },
  { path: '/roliComponent', component: roli, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/update_doctor/:id', component: update_doctor, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/updatecategoriya', component: updatecategoriya, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/view_edite_katgoriya', component: view_edite_katgoriya, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/xizmatlar', component: xizmatlar, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/AddOrder', component: AddOrder, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/create_1', component: create_1, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/update_user/:id', component: update_user, meta: { requiresAuth: true, role: 'admin' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'border-b border-blue-500 ',
  linkExactActiveClass: '',
});

const isAuthenticated = () => true; // Replace with actual authentication check
const getUserRole = () => 'admin'; // Replace with actual role fetching logic

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ path: '/' });
    } else {
      const userRole = getUserRole();
      const ability = defineAbilitiesFor(userRole);
      if (to.meta.role && !ability.can('access', to.meta.role) && userRole !== 'superAdmin' && userRole !== 'admin' && userRole !== 'kassa') {
        next({ path: '/' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.use(abilitiesPlugin, defineAbilitiesFor(getUserRole()));
app.mount('#app');
