<template>
  <!-- FIXED TOP HEADER -->
  <Teleport to="body">
    <header
      class="header"
      :class="{ 'is-menu-open': isMenuOpen }"
    >
      <div class="container header-top">
        <!-- STATIC GLASS LAYER -->
        <div class="header-glass"></div>

        <!-- MOBILE LANGUAGE SWITCHER (LEFT) -->
        <div
          v-show="isMobile"
          ref="mobileLangDropdownRef"
          class="mobile-lang-wrapper"
          :style="{ visibility: isMenuOpen ? 'hidden' : 'visible' }"
        >
          <button
            type="button"
            class="lang-trigger"
            :class="{ 'is-active': isMobileLangDropdownOpen }"
            :aria-expanded="isMobileLangDropdownOpen"
            aria-label="Select language"
            @click="isMobileLangDropdownOpen = !isMobileLangDropdownOpen"
          >
            <img
              :src="`https://flagcdn.com/${currentLang.flag}.svg`"
              class="lang-flag-trigger"
              alt=""
            />
            {{ currentLang.code }}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="chevron-icon"
              :class="{ 'is-rotated': isMobileLangDropdownOpen }"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown-fade">
            <div v-show="isMobileLangDropdownOpen" class="lang-dropdown mobile-dropdown-position">
              <div class="lang-dropdown-inner" data-lenis-prevent>
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  class="lang-option"
                  :class="{ 'is-selected': currentLang.code === lang.code }"
                  @click="setLangMobile(lang)"
                >
                  <div class="lang-info">
                    <img
                      :src="`https://flagcdn.com/${lang.flag}.svg`"
                      class="lang-flag"
                      alt=""
                    />
                    <span class="lang-code-full">{{ lang.name }}</span>
                  </div>
                  <span class="lang-code-short">{{ lang.code }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- BRAND LOGO -->
        <div
          v-show="!isMenuOpen || !isMobile"
          class="logo"
          @click="scrollToTopAndClose"
        >
          <img src="/icons/transparent.png" alt="Efimovs Agency" class="brand-logo-ea" />
        </div>

        <!-- DESKTOP NAVIGATION -->
        <nav class="nav desktop-nav">
          <a
            href="#services"
            class="nav-link"
            :class="{ 'is-active': activeSection === 'services' }"
            @click.prevent="scrollToSection('services')"
          >
            <span>{{ t('services') }}</span>
          </a>
          <a
            href="#plans"
            class="nav-link"
            :class="{ 'is-active': activeSection === 'plans' }"
            @click.prevent="scrollToSection('plans')"
          >
            <span>{{ t('packages') }}</span>
          </a>
          <a
            href="#projects"
            class="nav-link"
            :class="{ 'is-active': activeSection === 'projects' }"
            @click.prevent="scrollToSection('projects')"
          >
            <span>{{ t('projects') }}</span>
          </a>
          <a
            href="#contacts"
            class="nav-link"
            :class="{ 'is-active': activeSection === 'contacts' }"
            @click.prevent="scrollToSection('contacts')"
          >
            <span>{{ t('contacts') }}</span>
          </a>
        </nav>

        <!-- DESKTOP LANGUAGE SWITCHER (RIGHT) -->
        <div v-show="!isMobile" ref="langDropdownRef" class="desktop-lang-wrapper">
          <button
            type="button"
            class="lang-trigger"
            :class="{ 'is-active': isLangMenuOpen }"
            :aria-expanded="isLangMenuOpen"
            aria-label="Select language"
            @click="isLangMenuOpen = !isLangMenuOpen"
          >
            <img
              :src="`https://flagcdn.com/${currentLang.flag}.svg`"
              class="lang-flag-trigger"
              alt=""
            />
            {{ currentLang.code }}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="chevron-icon"
              :class="{ 'is-rotated': isLangMenuOpen }"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown-fade">
            <div v-show="isLangMenuOpen" class="lang-dropdown">
              <div class="lang-dropdown-inner" data-lenis-prevent>
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  class="lang-option"
                  :class="{ 'is-selected': currentLang.code === lang.code }"
                  @click="setLang(lang)"
                >
                  <div class="lang-info">
                    <img
                      :src="`https://flagcdn.com/${lang.flag}.svg`"
                      class="lang-flag"
                      alt=""
                    />
                    <span class="lang-code-full">{{ lang.name }}</span>
                  </div>
                  <span class="lang-code-short">{{ lang.code }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- MOBILE BURGER TRIGGER -->
        <div v-show="isMobile" class="header-mobile-wrapper">
          <button
            type="button"
            class="burger-btn"
            :class="{ 'is-active': isMenuOpen }"
            :aria-expanded="isMenuOpen"
            aria-label="Menu"
            @click="toggleMenu"
          >
            <span class="line"></span>
            <span class="line"></span>
          </button>
        </div>
      </div>
    </header>
  </Teleport>

  <!-- MOBILE DRAWER MENU -->
  <Teleport to="body">
    <transition name="luxury-menu">
      <div
        v-show="isMenuOpen"
        class="mobile-overlay"
        @click.self="toggleMenu"
      >
        <div class="mobile-drawer">
          <div class="mobile-scroll-container" data-lenis-prevent>
            <div class="mobile-menu-top">
              <nav class="mobile-nav-list">
                <div
                  class="mobile-nav-item"
                  role="button"
                  tabindex="0"
                  @click.prevent="handleMobileNav('services')"
                  @keydown.enter.prevent="handleMobileNav('services')"
                >
                  <span class="nav-text">{{ t('services') }}</span>
                  <div class="nav-line"><div class="line-fill"></div></div>
                </div>
                <div
                  class="mobile-nav-item"
                  role="button"
                  tabindex="0"
                  @click.prevent="handleMobileNav('plans')"
                  @keydown.enter.prevent="handleMobileNav('plans')"
                >
                  <span class="nav-text">{{ t('packages') }}</span>
                  <div class="nav-line"><div class="line-fill"></div></div>
                </div>
                <div
                  class="mobile-nav-item"
                  role="button"
                  tabindex="0"
                  @click.prevent="handleMobileNav('projects')"
                  @keydown.enter.prevent="handleMobileNav('projects')"
                >
                  <span class="nav-text">{{ t('projects') }}</span>
                  <div class="nav-line"><div class="line-fill"></div></div>
                </div>
                <div
                  class="mobile-nav-item"
                  role="button"
                  tabindex="0"
                  @click.prevent="handleMobileNav('contacts')"
                  @keydown.enter.prevent="handleMobileNav('contacts')"
                >
                  <span class="nav-text">{{ t('contacts') }}</span>
                  <div class="nav-line"><div class="line-fill"></div></div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { languages, currentLang, t } from '../composables/useLanguage.js';

const route = useRoute();
const router = useRouter();

// UI AND NAVIGATION STATE
const isMenuOpen = ref(false);
const isMobile = ref(false);
const activeSection = ref('');

const isLangMenuOpen = ref(false);
const isMobileLangDropdownOpen = ref(false);
const langDropdownRef = ref(null);
const mobileLangDropdownRef = ref(null);

const isProgrammaticScrolling = ref(false);

let mediaQuery = null;
let programmaticScrollTimeout = null;
let scrollRafId = null;
let cancelActiveScroll = null;
let savedMenuScrollY = 0;

const sections = ['services', 'plans', 'projects', 'contacts'];

// LANGUAGE SELECTION
const setLang = (lang) => {
  currentLang.value = lang;
  isLangMenuOpen.value = false;
};

const setLangMobile = (lang) => {
  currentLang.value = lang;
  isMobileLangDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    isLangMenuOpen.value &&
    langDropdownRef.value &&
    !langDropdownRef.value.contains(event.target)
  ) {
    isLangMenuOpen.value = false;
  }
  if (
    isMobileLangDropdownOpen.value &&
    mobileLangDropdownRef.value &&
    !mobileLangDropdownRef.value.contains(event.target)
  ) {
    isMobileLangDropdownOpen.value = false;
  }
};

// IOS TELEGRAM WEBVIEW SAFE BODY SCROLL LOCK
const lockBodyScroll = () => {
  savedMenuScrollY = window.scrollY;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedMenuScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.touchAction = 'none';
};

const unlockBodyScroll = (restorePosition = true) => {
  const hadFixedLock = document.body.style.position === 'fixed';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.touchAction = '';

  if (hadFixedLock && restorePosition) {
    window.scrollTo({ top: savedMenuScrollY, behavior: 'instant' });
  }
};

const handleMediaChange = (e) => {
  isMobile.value = e.matches;
  if (!e.matches && isMenuOpen.value) {
    isMenuOpen.value = false;
    unlockBodyScroll(true);
  }
};

// ACTIVE SECTION SCROLL SPY
const handlePixelPerfectScroll = () => {
  if (isProgrammaticScrolling.value) return;
  if (scrollRafId) cancelAnimationFrame(scrollRafId);

  scrollRafId = requestAnimationFrame(() => {
    if (route.path !== '/') {
      activeSection.value = '';
      return;
    }

    let currentActive = '';
    const triggerY = 90;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom > triggerY) {
          currentActive = id;
          break;
        }
      }
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollPosition <= 15) {
      currentActive = 'contacts';
    }

    if (activeSection.value !== currentActive) {
      activeSection.value = currentActive;
    }
  });
};

const startProgrammaticScroll = (actionFn, id) => {
  if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
  isProgrammaticScrolling.value = true;
  activeSection.value = id;
  actionFn();
  programmaticScrollTimeout = setTimeout(() => {
    isProgrammaticScrolling.value = false;
    programmaticScrollTimeout = null;
  }, 1800);
};

// SMOOTH SECTION SCROLL WITH LAYOUT SHIFT COMPENSATION
const executeSmartScroll = (id) => {
  if (cancelActiveScroll) {
    cancelActiveScroll();
    cancelActiveScroll = null;
  }

  let cancelled = false;
  let tryRafId = null;
  let shiftRafId = null;
  let shiftTimerId = null;

  cancelActiveScroll = () => {
    cancelled = true;
    if (tryRafId) cancelAnimationFrame(tryRafId);
    if (shiftRafId) cancelAnimationFrame(shiftRafId);
    if (shiftTimerId) clearTimeout(shiftTimerId);
  };

  let attempts = 0;

  const tryScroll = () => {
    if (cancelled) return;

    const el = document.getElementById(id);
    if (!el) {
      attempts++;
      if (attempts < 60) {
        tryRafId = requestAnimationFrame(tryScroll);
      }
      return;
    }

    const offsetVal = id === 'contacts' ? 0 : -80;

    if (isMobile.value || !window.lenis) {
      const doNativeScroll = () => {
        const y = el.getBoundingClientRect().top + window.scrollY + offsetVal;
        window.scrollTo({ top: y, behavior: 'smooth' });
      };

      doNativeScroll();

      let lastY = el.getBoundingClientRect().top + window.scrollY;
      let elapsed = 0;

      const trackShiftMobile = () => {
        if (cancelled || elapsed > 2000) return;
        elapsed += 80;
        const currentY = el.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(currentY - lastY) > 120) {
          lastY = currentY;
          doNativeScroll();
        }
        shiftTimerId = setTimeout(trackShiftMobile, 80);
      };

      shiftTimerId = setTimeout(trackShiftMobile, 80);
      return;
    }

    window.lenis.resize();
    window.lenis.scrollTo(el, {
      offset: offsetVal,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      force: true,
    });

    let lastYDesktop = el.getBoundingClientRect().top + window.scrollY;
    let elapsedDesktop = 0;

    const trackShiftDesktop = () => {
      if (cancelled || elapsedDesktop > 1800) return;
      elapsedDesktop += 16;
      const currentY = el.getBoundingClientRect().top + window.scrollY;

      if (Math.abs(currentY - lastYDesktop) > 40) {
        lastYDesktop = currentY;
        window.lenis.resize();
        window.lenis.scrollTo(el, {
          offset: offsetVal,
          duration: 1.0,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          force: true,
        });
      }
      shiftRafId = requestAnimationFrame(trackShiftDesktop);
    };

    shiftRafId = requestAnimationFrame(trackShiftDesktop);
  };

  tryScroll();
};

const scrollToSection = async (id) => {
  startProgrammaticScroll(() => {}, id);
  if (route.path !== '/') await router.push('/');
  executeSmartScroll(id);
};

// MOBILE DRAWER ACTIONS
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isMobileLangDropdownOpen.value = false;
    lockBodyScroll();
  } else {
    unlockBodyScroll(true);
  }
};

const handleMobileNav = (id) => {
  toggleMenu();
  setTimeout(() => scrollToSection(id), 360);
};

const scrollToTopAndClose = async () => {
  if (cancelActiveScroll) {
    cancelActiveScroll();
    cancelActiveScroll = null;
  }

  let delay = 0;
  if (isMenuOpen.value) {
    toggleMenu();
    if (isMobile.value) delay = 360;
  }
  if (route.path !== '/') await router.push('/');

  setTimeout(() => {
    startProgrammaticScroll(() => {
      if (window.lenis && !isMobile.value) {
        window.lenis.scrollTo(0, {
          duration: 1.4,
          easing: (t) => 1 - Math.pow(1 - t, 5),
          force: true,
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, '');
  }, delay);
};

// LIFECYCLE
onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 767px)');
  isMobile.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', handleMediaChange);

  window.addEventListener('scroll', handlePixelPerfectScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleMediaChange);
  }
  if (cancelActiveScroll) {
    cancelActiveScroll();
  }
  window.removeEventListener('scroll', handlePixelPerfectScroll);
  document.removeEventListener('click', handleClickOutside);
  if (scrollRafId) cancelAnimationFrame(scrollRafId);
  if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);

  unlockBodyScroll(false);
});
</script>

<style lang="scss">
// LANGUAGE FLAGS & DROPDOWN
.lang-flag {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  opacity: 1;
  filter: saturate(1.25) contrast(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transition:
    filter 0.3s ease,
    border-color 0.3s ease;
  flex-shrink: 0;
}

.lang-option:hover .lang-flag,
.lang-option.is-selected .lang-flag {
  border-color: rgba(255, 255, 255, 0.4);
  filter: saturate(1.35) contrast(1.15) brightness(1.1);
}

.lang-flag-trigger {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  filter: saturate(1.25) contrast(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition:
    filter 0.3s ease,
    border-color 0.3s ease;
  flex-shrink: 0;
}

.lang-trigger:hover .lang-flag-trigger,
.lang-trigger.is-active .lang-flag-trigger {
  border-color: rgba(255, 255, 255, 0.4);
  filter: saturate(1.35) contrast(1.15) brightness(1.1);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 230px;
  border-radius: 16px;
  background-color: rgba(15, 15, 15, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  backdrop-filter: saturate(180%) blur(24px);
  overflow: hidden;
  z-index: 1000;
  transform: translate3d(0, 0, 0);
}

.mobile-dropdown-position {
  left: 0;
  right: auto;
}

.lang-dropdown-inner {
  display: flex;
  flex-direction: column;
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
  -webkit-font-smoothing: antialiased;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.lang-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.lang-option:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.lang-option.is-selected {
  background-color: rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.lang-code-full {
  font-size: 14px;
  font-weight: 500;
  color: #8e8e93;
  transition: color 0.2s ease;
}

.lang-code-short {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

.lang-option.is-selected .lang-code-full,
.lang-option.is-selected .lang-code-short,
.lang-option:hover .lang-code-full {
  color: #ffffff;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.23, 1, 0.32, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translate3d(0, -10px, 0) scale(0.98);
}

// MOBILE DRAWER
.mobile-overlay {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 99998;
  pointer-events: auto;
  justify-content: flex-end;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.65);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.mobile-drawer {
  width: 320px;
  max-width: 85vw;
  height: 100%;
  background-color: #050505;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  will-change: transform;
}

.mobile-scroll-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: calc(88px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.mobile-menu-top {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.mobile-nav-item {
  position: relative;
  cursor: pointer;
  padding: clamp(18px, 2.5svh, 24px) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  contain: layout;
}

.nav-text {
  font-size: 26px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #e5e4e2;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: left center;
}

.nav-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.nav-line .line-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.mobile-nav-item:active .nav-text {
  transform: translate3d(10px, 0, 0);
}

.mobile-nav-item:active .nav-line .line-fill {
  transform: scaleX(1);
}

.luxury-menu-enter-active,
.luxury-menu-leave-active {
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-menu-enter-from,
.luxury-menu-leave-to {
  opacity: 0;
}

.luxury-menu-enter-active .mobile-drawer,
.luxury-menu-leave-active .mobile-drawer {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.luxury-menu-enter-from .mobile-drawer,
.luxury-menu-leave-to .mobile-drawer {
  transform: translate3d(100%, 0, 0);
}
</style>

<style scoped lang="scss">
@keyframes headerEnter {
  from {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: calc(15px + env(safe-area-inset-top)) 0 15px;
  z-index: 999999;
  animation: headerEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 100;
  width: 100%;
  height: 64px;
  padding: 0 30px;
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.header-glass {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  background-color: rgba(10, 10, 10, 0.84);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  backdrop-filter: saturate(180%) blur(24px);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.header.is-menu-open .header-glass {
  opacity: 0 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}

.brand-logo-ea {
  height: 55px;
  width: auto;
  object-fit: contain;
  transition: filter 0.4s ease;
}

@media (hover: hover) and (pointer: fine) {
  .logo:hover .brand-logo-ea {
    filter: brightness(1.1);
  }
}

.logo:active .brand-logo-ea {
  filter: brightness(0.9);
}

.nav {
  display: flex;
  align-items: center;
  gap: 45px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.nav-link {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  padding: 8px 0;
  white-space: nowrap;
  color: #8e8e93;
  transition: color 0.4s ease;
}

.nav-link.is-active {
  color: #ffffff;
}

@media (hover: hover) and (pointer: fine) {
  .nav-link:hover {
    color: #ffffff;
  }
}

// LANGUAGE TRIGGER
.desktop-lang-wrapper,
.mobile-lang-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 2;
}

.desktop-lang-wrapper {
  right: 42px;
}

.mobile-lang-wrapper {
  left: 20px;
}

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: #8e8e93;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

.lang-trigger:hover,
.lang-trigger.is-active {
  color: #ffffff;
}

.chevron-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.chevron-icon.is-rotated {
  transform: rotate(180deg);
}

.header-mobile-wrapper {
  display: flex;
  z-index: 2;
}

// RESPONSIVE ADJUSTMENTS
@media (max-width: 1100px) {
  .header-top {
    height: 60px;
  }
  .brand-logo-ea {
    height: 44px;
  }
  .nav {
    gap: 30px;
  }
}

@media (min-width: 801px) and (max-width: 950px) {
  .header-top {
    height: 60px;
  }
  .brand-logo-ea {
    height: 42px;
  }
  .nav {
    gap: 24px;
  }
  .desktop-lang-wrapper {
    right: 32px;
  }
}

@media (max-width: 800px) {
  .header {
    padding: calc(10px + env(safe-area-inset-top)) 0 10px;
  }
  .header-top {
    height: 56px;
    padding: 0 20px;
  }
  .brand-logo-ea {
    height: 38px;
  }
  .nav {
    gap: 15px;
  }
  .desktop-lang-wrapper {
    right: 20px;
  }
}

@media (max-width: 767px) {
  .desktop-nav,
  .desktop-lang-wrapper {
    display: none;
  }

  .header {
    padding: calc(12px + env(safe-area-inset-top)) 0 12px;
  }

  .header-top {
    height: 60px;
    padding: 0 16px;
    justify-content: space-between;
  }

  .mobile-lang-wrapper {
    position: relative;
    left: 0;
    z-index: 110;
  }

  .header-mobile-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 110;
  }

  .brand-logo-ea {
    height: 48px;
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-left: 0;
  }

  .burger-btn {
    position: relative;
    z-index: 120;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(229, 228, 226, 0.1);
    border-radius: 50%;
    cursor: pointer;
  }

  .burger-btn .line {
    width: 16px;
    height: 2px;
    background: #e5e4e2;
    border-radius: 2px;
    transition:
      transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
      background-color 0.4s;
  }

  .burger-btn.is-active {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(229, 228, 226, 0.3);
  }

  .burger-btn.is-active .line {
    background: #ffffff;
    width: 20px;
  }

  .burger-btn.is-active .line:first-child {
    transform: translateY(3.5px) rotate(45deg);
  }

  .burger-btn.is-active .line:last-child {
    transform: translateY(-3.5px) rotate(-45deg);
  }
}
</style>