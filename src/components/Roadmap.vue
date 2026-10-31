<template>
  <section class="roadmap-section">
    <div class="container">
      
      <!-- 🌟 Заголовок секции (теперь в одну строку) -->
      <div class="section-header">
        <div v-if="isDesktop" class="ambient-glow" v-once></div>

        <span class="kicker">{{ t('roadmap_kicker') }}</span>
        <h2 class="gradient-title">
          {{ t('roadmap_title_1') }} <span style="white-space: nowrap;">{{ t('roadmap_title_2') }}</span>
        </h2>
      </div>

      <!-- Сама линия и шаги -->
      <div class="timeline-wrapper">
        
        <!-- Линия трека -->
        <div class="timeline-track"></div>
        
        <!-- Ярко-белая лазерная линия прогресса -->
        <div class="timeline-progress">
          <div class="progress-glow"></div>
        </div>

        <!-- Сетка шагов -->
        <div class="steps-grid">
          
          <!-- Шаг 1 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>01</span>
              <h3 class="step-title">{{ t('step1_title') }}</h3>
              <p class="step-desc">{{ t('step1_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 2 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>02</span>
              <h3 class="step-title">{{ t('step2_title') }}</h3>
              <p class="step-desc">{{ t('step2_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 3 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>03</span>
              <h3 class="step-title">{{ t('step3_title') }}</h3>
              <p class="step-desc">{{ t('step3_desc') }}</p>
            </div>
          </div>

          <!-- Шаг 4 -->
          <div class="step-item">
            <div class="step-node">
              <div class="node-core"></div>
            </div>
            <div class="step-content">
              <span class="step-number" v-once>04</span>
              <h3 class="step-title">{{ t('step4_title') }}</h3>
              <p class="step-desc">{{ t('step4_desc') }}</p>
            </div>
          </div>

        </div>
      </div>
      
      <!-- КНОПКА CALL-TO-ACTION -->
      <div class="roadmap-cta">
        <button class="btn-pill btn-platinum" @click="$emit('open-contact')">
          <span class="btn-text">{{ t('btn_discuss') }}</span>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { t } from '../composables/useLanguage';

defineEmits(['open-contact']);

const isDesktop = ref(true);
let resizeTimer = null;

const checkDevice = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isDesktop.value = window.innerWidth >= 1024;
  }, 100);
};

onMounted(() => {
  checkDevice();
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.roadmap-section {
  position: relative;
  width: 100%;
  min-height: 100vh; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 0px;
  background: transparent;
  color: #ffffff;
  z-index: 10;
  contain: paint style;
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility;
}

.section-header {
  position: relative;
  z-index: 1;
}

.ambient-glow { 
  position: absolute; 
  top: 70%; 
  left: 50%; 
  transform: translate(-50%, -50%) translateZ(0); 
  width: 650px; 
  height: 250px; 
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.03) 0%, transparent 100%); 
  z-index: -1; 
  pointer-events: none;
}

.container {
  max-width: 1700px; 
  width: 100%;
  margin: 0px auto;
  padding: 0px 50px;
}

/* =========================================
   ТАЙМЛАЙН И ЛАЗЕРНАЯ ЛИНИЯ
   ========================================= */
.timeline-wrapper {
  position: relative;
  width: 100%;
  margin-top: clamp(60px, 8vw, 88px);
}

.timeline-track {
  position: absolute;
  top: 12px;
  left: 0px;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.timeline-progress {
  position: absolute;
  top: 12px;
  left: 0px;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.8) 50%, #ffffff 100%);
  z-index: 2;
  opacity: 1;
}

.progress-glow {
  position: absolute;
  right: 0px;
  top: -3px; 
  width: 7px;
  height: 7px;
  background: #ffffff;
  border-radius: 50%;
  transform: translateX(50%) translateZ(0);
}

/* =========================================
   ШАГИ И УЗЛЫ
   ========================================= */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
  position: relative;
  z-index: 3;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step-node {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px; 
}

.node-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff; 
  border: 1px solid #ffffff;
  transform: scale(1) translateZ(0);
  opacity: 1;
  z-index: 2;
}

/* =========================================
   ТИПОГРАФИКА ШАГОВ
   ========================================= */
.step-content {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  width: 100%;
}

.step-number {
  font-size: 18px; 
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  font-family: monospace;
}

.step-title {
  font-size: 26px; 
  font-weight: 700;
  margin: 0px 0px 16px 0px;
  color: #ffffff;
  letter-spacing: -0.5px;
  white-space: nowrap; 
}

.step-desc {
  font-size: 16px; 
  line-height: 26px;
  color: #e4e4e7;
  margin: 0px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

/* =========================================
   СЕКЦИЯ КНОПКИ (CTA)
   ========================================= */
.roadmap-cta {
  display: flex;
  justify-content: center;
  margin-top: 80px;
  position: relative;
  z-index: 5;
}

.btn-pill {
  padding: 22px 42px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              background 0.3s ease, 
              border-color 0.3s ease;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  transform: translateZ(0) scale(1);
  backface-visibility: hidden; 
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;
  
  outline: 1px solid transparent;
  background-clip: padding-box;
  -webkit-background-clip: padding-box;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-platinum {
  background: #e5e4e2;
  color: #000;
}

.btn-platinum:hover {
  background: #ffffff;
  transform: translateZ(0) scale(1.03);
}

/* =========================================
   АДАПТИВНОСТЬ
   ========================================= */
@media (max-width: 1199px) {
  .roadmap-section {
    min-height: auto;
    padding: 120px 0px;
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 80px;
  }
  
  .timeline-track, .timeline-progress {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .section-header .gradient-title {
    font-size: clamp(44px, 6vw, 64px) !important; 
    line-height: 1.1 !important;
  }
}

@media (max-width: 767px) {
  .roadmap-section {
    padding: 80px 0px 100px 0px;
  }
  
  .container {
    padding: 0px 24px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 0px;
  }

  .step-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
    padding-bottom: 50px;
    position: relative;
  }

  .step-item::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: 0px;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  .step-item:last-child::before {
    display: none;
  }
  
  .step-item:last-child {
    padding-bottom: 0px;
  }

  .step-node {
    margin-bottom: 0px;
    flex-shrink: 0;
  }

  .step-content {
    padding-right: 0px;
    padding-top: 0px; 
  }

  .step-title {
    font-size: 26px;
    margin: 0px 0px 8px 0px; 
    white-space: normal;
  }

  .step-desc {
    font-size: 15px; 
    line-height: 24px;
  }
  
  .roadmap-cta {
    margin-top: 50px;
  }
  
  .btn-pill { 
    width: 100%;
    padding: 20px 0;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>