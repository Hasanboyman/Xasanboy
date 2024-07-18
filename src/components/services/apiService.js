import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-pharm.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  login(credentials) {
    return apiClient.post('accounts/login/', credentials);
  },
  logout() {
    return apiClient.post('api/user/logout/');
  },
  createUser(userData) {
    return apiClient.post('api/create-user/', userData);
  },
  allOrders() {
    return apiClient.get('orders/');
  },
  createOrder(orderData) {
    return apiClient.post('orders/create/', orderData);
  },
  deleteOrder(orderId) {
    return apiClient.delete(`api/orders/${orderId}/`);
  },
  updateOrder(orderId, updatedData) {
    return apiClient.put(`api/orders/update/${orderId}/`, updatedData);
  },
  getAvailableDoctors(serviceId) {
    return apiClient.get(`doctors/available/${serviceId}/`);
  },
  getAllDoctors() {
    return apiClient.get('api/doctors/all');
  },
  createDoctor(doctorData) {
    return apiClient.post('api/doctors/create', doctorData);
  },
  updateDoctor(doctorId, updatedData) {
    return apiClient.put(`api/doctors/update/${doctorId}`, updatedData);
  },
  deleteDoctor(doctorId) {
    return apiClient.delete(`api/doctors/delete/${doctorId}`);
  },
  getAllServices() {
    return apiClient.get('api/services/all');
  },
  createService(serviceData) {
    return apiClient.post('api/services/create', serviceData);
  },
  updateService(serviceId, updatedData) {
    return apiClient.put(`api/services/update/${serviceId}`, updatedData);
  },
  deleteService(serviceId) {
    return apiClient.delete(`api/services/delete/${serviceId}`);
  },
  showCashBox() {
    return apiClient.get('api/cashbox/all');
  },
  getTotal() {
    return apiClient.get('api/cashbox/total/');
  },
  resetCashBox() {
    return apiClient.post('api/cashbox/reset');
  },
  withdrawMoney(withdrawData) {
    return apiClient.post('api/cashbox/withdrawCashbox', withdrawData);
  },
  getAllUsers() {
    return apiClient.get('api/users/all');
  },
  deleteUser(userId) {
    return apiClient.delete(`api/users/delete/${userId}`);
  },
  createUsers(userData) {
    return apiClient.post('api/create-user', userData);
  },
  updateUser(userId, updatedData) {
    return apiClient.put(`api/users/update/${userId}`, updatedData);
  },
  getAllCustomers() {
    return apiClient.get('api/customers/list');
  },
  createCustomer(customerData) {
    return apiClient.post('api/customers/create', customerData);
  },
  updateCustomer(customerId, updatedData) {
    return apiClient.put(`api/customers/update/${customerId}`, updatedData);
  },
  deleteCustomer(customerId) {
    return apiClient.delete(`api/customers/delete/${customerId}`);
  },
  getAllCategories() {
    return apiClient.get('api/categories/all');
  },
  createCategory(categoryData) {
    return apiClient.post('api/categories/create/', categoryData);
  },
  updateCategory(categoryId, updatedData) {
    return apiClient.post(`api/categories/update/${categoryId}`, updatedData);
  },
  deleteCategory(categoryId) {
    return apiClient.put(`api/categories/delete/${categoryId}`);
  },
  listPermissions() {
    return apiClient.get('permissions/');
  },
  getAllRoles() {
    return apiClient.get('api/roles/all');
  },
  updateRole(roleId, updatedData) {
    return apiClient.put(`api/roles/update/${roleId}`, updatedData);
  }
};