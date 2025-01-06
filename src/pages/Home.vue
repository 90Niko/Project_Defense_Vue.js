<script>
export default {
  data() {
    return {
      images: [
        { src: '/src/images/modell.png', alt: 'model' },
        { src: '/src/images/discount.png', alt: 'Discount' },
        { src: '/src/images/model.png', alt: 'Model' },
      ],
      currentIndex: 0,
      intervalId: null, // Track the interval ID
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex].src;
    },
    currentAlt() {
      return this.images[this.currentIndex].alt;
    },
  },
  mounted() {
    this.startImageRotation();
  },
  beforeUnmount() {
    // Clear interval on component unmount
    clearInterval(this.intervalId);
  },
  methods: {
    startImageRotation() {
      // Clear existing interval if it exists
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 1500);
    },
    goToImage(index) {
      this.currentIndex = index;
      this.startImageRotation(); // Restart rotation when manually navigating
    },
  },
};
</script>

<template>
  <div class="home">
    <div class="containerOne">
      <h1>🎉 Limited Time Offer!</h1>
      <p>Get <span class="highlight">30% OFF</span> on all items!</p>
      <p>Don't miss out – shop now and save big!</p>
    </div>
    <div class="containerTwo">
      <img :src="currentImage" :alt="currentAlt">
      <div class="pagination">
        <span
          v-for="(image, index) in images"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="goToImage(index)"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* General Styling */
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Full viewport height */
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: 'Arial', sans-serif; /* Clean, professional font *//* Soft gradient background */
}

/* Heading and Paragraph Styling */
.home h1 {
  font-size: 0.8rem;
  color: #2c3e50; /* Rich dark blue-gray */
  margin-bottom: 10px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Subtle text shadow */
}

.home p {
  font-size: 1.2rem;
  color: #555; /* Medium gray */
  margin-bottom: 10px;
  line-height: 1.5;
}

.home .highlight {
  font-weight: bold;
  color: #e63946; /* Eye-catching red */
  font-size: 1.4rem;
  background: rgba(230, 57, 70, 0.1); /* Light red background */
  padding: 4px 8px;
  border-radius: 4px;
}

/* Text Container Styling */
.containerOne {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px; /* Smooth rounded corners */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  margin-bottom: 20px;
  width: 90%;
  max-width: 600px; /* Keep the width responsive */
}

/* Image Container Styling */
.containerTwo {
  position: relative;
  width: 90%; /* Responsive width */
  max-width: 600px; /* Limit the maximum size */
  height: 400px;
  overflow: hidden; /* Hide overflow for clean transitions */
  border-radius: 12px; /* Smooth rounded corners */
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow for depth */
  background: #f0f0f0; /* Light gray background as fallback */
}

/* Images within the Container */
.containerTwo img {
  width: 100%; /* Fill the container */
  height: 100%; /* Maintain aspect ratio */
  object-fit: cover; /* Ensure images are cropped correctly */
  border-radius: 12px; /* Match container corners */
  opacity: 0; /* Start hidden */
  position: absolute; /* Stack images for transition */
  top: 0;
  left: 0;
  transition: opacity 1s ease-in-out; /* Smooth fade effect */
}

.containerTwo img:nth-child(1) {
  z-index: 1;
  opacity: 1;
}

/* Image Transition Animation */
@keyframes fadeEffect {
  0%, 100% { opacity: 0; } /* Fully hidden at start and end */
  50% { opacity: 1; } /* Fully visible in the middle */
}

.containerTwo img {
  animation: fadeEffect 4.5s linear infinite; /* Smoother timing for transitions */
}

/* Hover Interaction */
.containerTwo:hover img {
  filter: brightness(65%); /* Slight darkening effect on hover */
  transition: filter 0.5s ease-in-out;
}
.pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.pagination span {
  width: 12px;
  height: 12px;
  margin: 0 5px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination span.active {
  background: #e63946; /* Active dot color */
}
.pagination span:hover {
  background: #844242; /* Hover effect */
}

/* Responsive Design */
@media (max-width: 768px) {
  .home h1 {
    font-size: 2rem; /* Scale down heading size */
  }

  .home p {
    font-size: 1rem; /* Scale down text size */
  }

  .home .highlight {
    font-size: 1.2rem; /* Adjust highlight size */
  }

  .containerTwo {
    height: 300px; /* Reduce height for smaller screens */
  }
}
</style>
