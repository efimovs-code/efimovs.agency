<template>
  <div class="home-container">
    <!-- ЗАХВАТ ВНИМАНИЯ (Грузится сразу) -->
    <Main @open-contact="$emit('open-contact')" />
    
    <!-- КАСКАДНАЯ ЗАГРУЗКА ДЛЯ ОПТИМИЗАЦИИ -->
    <div ref="expertiseRef" class="opt-contain section-wrapper">
      <Expertise v-if="isVisible.expertise" @open-specific="(stack, service) => $emit('open-specific', stack, service)" />
    </div>

    <!-- СРАВНЕНИЕ С КОНКУРЕНТАМИ ПЕРЕД ТАРИФАМИ -->
    <div ref="comparisonRef" class="opt-contain section-wrapper">
      <Comparison v-if="isVisible.comparison" @open-contact="$emit('open-contact')" />
    </div>

    <!-- ИНТЕРАКТИВНОЕ СРАВНЕНИЕ ИНТЕРФЕЙСА ДО / ПОСЛЕ -->
    <div ref="showcaseRef" class="opt-contain section-wrapper">
      <BeforeAfterShowcase v-if="isVisible.showcase" @open-contact="$emit('open-contact')" />
    </div>

    <div ref="pricingRef" class="opt-contain section-wrapper">
      <Pricing 
        v-if="isVisible.pricing"
        @open-contact="$emit('open-contact')" 
        @open-specific="(stack, service) => $emit('open-specific', stack, service)" 
      />
    </div>

    <div ref="projectsRef" class="opt-contain section-wrapper">
      <Projects v-if="isVisible.projects" @open-contact="$emit('open-contact')" />
    </div>
      
    <div ref="faqRef" class="opt-contain section-wrapper">
      <FAQ v-if="isVisible.faq" @open-contact="$emit('open-contact')" />
    </div>

    <div ref="roadmapRef" class="opt-contain section-wrapper">
      <Roadmap v-if="isVisible.roadmap" @open-contact="$emit('open-contact')" />
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Main from '../components/Main.vue';

const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Comparison = defineAsyncComponent(() => import('../components/Comparison.vue'));
const BeforeAfterShowcase = defineAsyncComponent(() => import('../components/BeforeAfterShowcase.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));

defineEmits(['open-contact', 'open-specific']);

const isVisible = reactive({
  expertise: false,
  comparison: false,
  showcase: false,
  pricing: false,
  projects: false,
  faq: false,
  roadmap: false
});

const expertiseRef = ref(null);
const comparisonRef = ref(null);
const showcaseRef = ref(null);
const pricingRef = ref(null);
const projectsRef = ref(null);
const faqRef = ref(null);
const roadmapRef = ref(null);

let observer = null;

onMounted(async () => {
  await nextTick();
  
  const observerOptions = {
    root: null,
    rootMargin: '150px 0px', 
    threshold: 0
  };

  observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionName = entry.target.dataset.section;
        isVisible[sectionName] = true;
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = [
    { el: expertiseRef.value, name: 'expertise' },
    { el: comparisonRef.value, name: 'comparison' },
    { el: showcaseRef.value, name: 'showcase' },
    { el: pricingRef.value, name: 'pricing' },
    { el: projectsRef.value, name: 'projects' },
    { el: faqRef.value, name: 'faq' },
    { el: roadmapRef.value, name: 'roadmap' }
  ];

  sections.forEach(({ el, name }) => {
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
  contain: content;
}

.section-wrapper {
  min-height: 20vh;
  contain: layout style;
}
</style>