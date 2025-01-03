<script>
import useVuelidate from '@vuelidate/core';
import { email, maxLength, minLength, numeric, required } from '@vuelidate/validators';
import axios from 'axios';

export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: null,
      },
      submitted: false,
    };
  },
  methods: {
    async submitForm() {
      this.submitted = true;
      window.scrollTo(0, 0);
      console.log('Form Data:', this.form);

      try {
        const response = await axios.post(
          'https://fakestoreapi.com/users',
          {
            email: this.form.email,
            username: `${this.form.firstName.toLowerCase()}${this.form.lastName.toLowerCase()}`,
            password: 'm38rmF$',
            name: {
              firstname: this.form.firstName,
              lastname: this.form.lastName,
            },
            address: {
              city: 'kilcoole',
              street: '7835 new road',
              number: 3,
              zipcode: '12926-3874',
              geolocation: {
                lat: '-37.3159',
                long: '81.1496',
              },
            },
            phone: this.form.phoneNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Server Response:', response.data);

        // Create a cookie with the form data
        document.cookie = `userData=${encodeURIComponent(
          JSON.stringify(this.form),
        )}; path=/; max-age=3600;`;
      }
      catch (error) {
        console.error('Error submitting form:', error);
      }

      finally {
        setTimeout(() => {
          this.submitted = false;
          this.$router.push('/');
        }, 3000);
      }
    },
  },
  validations: {
    form: {
      firstName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      lastName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      email: { required, email },
      phoneNumber: { required, numeric, minLength: minLength(5), maxLength: maxLength(10) },
      age: { required, numeric },
    },
  },
};
</script>

<template>
  <div v-if="submitted" class="loader-line" />
  <div v-if="submitted" class="submission-info">
    <h3>Form Submitted Successfully!</h3>
  </div>
  <div class="registration-form">
    <h2>Registration Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="form.firstName" type="text" required placeholder="Enter your first name...">
      </div>

      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input id="lastName" v-model="form.lastName" type="text" required placeholder="Enter your last name...">
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="form.email" type="email" required placeholder="Enter your email...">
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input id="phoneNumber" v-model="form.phoneNumber" type="tel" required placeholder="Enter your phone number...">
      </div>

      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" v-model="form.age" type="number" min="0" required placeholder="Enter your age...">
      </div>

      <button type="submit">
        Submit
        {{ console.log(form) }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.loader-line {
            width: 100%;
            height: 3px;
            position: relative;
            overflow: hidden;
            background-color: #ddd;
            margin: 0 auto;
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            border-radius: 20px;
        }

        .loader-line:before {
            content: "";
            position: absolute;
            left: -50%;
            height: 3px;
            width: 40%;
            background-color: #212020;
            -webkit-animation: lineAnim 1s linear infinite;
            -moz-animation: lineAnim 1s linear infinite;
            animation: lineAnim 1s linear infinite;
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            border-radius: 20px;
        }

        @keyframes lineAnim {
            0% {
                left: -40%;
            }
            50% {
                left: 20%;
                width: 80%;
            }
            100% {
                left: 100%;
                width: 100%;
            }
        }
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.submission-info {
  margin-top: 20px;
  padding: 15px;
  border: 2px solid #28a745;
  border-radius: 10px;
  background-color: #e6ffed;
  color: #155724;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: auto;
  width: 30%;
  margin: 20px auto;
}

.submission-info h3 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #155724;
}
  </style>
