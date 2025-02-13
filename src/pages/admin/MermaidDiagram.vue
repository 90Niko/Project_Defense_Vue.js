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
    // Define your target value.
    const target = 100;

    // --- User Diagram ---
    const userDiagramDefinition = computed(() => {
      const achieved = props.userCount;
      const remaining = achieved >= target ? 0 : target - achieved;
      // Set pie1 to #ffc107 and pie2 to dark grey (#343a40).
      return `
%%{init: {"themeVariables": {"pie1": "#ffc107", "pie2": "#2c3e50"}}}%%
pie
  title Users
  "Achieved": ${achieved}
  "Remaining": ${remaining}
      `;
    });
    const userDiagramHtml = computed(() => {
      return `<div class="mermaid user">
${userDiagramDefinition.value}
</div>`;
    });

    // --- Product Diagram ---
    const productDiagramDefinition = computed(() => {
      const achieved = props.productCount;
      const remaining = achieved >= target ? 0 : target - achieved;
      // Set pie1 to #007bff and pie2 to dark grey (#343a40).
      return `
%%{init: {"themeVariables": {"pie1": "#007bff", "pie2": "#2c3e50"}}}%%
pie
  title Products
  "Achieved": ${achieved}
  "Remaining": ${remaining}
      `;
    });
    const productDiagramHtml = computed(() => {
      return `<div class="mermaid product">
${productDiagramDefinition.value}
</div>`;
    });

    // --- Category Diagram ---
    const categoryDiagramDefinition = computed(() => {
      const achieved = props.categoryCount;
      const remaining = achieved >= target ? 0 : target - achieved;
      // Set pie1 to #28a745 and pie2 to dark grey (#343a40).
      return `
%%{init: {"themeVariables": {"pie1": "#28a745", "pie2": "#2c3e50"}}}%%
pie
  title Categories
  "Achieved": ${achieved}
  "Remaining": ${remaining}
      `;
    });
    const categoryDiagramHtml = computed(() => {
      return `<div class="mermaid category">
${categoryDiagramDefinition.value}
</div>`;
    });

    // Function to render or re-render the diagrams.
    const renderDiagrams = async () => {
      await nextTick();
      const elements = document.querySelectorAll('.mermaid');
      mermaid.init(undefined, elements);
    };

    onMounted(() => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
      });
      renderDiagrams();
    });

    // Watch for changes in the computed diagram definitions.
    watch(
      [userDiagramDefinition, productDiagramDefinition, categoryDiagramDefinition],
      () => {
        renderDiagrams();
      },
    );

    return {
      userDiagramHtml,
      productDiagramHtml,
      categoryDiagramHtml,
    };
  },
};
</script>

<template>
  <div class="triple-analytic-diagram">
    <!-- Render the three diagrams -->
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

.mermaid {
  width: 300px;
  text-align: center;
}

/* Remove any stroke from SVG paths */
.mermaid svg path {
  stroke: none !important;
}

/* Also remove any border from the SVG container */
.mermaid svg {
  border: none !important;
  stroke: none !important;
}
</style>
