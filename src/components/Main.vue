<template>
  <section
    ref="heroSection"
    class="hero"
    :class="{ 'is-paused': !isVisible }"
  >
    <div class="container">
      <!-- ЕДИНЫЙ ФЛАГМАНСКИЙ ЗАГОЛОВОК + КНОПКИ TESLA -->
      <div class="flagship-head">
        <span class="brand-eyebrow">EFIMOVS AGENCY</span>

        <h1 ref="titleRef" class="flagship-title">
          {{ t('mobile_hero_title') }}
        </h1>

        <p class="flagship-sub">
          {{ t('mobile_hero_sub') }}
        </p>

        <div class="tesla-actions">
          <button
            class="tesla-btn tesla-primary"
            @click="$emit('open-contact')"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend="handleSmartClick(() => $emit('open-contact'), $event)"
          >
            {{ t('mobile_btn_primary') }}
          </button>

          <a
            href="/portfolio"
            class="tesla-btn tesla-secondary"
            @click.prevent="navigateToPortfolio"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend="handleSmartClick(navigateToPortfolio, $event)"
          >
            {{ t('mobile_btn_secondary') }}
          </a>
        </div>
      </div>

      <!-- ОДНА ПОЛНОЦЕННАЯ СТАТИЧНАЯ СЕРЕБРЯНАЯ ПОЛОСА (ДЕСКТОП + ПЛАНШЕТ) -->
      <div class="silver-bar-stage" aria-hidden="true">
        <div class="silver-static-cast"></div>
        <div class="silver-single-line"></div>
      </div>

      <!-- МИНИМАЛИСТИЧНАЯ ПАНЕЛЬ БЫСТРОЙ СВЯЗИ БЕЗ АНКЕТ (ДЕСКТОП + ПЛАНШЕТ) -->
      <div class="direct-contact-bar">
        <span class="direct-label">
          {{ tr('hero_direct_label', 'Написать напрямую без формы') }}
        </span>

        <div class="direct-channels">
          <a
            :href="telegramDirectUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-pill"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span>Telegram</span>
          </a>

          <a
            :href="whatsappDirectUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-pill"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.489l4.614-1.464A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <a
            :href="emailDirectUrl"
            class="channel-pill"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>Email</span>
          </a>
        </div>
      </div>

      <!-- МОБИЛЬНЫЙ ЖИВОЙ 4D MACBOOK SHOWCASE (ТОЛЬКО <= 767px) -->
      <div class="mobile-macbook-stage" aria-hidden="true">
        <div class="mobile-macbook-glow"></div>
        <div class="mobile-macbook-float">
          <img
            src="/hero-macbook.jpg"
            alt="Efimovs Agency Flagship Web Architecture"
            class="mobile-macbook-render"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div class="mobile-macbook-sheen"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { t, telegramDirectUrl, whatsappDirectUrl, emailDirectUrl } from "../composables/useLanguage";

const emit = defineEmits(["open-contact"]);

const router = useRouter();
const heroSection = ref(null);
const titleRef = ref(null);
const isVisible = ref(true);

let observer = null;

// Безопасный перевод с фолбэком, если ключ ещё не добавлен в словарь
const tr = (key, fallback) => {
  const translated = t(key);
  return translated && translated !== key ? translated : fallback;
};

// Автоподгонка заголовка строго в 1 строку на ВСЕХ языках
const fitTitle = async () => {
  await nextTick();
  const el = titleRef.value;
  if (!el) return;

  el.style.fontSize = "";
  const parentWidth = el.parentElement?.clientWidth || window.innerWidth - 40;
  let currentSize = parseFloat(window.getComputedStyle(el).fontSize);

  while (el.scrollWidth > parentWidth && currentSize > 16) {
    currentSize -= 0.5;
    el.style.fontSize = `${currentSize}px`;
  }
};

watch(() => t("mobile_hero_title"), fitTitle);

const navigateToPortfolio = () => {
  router.push("/portfolio");
};

let touchStartY = 0;
let touchStartX = 0;
let isDragging = false;

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  isDragging = false;
};

const handleTouchMove = (e) => {
  if (!isDragging) {
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    if (Math.abs(touchY - touchStartY) > 10 || Math.abs(touchX - touchStartX) > 10) {
      isDragging = true;
    }
  }
};

const handleSmartClick = (actionFn, e) => {
  if (!isDragging) {
    if (e && e.cancelable) e.preventDefault();
    actionFn();
  }
  isDragging = false;
};

onMounted(() => {
  fitTitle();
  window.addEventListener("resize", fitTitle, { passive: true });

  observer = new IntersectionObserver(
    (entries) => {
      if (isVisible.value !== entries[0].isIntersecting) {
        isVisible.value = entries[0].isIntersecting;
      }
    },
    { rootMargin: "0px 0px -100px 0px", threshold: 0 }
  );

  if (heroSection.value) {
    observer.observe(heroSection.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", fitTitle);
  if (observer) {
    if (heroSection.value) observer.unobserve(heroSection.value);
    observer.disconnect();
    observer = null;
  }
});
</script>

<style lang="scss" scoped>
$platinum: #e5e4e2;

.mobile-macbook-stage {
  display: none;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes macbookLevitateMobile {
  0% {
    transform: perspective(900px) rotateX(2.2deg) rotateY(-2.2deg) translate3d(0, 0px, 0) scale(1);
  }
  50% {
    transform: perspective(900px) rotateX(-1.8deg) rotateY(2.2deg) translate3d(0, -10px, 14px) scale(1.022);
  }
  100% {
    transform: perspective(900px) rotateX(2.2deg) rotateY(-2.2deg) translate3d(0, 0px, 0) scale(1);
  }
}

@keyframes macbookAuraPulse {
  0% {
    opacity: 0.52;
    transform: translate(-50%, -50%) scale(0.92);
  }
  100% {
    opacity: 0.95;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes macbookLightSweep {
  0% {
    transform: translateX(-140%) skewX(-22deg);
    opacity: 0;
  }
  20% {
    opacity: 0.55;
  }
  55%, 100% {
    transform: translateX(260%) skewX(-22deg);
    opacity: 0;
  }
}

.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 120px 0 48px;
  overflow: hidden;
  background: transparent;
}

.hero.is-paused .mobile-macbook-float,
.hero.is-paused .mobile-macbook-glow,
.hero.is-paused .mobile-macbook-sheen {
  animation-play-state: paused !important;
}

.hero .container {
  max-width: 1340px;
  width: 100%;
  margin: 0 auto;
  padding: 0 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: relative;
  z-index: 10;
}

/* ===============================================================
   ВЕРХНИЙ ЗАГОЛОВОК + КНОПКИ TESLA
   =============================================================== */
.flagship-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 1240px;
  z-index: 15;
  animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.06s both;
}

.brand-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.52);
  margin-bottom: 14px;
}

.flagship-title {
  margin: 0 0 14px 0;
  font-size: clamp(44px, 4.9vw, 72px);
  font-weight: 700;
  line-height: 1.07;
  letter-spacing: -0.035em;
  white-space: nowrap;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #d4d6dc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.flagship-sub {
  margin: 0 0 30px 0;
  font-size: clamp(17px, 1.35vw, 20px);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.72);
  max-width: 560px;
}

.tesla-actions {
  width: 100%;
  max-width: 440px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.tesla-btn {
  height: 50px;
  padding: 0 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.tesla-primary {
  background: #ffffff;
  color: #050505;
  border: none;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.14);
}

.tesla-secondary {
  background: #121214;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

@media (hover: hover) and (pointer: fine) {
  .tesla-primary:hover {
    background: #f5f5f7;
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(255, 255, 255, 0.22);
  }

  .tesla-secondary:hover {
    background: #1c1d21;
    border-color: rgba(255, 255, 255, 0.44);
    transform: translateY(-2px);
  }

  .tesla-btn:active {
    transform: scale(0.98);
    transition-duration: 0.1s;
  }
}

/* ===============================================================
   ОДНА ПОЛНОЦЕННАЯ СТАТИЧНАЯ СЕРЕБРЯНАЯ ПОЛОСА
   =============================================================== */
.silver-bar-stage {
  position: relative;
  width: 100%;
  max-width: 660px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 6;
  animation: fadeInUp 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.14s both;
}

.silver-static-cast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76%;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(229, 228, 226, 0.025) 48%,
    transparent 74%
  );
  pointer-events: none;
}

.silver-single-line {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #c6c9d0 0%,
    #ffffff 50%,
    #c6c9d0 100%
  );
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.24);
}

/* ===============================================================
   МИНИМАЛИСТИЧНАЯ ПАНЕЛЬ ПРЯМОЙ СВЯЗИ (БЕЗ ПОДСВЕТКИ И ЛИШНЕГО ТЕКСТА)
   =============================================================== */
.direct-contact-bar {
  position: relative;
  z-index: 12;
  width: 100%;
  max-width: 660px;
  padding: 10px 10px 10px 22px;
  border-radius: 16px;
  background: #0c0d10;
  border: 1px solid rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  animation: fadeInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
}

.direct-label {
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.68);
  white-space: nowrap;
}

.direct-channels {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-pill {
  height: 38px;
  padding: 0 15px;
  border-radius: 10px;
  background: #16171c;
  border: 1px solid rgba(255, 255, 255, 0.11);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  white-space: nowrap;
  cursor: pointer;
  will-change: transform;
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.82);
  }
}

@media (hover: hover) and (pointer: fine) {
  .channel-pill:hover {
    transform: scale(1.045);
  }

  .channel-pill:active {
    transform: scale(0.98);
    transition-duration: 0.1s;
  }
}

/* ===============================================================
   ПЛАНШЕТЫ (768px - 1023px)
   =============================================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero .container {
    padding: 0 24px;
    gap: 32px;
  }

  .silver-bar-stage,
  .direct-contact-bar {
    max-width: 620px;
  }

  .direct-contact-bar {
    padding: 9px 9px 9px 18px;
  }

  .direct-label {
    font-size: 13px;
  }

  .channel-pill {
    padding: 0 12px;
    font-size: 12.5px;
  }
}

/* ===============================================================
   МОБИЛЬНАЯ ВЕРСИЯ (<= 767px) — ОСТАЁТСЯ 4D MACBOOK
   =============================================================== */
@media (max-width: 767px) {
  .silver-bar-stage,
  .direct-contact-bar {
    display: none !important;
  }

  .hero {
    height: 100svh;
    max-height: 960px;
    padding: 118px 0 10px;
    background: #000000;
  }

  .hero::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 54px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #050505 100%);
    pointer-events: none;
    z-index: 20;
  }

  .hero .container {
    padding: 0 20px;
    height: 100%;
    gap: 36px;
  }

  .brand-eyebrow {
    font-size: 10px;
    letter-spacing: 0.26em;
    margin-bottom: 10px;
  }

  .flagship-title {
    font-size: clamp(21px, 6.85vw, 31px);
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
  }

  .flagship-sub {
    font-size: 15px;
    line-height: 1.35;
    margin-bottom: 22px;
    max-width: 320px;
  }

  .tesla-actions {
    max-width: 360px;
    gap: 10px;
  }

  .tesla-btn {
    height: 44px;
    padding: 0 12px;
    border-radius: 10px;
    font-size: 13px;
  }

  .mobile-macbook-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    flex: 0 0 auto;
    pointer-events: none;
    z-index: 5;
    animation: fadeInUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
  }

  .mobile-macbook-glow {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 310px;
    height: 195px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(212, 175, 55, 0.18) 0%,
      rgba(229, 228, 226, 0.08) 45%,
      transparent 72%
    );
    animation: macbookAuraPulse 4.5s ease-in-out infinite alternate;
    z-index: 0;
  }

  .mobile-macbook-float {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 440px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    will-change: transform;
    animation: macbookLevitateMobile 7.5s ease-in-out infinite;
  }

  .mobile-macbook-render {
    width: 100%;
    height: auto;
    max-height: 35vh;
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-mask-image:
      linear-gradient(to bottom, transparent 0%, #000 12%, #000 84%, transparent 100%),
      linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-image:
      linear-gradient(to bottom, transparent 0%, #000 12%, #000 84%, transparent 100%),
      linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
    mask-composite: intersect;
  }

  .mobile-macbook-sheen {
    position: absolute;
    inset: 0;
    width: 45%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 245, 214, 0.07) 50%,
      transparent 100%
    );
    mix-blend-mode: screen;
    pointer-events: none;
    animation: macbookLightSweep 6.8s ease-in-out infinite;
  }
}

@media (max-width: 380px), (max-width: 767px) and (max-height: 700px) {
  .hero { padding-top: 96px; }
  .hero .container { gap: 24px; }
  .mobile-macbook-render { max-height: 29vh; }
}

@media (max-width: 767px) and (min-height: 840px) {
  .hero { padding-top: 132px; }
  .hero .container { gap: 44px; }
  .mobile-macbook-render { max-height: 38vh; }
}
</style>