<template>
  <div class="home-container">
    <!-- 1. HOOK & VALUE PROPOSITION (LOADS IMMEDIATELY) -->
    <Main @open-contact="$emit('open-contact')" />

    <!-- BELOW-THE-FOLD CONVERSION FUNNEL -->
    <template v-if="isBelowFoldReady">
      <!-- 2. INSTANT VISUAL PROOF & DESIRE -->
      <Projects
        @open-contact="$emit('open-contact')"
      />

      <!-- 3. TANGIBLE TRANSFORMATION & CONTRAST -->
      <BeforeAfterShowcase
        @open-contact="$emit('open-contact')"
      />

      <!-- 4. CATEGORY POSITIONING (CLEAN CODE VS BUILDERS) -->
      <Comparison
        @open-contact="$emit('open-contact')"
      />

      <!-- 5. CAPABILITIES & TECHNICAL SCOPE -->
      <Expertise
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />

      <!-- 6. EXECUTION CLARITY & RISK REVERSAL -->
      <Roadmap
        @open-contact="$emit('open-contact')"
      />

      <!-- 7. PACKAGES & PRICING AT PEAK PERCEIVED VALUE -->
      <Pricing
        @open-contact="$emit('open-contact')"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />

      <!-- 8. FINAL OBJECTION HANDLING -->
      <FAQ
        @open-contact="$emit('open-contact')"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue';
import Main from '../components/Main.vue';

/* ASYNC BELOW-THE-FOLD FUNNEL COMPONENTS */
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const BeforeAfterShowcase = defineAsyncComponent(() => import('../components/BeforeAfterShowcase.vue'));
const Comparison = defineAsyncComponent(() => import('../components/Comparison.vue'));
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));

defineEmits(['open-contact', 'open-specific']);

const isBelowFoldReady = ref(false);
let mountTimer = null;

/* MOUNT REMAINING SECTIONS AFTER INITIAL HERO TRANSITION SETTLES */
onMounted(() => {
  mountTimer = setTimeout(() => {
    isBelowFoldReady.value = true;
  }, 300);
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