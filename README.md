Vue.js Single Page Application 

Overview
This project is a Single Page Application (SPA) built with Vue.js. The application is an e-commerce platform that provides a seamless user experience with both a public area (accessible without authentication) 
and a private area (accessible only for logged-in users). It utilizes Fake Store API for fetching product data, Pinia for state management, and Firebase Authentication for user management.
The project includes components and logic implemented using both Options API and Composition API, showcasing flexibility and understanding of both approaches in Vue.js development.
-------------------------------------
1. API Integration
The application fetches product data from the Fake Store API using Axios.
Example of a service layer for fetching products
-------------------------------------
1. User Authentication
Login (handleLogin):Sends a POST request to the Fake Store API with the username and password.On successful login:
The token is securely stored as a cookie (with the Secure option for added safety).The Pinia Store (useAuthStore) is updated to save the logged-in status and user data.
Redirects to the "home" page using Vue Router.On error:Displays an error message if one is provided by the API response.Shows a generic error message for unexpected issues.
Pinia Store (useAuthStore): Manages login status and user data.Provides the following methods: setLoggedIn: Updates the login status and stores user data.logout:Clears the Pinia state.
Removes the token from the cookies.
------------------------------------
2. Routing
Vue Router is used for navigation between pages.
Dynamic routes are implemented for product details, and guards are used to protect private routes.
------------------------------------
3. State Management
Pinia is used to manage application state for users and favorite.
-----------------------------------
4. Error Handling
Vuelidate is used to validate form inputs for login and registration.
Error messages are displayed when invalid data is entered.
------------------------------------
5. Page Not Found
A custom 404 page is displayed when users navigate to an invalid route.
-----------------------------------
6. Deployment
The application is deployed on https://project-defense-vue-js.onrender.com
