<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: true,
      error: null,
      searchId: '', // This will hold the search input
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:5084/api/Order/getAll');
        this.orders = response.data;
        this.filteredOrders = this.orders; // Initially show all orders
      }
      catch (error) {
        this.error = error.message || 'Error fetching orders';
      }
      finally {
        this.loading = false;
      }
    },

    // Filter orders based on the searchId
    filterOrders() {
      if (this.searchId) {
        this.filteredOrders = this.orders.filter(order =>
          order.id === Number.parseInt(this.searchId),
        );
      }
      else {
        this.filteredOrders = this.orders; // If searchId is empty, show all orders
      }
    },

    // Toggle the visibility of the order details
    toggleDetails(orderId) {
      const order = this.orders.find(order => order.id === orderId);
      if (order) {
        order.showDetails = !order.showDetails;
      }
    },

    // Cancel an order
    async cancelOrder(orderId) {
      try {
        // Make a request to the API to update the order status to "Cancelled"
        await axios.put(`http://localhost:5084/api/Order/cancel/${orderId}`);

        // Update the order status in the local list after successful cancellation
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
          order.status = 'Cancelled';
        }

        // Re-filter the orders if searchId is still present
        this.filterOrders();
      }
      catch (error) {
        console.error('Error cancelling the order:', error);
      }
    },

    // Change the order status (e.g., from Pending to Shipped)
    async changeStatus(orderId) {
      try {
        // Make a request to the API to change the order status
        await axios.put(`http://localhost:5084/api/Order/changeStatus/${orderId}`);

        // Update the order status in the local list after successful status change
        const order = this.orders.find(order => order.id === orderId);
        if (order) {
          order.status = 'Shipped'; // Change this to the status you want (e.g., 'Shipped', 'Delivered')
        }

        // Re-filter the orders if searchId is still present
        this.filterOrders();
      }
      catch (error) {
        console.error('Error changing the order status:', error);
      }
    },
  },
};
</script>

<template>
  <div class="order-list">
    <h1>All Orders</h1>

    <!-- Search Input -->
    <div class="search-container">
      <label for="order-id">Search by Order ID:</label>
      <input
        id="order-id"
        v-model="searchId"
        type="number"
        placeholder="Enter Order ID"
        @input="filterOrders"
      >
    </div>

    <div v-if="loading" class="loading">
      Loading orders...
    </div>
    <div v-if="error" class="error">
      <p>An error occurred while fetching the orders: {{ error }}</p>
    </div>

    <!-- Display Orders -->
    <ul v-if="filteredOrders.length">
      <li v-for="order in filteredOrders" :key="order.id" class="order-item">
        <h2>Order ID: {{ order.id }}</h2>
        <p><strong>Customer Name:</strong> {{ order.customerName }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Total Price:</strong> €{{ order.totalPrice }}</p>
        <p><strong>Order Date:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>

        <!-- Details Button -->
        <button class="details-button" @click="toggleDetails(order.id)">
          {{ order.showDetails ? 'Hide Details' : 'Show Details' }}
        </button>

        <!-- Order Details Section -->
        <div v-if="order.showDetails">
          <ul>
            <li v-for="item in order.orderItems" :key="item.id" class="order-item-detail">
              <p>Product ID: {{ item.productId }}</p>
              <p>Quantity: {{ item.quantity }}</p>
              <p>Price: €{{ item.price }}</p>
            </li>
          </ul>
          <p v-if="order.customerAddress">
            <strong>Address:</strong> {{ order.customerAddress }}
          </p>
          <p v-if="order.customerEmail">
            <strong>Email:</strong> {{ order.customerEmail }}
          </p>
          <p v-if="order.customerPhone">
            <strong>Phone:</strong> {{ order.customerPhone }}
          </p>
        </div>

        <!-- Cancel Button -->
        <button v-if="order.status !== 'Cancelled'" class="cancel-button" @click="cancelOrder(order.id)">
          Cancel Order
        </button>

        <!-- Change Status Button -->
        <button v-if="order.status !== 'Cancelled'" class="change-status-button" @click="changeStatus(order.id)">
          Change Status
        </button>
      </li>
    </ul>

    <!-- No Orders Found Message -->
    <div v-else class="no-orders">
      <p>No orders found with that ID.</p>
    </div>
  </div>
</template>

<style scoped>
.order-list {
  margin: 20px;
}

.loading {
  font-size: 1.2em;
  color: #555;
}

.error {
  color: red;
}

.search-container {
  margin-bottom: 20px;
}

#order-id {
  padding: 8px;
  margin-left: 10px;
}

.order-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.order-item-detail {
  margin-left: 20px;
}

h2 {
  font-size: 1.5em;
}

p {
  margin: 5px 0;
}

.no-orders {
  font-size: 1.2em;
  color: #555;
}

.cancel-button,
.change-status-button,
.details-button {
  background-color: #ff4d4f;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1rem;
}

.cancel-button:hover,
.change-status-button:hover,
.details-button:hover {
  background-color: #f5222d;
}

.change-status-button {
  background-color: #52c41a;
}

.change-status-button:hover {
  background-color: #4caf50;
}

.details-button {
  background-color: #1890ff;
}

.details-button:hover {
  background-color: #40a9ff;
}

button {
  margin-top: 10px;
}
</style>
