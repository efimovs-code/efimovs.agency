<template>
  <div>
    <!--ЗАХВАТ ВНИМАНИЯ (Грузится сразу) -->
    <Main @open-contact="$emit('open-contact')" />
    
    <!-- 🌟 ВОЗВРАЩАЕМ ТВОЮ БЛОКИРОВКУ -->
    <!-- Во время прелоадера блоков нет, высота сайта 100vh, скроллить некуда! -->
    <template v-if="deferHeavyComponents">
      
      <!-- 🌟 МОЯ КАСКАДНАЯ ЗАГРУЗКА (Остается для оптимизации ПК) -->
      
      <div ref="expertiseRef" class="opt-contain section-wrapper">
        <Expertise v-if="isVisible.expertise" @open-specific="(stack, service) => $emit('open-specific', stack, service)" />
      </div>

      <div ref="projectsRef" class="opt-contain section-wrapper">
        <Projects v-if="isVisible.projects" @open-contact="$emit('open-contact')" />
      </div>
        
      <div ref="pricingRef" class="opt-contain section-wrapper">
        <Pricing 
          v-if="isVisible.pricing"
          @open-contact="$emit('open-contact')" 
          @open-specific="(stack, service) => $emit('open-specific', stack, service)" 
        />
      </div>
        
      <div ref="roadmapRef" class="opt-contain section-wrapper">
        <Roadmap v-if="isVisible.roadmap" @open-contact="$emit('open-contact')" />
      </div>

      <div ref="faqRef" class="opt-contain section-wrapper">
        <FAQ v-if="isVisible.faq" @open-contact="$emit('open-contact')" />
      </div>

    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent, reactive, ref, watch, nextTick } from 'vue';
import Main from '../components/Main.vue';

// Асинхронный импорт компонентов в новом порядке
const Expertise = defineAsyncComponent(() => import('../components/Expertise.vue'));
const Projects = defineAsyncComponent(() => import('../components/Projects.vue'));
const Pricing = defineAsyncComponent(() => import('../components/Pricing.vue'));
const Roadmap = defineAsyncComponent(() => import('../components/Roadmap.vue'));
const FAQ = defineAsyncComponent(() => import('../components/FAQ.vue'));

const props = defineProps({
  deferHeavyComponents: Boolean
});

defineEmits(['open-contact', 'open-specific']);

const isVisible = reactive({
  expertise: false,
  projects: false,
  pricing: false,
  roadmap: false,
  faq: false
});

const expertiseRef = ref(null);
const projectsRef = ref(null);
const pricingRef = ref(null);
const roadmapRef = ref(null);
const faqRef = ref(null);

// 🌟 Запускаем обсервер ТОЛЬКО когда прелоадер исчез и блоки отрисовались
watch(() => props.deferHeavyComponents, async (newVal) => {
  if (newVal) {
    await nextTick(); // Ждем, пока Vue вставит пустые обертки в DOM
    
    const observerOptions = {
      root: null,
      rootMargin: '800px', 
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
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
      { el: projectsRef.value, name: 'projects' },
      { el: pricingRef.value, name: 'pricing' },
      { el: roadmapRef.value, name: 'roadmap' },
      { el: faqRef.value, name: 'faq' }
    ];

    sections.forEach(({ el, name }) => {
      if (el) {
        el.dataset.section = name;
        observer.observe(el);
      }
    });
  }
}, { immediate: true });
</script>

<style scoped>
.section-wrapper {
  min-height: 20vh;
}
</style>