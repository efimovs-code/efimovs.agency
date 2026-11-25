<template>
  <div class="home-container">
    <!-- HERO SECTION (LOADS IMMEDIATELY) -->
    <Main @open-contact="$emit('open-contact')" />

    <!-- LAZY-LOADED PAGE SECTIONS -->
    <div
      :ref="setSectionRef('expertise')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.expertise }"
    >
      <Expertise
        v-if="isVisible.expertise"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />
    </div>

    <div
      :ref="setSectionRef('comparison')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.comparison }"
    >
      <Comparison
        v-if="isVisible.comparison"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div
      :ref="setSectionRef('showcase')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.showcase }"
    >
      <BeforeAfterShowcase
        v-if="isVisible.showcase"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div
      :ref="setSectionRef('pricing')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.pricing }"
    >
      <Pricing
        v-if="isVisible.pricing"
        @open-contact="$emit('open-contact')"
        @open-specific="(stack, service) => $emit('open-specific', stack, service)"
      />
    </div>

    <div
      :ref="setSectionRef('projects')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.projects }"
    >
      <Projects
        v-if="isVisible.projects"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div
      :ref="setSectionRef('faq')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.faq }"
    >
      <FAQ
        v-if="isVisible.faq"
        @open-contact="$emit('open-contact')"
      />
    </div>

    <div
      :ref="setSectionRef('roadmap')"
      class="section-wrapper"
      :class="{ 'is-loaded': isVisible.roadmap }"
    >
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

// ASYNC BELOW-THE-FOLD COMPONENTS
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Comparison = defineAsyncComponent(() => import('../components/Comparison.vue'));
const BeforeAfterShowcase = defineAsyncComponent(() => import('../components/BeforeAfterShowcase.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));

// EMITS
defineEmits(['open-contact', 'open-specific']);

// VISIBILITY STATE & SECTION REFS
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

const setSectionRef = (name) => (el) => {
  sectionRefs[name] = el;
};

// INTERSECTION OBSERVER SETUP
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    Object.keys(isVisible).forEach((key) => {
      isVisible[key] = true;
    });
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionName = entry.target.dataset.section;
        if (sectionName) {
          isVisible[sectionName] = true;
        }
        observer.unobserve(entry.target);

        if (Object.values(isVisible).every(Boolean)) {
          observer.disconnect();
          observer = null;
        }
      });
    },
    {
      root: null,
      rootMargin: '500px 0px',
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
.home-container {
  width: 100%;
  position: relative;
}

.section-wrapper {
  min-height: 180px;
}

.section-wrapper.is-loaded {
  min-height: 0;
}
</style>