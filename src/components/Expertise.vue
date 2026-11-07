<template>
  <section class="expertise" id="services">
    <div class="container">
      
      <div class="section-header">
        <span class="kicker">{{ t('exp_kicker') }}</span>
        <h2 class="gradient-title">{{ t('exp_title') }}</h2>
      </div>

      <!-- DESKTOP LAYOUT (1 КАРТОЧКА) -->
      <div class="desktop-layout">
        <div class="stack-layout">
          
          <div class="expertise-group">
            <div class="card-wrapper">
              <div
                class="card direction-main"
                style="--clr: #ffffff"
                v-on="isMobile ? {} : { mousemove: handleMouseMove }"
                @click="openModal('Conversion Websites')"
              >
                <div class="card-content">
                  <div class="info">
                    <div class="icon-wrapper">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" />
                        <path d="M3.6 9H20.4M3.6 15H20.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                        <path d="M12 3C14.5013 5.43845 15.9228 8.63013 16 12C15.9228 15.3699 14.5013 18.5615 12 21C9.49872 18.5615 8.07725 15.3699 8 12C8.07725 8.63013 9.49872 5.43845 12 3Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="text-info">
                      <h3>{{ t('exp_card1_title') }}</h3>
                      <p><strong>{{ t('exp_card1_q') }}</strong> {{ t('exp_card1_desc') }}</p>
                    </div>
                  </div>
                </div>
                <div class="card-border"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- MOBILE LAYOUT (1 КАРТОЧКА) -->
      <div class="mobile-layout">
        <div class="stack-layout">
          
          <div class="premium-row-wrapper">
            <div class="premium-row single-action" style="--clr: #ffffff">
              <div class="row-glass" @click="openModal('Conversion Websites')">
                <div class="row-header">
                  <div class="icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" />
                      <path d="M3.6 9H20.4M3.6 15H20.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                      <path d="M12 3C14.5013 5.43845 15.9228 8.63013 16 12C15.9228 15.3699 14.5013 18.5615 12 21C9.49872 18.5615 8.07725 15.3699 8 12C8.07725 8.63013 9.49872 5.43845 12 3Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="header-text">
                    <h3>{{ t('exp_card1_title') }}</h3>
                    <p><strong>{{ t('exp_card1_q') }}</strong> {{ t('exp_card1_desc') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ГЛАВНАЯ КНОПКА СЕКЦИИ -->
      <div class="section-cta-wrapper">
        <button class="main-action-btn" @click="openModal('Conversion Websites')">
          {{ t('btn_discuss') }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { t } from "../composables/useLanguage.js";

const emit = defineEmits(["open-specific"]);
const isMobile = ref(false);

const openModal = (service = "Conversion Websites") => {
  emit("open-specific", service);
};

const handleMouseMove = (e) => {
  if (isMobile.value) return;

  const target = e.currentTarget;
  const cards = target.classList.contains("card")
    ? [target]
    : target.querySelectorAll(".card");

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  });
};

const checkDevice = () => {
  isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
  checkDevice();
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
});
</script>

<style lang="scss" scoped>
@mixin silver-text-static {
  background: linear-gradient(135deg, #d7d7d7 0%, #ffffff 50%, #999999 100%);
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
  text-shadow: none !important;
  padding-bottom: 0.15em !important;
}

@mixin silver-text-strong {
  background: linear-gradient(180deg, #ffffff 0%, #ececec 52%, #bdbdbd 100%);
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
  text-shadow: none !important;
  padding-bottom: 0.15em !important;
}

@mixin body-readable {
  color: rgba(245, 245, 245, 0.85) !important;
  -webkit-text-fill-color: initial !important;
  background: none !important;
  text-shadow: none !important;
}

.expertise {
  background-color: transparent !important;
  padding: 150px 0px;
  position: relative;
  z-index: 1;
  isolation: isolate;
  contain: layout;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.container {
  max-width: 1400px;
  margin: 0px auto;
  padding: 0px 40px;
  position: relative;
  z-index: 2;
}

.desktop-layout, .mobile-layout {
  margin-top: clamp(36px, 6vw, 88px);
}

.stack-layout {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.desktop-layout {
  display: block;
}

.mobile-layout {
  display: none;
}

.card-wrapper,
.premium-row-wrapper {
  display: block;
}

.card-border,
.icon-wrapper svg {
  pointer-events: none;
}

/* --- СТИЛИ ДЛЯ ГЛАВНОЙ КНОПКИ СЕКЦИИ --- */
.section-cta-wrapper {
  margin-top: clamp(40px, 5vw, 60px);
  display: flex;
  justify-content: center;
  width: 100%;
}

.main-action-btn {
  background-color: #E6E6E6;
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

.desktop-layout .expertise-group {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.desktop-layout .card {
  background: rgba(15, 15, 15, 0.35);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  position: relative;
  cursor: pointer;
  transition: transform 0.4s ease, background 0.4s ease;

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
    inset: 0px;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04) 0%,
      transparent 40%
    );
    pointer-events: none;
    z-index: 3;
  }
}

@media (hover: hover) and (pointer: fine) {
  .desktop-layout .card:hover {
    transform: translateY(-6px);
    background: rgba(20, 20, 20, 0.45);
    .card-border {
      opacity: 1;
    }
    .icon-wrapper {
      color: #fff;
    }
    &::after {
      bottom: -30px;
      left: -15px;
      right: -15px;
      top: -15px;
    }
  }
}

.desktop-layout .card-content {
  padding: 60px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 5;
  border-radius: inherit;
  overflow: hidden;
  background: radial-gradient(
    800px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.04) 0%,
    transparent 40%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.desktop-layout .icon-wrapper {
  width: 75px;
  height: 75px;
  color: var(--clr);
  transition: color 0.3s ease;
  svg {
    width: 100%;
    height: 100%;
  }
}

.desktop-layout .direction-main {
  min-height: 240px;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
    width: 100%;
  }

  .text-info {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    font-size: 42px;
    line-height: 1.08;
    margin: 0px;
    font-weight: 700;
    letter-spacing: -0.5px;
    text-align: center;
    @include silver-text-strong;
  }

  p {
    font-size: 19px;
    line-height: 1.58;
    margin-top: 14px;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
    font-weight: 500;
    letter-spacing: 0.01em;
    max-width: 45ch;
    text-align: center;
    @include body-readable;
    
    strong {
      color: #fff;
      font-weight: 700;
      display: block;
      margin-bottom: 6px;
    }
  }
}

.desktop-layout .card-border {
  position: absolute;
  inset: 0px;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.8s;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    var(--clr),
    transparent 40%
  );
  -webkit-mask:
    linear-gradient(#fff 0px 0px) content-box,
    linear-gradient(#fff 0px 0px);
  mask:
    linear-gradient(#fff 0px 0px) content-box,
    linear-gradient(#fff 0px 0px);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1.5px;
  z-index: 10;
  pointer-events: none;
}

.mobile-layout .premium-row {
  border-radius: 24px;
  background: rgba(15, 15, 15, 0.35);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  touch-action: manipulation;
}

@media (hover: hover) and (pointer: fine) {
  .mobile-layout .premium-row:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.mobile-layout .premium-row:active {
  transform: scale(0.98);
}

.mobile-layout .row-glass {
  display: flex;
  position: relative;
  z-index: 5;
  border-radius: inherit;
  overflow: hidden;
  padding: 36px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.mobile-layout .row-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mobile-layout .icon-wrapper {
  width: 56px;
  height: 56px;
  color: var(--clr);
  margin-bottom: 8px;
  svg {
    width: 100%;
    height: 100%;
  }
}

.mobile-layout .header-text h3 {
  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;
  margin: 0px 0px 10px 0px;
  letter-spacing: -0.5px;
  @include silver-text-strong;
}

.mobile-layout .header-text p {
  font-size: 16px;
  line-height: 1.5;
  margin: 0px;
  font-weight: 500;
  max-width: 100%;
  @include body-readable;

  strong {
    color: #fff;
    font-weight: 700;
    display: block;
    margin-bottom: 4px;
  }
}

@media (min-width: 1024px) and (max-width: 1366px) {
  .expertise {
    padding: 100px 0px;
  }
  .desktop-layout .card-content {
    padding: 45px;
  }
  .desktop-layout .direction-main h3 {
    font-size: 38px;
  }
  .desktop-layout .direction-main p {
    font-size: 18px;
  }
}

@media (max-width: 1024px) {
  .desktop-layout {
    display: none;
  }
  .mobile-layout {
    display: block;
  }
  .expertise {
    padding: 100px 0px;
  }
  .container {
    padding: 0px 24px;
  }
  .mobile-layout .premium-row {
    background: rgba(15, 15, 15, 0.35) !important;
  }
}

@media (max-width: 767px) {
  .expertise {
    padding: 80px 0px;
  }
  .container {
    padding: 0px 16px;
  }
  .mobile-layout .row-glass {
    padding: 32px 20px;
  }
  .mobile-layout .header-text h3 {
    font-size: 24px;
  }
  .mobile-layout .header-text p {
    font-size: 15px;
  }
  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}
</style>