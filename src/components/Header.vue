<template>
  <Teleport to="body">
    <header
      class="header"
      :class="{ 'is-menu-open': isMenuOpen }"
    >
      <div class="container header-top">
        
        <!-- Статичный, неудаляемый слой стекла -->
        <div class="header-glass"></div>

        <!-- 🌐 МОБИЛЬНЫЙ ВЫБОР ЯЗЯКА (СЛЕВА) 🌐 -->
        <div 
          class="mobile-lang-wrapper" 
          v-show="isMobile" 
          :style="{ visibility: isMenuOpen ? 'hidden' : 'visible' }"
          ref="mobileLangDropdownRef"
        >
          <button 
            class="lang-trigger" 
            @click="isMobileLangDropdownOpen = !isMobileLangDropdownOpen"
            :class="{ 'is-active': isMobileLangDropdownOpen }"
          >
            <img :src="`https://flagcdn.com/${currentLang.flag}.svg`" class="lang-flag-trigger" alt="" />
            {{ currentLang.code }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron-icon" :class="{ 'is-rotated': isMobileLangDropdownOpen }">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown-fade">
            <div class="lang-dropdown mobile-dropdown-position" v-show="isMobileLangDropdownOpen">
              <div class="lang-dropdown-inner" data-lenis-prevent>
                <button 
                  v-for="lang in languages" 
                  :key="lang.code"
                  class="lang-option"
                  :class="{ 'is-selected': currentLang.code === lang.code }"
                  @click="setLangMobile(lang)"
                >
                  <div class="lang-info">
                    <img :src="`https://flagcdn.com/${lang.flag}.svg`" class="lang-flag" alt="" />
                    <span class="lang-code-full">{{ lang.name }}</span>
                  </div>
                  <span class="lang-code-short">{{ lang.code }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div
          class="logo"
          @click="scrollToTopAndClose"
          v-show="!isMenuOpen || !isMobile"
        >
          <img src="/icons/transparent.png" alt="Efimovs Agency" class="brand-logo-ea" />
        </div>

        <nav class="nav desktop-nav">
          <a href="#" @click.prevent="scrollToSection('projects')" class="nav-link" :class="{ 'is-active': activeSection === 'projects' }"><span>{{ t('projects') }}</span></a>
          <a href="#" @click.prevent="scrollToSection('services')" class="nav-link" :class="{ 'is-active': activeSection === 'services' }"><span>{{ t('services') }}</span></a>
          <a href="#" @click.prevent="scrollToSection('plans')" class="nav-link" :class="{ 'is-active': activeSection === 'plans' }"><span>{{ t('packages') }}</span></a>
          <a href="#" @click.prevent="scrollToSection('contacts')" class="nav-link" :class="{ 'is-active': activeSection === 'contacts' }"><span>{{ t('contacts') }}</span></a>
        </nav>

        <!-- 🌐 ДЕСКТОП: Выпадающее меню языка (СПРАВА) 🌐 -->
        <div class="desktop-lang-wrapper" v-show="!isMobile" ref="langDropdownRef">
          <button 
            class="lang-trigger" 
            @click="isLangMenuOpen = !isLangMenuOpen"
            :class="{ 'is-active': isLangMenuOpen }"
          >
            <img :src="`https://flagcdn.com/${currentLang.flag}.svg`" class="lang-flag-trigger" alt="" />
            {{ currentLang.code }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron-icon" :class="{ 'is-rotated': isLangMenuOpen }">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown-fade">
            <div class="lang-dropdown" v-show="isLangMenuOpen">
              <div class="lang-dropdown-inner" data-lenis-prevent>
                <button 
                  v-for="lang in languages" 
                  :key="lang.code"
                  class="lang-option"
                  :class="{ 'is-selected': currentLang.code === lang.code }"
                  @click="setLang(lang)"
                >
                  <div class="lang-info">
                    <img :src="`https://flagcdn.com/${lang.flag}.svg`" class="lang-flag" alt="" />
                    <span class="lang-code-full">{{ lang.name }}</span>
                  </div>
                  <span class="lang-code-short">{{ lang.code }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="header-mobile-wrapper" v-show="isMobile">
          <button
            class="burger-btn"
            :class="{ 'is-active': isMenuOpen }"
            @click="toggleMenu"
            aria-label="Menu"
          >
            <span class="line" v-once></span>
            <span class="line" v-once></span>
          </button>
        </div>
      </div>
    </header>
  </Teleport>

  <!-- Мобильное выдвижное меню -->
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
                <div class="mobile-nav-item" @click.prevent="handleMobileNav('projects')">
                  <span class="nav-text">{{ t('projects') }}</span>
                  <div class="nav-line" v-once><div class="line-fill"></div></div>
                </div>
                <div class="mobile-nav-item" @click.prevent="handleMobileNav('services')">
                  <span class="nav-text">{{ t('services') }}</span>
                  <div class="nav-line" v-once><div class="line-fill"></div></div>
                </div>
                <div class="mobile-nav-item" @click.prevent="handleMobileNav('plans')">
                  <span class="nav-text">{{ t('packages') }}</span>
                  <div class="nav-line" v-once><div class="line-fill"></div></div>
                </div>
                <div class="mobile-nav-item" @click.prevent="handleMobileNav('contacts')">
                  <span class="nav-text">{{ t('contacts') }}</span>
                  <div class="nav-line" v-once><div class="line-fill"></div></div>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { languages, currentLang, t } from "../composables/useLanguage";

const route = useRoute();
const router = useRouter();

const isMenuOpen = ref(false);
const isMobile = ref(false);
const activeSection = ref("");

const isLangMenuOpen = ref(false);
const isMobileLangDropdownOpen = ref(false);
const langDropdownRef = ref(null);
const mobileLangDropdownRef = ref(null);

const setLang = (lang) => {
  currentLang.value = lang;
  isLangMenuOpen.value = false;
};

const setLangMobile = (lang) => {
  currentLang.value = lang;
  isMobileLangDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (isLangMenuOpen.value && langDropdownRef.value && !langDropdownRef.value.contains(event.target)) {
    isLangMenuOpen.value = false;
  }
  if (isMobileLangDropdownOpen.value && mobileLangDropdownRef.value && !mobileLangDropdownRef.value.contains(event.target)) {
    isMobileLangDropdownOpen.value = false;
  }
};

const isProgrammaticScrolling = ref(false); 
let programmaticScrollTimeout = null; 
let scrollRafId = null;

const sections = ["projects", "services", "plans", "contacts"];

const handlePixelPerfectScroll = () => {
  if (isProgrammaticScrolling.value) return;
  if (scrollRafId) cancelAnimationFrame(scrollRafId);

  scrollRafId = requestAnimationFrame(() => {
    if (route.path !== '/') {
      activeSection.value = "";
      return;
    }

    let currentActive = "";
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
      currentActive = "contacts";
    }

    if (activeSection.value !== currentActive) {
      activeSection.value = currentActive;
    }
  });
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 767;
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

const executeSmartScroll = (id) => {
  let attempts = 0;
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (!el) {
      attempts++;
      if (attempts < 60) requestAnimationFrame(tryScroll);
      return;
    }

    const offsetVal = id === 'contacts' ? 0 : -80;
    
    if (isMobile.value || !window.lenis) {
      const doNativeScroll = () => {
        const y = el.getBoundingClientRect().top + window.scrollY + offsetVal;
        window.scrollTo({ top: y, behavior: "smooth" });
      };
      
      doNativeScroll();

      let lastY = el.getBoundingClientRect().top + window.scrollY;
      let elapsed = 0;

      const trackShiftMobile = () => {
        if (elapsed > 2000) return; 
        elapsed += 50; 
        const currentY = el.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(currentY - lastY) > 50) {
          lastY = currentY;
          doNativeScroll();
        }
        setTimeout(trackShiftMobile, 50);
      };
      
      setTimeout(trackShiftMobile, 50);
      return;
    }

    window.lenis.resize();
    window.lenis.scrollTo(el, {
      offset: offsetVal,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      force: true
    });

    let lastYDesktop = el.getBoundingClientRect().top + window.scrollY;
    let elapsedDesktop = 0;

    const trackShiftDesktop = () => {
      if (elapsedDesktop > 1800) return;
      elapsedDesktop += 16; 
      const currentY = el.getBoundingClientRect().top + window.scrollY;
      
      if (Math.abs(currentY - lastYDesktop) > 40) {
        lastYDesktop = currentY;
        window.lenis.resize();
        window.lenis.scrollTo(el, {
          offset: offsetVal,
          duration: 1.0, 
          easing: (t) => 1 - Math.pow(1 - t, 4),
          force: true
        });
      }
      requestAnimationFrame(trackShiftDesktop);
    };
    
    requestAnimationFrame(trackShiftDesktop);
  };
  tryScroll();
};

const scrollToSection = async (id) => {
  startProgrammaticScroll(() => {}, id);
  if (route.path !== '/') await router.push('/');
  executeSmartScroll(id);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isMobileLangDropdownOpen.value = false;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }
};

const handleMobileNav = (id) => {
  toggleMenu();
  setTimeout(() => scrollToSection(id), 400); 
};

const scrollToTopAndClose = async () => {
  let delay = 0;
  if (isMenuOpen.value) {
    toggleMenu();
    if (isMobile.value) delay = 400; 
  }
  if (route.path !== '/') await router.push('/');

  setTimeout(() => {
    startProgrammaticScroll(() => {
      if (window.lenis && !isMobile.value) {
        window.lenis.scrollTo(0, { 
          duration: 1.4, 
          easing: (t) => 1 - Math.pow(1 - t, 5),
          force: true
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, "");
  }, delay);
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile, { passive: true });
  window.addEventListener("scroll", handlePixelPerfectScroll, { passive: true });
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("scroll", handlePixelPerfectScroll);
  document.removeEventListener("click", handleClickOutside);
  if (scrollRafId) cancelAnimationFrame(scrollRafId);
  if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout); 

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
});
</script>

<style lang="scss">
/* --- ОБЩИЕ СТИЛИ ФЛАГОВ И ВЫПАДАЮЩЕГО МЕНЮ --- */
.lang-flag {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  opacity: 1;
  filter: saturate(1.25) contrast(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
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
  transition: filter 0.3s ease, border-color 0.3s ease;
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
  right: 0px;
  width: 230px;
  border-radius: 16px;
  background-color: rgba(15, 15, 15, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: saturate(180%) blur(40px);
  backdrop-filter: saturate(180%) blur(40px);
  overflow: hidden;
  z-index: 1000;
  -webkit-transform: translateZ(0);
  will-change: transform, opacity;
}

.mobile-dropdown-position {
  left: 0px;
  right: auto;
}

.lang-dropdown-inner {
  display: flex;
  flex-direction: column;
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
  
  /* Полное скрытие полосы прокрутки */
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

.lang-option:hover { background-color: rgba(255, 255, 255, 0.05); }
.lang-option.is-selected { background-color: rgba(255, 255, 255, 0.08); pointer-events: none; }

.lang-code-full { font-size: 14px; font-weight: 500; color: #8e8e93; transition: color 0.2s ease; }
.lang-code-short { font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.3); letter-spacing: 1px; }

.lang-option.is-selected .lang-code-full { color: #ffffff; }
.lang-option.is-selected .lang-code-short { color: #ffffff; }
.lang-option:hover .lang-code-full { color: #ffffff; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* --- МОБИЛЬНОЕ МЕНЮ (ДРАВЕР) --- */
.mobile-overlay { 
  display: flex; 
  position: fixed; 
  top: 0px; 
  bottom: 0px; 
  left: 0px; 
  right: 0px; 
  z-index: 99998; 
  pointer-events: auto; 
  justify-content: flex-end; 
  overflow: hidden; 
  background-color: rgba(0, 0, 0, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px); 
}

.mobile-drawer { 
  width: 320px; 
  max-width: 85vw; 
  height: 100%; 
  background-color: #050505; 
  border-left: 1px solid rgba(255, 255, 255, 0.05); 
  box-shadow: -20px 0px 50px rgba(0, 0, 0, 0.8); 
  display: flex; 
  flex-direction: column; 
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}

.mobile-scroll-container { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  width: 100%; 
  box-sizing: border-box; 
  padding: 100px 20px calc(24px + env(safe-area-inset-bottom)); 
  overflow-y: auto; 
  overscroll-behavior: none; 
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.mobile-menu-top { display: flex; flex-direction: column; width: 100%; }
.mobile-nav-list { display: flex; flex-direction: column; width: 100%; padding: 0px 10px; box-sizing: border-box; }
.mobile-nav-item { position: relative; cursor: pointer; padding: 24px 0px; display: flex; flex-direction: column; justify-content: center; -webkit-tap-highlight-color: transparent; contain: layout; }

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

.nav-line { position: absolute; bottom: 0px; left: 0px; width: 100%; height: 1px; background: rgba(255, 255, 255, 0.1); }
.nav-line .line-fill { 
  position: absolute; 
  top: 0px; 
  left: 0px; 
  width: 100%; 
  height: 100%; 
  background: #ffffff; 
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
}

.mobile-nav-item:active .nav-text { -webkit-transform: translate3d(10px, 0px, 0px); transform: translate3d(10px, 0px, 0px); }
.mobile-nav-item:active .nav-line .line-fill { -webkit-transform: scaleX(1); transform: scaleX(1); }

.luxury-menu-enter-active, .luxury-menu-leave-active { transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.luxury-menu-enter-from, .luxury-menu-leave-to { opacity: 0; }
.luxury-menu-enter-active .mobile-drawer, .luxury-menu-leave-active .mobile-drawer { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.luxury-menu-enter-from .mobile-drawer, .luxury-menu-leave-to .mobile-drawer { -webkit-transform: translate3d(100%, 0px, 0px); transform: translate3d(100%, 0px, 0px); }

@media (max-height: 700px) and (max-width: 767px) {
  .mobile-scroll-container { padding-top: 80px; padding-bottom: calc(20px + env(safe-area-inset-bottom)); }
  .mobile-nav-item { padding: 18px 0px; }
}
</style>

<style scoped lang="scss">
@keyframes headerEnter {
  from { opacity: 0; transform: translate3d(0, -20px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}

.header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  padding: 15px 0px;
  z-index: 999999; 
  animation: headerEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
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
  padding: 0px 30px; 
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
  box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.7);
  background-color: rgba(10, 10, 10, 0.78);
  -webkit-backdrop-filter: saturate(180%) blur(40px);
  backdrop-filter: saturate(180%) blur(40px);
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}

.header.is-menu-open .header-glass { opacity: 0 !important; }

.container { max-width: 1200px; margin: 0px auto; padding: 0px 20px; }

.logo {
  display: flex;
  align-items: center;
  height: 100%; 
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 2; 
  transform: translateZ(10px);
  -webkit-tap-highlight-color: transparent;
}

.brand-logo-ea {
  height: 55px;
  width: auto;
  object-fit: contain;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: filter 0.4s ease; 
}

@media (hover: hover) and (pointer: fine) {
  .logo:hover .brand-logo-ea { filter: brightness(1.1); }
}
.logo:active .brand-logo-ea { filter: brightness(0.9); }

.nav {
  display: flex;
  align-items: center;
  gap: 45px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateZ(10px);
  z-index: 2;
}

.nav-link {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  padding: 8px 0px;
  white-space: nowrap;
  color: #8e8e93; 
  transition: color 0.4s ease;
}

.nav-link.is-active { color: #ffffff; }

@media (hover: hover) and (pointer: fine) {
  .nav-link:hover { color: #ffffff; }
}

/* 🌐 ОБЩИЕ СТИЛИ КНОПКИ ВЫБОРА ЯЗЫКА (ТРИГГЕРА) 🌐 */
.desktop-lang-wrapper, .mobile-lang-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 2; 
  transform: translateZ(10px);
}

.desktop-lang-wrapper { right: 42px; }
.mobile-lang-wrapper { left: 20px; }

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: #8e8e93;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

.lang-trigger:hover, .lang-trigger.is-active { color: #ffffff; }

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
  transform: translateZ(10px);
}

@media (max-width: 1100px) { 
  .header-top { height: 60px; }
  .brand-logo-ea { height: 44px; } 
  .nav { gap: 30px; } 
}

@media (min-width: 801px) and (max-width: 950px) { 
  .header-top { height: 60px; }
  .brand-logo-ea { height: 42px; } 
  .nav { gap: 24px; } 
  .desktop-lang-wrapper { right: 32px; }
}

@media (max-width: 800px) { 
  .header { padding: 10px 0px; } 
  .header-top { height: 56px; padding: 0px 20px; } 
  .brand-logo-ea { height: 38px; } 
  .nav { gap: 15px; } 
  .desktop-lang-wrapper { right: 20px; }
}

@media (max-width: 767px) {
  .desktop-nav, .desktop-lang-wrapper { display: none; }
  
  .header { padding: 12px 0px; }
  
  .header-top { 
    height: 60px; 
    padding: 0px 16px; 
    justify-content: space-between; 
  }
  
  .mobile-lang-wrapper {
    position: relative;
    left: 0px;
    z-index: 110;
  }
  
  .header-mobile-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 110;
  }
  
  .brand-logo-ea { height: 48px; } 
  
  .logo { 
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateZ(10px);
    margin-left: 0px;
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
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.4s; 
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
    -webkit-transform: translateY(3.5px) rotate(45deg); 
    transform: translateY(3.5px) rotate(45deg); 
  }
  
  .burger-btn.is-active .line:last-child { 
    -webkit-transform: translateY(-3.5px) rotate(-45deg); 
    transform: translateY(-3.5px) rotate(-45deg); 
  }
}
</style>