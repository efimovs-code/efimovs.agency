<template>
  <div class="home-container">

    <!-- --- HERO SECTION (LOADS IMMEDIATELY) -->
    <Main @open-contact="$emit('open-contact')" />

    <!-- --- LAZY-LOADED PAGE SECTIONS -->
    <div :ref="(el) => (sectionRefs.expertise = el)" class="opt-contain section-wrapper">
      <Expertise
        v-if="isVisible.expertise"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />
    </div>

    <div :ref="(el) => (sectionRefs.comparison = el)" class="opt-contain section-wrapper">
      <Comparison
        v-if="isVisible.comparison"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div :ref="(el) => (sectionRefs.showcase = el)" class="opt-contain section-wrapper">
      <BeforeAfterShowcase
        v-if="isVisible.showcase"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div :ref="(el) => (sectionRefs.pricing = el)" class="opt-contain section-wrapper">
      <Pricing
        v-if="isVisible.pricing"
        @open-contact="$emit('open-contact')"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />
    </div>

    <div :ref="(el) => (sectionRefs.projects = el)" class="opt-contain section-wrapper">
      <Projects
        v-if="isVisible.projects"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div :ref="(el) => (sectionRefs.faq = el)" class="opt-contain section-wrapper">
      <FAQ
        v-if="isVisible.faq"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div :ref="(el) => (sectionRefs.roadmap = el)" class="opt-contain section-wrapper">
      <Roadmap
        v-if="isVisible.roadmap"
        @open-contact="$emit('open-contact')"
      />
    </div>

  </div>
</template>

<script setup>
import { defineAsyncComponent, reactive, onMounted, onBeforeUnmount } from 'vue';
import Main from '../components/Main.vue';

// --- ASYNC BELOW-THE-FOLD COMPONENTS
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Comparison = defineAsyncComponent(() => import('../components/Comparison.vue'));
const BeforeAfterShowcase = defineAsyncComponent(() => import('../components/BeforeAfterShowcase.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));

// --- EMITS
defineEmits(['open-contact', 'open-specific']);

// --- VISIBILITY STATE & SECTION REFS
const isVisible = reactive({
  expertise: false,
  comparison: false,
  showcase: false,
  pricing: false,
  projects: false,
  faq: false,
  roadmap: false,
});

const sectionRefs = {};
let observer = null;

// --- INTERSECTION OBSERVER SETUP
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionName = entry.target.dataset.section;
        isVisible[sectionName] = true;
        observer.unobserve(entry.target);

        // --- STOP OBSERVER ONCE ALL SECTIONS ARE LOADED
        if (Object.values(isVisible).every(Boolean)) {
          observer.disconnect();
          observer = null;
        }
      });
    },
    {
      root: null,
      rootMargin: '150px 0px',
      threshold: 0,
    }
  );

  Object.entries(sectionRefs).forEach(([name, el]) => {
    if (el) {
      el.dataset.section = name;
      observer.observe(el);
    }
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped>
/* --- PAGE LAYOUT */
.home-container {
  contain: content;
}

.section-wrapper {
  min-height: 20vh;
  contain: layout style;
}
</style>