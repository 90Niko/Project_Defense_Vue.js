<script>
export default {
  name: 'Contacts',
  data() {
    return {
      contacts: [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210' },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567' },
      ],
    };
  },
};
</script>

<template>
  <div class="contacts">
    <h1>Contacts</h1>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <h3>{{ contact.name }}</h3>
        <p>Email: {{ contact.email }}</p>
        <p>Phone: {{ contact.phone }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.contacts {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.contacts h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contacts ul {
  list-style: none;
  padding: 0;
}

.contacts li {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fefefe;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.contacts li:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.contacts li h3 {
  margin: 0 0 0.5rem 0;
  color: #34495e;
  font-size: 1.2rem;
  text-decoration: none;
}

.contacts li p {
  margin: 0.3rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>
