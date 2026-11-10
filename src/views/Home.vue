<template>
  <div class="home-container">
    <!-- ЗАХВАТ ВНИМАНИЯ (Грузится сразу) -->
    <Main @open-contact="$emit('open-contact')" />
    
    <!-- КАСКАДНАЯ ЗАГРУЗКА ДЛЯ ОПТИМИЗАЦИИ -->
    <div ref="expertiseRef" class="opt-contain section-wrapper">
      <Expertise v-if="isVisible.expertise" @open-specific="(stack, service) => $emit('open-specific', stack, service)" />
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

// Асинхронный импорт с базовым кэшированием браузера
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));

defineEmits(['open-contact', 'open-specific']);

const isVisible = reactive({
  expertise: false,
  pricing: false,
  projects: false,
  faq: false,
  roadmap: false
});

const expertiseRef = ref(null);
const pricingRef = ref(null);
const projectsRef = ref(null);
const faqRef = ref(null);
const roadmapRef = ref(null);

let observer = null;

onMounted(async () => {
  await nextTick();
  
  // ОПТИМИЗАЦИЯ: Уменьшен margin. 800px триггерил загрузку всего сразу.
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
        // Отключаем наблюдение после первой отрисовки для экономии CPU
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = [
    { el: expertiseRef.value, name: 'expertise' },
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
  /* Изолируем страницу для браузера */
  contain: content;
}

.section-wrapper {
  min-height: 20vh;
  /* Указываем браузеру, что контент не влияет на внешний layout */
  contain: layout style;
}
</style>