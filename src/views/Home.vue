<template>
  <div class="home-container">
    <!-- HERO SECTION (LOADS IMMEDIATELY) -->
    <Main @open-contact="$emit('open-contact')" />

    <!-- BELOW-THE-FOLD SECTIONS (MOUNTED AFTER FIRST PAINT TO PREVENT SCROLL HEIGHT JUMPS) -->
    <template v-if="isBelowFoldReady">
      <Expertise
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />

      <Comparison
        @open-contact="$emit('open-contact')"
      />

      <BeforeAfterShowcase
        @open-contact="$emit('open-contact')"
      />

      <Pricing
        @open-contact="$emit('open-contact')"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />

      <Projects
        @open-contact="$emit('open-contact')"
      />

      <FAQ
        @open-contact="$emit('open-contact')"
      />

      <Roadmap
        @open-contact="$emit('open-contact')"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue';
import Main from '../components/Main.vue';

/* ASYNC BELOW-THE-FOLD COMPONENTS */
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Comparison = defineAsyncComponent(() => import('../components/Comparison.vue'));
const BeforeAfterShowcase = defineAsyncComponent(() => import('../components/BeforeAfterShowcase.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));

defineEmits(['open-contact', 'open-specific']);

const isBelowFoldReady = ref(false);
let mountTimer = null;

/* MOUNT REMAINING SECTIONS RIGHT AFTER INITIAL HERO RENDER */
onMounted(() => {
  mountTimer = setTimeout(() => {
    isBelowFoldReady.value = true;
  }, 120);
});

onBeforeUnmount(() => {
  if (mountTimer) {
    clearTimeout(mountTimer);
    mountTimer = null;
  }
});
</script>

<style scoped>
.home-container {
  width: 100%;
  position: relative;
}
</style>