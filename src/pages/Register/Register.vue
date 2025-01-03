<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        gender: '',
      },
    };
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.form);
      // Add your form submission logic here
    },
  },
};
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          id="firstName"
          v-model="form.firstName"
          type="text"
          placeholder="Enter your first name"
          required
        >
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          placeholder="Enter your last name"
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          required
        >
      </div>

      <div class="form-group">
        <label>Gender</label>
        <div>
          <label>
            <input
              v-model="form.gender"
              type="radio"
              value="Male"
            >
            Male
          </label>
          <label>
            <input
              v-model="form.gender"
              type="radio"
              value="Female"
            >
            Female
          </label>
          <label>
            <input
              v-model="form.gender"
              type="radio"
              value="Other"
            >
            Other
          </label>
        </div>
      </div>

      <button type="submit">
        Register
      </button>
    </form>
  </div>
</template>

  <style scoped>
  .register-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
  </style>
