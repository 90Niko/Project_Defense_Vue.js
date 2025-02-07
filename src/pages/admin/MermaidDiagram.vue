<script>
import mermaid from 'mermaid';
import { computed, nextTick, onMounted, watch } from 'vue';

export default {
  name: 'TripleAnalyticDiagram',
  props: {
    userCount: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    categoryCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    // For demonstration, we use a target value of 100.
    // You can change this value or pass it as a prop.
    const target = 100;

    // --- User Diagram ---
    const userDiagramDefinition = computed(() => {
      const achieved = props.userCount;
      // If achieved exceeds the target, remaining is 0.
      const remaining = achieved >= target ? 0 : target - achieved;
      return `
  pie
    title Users
    "Achieved" : ${achieved}
    "Remaining" : ${remaining}
        `;
    });
    const userDiagramHtml = computed(() => {
      return `<div class="mermaid">
  ${userDiagramDefinition.value}
  </div>`;
    });

    // --- Product Diagram ---
    const productDiagramDefinition = computed(() => {
      const achieved = props.productCount;
      const remaining = achieved >= target ? 0 : target - achieved;
      return `
  pie
    title Products
    "Achieved" : ${achieved}
    "Remaining" : ${remaining}
        `;
    });
    const productDiagramHtml = computed(() => {
      return `<div class="mermaid">
  ${productDiagramDefinition.value}
  </div>`;
    });

    // --- Category Diagram ---
    const categoryDiagramDefinition = computed(() => {
      const achieved = props.categoryCount;
      const remaining = achieved >= target ? 0 : target - achieved;
      return `
  pie
    title Categories
    "Achieved" : ${achieved}
    "Remaining" : ${remaining}
        `;
    });
    const categoryDiagramHtml = computed(() => {
      return `<div class="mermaid">
  ${categoryDiagramDefinition.value}
  </div>`;
    });

    // Function to render (or re-render) the diagrams.
    const renderDiagrams = async () => {
      // Wait for the DOM updates to complete.
      await nextTick();
      // Select all elements with the "mermaid" class.
      const elements = document.querySelectorAll('.mermaid');
      // Process these elements with Mermaid.
      mermaid.init(undefined, elements);
    };

    onMounted(() => {
      // Initialize Mermaid (adjust options as needed).
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
      });
      renderDiagrams();
    });

    // Watch for changes in any diagram definition and re-render.
    watch(
      [userDiagramDefinition, productDiagramDefinition, categoryDiagramDefinition],
      () => {
        renderDiagrams();
      },
    );

    return {
      productDiagramHtml,
      userDiagramHtml,
      categoryDiagramHtml,
    };
  },
};
</script>

<template>
  <div class="triple-analytic-diagram">
    <!-- Each diagram is rendered into its own container -->
    <div v-html="userDiagramHtml" />
    <div v-html="productDiagramHtml" />
    <div v-html="categoryDiagramHtml" />
  </div>
</template>

  <style scoped>
  .triple-analytic-diagram {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }

  .triple-analytic-diagram .mermaid {
    width: 300px;
    /* Adjust height or styling as needed */
    text-align: center;
  }
  </style>
