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
    const target = 100;

    const userDiagramDefinition = computed(() => {
      const achieved = props.userCount;
      const remaining = achieved >= target ? 0 : target - achieved;
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

    const productDiagramDefinition = computed(() => {
      const achieved = props.productCount;
      const remaining = achieved >= target ? 0 : target - achieved;
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
    const categoryDiagramDefinition = computed(() => {
      const achieved = props.categoryCount;
      const remaining = achieved >= target ? 0 : target - achieved;
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

.mermaid svg path {
  stroke: none !important;
}

.mermaid svg {
  border: none !important;
  stroke: none !important;
}
</style>
