<template>
  <section ref="heroSection" class="hero" :class="{ 'is-paused': !isVisible }">
    <div class="container">
      <div class="hero-left">

        <h1 class="staggered-title">
          <span class="line-wrap"
            ><span class="line" style="--entry-delay: 0.1s"
              >{{ t('hero_line1') }}</span
            ></span
          >
          <span class="line-wrap"
            ><span class="line fit-line" style="--entry-delay: 0.2s;"
              >{{ t('hero_line2') }}</span
            ></span
          >
          <span class="line-wrap"
            ><span class="line" style="--entry-delay: 0.3s"
              >{{ t('hero_line3') }}</span
            ></span
          >
          <span class="line-wrap"
            ><span class="line fit-line-bottom" style="--entry-delay: 0.4s"
              >{{ t('hero_line4') }}</span
            ></span
          >
        </h1>

        <div class="minimal-luxury-desc-wrapper hero-anim-desc">
          <div class="desc-text-content">
            <div class="desc-sub-block">
              <span class="desc-sub-part text-shimmer-bright">
                {{ t('hero_desc') }}
              </span>
            </div>
          </div>
        </div>

        <div class="actions hero-anim-btns">
          <!-- 🌟 ИСПРАВЛЕНО: Добавлены смарт-обработчики скролла (touchstart, touchmove, touchend) -->
          <button 
            class="btn-pill btn-platinum" 
            @click="$emit('open-contact')"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleSmartClick(() => $emit('open-contact'), $event)"
          >
          <span class="btn-text">{{ t('btn_scale') }}</span>
          </button>
          
          <!-- 🌟 ИСПРАВЛЕНО: Заменили router-link на тег <a> для полного контроля над тапами -->
          <a 
            class="btn-pill btn-dark"
            @click.prevent="navigateToPortfolio"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleSmartClick(navigateToPortfolio, $event)"
          >
            <span class="btn-text">{{ t('btn_cases') }}</span>
          </a>
        </div>
      </div>

      <div class="hero-right hero-anim-figure">
        <div class="css-3d-scene">
          <div class="css-3d-wrapper" :class="{ 'delay-3d': hasIntroDelay }">
            <div class="horizon-neon-glow"></div>

            <div class="obsidian-planet">
              <div class="blade-reflection"></div>
              <div class="ambient-bottom-light"></div>
              <div class="planet-glow-layer"></div>
            </div>

            <div class="ring-system">
              <div class="laser-ring r1"><div class="gold-node"></div></div>
              <div class="laser-ring r2"><div class="gold-node"></div></div>
              <div class="laser-ring r3"><div class="gold-node"></div></div>
              <div class="laser-ring r4"><div class="gold-node"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { t } from "../composables/useLanguage";

const emit = defineEmits(["open-contact"]);

const router = useRouter();
const heroSection = ref(null);
const isVisible = ref(true);
const hasIntroDelay = ref(true); 
let observer = null;

// Функция для навигации
const navigateToPortfolio = () => {
  router.push('/portfolio');
};

// ==========================================
// 🌟 SMART TAP ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
// ==========================================
let touchStartY = 0;
let touchStartX = 0;
let isDragging = false;

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  isDragging = false; // Сбрасываем статус при новом касании
};

const handleTouchMove = (e) => {
  const touchY = e.touches[0].clientY;
  const touchX = e.touches[0].clientX;
  // Если палец сдвинулся больше чем на 10px по любой оси — это скролл
  if (Math.abs(touchY - touchStartY) > 10 || Math.abs(touchX - touchStartX) > 10) {
    isDragging = true;
  }
};

const handleSmartClick = (actionFn, e) => {
  // Если палец не двигался (или двигался меньше 10px), выполняем действие
  if (!isDragging) {
    if (e && e.cancelable) e.preventDefault(); // Предотвращаем "фантомный" клик от браузера
    actionFn();
  }
  isDragging = false; // Очищаем статус
};
// ==========================================

onMounted(() => {
  if (sessionStorage.getItem('introSeen')) {
    hasIntroDelay.value = false;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible.value = entry.isIntersecting;
    },
    { 
      rootMargin: "0px 0px -100px 0px", 
      threshold: 0 
    }
  );

  if (heroSection.value) {
    observer.observe(heroSection.value);
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss" scoped>
$gold: #d4af37;
$platinum: #e5e4e2;
$ice-blue: #00e5ff;
$obsidian-base: #111111;
$obsidian-core: #030303;

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  padding-top: 130px;
  padding-bottom: 50px;
}

.hero.is-paused .css-3d-wrapper,
.hero.is-paused .horizon-neon-glow,
.hero.is-paused .obsidian-planet,
.hero.is-paused .planet-glow-layer,
.hero.is-paused .laser-ring {
  animation-play-state: paused !important;
}

.css-3d-scene {
  perspective: 1200px;
  width: 500px;
  height: 500px;
  position: relative;
  pointer-events: none;
  isolation: isolate;
  transform: translateZ(0);
  will-change: transform;
}

.css-3d-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  animation: cinematicFloat 20s ease-in-out infinite backwards;
  will-change: transform;
}

.horizon-neon-glow {
  position: absolute;
  top: -100px;
  left: -150px;
  width: 300px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.025) 50%,
    transparent 70%
  );
  transform: translateZ(-1px);
  border-radius: 50%;
  animation: glowBreathe 4s ease-in-out infinite alternate backwards;
  pointer-events: none;
  will-change: transform, opacity;
}

.obsidian-planet {
  position: absolute;
  top: -120px;
  left: -120px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 25%,
    #232323 0%,
    $obsidian-base 40%,
    $obsidian-core 80%,
    #000 100%
  );
  box-shadow:
    0 0 50px 5px rgba(255, 255, 255, 0.12),
    inset 0 0 30px 5px rgba(255, 255, 255, 0.08),
    inset -15px -15px 40px rgba(0, 0, 0, 0.9);
  transform: translateZ(0);
  animation: planetScaleOnly 4s ease-in-out infinite alternate backwards;
  transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.planet-glow-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow:
    0 0 60px 10px rgba(255, 255, 255, 0.08),
    inset 0 0 40px 8px rgba(255, 255, 255, 0.06);
  opacity: 0;
  animation: glowFadeOnly 4s ease-in-out infinite alternate backwards;
  pointer-events: none;
  will-change: opacity;
}

.blade-reflection {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 4px 6px 4px -4px rgba(255, 255, 255, 0.9);
  transform: rotate(-15deg) translateZ(0);
}

.ambient-bottom-light {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 0 -12px 25px -5px rgba(255, 255, 255, 0.18);
  transform: translateZ(0);
}

.ring-system {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateX(75deg) rotateY(-15deg) translateZ(0);
  transform-style: preserve-3d;
}

.laser-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(229, 228, 226, 0.45);
  box-shadow:
    0 0 25px rgba(229, 228, 226, 0.3),
    inset 0 0 20px rgba(229, 228, 226, 0.2);
  transform-style: preserve-3d;
}

.laser-ring::before,
.laser-ring::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 50%;
  transform: translateZ(0);
}

.laser-ring::before {
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  border: 1px solid rgba(229, 228, 226, 0.25);
}

.laser-ring::after {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 1px solid rgba(229, 228, 226, 0.2);
}

.r1 {
  width: 320px;
  height: 320px;
  top: -160px;
  left: -160px;
  animation: spinR 12s linear infinite backwards;
}

.r2 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
  border-color: rgba(229, 228, 226, 0.6);
  box-shadow:
    0 0 30px rgba(229, 228, 226, 0.4),
    inset 0 0 25px rgba(229, 228, 226, 0.25);
  animation: spinR 20s linear infinite reverse backwards;
}

.r2::before,
.r2::after {
  border-color: rgba(229, 228, 226, 0.3);
  box-shadow: none;
}

.r3 {
  width: 480px;
  height: 480px;
  top: -240px;
  left: -240px;
  animation: spinR 30s linear infinite backwards;
}

.r4 {
  width: 560px;
  height: 560px;
  top: -280px;
  left: -280px;
  opacity: 0.8;
  animation: spinR 45s linear infinite reverse backwards;
}

.delay-3d,
.delay-3d .horizon-neon-glow,
.delay-3d .obsidian-planet,
.delay-3d .planet-glow-layer,
.delay-3d .laser-ring {
  animation-delay: 2.5s !important;
  animation-fill-mode: backwards !important;
}

.gold-node {
  position: absolute;
  top: -2px;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  transform: translateX(-50%) translateZ(0);
  box-shadow:
    0 0 12px rgba(229, 228, 226, 0.8),
    0 0 24px rgba(229, 228, 226, 0.5);
}

.r2 .gold-node {
  box-shadow:
    0 0 10px rgba(229, 228, 226, 0.6),
    0 0 20px rgba(229, 228, 226, 0.3);
}

@keyframes spinR {
  0% { transform: rotateZ(0deg) translateZ(0); }
  100% { transform: rotateZ(360deg) translateZ(0); }
}

@keyframes cinematicFloat {
  0% { transform: rotateX(5deg) rotateY(-15deg) translateZ(0); }
  25% { transform: rotateX(-8deg) rotateY(5deg) translateZ(0); }
  50% { transform: rotateX(12deg) rotateY(15deg) translateZ(0); }
  75% { transform: rotateX(-5deg) rotateY(0deg) translateZ(0); }
  100% { transform: rotateX(5deg) rotateY(-15deg) translateZ(0); }
}

@keyframes glowBreathe {
  0% { opacity: 0.45; transform: translateZ(-1px) scale(0.95); }
  100% { opacity: 0.9; transform: translateZ(-1px) scale(1.08); }
}

@keyframes planetScaleOnly {
  0% { transform: translateZ(0) scale(1); }
  100% { transform: translateZ(0) scale(1.02); }
}

@keyframes glowFadeOnly {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes revealUp {
  0% { transform: translate3d(0, 110%, 0); opacity: 0; }
  100% { transform: translate3d(0, 0, 0); opacity: 1; }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translate3d(0, 20px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

.hero .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 50px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 50px;
  align-items: center;
  z-index: 10;
  width: 100%;
}

.staggered-title {
  font-size: 53px;
  font-weight: 800;
  line-height: 58px; 
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
}

.line-wrap {
  overflow: hidden;
  padding-bottom: 13px; 
  margin-bottom: -13px; 
}

.line {
  display: inline-block;
  transform: translate3d(0, 110%, 0);
  opacity: 0;
  background: linear-gradient(to right, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: revealUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) var(--entry-delay) forwards;
}

.text-shimmer-main {
  background: linear-gradient(
    180deg,
    #f4f4f4 0%,
    #d8d8d8 55%,
    #bcbcbc 100%
  );
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: none;
}

.text-shimmer-bright {
  background: linear-gradient(
    180deg,
    #e8e8e8 0%,
    #cfcfcf 52%,
    #adadad 100%
  );
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: none;
}

.mobile-only-br { display: none; }
.desktop-only-br { display: inline; }

.minimal-luxury-desc-wrapper {
  max-width: 600px;
  margin-bottom: 45px;
  position: relative;
  animation: fadeInUp 1.2s ease 0.6s both;
}

.desc-text-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.desc-sub-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.desc-sub-part {
  font-size: 17px;
  font-weight: 300;
  line-height: 27px; 
  margin: 0;
}

.actions {
  display: flex;
  gap: 20px;
  animation: fadeInUp 1.2s ease 0.8s both;
  position: relative; 
  z-index: 50; 
  cursor: pointer;
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
  
  transform: translateZ(10px) scale(1);
  backface-visibility: hidden; 
  -webkit-backface-visibility: hidden;
  
  pointer-events: auto; 
  touch-action: manipulation; 
  -webkit-tap-highlight-color: transparent; 
  
  outline: 1px solid transparent;
  background-clip: padding-box;
  -webkit-background-clip: padding-box;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-platinum {
  background: $platinum;
  color: #000;
}

.btn-dark {
  background: #141414;
  color: $platinum;
  border: 1px solid rgba(229, 228, 226, 0.2);
}

@media (hover: hover) and (pointer: fine) {
  .btn-platinum:hover {
    background: #ffffff;
    transform: translateZ(10px) scale(1.03);
  }

  .btn-dark:hover {
    background: #1e1e1e;
    transform: translateZ(10px) scale(1.03);
    border-color: $platinum;
  }

  .btn-platinum:active,
  .btn-dark:active {
    transform: translateZ(10px) scale(0.97);
    transition-duration: 0.1s;
  }
}

@media (hover: none) {
  .btn-platinum:active {
    background: #d8d8d8;
  }
  .btn-dark:active {
    background: #222222;
  }
}

.hero-anim-figure { 
  animation: fadeInUp 1.5s ease 0.3s both; 
  will-change: transform, opacity;
}

@media (min-width: 1024px) {
  .text-shimmer-main,
  .text-shimmer-bright {
    background: none !important;
    background-color: transparent !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    animation: none !important;
  }
}

/* ===============================================================
   ШИКАРНАЯ АДАПТАЦИЯ ДЛЯ ПЛАНШЕТОВ (iPad Mini, iPad Pro, Surface)
   =============================================================== */

/* 1. iPad Mini (и схожие планшеты 768px - 900px) */
@media (min-width: 768px) and (max-width: 900px) {
  .hero { 
    min-height: 100vh !important; 
    height: 100vh !important;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    overflow: visible !important; 
    position: relative;
    margin-bottom: 300px !important; 
  }
  
  .hero .container { 
    padding: 0 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .hero-left { 
    position: relative !important;
    z-index: 10;
    width: 100%;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    text-align: center;
    margin-top: 20px; 
  }
  
  .staggered-title { 
    font-size: 64px !important; 
    line-height: 68px !important; 
    letter-spacing: -1px;
    margin-bottom: 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .line-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .minimal-luxury-desc-wrapper { 
    max-width: 500px;
    margin-bottom: 35px;
  }
  
  .desc-sub-part {
    font-size: 20px !important; 
    line-height: 30px !important;
    color: rgba(255, 255, 255, 0.85) !important; 
  }
  
  .actions { 
    flex-direction: row; 
    justify-content: center; 
    width: 100%; 
    gap: 20px; 
  }
  
  .btn-pill {
    padding: 22px 46px !important; 
    font-size: 14px !important;
  }

  .hero-right {
    position: absolute !important;
    top: 820px !important; 
    bottom: auto !important;
    left: 50% !important;
    transform: translateX(-50%) !important; 
    margin: 0 !important;
    z-index: 1;
    display: flex;
    justify-content: center;
  }
  
  .css-3d-scene { 
    width: 450px !important; 
    height: 450px !important; 
    transform: none !important; 
  }
}

/* 2. Surface Pro 10, iPad Pro 13 (и крупные планшеты 901px - 1366px) */
@media (min-width: 901px) and (max-width: 1366px) and (orientation: portrait),
       (min-width: 901px) and (max-width: 1199px) {
  .hero { 
    min-height: 100vh !important; 
    height: 100vh !important;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    overflow: visible !important; 
    position: relative;
    margin-bottom: 400px !important; 
  }
  
  .hero .container { 
    padding: 0 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .hero-left { 
    position: relative !important;
    z-index: 10;
    width: 100%;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    text-align: center;
    margin-top: 40px; 
  }
  
  .staggered-title { 
    font-size: 86px !important; 
    line-height: 90px !important; 
    letter-spacing: -1.5px;
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .line-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .minimal-luxury-desc-wrapper { 
    max-width: 650px;
    margin-bottom: 45px;
  }
  
  .desc-sub-part {
    font-size: 24px !important; 
    line-height: 36px !important;
    color: rgba(255, 255, 255, 0.85) !important; 
  }
  
  .actions { 
    flex-direction: row; 
    justify-content: center; 
    width: 100%; 
    gap: 24px; 
  }
  
  .btn-pill {
    padding: 26px 52px !important; 
    font-size: 15px !important;
  }

  .hero-right {
    position: absolute !important;
    top: 1080px !important; 
    bottom: auto !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin: 0 !important;
    z-index: 1;
    display: flex;
    justify-content: center;
  }
  
  .css-3d-scene { 
    width: 600px !important; 
    height: 600px !important; 
    transform: none !important;
  }
}

/* ===============================================================
   МОБИЛЬНАЯ ВЕРСИЯ (СТРОГО PX, СТАТИЧНЫЙ ПОТОК, ИДЕАЛЬНЫЙ ЦЕНТР)
   =============================================================== */
@media (max-width: 767px) {
  .hide-on-mobile { display: none !important; }
  .mobile-only-br { display: inline; }
  .desktop-only-br { display: none; }
  .desktop-space { display: none; }
  
  .hero { 
    height: auto !important; 
    min-height: 0 !important; 
    padding-top: 190px !important; 
    padding-bottom: 90px !important; 
    display: flex;
    flex-direction: column;
    overflow: visible; 
  }
  
  .hero .container {  
    padding: 0 20px; 
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    position: static;
  }

  .hero-left {
    position: static !important; 
    transform: none !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-right {
    position: static !important; 
    transform: none !important;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center; 
    margin-top: 90px !important; 
  }

  .staggered-title { 
    margin-top: 0; 
    font-size: 34px !important; 
    line-height: 33px !important; 
    letter-spacing: -1.5px !important; 
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .line-wrap {
    width: 100%;
    text-align: center;
    display: flex; 
    justify-content: center;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }
  
  .line {
    white-space: nowrap !important;
    text-align: center;
    padding: 0 !important;
    margin: 0 !important;
  }

  .fit-line {
    font-size: 33px !important; 
    letter-spacing: -1.7px !important;
  }
  
  .fit-line-bottom {
    font-size: 32px !important; 
    letter-spacing: -1.6px !important;
  }

  .minimal-luxury-desc-wrapper {
    margin-top: 20px; 
    margin-bottom: 35px;
    text-align: center; 
    width: 100%;
  }

  .desc-text-content { 
    gap: 0; 
    max-width: 100%;
  }

  .desc-sub-part { 
    font-size: 15px !important; 
    line-height: 23px !important; 
    color: rgba(255, 255, 255, 0.7) !important;
    background: none !important;
    -webkit-text-fill-color: initial !important;
    padding: 0;
    text-align: center;
  }

  .actions { 
    width: 100%;
    max-width: none !important; 
    display: flex;
    flex-direction: column;
    align-items: stretch; 
    gap: 14px;
  }

  .btn-pill { 
    width: 100%; 
    padding: 20px 0; 
    font-size: 12px !important; 
    font-weight: 700;
    letter-spacing: 2.5px;
    min-width: unset;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .css-3d-scene { 
    width: 260px !important; 
    height: 260px !important; 
    margin: 0;
    transform: scale(0.75) translateZ(0); 
  }
}

/* ===============================================================
   ФИКС МАСШТАБА ПЛАНЕТЫ ДЛЯ ОЧЕНЬ МАЛЕНЬКИХ ЭКРАНОВ
   =============================================================== */
@media (max-width: 375px) {
  .css-3d-scene {
    transform: scale(0.65) translateZ(0);
  }
}

/* ===============================================================
   ИДЕАЛЬНОЕ ЦЕНТРИРОВАНИЕ ДЛЯ ВЫТЯНУТЫХ УСТРОЙСТВ 
   =============================================================== */
@media (max-width: 767px) and (min-height: 800px) {
  .hero {
    padding-top: 240px !important;
  }
}

@media (max-width: 767px) and (min-height: 900px) {
  .hero {
    padding-top: 280px !important;
  }
}
</style>