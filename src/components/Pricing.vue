<template>
  <section id="plans" class="pricing-luxury" :class="{ 'tg-safe-mode': isTelegram }">
    <!-- GPU Ambient Glow -->
    <div v-if="isDesktop && !isTelegram" class="ambient-glow opt-gpu" v-once></div>

    <div class="container">
      
      <div class="header-group">
        
        <div class="pricing-header">
          <span class="kicker">{{ t('pr_kicker') || 'ІНВЕСТИЦІЇ' }}</span>
          <!-- Обертка для идеального выравнивания и скролла -->
          <div class="title-scroll-wrapper">
            <h2 class="gradient-title">
              {{ t('pr_title') || 'Вартість розробки' }}
            </h2>
          </div>
        </div>

        <!-- 3 Типы разработки -->
        <div class="tab-wrapper">
          <div class="tab-system" style="--tab-count: 3;">
            <div class="tab-indicator" :style="indicatorStyle">
              <div class="indicator-shine" v-once></div>
            </div>

            <button
              v-for="(type, index) in designTypes"
              :key="type.key"
              @click="setActiveType(type.key, index)"
              :class="['tab-btn', { active: activeType === type.key }]"
            >
              <span class="btn-text">{{ t(type.titleKey) || type.defTitle }}</span>
            </button>
          </div>
        </div>

        <!-- Описание выбранного типа разработки -->
        <div class="dynamic-service-context">
          <Transition name="fade-slide" mode="out-in">
            <p :key="activeType" class="service-description">
              {{ currentTypeDescription }}
            </p>
          </Transition>
        </div>
      </div>

      <div class="pricing-carousel">
        <div class="cards-wrapper gpu-scroll" ref="scrollContainer" @scroll="onCarouselScroll">
          <div
            v-for="(plan, index) in currentPlans"
            :key="activeType + '-' + plan.name" 
            class="card-wrapper"
            @click="openModalWithPlan(plan)"
            v-memo="[isDesktop, index === activeMobileIndex, activeType, currentLang.code]"
          >
            <div :class="['card gpu-layer', { 
              featured: index === 1,
              'is-mobile-active': !isDesktop && index === activeMobileIndex 
            }]">

              <div class="card-content">
                
                <div class="card-header">
                  <span class="plan-tag">{{ t(plan.labelKey) || plan.defLabel }}</span>
                  <h3 class="plan-name">{{ t(plan.nameKey) || plan.originalName }}</h3>
                  <p class="plan-desc">{{ plan.desc }}</p>
                </div>

                <div class="spacer"></div>

                <div class="card-footer">
                  <div class="luxury-divider" v-once></div>
                  
                  <div class="price-container">
                    <span class="price-val">{{ plan.priceRange }}</span>
                    <span class="billing-info">{{ t('pr_calc') || 'Орієнтовний бюджет' }}</span>
                  </div>

                  <button class="prime-btn">
                    <span class="btn-inner">
                      <span class="text">{{ t('pr_btn') || 'ОБГОВОРИТИ ПРОЄКТ' }}</span>
                      <div class="arrow-wrapper" v-once>
                        <svg class="luxury-arrow" viewBox="0 0 42 14" fill="none" shape-rendering="optimizeSpeed">
                          <path d="M0 7H40M40 7L34 1M40 7L34 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
                        </svg>
                      </div>
                    </span>
                    <div class="btn-flare" v-once></div>
                  </button>
                </div>

              </div>
              <div class="card-light" v-if="isDesktop"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <ContactModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :initial-design-type="selectedDesignTypeForModal"
      :initial-plan="selectedPlanNameForModal"
      @close="isModalOpen = false"
    />
  </section>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent,
  shallowRef,
} from "vue";
import { t, currentLang } from "../composables/useLanguage";

const ContactModal = defineAsyncComponent(() => import("./ContactModal.vue"));

const designTypes = [
  { key: 'template', titleKey: 'mod_opt_template_title', defTitle: 'Шаблонна розробка' },
  { key: 'layout', titleKey: 'mod_opt_layout_title', defTitle: 'За вашим макетом' },
  { key: 'custom', titleKey: 'mod_opt_custom_title', defTitle: 'Проєкт під ключ' }
];

const typeDescriptions = {
  template: {
    EN: "We take a proven, high-converting template and adapt it specifically for your business.",
    RU: "Берем проверенный шаблон, который продает, и адаптируем под ваш бизнес.",
    UA: "Беремо перевірений шаблон, який продає, та адаптуємо під ваш бізнес."
  },
  layout: {
    EN: "You already have a website layout. We will write clean code, add functionality, and bring it to life.",
    RU: "У вас уже есть готовый макет сайта. Мы напишем чистый код, добавим функционал и оживим его.",
    UA: "У вас вже є готовий макет сайту. Ми напишемо чистий код, добавимо функціонал та оживимо його."
  },
  custom: {
    EN: "From unique design to the exact functionality you need. A solution for non-standard tasks.",
    RU: "От уникального дизайна до нужного вам функционала. Решение для нестандартных задач.",
    UA: "Від унікального дизайну до необхідного вам функціоналу. Рішення для нестандартних завдань."
  }
};

const pricingData = {
  template: [
    { nameKey: "pl_n_simp", labelKey: "pl_l_simp", priceRange: "$300 - $600", originalName: "Simple Project", defLabel: "Base",
      desc: { RU: "Одностраничный сайт для быстрого старта. Базовая настройка и запуск за несколько дней.", EN: "Single-page site for a quick start. Basic setup and launch in a few days.", UA: "Односторінковий сайт для швидкого старту. Базове налаштування та запуск за кілька днів." } },
    { nameKey: "pl_n_med", labelKey: "pl_l_med", priceRange: "$700 - $1,200", originalName: "Medium Project", defLabel: "Optimal",
      desc: { RU: "Многостраничный сайт или небольшой магазин. Удобная панель управления и корзина для заказов.", EN: "Multi-page site or small store. Convenient control panel and shopping cart.", UA: "Багатосторінковий сайт або невеликий магазин. Зручна панель управления та кошик для замовлень." } },
    { nameKey: "pl_n_comp", labelKey: "pl_l_comp", priceRange: "$1,400 - $2,500+", originalName: "Complex Project", defLabel: "Pro",
      desc: { RU: "Крупный портал с каталогом, личным кабинетом для клиентов и подключением онлайн-оплат.", EN: "Large portal with a catalog, personal client accounts, and online payment integration.", UA: "Великий портал з каталогом, особистим кабінетом для клієнтів та підключенням онлайн-оплат." } }
  ],
  layout: [
    { nameKey: "pl_n_simp", labelKey: "pl_l_simp", priceRange: "$400 - $800", originalName: "Simple Project", defLabel: "Base",
      desc: { RU: "Точный перенос вашего дизайна в интернет. Одностраничный сайт, который быстро работает на всех устройствах.", EN: "Exact transfer of your design to the web. A fast single-page site for all devices.", UA: "Точне перенесення вашого дизайну в інтернет. Односторінковий сайт, який швидко працює на всіх пристроях." } },
    { nameKey: "pl_n_med", labelKey: "pl_l_med", priceRange: "$900 - $1,800", originalName: "Medium Project", defLabel: "Optimal",
      desc: { RU: "Несколько страниц, плавные анимации и подключение системы для самостоятельного изменения текста и фото.", EN: "Multiple pages, smooth animations, and a system to easily edit text and photos yourself.", UA: "Кілька сторінок, плавні анімації та підключення системи для самостійної зміни тексту й фото." } },
    { nameKey: "pl_n_comp", labelKey: "pl_l_comp", priceRange: "$2,000 - $4,000+", originalName: "Complex Project", defLabel: "Pro",
      desc: { RU: "Сложная логика, регистрация пользователей и объединение вашего макета с бизнес-процессами компании.", EN: "Complex logic, user registration, and connecting your design to business processes.", UA: "Складна логіка, реєстрація користувачів та об'єднання вашого макету з бізнес-процесами компанії." } }
  ],
  custom: [
    { nameKey: "pl_n_simp", labelKey: "pl_l_simp", priceRange: "$800 - $1,500", originalName: "Simple Project", defLabel: "Base",
      desc: { RU: "Разработка дизайна с нуля под ваш стиль. Эксклюзивный одностраничный сайт, выделяющий вас среди конкурентов.", EN: "Custom design from scratch. An exclusive single-page site that makes you stand out.", UA: "Розробка дизайну з нуля под ваш стиль. Ексклюзивний односторінковий сайт, що виділяє вас серед конкурентів." } },
    { nameKey: "pl_n_med", labelKey: "pl_l_med", priceRange: "$1,500 - $3,500", originalName: "Medium Project", defLabel: "Optimal",
      desc: { RU: "Премиальный многостраничный сайт. Уникальные эффекты, панель управления и автоматический сбор заявок клиентов.", EN: "Premium multi-page site. Unique effects, management panel, and automatic lead collection.", UA: "Преміальний багатосторінковий сайт. Унікальні ефекти, панель управління та автоматичний збір заявок клієнтів." } },
    { nameKey: "pl_n_comp", labelKey: "pl_l_comp", priceRange: "$3,500 - $6,000+", originalName: "Complex Project", defLabel: "Pro",
      desc: { RU: "Полноценная платформа. Личные кабинеты, надежная защита данных, автоматизация продаж и любой нестандартный функционал.", EN: "Full-scale platform. Personal accounts, high security, sales automation, and any custom features.", UA: "Повноцінна платформа. Особисті кабінети, надійний захист даних, автоматизація продажів та будь-який нестандартний функціонал." } }
  ]
};

const activeType = ref(designTypes[0].key);
const activeIndex = ref(0);

const scrollContainer = ref(null);
const isModalOpen = ref(false);

const selectedDesignTypeForModal = shallowRef("");
const selectedPlanNameForModal = shallowRef("");

const isDesktop = ref(true);
const isTelegram = ref(false);
const activeMobileIndex = ref(0);
let rafId = null;

const currentTypeDescription = computed(() => {
  const code = currentLang.value.code;
  const descGroup = typeDescriptions[activeType.value];
  return descGroup[code] || descGroup['EN']; 
});

const currentPlans = computed(() => {
  const code = currentLang.value.code;
  const plansArray = pricingData[activeType.value] || pricingData['template'];
  
  return plansArray.map(p => ({
    nameKey: p.nameKey,
    labelKey: p.labelKey,
    priceRange: p.priceRange,
    originalName: p.originalName,
    defLabel: p.defLabel,
    desc: p.desc[code] || p.desc['EN']
  }));
});

const onCarouselScroll = () => {
  if (isDesktop.value || !scrollContainer.value) return;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const cardWidth = window.innerWidth * 0.76; 
    const gap = 16;
    const itemFullWidth = cardWidth + gap;
    
    let rawIndex = Math.round(scrollContainer.value.scrollLeft / itemFullWidth);
    const maxIndex = currentPlans.value.length - 1;
    const safeIndex = Math.max(0, Math.min(rawIndex, maxIndex));

    if (activeMobileIndex.value !== safeIndex) {
      activeMobileIndex.value = safeIndex;
    }
  });
};

const openModalWithPlan = (plan) => {
  selectedDesignTypeForModal.value = activeType.value;
  selectedPlanNameForModal.value = plan.originalName;
  isModalOpen.value = true;
};

let resizeTimer;
const checkDevice = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isDesktop.value = window.innerWidth >= 1024;
  }, 100);
};

onMounted(() => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/Telegram|FBAV|Instagram/i.test(ua)) {
    isTelegram.value = true;
  }
  checkDevice();
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
  if (rafId) cancelAnimationFrame(rafId);
  clearTimeout(resizeTimer);
});

const indicatorStyle = computed(() => ({
  transform: `translate3d(calc(100% * ${activeIndex.value}), 0, 0)`,
}));

const setActiveType = (typeKey, index) => {
  activeType.value = typeKey;
  activeIndex.value = index;
  activeMobileIndex.value = 0; 
  if (!isDesktop.value && scrollContainer.value) {
    scrollContainer.value.scrollTo({ left: 0, behavior: "smooth" });
  }
};
defineExpose({ setActiveType }); 
</script>

<style scoped>
.pricing-luxury { 
  contain: content;
  padding: clamp(80px, 10vw, 120px) 0; 
  background-color: transparent !important; 
  color: #fff; 
  font-family: "Plus Jakarta Sans", sans-serif; 
  position: relative; 
  z-index: 1; 
  isolation: isolate; 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility; 
}

.ambient-glow { 
  position: absolute; 
  top: 250px; 
  left: 50%; 
  transform: translate(-50%, -50%) translateZ(0); 
  width: 1000px; 
  height: 400px; 
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.04) 0%, transparent 100%); 
  z-index: -1; 
  pointer-events: none;
  will-change: transform;
}

.container { 
  max-width: 1760px; 
  margin: 0 auto; 
  padding: 0 40px; 
  position: relative; 
  z-index: 10; 
}
.header-group { max-width: 1240px; margin: 0 auto; }

/* --- СТИЛИ ЗАГОЛОВКА (1:1 С PROJECTS.VUE НА ДЕСКТОПЕ) --- */
.pricing-header { 
  margin-bottom: 40px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center; 
  gap: 16px; 
  width: 100%;
}

.kicker { 
  font-size: 12px; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.25em; 
  color: #98989d; 
  margin: 0; 
  margin-right: -0.25em; 
}

.title-scroll-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.gradient-title { 
  font-size: 64px; 
  font-weight: 500; 
  letter-spacing: -0.04em; 
  line-height: 1.2; 
  padding-bottom: 0.15em;
  padding-left: 0.25em; /* Оптическая компенсация точки/края */
  margin: 0; 
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%); 
  -webkit-background-clip: text; 
  background-clip: text; 
  color: transparent; 
  -webkit-text-fill-color: transparent; 
  white-space: nowrap; 
}

/* --- ТАБЫ И ДИНАМИЧЕСКИЙ КОНТЕКСТ --- */
.tab-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }

.tab-system { 
  display: flex; 
  position: relative; 
  padding: 6px; 
  background: #111; 
  border: 1px solid rgba(255, 255, 255, 0.05); 
  border-radius: 24px; 
  width: 100%; 
  max-width: 850px; 
  height: 64px; 
  box-sizing: border-box;
}

.tab-btn { 
  flex: 1; 
  height: 100%; 
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0; 
  border: none; 
  background: none; 
  color: rgba(255, 255, 255, 0.5); 
  font-weight: 800; 
  font-size: 13px; 
  text-transform: uppercase; 
  letter-spacing: 1.4px; 
  cursor: pointer; 
  z-index: 2; 
  position: relative; 
  transition: color 0.35s ease; 
}
.tab-btn.active { color: #000; }

.tab-indicator { 
  position: absolute; 
  top: 6px; 
  left: 6px; 
  height: calc(100% - 12px); 
  width: calc((100% - 12px) / var(--tab-count, 3)); 
  background: linear-gradient(135deg, #ffffff 0%, #e5e4e2 100%); 
  border-radius: 18px; 
  z-index: 1; 
  overflow: hidden; 
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.indicator-shine { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent); 
  transform: translateX(-100%); 
  animation: shine 3s infinite; 
  pointer-events: none;
}
@keyframes shine { 0% { transform: translateX(-100%); } 20%, 100% { transform: translateX(100%); } }

.dynamic-service-context { display: flex; justify-content: center; margin-bottom: clamp(40px, 6vw, 60px); text-align: center; height: 24px; }
.service-description { font-size: 15px; color: #a1a1aa; font-weight: 500; letter-spacing: 0.3px; margin: 0; max-width: 700px; line-height: 1.6; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

/* --- КАРТОЧКИ --- */
.pricing-carousel { position: relative; }

.cards-wrapper { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 36px; 
  max-width: 1100px; 
  margin: 0 auto;
}

.card-wrapper { 
  position: relative; 
  z-index: 1; 
  display: block; 
  height: 100%; 
  width: 100%;
  cursor: pointer;
  background: transparent; 
  border-radius: 20px;
  transform: translateZ(0);
}

.gpu-layer {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

.card { 
  position: relative; 
  z-index: 1;
  background: linear-gradient(180deg, #0a0a0a 0%, #060606 100%); 
  border: 1px solid rgba(255, 255, 255, 0.06); 
  border-radius: 20px; 
  height: 100%; 
  width: 100%;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease, border-color 0.4s ease; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
}

.featured { 
  background: linear-gradient(165deg, #191919 0%, #050505 100%); 
  border-color: rgba(255, 255, 255, 0.15); 
}

.featured .prime-btn { background: #ffffff; color: #000000; border-color: #ffffff; }
.featured .prime-btn .luxury-arrow { color: #000000; }

.card-light { position: absolute; inset: 0; border-radius: 20px; background: radial-gradient(600px circle at 50% 50%, rgba(255, 255, 255, 0.04), transparent 40%); opacity: 0; transition: opacity 0.4s ease; z-index: 1; pointer-events: none; }

@media (min-width: 1024px) {
  .card-wrapper:hover { z-index: 10; }
  .card-wrapper:hover .card { 
    transform: translateY(-12px) translateZ(0); 
    border-color: #ffffff; 
  }
  .card-wrapper:hover .card .price-val { color: #ffffff; } 
  
  .card-wrapper:hover .card:not(.featured) .prime-btn { background: #ffffff; color: #000000; border-color: #ffffff; transform: translateY(-2px); }
  .card-wrapper:hover .card:not(.featured) .prime-btn .luxury-arrow { transform: translateX(0); color: #000000; }
  
  .card-wrapper:hover .card.featured .prime-btn { transform: translateY(-2px); } 
  .card-wrapper:hover .card.featured .prime-btn .luxury-arrow { transform: translateX(0); }

  .card-light { opacity: 1; }
  @media (hover: hover) and (pointer: fine) {
    .tab-btn:not(.active):hover { color: rgba(255, 255, 255, 0.82); }
  }
}

.card-content { padding: 44px 36px; position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; pointer-events: none; flex-grow: 1; }

.card-header { display: flex; flex-direction: column; flex-shrink: 0; }
.plan-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 16px; color: rgba(255, 255, 255, 0.6); display: block; }
.plan-name { font-size: clamp(24px, 2vw, 28px); font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 16px; margin-top: 0; color: #ffffff; }
.plan-desc { font-size: 14.5px; line-height: 1.65; margin: 0; color: rgba(255, 255, 255, 0.7); font-weight: 400; letter-spacing: 0.2px; }

.spacer { flex-grow: 1; min-height: 40px; }
.card-footer { display: flex; flex-direction: column; flex-shrink: 0; }
.luxury-divider { height: 1px; background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%); margin-bottom: 24px; }

.price-container { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; }
.price-val { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; line-height: 1; transition: color 0.4s ease; text-transform: uppercase;}
.billing-info { font-size: 11px; color: #98989d; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

.prime-btn { width: 100%; padding: 16px 24px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); background: #141414; color: #ffffff; cursor: pointer; pointer-events: auto; position: relative; overflow: hidden; transition: all 0.4s ease; }
.prime-btn .btn-inner { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
.prime-btn .btn-inner .text { font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: inherit; }
.prime-btn .arrow-wrapper { width: 46px !important; overflow: hidden; display: flex; justify-content: flex-end; }
.prime-btn .luxury-arrow { width: 42px; height: 14px; flex-shrink: 0; transition: transform 0.6s ease; transform: translateX(-14px); color: inherit; }

@media (min-width: 1024px) and (max-width: 1200px) {
  .cards-wrapper { gap: 20px; }
  .card-content { padding: 34px 26px; }
  .price-val { font-size: 18px; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title { font-size: clamp(40px, 5.5vw, 56px) !important; text-align: center; }
  .cards-wrapper { grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 0 20px;}
  .card-content { padding: 30px 20px; }
  .plan-name { font-size: 22px; }
  .price-val { font-size: 16px; }
  .prime-btn .btn-inner .text { font-size: 10px; }
}

@media (max-width: 767px) {
  .pricing-luxury { padding: 80px 0; }
  
  .pricing-header { margin-bottom: 32px; gap: 12px; }
  
  .kicker {
    font-size: 11px; 
    font-weight: 700;
    letter-spacing: 0.4em; 
    margin-right: -0.4em;
  }
  
  .title-scroll-wrapper {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    display: flex;
    justify-content: flex-start;
  }
  
  .title-scroll-wrapper::-webkit-scrollbar { display: none; }
  
  .title-scroll-wrapper::before,
  .title-scroll-wrapper::after {
    content: "";
    flex: 1 0 auto;
  }
  
  .gradient-title { 
    flex: 0 0 auto;
    font-size: clamp(24px, 7.5vw, 36px) !important; 
    padding: 0 16px 0.15em calc(16px + 0.25em) !important; 
  }

  .dynamic-service-context { height: auto; margin-bottom: 40px; padding: 0 10px; }
  .service-description { font-size: 13px; }

  .tab-system { 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center;
    align-items: center;
    gap: 10px; 
    background: transparent; 
    border: none; 
    padding: 0 10px; 
    box-shadow: none; 
    height: auto; 
    width: 100%;
    max-width: 100%;
  }
  .tab-indicator { display: none; }
  
  .tab-btn { 
    flex: 0 0 calc(50% - 5px) !important; 
    max-width: calc(50% - 5px) !important; 
    min-width: 0; 
    height: 48px; 
    padding: 0 6px; 
    font-size: clamp(9px, 2.7vw, 12px); 
    font-weight: 700;
    white-space: nowrap; 
    overflow: hidden; 
    line-height: 1; 
    border-radius: 14px; 
    background: #111; 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    letter-spacing: 0.5px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }
  
  .tab-btn .btn-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .tab-btn.active { 
    background: #e5e4e2; 
    color: #000; 
    border-color: transparent; 
    font-weight: 800;
  }

  .pricing-carousel {
    width: 100vw;
    margin-left: calc(-50vw + 50%); 
    margin-right: calc(-50vw + 50%);
    padding-top: 10px;
    padding-bottom: 50px; 
  }

  .gpu-scroll {
    display: flex; 
    flex-direction: row; 
    overflow-x: auto; 
    scroll-snap-type: x mandatory; 
    scroll-behavior: smooth; 
    gap: 16px; 
    padding: 0 20px; 
    scroll-padding-left: 20px; 
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; 
    will-change: scroll-position;
  }
  .gpu-scroll::-webkit-scrollbar { display: none; }
  
  .card-wrapper { 
    flex: 0 0 76vw; 
    width: 76vw; 
    scroll-snap-align: start; 
    scroll-snap-stop: always;
  }

  .card { 
    transform: scale(0.85) translateZ(0); 
    filter: brightness(0.4); 
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease, border-color 0.4s ease; 
  }

  .card.is-mobile-active { 
    transform: scale(1) translateZ(0); 
    filter: brightness(1);
    border-color: #ffffff; 
  }

  .card.is-mobile-active .prime-btn { background: #ffffff; color: #000000; border-color: #ffffff; }
  .card.is-mobile-active .prime-btn .luxury-arrow { transform: translateX(0); color: #000000; }

  .card-content { padding: 32px 24px; }
  .plan-name { font-size: 24px; }
  .price-val { font-size: 16px; }
  
  .prime-btn { padding: 14px 16px; }
  .prime-btn .btn-inner .text { font-size: 11px; letter-spacing: 0.5px; }
}

@media (max-width: 380px) {
  .tab-system { padding: 0 4px; gap: 6px; }
  .tab-btn { 
    flex: 0 0 calc(50% - 3px) !important; 
    max-width: calc(50% - 3px) !important;
    height: 44px; 
    padding: 0 4px; 
    font-size: clamp(8px, 2.5vw, 11px); 
  }

  .card-content { padding: 28px 20px; }
  .plan-name { font-size: 22px; margin-bottom: 12px; }
  .plan-desc { font-size: 13.5px; }
  .price-val { font-size: 15px; letter-spacing: 1px; }
  .billing-info { font-size: 9px; margin-top: 6px; }
  .prime-btn { padding: 12px 14px; }
  .prime-btn .btn-inner .text { font-size: 10px; letter-spacing: 0px; }
}
</style>