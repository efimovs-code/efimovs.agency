<template>
  <section ref="introRoot" class="cinematic-intro-wrapper" :class="{ 'is-fading': isFading }">
    <div class="cinematic-intro-content">
      
      <div class="intro-inner">
        <div ref="emblemWrap" class="intro-emblem-wrap">
          <img
            ref="emblem"
            class="intro-emblem"
            src="/preloader-emblem.webp"
            alt="EFIMOVS AGENCY"
            width="1080"
            height="1080"
            draggable="false"
            fetchpriority="high"
          />
        </div>

        <div class="intro-text-block">
          <p ref="kicker" class="intro-kicker">Strategic Digital Partner</p>
          
          <!-- 🌟 ФИКС ДОСТУПНОСТИ: Читалки для слепых прочитают это слитно, игнорируя разбитые буквы -->
          <h1 ref="brandTitle" class="intro-title" aria-label="EFIMOVS AGENCY">
            <span
              v-for="(char, index) in brandLetters"
              :key="`${char}-${index}`"
              ref="charRefs"
              class="intro-char"
              :class="{ 'is-space': char === ' ' }"
              aria-hidden="true"
            >
              {{ char === " " ? "\u00A0" : char }}
            </span>
          </h1>
        </div>
      </div>

      <div ref="scrollIndicator" class="scroll-indicator" aria-hidden="true">
        <span class="scroll-text">
          <span class="text-desktop">Scroll to explore</span>
          <span class="text-touch">Swipe to explore</span>
        </span>
        
        <!-- 1. Иконка для Десктопа (Мышь - скролл вниз) -->
        <div class="device-icon icon-mouse">
          <div class="wheel-down"></div>
        </div>

        <!-- 2. Иконка для Планшета (Широкий экран - свайп вверх) -->
        <div class="device-icon icon-tablet">
          <div class="swipe-up"></div>
        </div>

        <!-- 3. Иконка для Телефона (Узкий экран - свайп вверх) -->
        <div class="device-icon icon-phone">
          <div class="swipe-up"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { gsap } from 'gsap';

const emit = defineEmits(["start-fade", "intro-finished"]);

const introRoot = ref(null);
const emblemWrap = ref(null);
const kicker = ref(null);
const charRefs = ref([]);
const scrollIndicator = ref(null);
const isFading = ref(false);

const brandLetters = computed(() => "EFIMOVS AGENCY".split(""));

let introTl = null;
let touchStartY = 0;
let isScrollLocked = false;

const playIntro = async () => {
  await nextTick();
  
  requestAnimationFrame(() => {
    introTl = gsap.timeline({ defaults: { ease: "power4.out", force3D: true } });

    introTl
      .to(emblemWrap.value, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: "blur(0px)", 
        duration: 2.2,
        ease: "expo.out" 
      })
      .to(kicker.value, { opacity: 1, y: 0, duration: 1 }, "-=1.6")
      .to(charRefs.value, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.04
      }, "-=1.4")
      .to(scrollIndicator.value, { opacity: 1, y: 0, duration: 1 }, "-=0.5");
  });
};

const triggerOutro = () => {
  if (isFading.value) return; 
  isFading.value = true;
  
  sessionStorage.setItem('introSeen', 'true');
  removeListeners();
  
  // УДАЛЕНО: document.body.style.overflow = '';
  // Разблокировка теперь полностью делегирована в App.vue, чтобы избежать бага "пустого первого тапа" на мобильных.

  emit("start-fade");

  setTimeout(() => {
    emit("intro-finished");
  }, 800);
};

const handleWheel = (e) => {
  if (isScrollLocked) return;
  if (e.deltaY > 10) {
    isScrollLocked = true;
    requestAnimationFrame(() => triggerOutro());
  }
};

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  if (isScrollLocked) return;
  const touchEndY = e.touches[0].clientY;
  if (touchStartY - touchEndY > 30) { 
    isScrollLocked = true;
    requestAnimationFrame(() => triggerOutro());
  }
};

const setupListeners = () => {
  window.addEventListener('wheel', handleWheel, { passive: true });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
};

const removeListeners = () => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
};

onMounted(() => {
  if (sessionStorage.getItem('introSeen')) return; 
  
  // УДАЛЕНО: document.body.style.overflow = 'hidden';
  // App.vue сам выставляет скрытие overflow, дублирование вызывало конфликты
  
  playIntro();
  setTimeout(setupListeners, 500); 
});

onBeforeUnmount(() => {
  if (introTl) introTl.kill();
  removeListeners();
});
</script>

<style scoped>
.cinematic-intro-wrapper {
  position: fixed; 
  top: -15vh;
  left: 0;
  width: 100%;
  height: 130vh;
  background-color: #000000;
  z-index: 99999;
  opacity: 1;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
  touch-action: none; 
  overscroll-behavior: none; 
  transform: translateZ(0);
  will-change: opacity, transform;
}

.cinematic-intro-wrapper.is-fading {
  opacity: 0;
  transform: translateY(-50px) translateZ(0);
  pointer-events: none; 
}

.cinematic-intro-content {
  position: absolute;
  top: 15vh; 
  left: 0;
  width: 100%;
  height: 100vh; 
  height: 100svh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: translateZ(0);
}

.intro-inner {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transform: translateY(-70px);
}

.intro-emblem-wrap {
  margin-bottom: -10px; 
  opacity: 0; 
  transform: translateY(40px) scale(1.15) translateZ(0); 
  filter: blur(12px) drop-shadow(0 0 36px rgba(255, 255, 255, 0.04));
  will-change: transform, opacity, filter; 
  backface-visibility: hidden;
}

.intro-emblem {
  width: 240px; 
  height: auto;
  pointer-events: none;
  user-select: none;
}

.intro-kicker {
  font-family: "Plus Jakarta Sans", sans-serif;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
  margin: 0 0 20px 0;
  opacity: 0; 
  transform: translateY(20px) translateZ(0); 
  backface-visibility: hidden;
}

.intro-title {
  font-family: "Plus Jakarta Sans", sans-serif;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: #ffffff;
  font-size: 42px; 
  font-weight: 500;
  letter-spacing: 11px; 
  text-transform: uppercase;
}

.intro-char {
  display: inline-block;
  opacity: 0; 
  transform: translateY(30px) translateZ(0); 
  filter: blur(10px);
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
}

.intro-char.is-space {
  width: 21px; 
}

.scroll-indicator {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 10;
  opacity: 0; 
  transform: translateY(20px) translateZ(0); 
  will-change: transform, opacity;
}

.scroll-text {
  font-family: "Plus Jakarta Sans", sans-serif;
  color: rgba(255, 255, 255, 0.75);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* =========================================================
   ИКОНКИ УСТРОЙСТВ (ГЕОМЕТРИЯ И ДЕТАЛИЗАЦИЯ)
   ========================================================= */
.device-icon {
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  position: relative; /* Для позиционирования деталей (камеры/кнопок) */
  animation: deviceFloat 3s ease-in-out infinite;
  transform: translateZ(0);
  will-change: transform;
}

/* 1. ФОРМА: Мышка (Десктоп) */
.icon-mouse {
  width: 24px;
  height: 38px;
  border-radius: 12px;
  align-items: flex-start;
  padding-top: 8px;
}
/* Разделитель левой и правой кнопки мыши */
.icon-mouse::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 10px;
  background: rgba(255, 255, 255, 0.25);
}

/* 2. ФОРМА: Планшет (iPad) */
.icon-tablet {
  width: 36px;
  height: 48px;
  border-radius: 6px;
  align-items: flex-end;
  padding-bottom: 12px;
}
/* Глазок камеры сверху */
.icon-tablet::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}
/* Индикатор Home снизу */
.icon-tablet::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
}

/* 3. ФОРМА: Телефон (iPhone) */
.icon-phone {
  width: 24px;
  height: 46px;
  border-radius: 6px;
  align-items: flex-end;
  padding-bottom: 12px;
}
/* Динамик (челка) сверху */
.icon-phone::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
}
/* Индикатор Home снизу */
.icon-phone::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
}


/* ИНДИКАТОРЫ АНИМАЦИИ (Золотой элемент внутри) */
.wheel-down {
  width: 2px;
  height: 6px;
  background-color: #d4af37;
  border-radius: 2px;
  animation: dropWheel 1.8s cubic-bezier(0.15, 0.41, 0.69, 0.94) infinite;
  transform: translateZ(0);
  will-change: transform, opacity;
  z-index: 2;
}

.swipe-up {
  width: 2px;
  height: 6px;
  background-color: #d4af37;
  border-radius: 2px;
  animation: swipeGesture 1.8s cubic-bezier(0.15, 0.41, 0.69, 0.94) infinite;
  transform: translateZ(0);
  will-change: transform, opacity;
  z-index: 2;
}

/* =========================================================
   АНИМАЦИИ
   ========================================================= */
@keyframes deviceFloat {
  0%, 100% { transform: translateY(0) translateZ(0); }
  50% { transform: translateY(5px) translateZ(0); }
}

@keyframes dropWheel {
  0% { transform: translateY(0) translateZ(0); opacity: 0; }
  20% { transform: translateY(0) translateZ(0); opacity: 1; }
  80% { transform: translateY(12px) translateZ(0); opacity: 0; }
  100% { transform: translateY(12px) translateZ(0); opacity: 0; }
}

@keyframes swipeGesture {
  0% { transform: translateY(0) translateZ(0); opacity: 0; }
  20% { transform: translateY(0) translateZ(0); opacity: 1; }
  80% { transform: translateY(-16px) translateZ(0); opacity: 0; } /* Движение пальца ВВЕРХ */
  100% { transform: translateY(-16px) translateZ(0); opacity: 0; }
}

/* =========================================================
   ЛОГИКА ОТОБРАЖЕНИЯ (МЕДИА-ЗАПРОСЫ)
   ========================================================= */

/* БАЗОВОЕ СОСТОЯНИЕ (ДЕСКТОП) */
.text-desktop { display: inline; }
.text-touch { display: none; }
.icon-mouse { display: flex; }
.icon-tablet, .icon-phone { display: none; }

/* ПЛАНШЕТЫ (Тач-экраны шириной от 768px и больше) */
@media (hover: none) and (pointer: coarse) and (min-width: 768px) {
  .text-desktop { display: none; }
  .text-touch { display: inline; }
  
  .icon-mouse { display: none; }
  .icon-phone { display: none; }
  .icon-tablet { display: flex; }
}

/* ТЕЛЕФОНЫ (Тач-экраны шириной до 767px) */
@media (hover: none) and (pointer: coarse) and (max-width: 767px) {
  .text-desktop { display: none; }
  .text-touch { display: inline; }
  
  .icon-mouse { display: none; }
  .icon-tablet { display: none; }
  .icon-phone { display: flex; }
}

/* =========================================================
   РЕСАЙЗ КОНТЕНТА
   ========================================================= */
@media (max-width: 767px) {
  .intro-inner { transform: translateY(-50px); }
  .intro-emblem-wrap { margin-bottom: -20px; } 
  .intro-emblem { width: 150px; } 
  .intro-kicker { font-size: 9px; letter-spacing: 4px; margin: 0 0 12px 0; } 
  .intro-title { font-size: 22px; letter-spacing: 5px; line-height: 1.2; }
  .intro-char.is-space { width: 10px; }
  .scroll-indicator { bottom: calc(env(safe-area-inset-bottom) + 30px); }
}

@media screen and (min-width: 390px) and (max-width: 435px) {
  .intro-emblem { width: 175px; } 
  .intro-emblem-wrap { margin-bottom: -25px; } 
  .intro-kicker { font-size: 9px; letter-spacing: 4px; margin: 0 0 12px 0; }
  .intro-title { font-size: 22px; letter-spacing: 5px; }
  .intro-char.is-space { width: 10px; }
}

@media screen and (max-width: 360px) {
  .intro-emblem { width: 125px; } 
  .intro-emblem-wrap { margin-bottom: -22px; }
  .intro-title { font-size: 19px; letter-spacing: 4px; }
  .intro-char.is-space { width: 8px; }
}
</style>