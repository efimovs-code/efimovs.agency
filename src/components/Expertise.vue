<template>
  <section class="expertise" id="services">
    <div class="container">
      <div class="section-header">
        <span class="kicker">{{ t('exp_kicker') }}</span>
        <h2 class="gradient-title">{{ t('exp_title') }}</h2>
      </div>

      <!-- EXPERTISE CARD -->
      <div class="expertise-body">
        <div
          class="expertise-card"
          style="--clr: #ffffff"
          v-on="isMobile ? {} : { mousemove: handleMouseMove }"
          @click="openModal('Conversion Websites')"
        >
          <div class="card-content">
            <div class="info">
              <div class="icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" />
                  <path
                    d="M3.6 9H20.4M3.6 15H20.4"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M12 3C14.5013 5.43845 15.9228 8.63013 16 12C15.9228 15.3699 14.5013 18.5615 12 21C9.49872 18.5615 8.07725 15.3699 8 12C8.07725 8.63013 9.49872 5.43845 12 3Z"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="text-info">
                <h3>{{ t('exp_card1_title') }}</h3>
                <p>
                  <strong>{{ t('exp_card1_q') }}</strong>
                  {{ t('exp_card1_desc') }}
                </p>
              </div>
            </div>
          </div>
          <div class="card-border"></div>
        </div>
      </div>

      <!-- SECTION CTA -->
      <div class="section-cta-wrapper">
        <button
          type="button"
          class="main-action-btn"
          @click="openModal('Conversion Websites')"
        >
          {{ t('btn_discuss') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { t } from '../composables/useLanguage.js';

const emit = defineEmits(['open-specific']);
const isMobile = ref(false);
let mediaQuery = null;

const openModal = (service = 'Conversion Websites') => {
  emit('open-specific', service);
};

const handleMouseMove = (e) => {
  if (isMobile.value) return;

  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const handleMediaChange = (e) => {
  isMobile.value = e.matches;
};

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 1023px)');
  isMobile.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', handleMediaChange);
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleMediaChange);
  }
});
</script>

<style lang="scss" scoped>
.expertise {
  background-color: transparent;
  padding: 150px 0;
  position: relative;
  z-index: 1;
  isolation: isolate;
  contain: style;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.section-header {
  .gradient-title {
    word-spacing: 0.14em;
  }
}

.expertise-body {
  margin-top: clamp(36px, 6vw, 88px);
}

/* EXPERTISE CARD */
.expertise-card {
  background: rgba(15, 15, 15, 0.35);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  min-height: 240px;
  position: relative;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    transform 0.4s ease,
    background 0.4s ease,
    border-color 0.3s ease;

  /* INVISIBLE HOVER BUFFER TO PREVENT FLICKER ON TRANSLATE */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: transparent;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04) 0%,
      transparent 40%
    );
    pointer-events: none;
    z-index: 3;
  }

  &:active {
    transform: scale(0.985);
  }
}

@media (hover: hover) and (pointer: fine) {
  .expertise-card:hover {
    transform: translateY(-6px);
    background: rgba(20, 20, 20, 0.45);
    border-color: rgba(255, 255, 255, 0.12);

    .card-border {
      opacity: 1;
    }

    .icon-wrapper {
      color: #fff;
    }

    &::after {
      top: -15px;
      right: -15px;
      bottom: -30px;
      left: -15px;
    }
  }
}

.card-content {
  padding: 60px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 5;
  border-radius: inherit;
  overflow: hidden;
  background: radial-gradient(
    800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.04) 0%,
    transparent 40%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 24px;
  width: 100%;
}

.icon-wrapper {
  width: 75px;
  height: 75px;
  color: var(--clr);
  transition: color 0.3s ease;

  svg {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}

.text-info {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 42px;
    line-height: 1.08;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.5px;
    text-align: center;
    padding-bottom: 0.15em;
    background: linear-gradient(180deg, #ffffff 0%, #ececec 52%, #bdbdbd 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  p {
    font-size: 19px;
    line-height: 1.58;
    margin: 14px auto 0;
    font-weight: 500;
    letter-spacing: 0.01em;
    max-width: 45ch;
    text-align: center;
    color: rgba(245, 245, 245, 0.85);

    strong {
      color: #fff;
      font-weight: 700;
      display: block;
      margin-bottom: 6px;
    }
  }
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.8s;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    var(--clr),
    transparent 40%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1.5px;
  z-index: 10;
  pointer-events: none;
}

/* SECTION CTA */
.section-cta-wrapper {
  margin-top: clamp(40px, 5vw, 60px);
  display: flex;
  justify-content: center;
  width: 100%;
}

.main-action-btn {
  background-color: #e6e6e6;
  color: #050505;
  border: none;
  border-radius: 100px;
  padding: 24px 80px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #ffffff;
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (min-width: 1024px) and (max-width: 1366px) {
  .expertise {
    padding: 100px 0;
  }

  .card-content {
    padding: 45px;
  }

  .text-info h3 {
    font-size: 38px;
  }

  .text-info p {
    font-size: 18px;
  }
}

@media (max-width: 1023px) {
  .expertise {
    padding: 100px 0;
  }

  .container {
    padding: 0 24px;
  }

  .expertise-card {
    border-radius: 24px;
    min-height: auto;
    background: rgba(18, 18, 20, 0.92);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: rgba(255, 255, 255, 0.08);
  }

  .card-content {
    padding: 36px 24px;
    background: none;
  }

  .card-border {
    display: none;
  }

  .info {
    gap: 16px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    margin-bottom: 8px;
  }

  .text-info h3 {
    font-size: 26px;
    line-height: 1.1;
    margin-bottom: 10px;
  }

  .text-info p {
    font-size: 16px;
    line-height: 1.5;
    margin-top: 0;
    max-width: 100%;

    strong {
      margin-bottom: 4px;
    }
  }
}

@media (max-width: 767px) {
  .expertise {
    padding: 80px 0;
  }

  .container {
    padding: 0 16px;
  }

  .card-content {
    padding: 32px 20px;
  }

  .text-info h3 {
    font-size: 24px;
  }

  .text-info p {
    font-size: 15px;
  }

  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}
</style>