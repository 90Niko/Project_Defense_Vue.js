<script>
import useVuelidate from '@vuelidate/core';
import { email, maxLength, minLength, numeric, required } from '@vuelidate/validators';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: null,
    });

    const submitted = ref(false);
    const submissionError = ref(null);
    const validationErrors = ref([]);
    const isLoading = ref(false);
    const router = useRouter();

    const rules = {
      firstName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      lastName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      email: { required, email },
      phoneNumber: { required, numeric, minLength: minLength(5), maxLength: maxLength(10) },
      age: { required, numeric },
    };

    const v$ = useVuelidate(rules, form);

    const validateForm = () => {
      v$.value.$touch();
      validationErrors.value = [];

      if (!v$.value.$invalid)
        return true;

      Object.entries(v$.value).forEach(([key, value]) => {
        if (value && value.$error) {
          validationErrors.value.push(`${key}: Validation failed`);
        }
      });

      return false;
    };

    const submitForm = async () => {
      submitted.value = false;
      isLoading.value = true;
      submissionError.value = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (!validateForm()) {
        submitted.value = false;
        isLoading.value = false;
        return;
      }

      try {
        const response = await axios.post(
          'https://fakestoreapi.com/users',
          {
            email: form.value.email,
            username: `${form.value.firstName.toLowerCase()}${form.value.lastName.toLowerCase()}`,
            password: 'm38rmF$',
            name: {
              firstname: form.value.firstName,
              lastname: form.value.lastName,
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
            phone: form.value.phoneNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Server Response:', response.data);
        submitted.value = true;

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
      catch (error) {
        console.error('Error submitting form:', error);
        submissionError.value = 'There was an error submitting the form. Please try again later.';
      }
      finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      submitted,
      submissionError,
      validationErrors,
      isLoading,
      v$,
      submitForm,
    };
  },
};
</script>

<template>
  <div v-if="isLoading" class="loader-line" />
  <div v-if="submitted && !submissionError" class="submission-info">
    <h3>Form Submitted Successfully!</h3>
  </div>
  <div v-if="submissionError" class="error-message">
    <h3>{{ submissionError }}</h3>
  </div>
  <div class="registration-form">
    <h2>Registration Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="form.firstName" type="text" required placeholder="Enter your first name...">
        <p v-if="v$.firstName.$error" class="error-text">
          {{ v$.firstName.$errors[0]?.$message }}
        </p>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input id="lastName" v-model="form.lastName" type="text" required placeholder="Enter your last name...">
        <p v-if="v$.lastName.$error" class="error-text">
          {{ v$.lastName.$errors[0]?.$message }}
        </p>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="form.email" type="email" required placeholder="Enter your email...">
        <p v-if="v$.email.$error" class="error-text">
          {{ v$.email.$errors[0]?.$message }}
        </p>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input id="phoneNumber" v-model="form.phoneNumber" type="tel" required placeholder="Enter your phone number...">
        <p v-if="v$.phoneNumber.$error" class="error-text">
          {{ v$.phoneNumber.$errors[0]?.$message }}
        </p>
      </div>

      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" v-model="form.age" type="text" required placeholder="Enter your age...">
        <p v-if="v$.age.$error" class="error-text">
          {{ v$.age.$errors[0]?.$message }}
        </p>
      </div>

      <button type="submit">
        Submit
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
  border-radius: 20px;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: #212020;
  animation: lineAnim 1s linear infinite;
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

.error-message {
  color: #d9534f;
  background-color: #f2dede;
  padding: 10px;
  border: 1px solid #ebccd1;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
}

.error-list {
  margin-bottom: 20px;
  color: #d9534f;
}

.error-list ul {
  list-style-type: none;
  padding: 0;
}

.error-list li {
  margin-bottom: 5px;
}

.error-text {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 5px;
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
