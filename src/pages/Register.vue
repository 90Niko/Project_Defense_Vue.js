<script>
import useVuelidate from '@vuelidate/core';
import { email, maxLength, minLength, numeric, required } from '@vuelidate/validators';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

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
    const toast = useToast(); // Initialize toast

    const rules = {
      firstName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      lastName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(20) },
      age: { required, numeric },
      gender: { required },
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
        toast.error('Validation errors found. Please correct them.');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:5084/api/User/register',
          {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email,
            password: form.value.password,
            male: form.value.gender,
            age: form.value.age,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Server Response:', response.data);
        submitted.value = true;
        toast.success('Registration successful!');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('login');
        }, 2000);
      }
      catch (error) {
        console.error('Error submitting form:', error);
        submissionError.value = 'There was an error submitting the form. Please try again later.';
        toast.error('Failed to submit the form. Please try again.');
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
  <div class="registration-container">
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-indicator" />

    <!-- Success Message -->
    <div v-if="submitted && !submissionError" class="success-message">
      <h3>Form Submitted Successfully!</h3>
    </div>

    <!-- Error Message -->
    <div v-if="submissionError" class="error-message">
      <h3>{{ submissionError }}</h3>
    </div>

    <!-- Profile Icon -->
    <div class="profile-icon-container">
      <img
        class="profile-icon"
        width="80"
        height="80"
        src="https://img.icons8.com/ios-filled/100/user-male-circle.png"
        alt="Profile"
      >
    </div>
    <!-- Registration Form -->
    <div class="form-wrapper">
      <form class="form-content" @submit.prevent="submitForm">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/fluency-systems-filled/24/name.png"
              alt="name"
            >
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            required
            placeholder="Enter your first name..."
            class="form-input"
          >
          <p v-if="v$.firstName.$error" class="error-text">
            {{ v$.firstName.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/fluency-systems-filled/24/name.png"
              alt="name"
            >
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            required
            placeholder="Enter your last name..."
            class="form-input"
          >
          <p v-if="v$.lastName.$error" class="error-text">
            {{ v$.lastName.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/sf-black-filled/24/new-post.png"
              alt="email"
            >
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email..."
            class="form-input"
          >
          <p v-if="v$.email.$error" class="error-text">
            {{ v$.email.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/material-sharp/24/password.png"
              alt="password"
            >
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password..."
            class="form-input"
          >
          <p v-if="v$.password.$error" class="error-text">
            {{ v$.password.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Age -->
        <div class="form-group">
          <label for="age" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/sf-regular-filled/24/age.png"
              alt="age"
            >
          </label>
          <input
            id="age"
            v-model="form.age"
            type="text"
            required
            placeholder="Enter your age..."
            class="form-input"
          >
          <p v-if="v$.age.$error" class="error-text">
            {{ v$.age.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Gender -->
        <div class="form-group">
          <label for="gender" class="form-label">
            <img
              class="form-icon"
              width="24"
              height="24"
              src="https://img.icons8.com/glyph-neue/24/gender.png"
              alt="gender"
            >
          </label>
          <select
            id="gender"
            v-model="form.gender"
            required
            class="form-select"
          >
            <option value="" disabled>
              Select your gender...
            </option>
            <option value="male">
              Male
            </option>
            <option value="female">
              Female
            </option>
          </select>
          <p v-if="v$.gender.$error" class="error-text">
            {{ v$.gender.$errors[0]?.$message }}
          </p>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="form-button">
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* General Styling */
/* General Styling */
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('https://your-image-url.com'); /* Background image */
  background-size: cover;
  background-position: center;
}

.registration-container {
  position: relative;
  background-color: white; /* Slightly transparent white background */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 100px;
  margin-bottom: 100px;
  backdrop-filter: blur(8px)!important; /* Applying blur effect to the background */
  -webkit-backdrop-filter: blur(8px)!important;
  z-index: 10; /* For Safari */
}

/* Form Group Styling */
.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-icon {
  position: absolute;
  top: 51%;
  left: 10px;
  transform: translateY(-45%);
}

.form-input,
.form-select {
  width: 100%;
  height: 50px;
  padding: 5px 5px 5px 40px; /* Padding left to make space for the icon */
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.2s;
  margin:0 auto;
  margin-top: 0.5px;
  color: #333333;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
}

.form-select {
  padding: 10px 10px 10px 40px; /* Same padding to align with input fields */
  background-color: #ffffff;
  cursor: pointer;
}

/* Error Text */
.error-text {
  font-size: 12px;
  color: #dc3545;
  margin-top: 5px;
}

/* Submit Button */
.form-button {
  background-color: #555;
  color: #ffffff;
  padding: 12px 20px;
  margin-bottom: 7px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.form-button:hover {
  background-color: #222;
}

/* Loading Indicator */
.loading-indicator {
  height: 4px;
  background-color: #007bff;
  width: 100%;
  animation: loading 1.5s linear infinite;
}

.profile-icon-container {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.profile-icon {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 15px solid white;
  background-color: #f9f9f9;
  position: absolute;
  top: -95px; /* Half of the icon height to push it outside */
  left: 50%;
  transform: translateX(-50%); /* To center the icon horizontally */
}

@keyframes loading {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .registration-container {
    padding: 15px;
  }

  .form-title {
    font-size: 20px;
  }

  .form-button {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
