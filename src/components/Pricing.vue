<template>
  <section id="plans" class="pricing-luxury" :class="{ 'tg-safe-mode': isTelegram }">
    <!-- 🚀 ФИКС: Убрали blur() из свечения для максимального FPS -->
    <div v-if="isDesktop && !isTelegram" class="ambient-glow opt-gpu" v-once></div>

    <div class="container">
      
      <div class="header-group">
        
        <div class="pricing-header">
          <span class="kicker">{{ t('pr_kicker') }}</span>
          <h2 class="gradient-title">
            {{ t('pr_title') }}
          </h2>
        </div>

        <!-- 3 Направления (Стеки) -->
        <div class="tab-wrapper">
          <div class="tab-system" :style="{ '--tab-count': stacks.length }">
            <div class="tab-indicator" :style="indicatorStyle">
              <div class="indicator-shine" v-once></div>
            </div>

            <button
              v-for="(stack, index) in stacks"
              :key="stack"
              @click="setActiveStack(stack, index)"
              :class="['tab-btn', { active: activeStack === stack }]"
            >
              <span class="btn-text">{{ t(stackKeyMap[stack]) }}</span>
            </button>
          </div>
        </div>

        <!-- Услуги под выбранное направление -->
        <div class="sub-nav-wrapper">
          <button
            v-for="service in currentServicesList"
            :key="service"
            @click="setActiveService(service)"
            :class="['sub-btn', { active: activeService === service }]"
          >
            <span class="sub-text">{{ t(serviceKeyMap[service]) }}</span>
            <div class="sub-glow" v-once></div>
          </button>
        </div>

        <div class="dynamic-service-context">
          <Transition name="fade-slide" mode="out-in">
            <p :key="activeService" class="service-description">
              {{ currentServiceDescription }}
            </p>
          </Transition>
        </div>
      </div>

      <div class="pricing-carousel">
        
        <div class="cards-wrapper gpu-scroll" ref="scrollContainer" @scroll="onCarouselScroll">
          <div
            v-for="(plan, index) in currentPlans"
            :key="activeService + '-' + plan.name" 
            class="card-wrapper"
            @click="openModalWithPlan(plan)"
            v-memo="[isDesktop, index === activeMobileIndex, activeService, currentLang.code]"
          >
            <div :class="['card gpu-layer', { 
              featured: index === 1 || index === 3,
              'is-mobile-active': !isDesktop && index === activeMobileIndex 
            }]">

              <div class="card-content">
                
                <div class="card-header">
                  <span class="plan-tag">{{ t(plan.label) }}</span>
                  <h3 class="plan-name">{{ t(plan.name) }}</h3>
                  <p class="plan-desc">{{ plan.desc }}</p>
                </div>

                <div class="spacer"></div>

                <div class="card-footer">
                  <div class="luxury-divider" v-once></div>
                  
                  <div class="price-container">
                    <span class="price-val">{{ t('pr_quote') }}</span>
                    <span class="billing-info">{{ t('pr_calc') }}</span>
                  </div>

                  <button class="prime-btn">
                    <span class="btn-inner">
                      <span class="text">{{ t('pr_btn') }}</span>
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
      :initial-stack="activeStack"
      :initial-service="activeService"
      :initial-plan="selectedPlanName"
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

// --- ОБНОВЛЕННАЯ СТРУКТУРА: 3 НАПРАВЛЕНИЯ ---
const stacks = [
  "Conversion Websites",
  "Lead Automation",
  "AI Assistants"
];

// --- МАППИНГ КЛЮЧЕЙ ИЗ ФАЙЛА ЛОКАЛИЗАЦИИ ---
// Используем ключи, которые ты уже добавил в языковой файл (exp_card1_title = "Конверсионные сайты" и тд)
const stackKeyMap = {
  "Conversion Websites": "exp_card1_title",
  "Lead Automation": "exp_card2_title",
  "AI Assistants": "exp_card3_title"
};

const serviceKeyMap = {
  // Сайты
  "Landing Page": "srv_opt_web_1",
  "Corporate Website": "srv_opt_web_2",
  "E-commerce": "srv_opt_web_3",
  // CRM
  "Social & CRM": "srv_opt_crm_1",
  "CRM from Scratch": "srv_opt_crm_2",
  "CRM Enhancement": "srv_opt_crm_3",
  // AI
  "24/7 Bot": "srv_opt_ai_1",
  "AI Comm Bot": "srv_opt_ai_2",
  "Custom AI Solutions": "srv_opt_ai_3"
};

// --- СТРУКТУРА УСЛУГ ПОД КАЖДОЕ НАПРАВЛЕНИЕ ---
const servicesOrder = {
  "Conversion Websites": ["Landing Page", "Corporate Website", "E-commerce"],
  "Lead Automation": ["Social & CRM", "CRM from Scratch", "CRM Enhancement"],
  "AI Assistants": ["24/7 Bot", "AI Comm Bot", "Custom AI Solutions"]
};

// --- ОПИСАНИЯ ДЛЯ САМОЙ УСЛУГИ (Текст под кнопками) ---
const serviceDescriptionsDict = {
  "Landing Page": {
    EN: "Fast, high-converting single-page websites designed to capture leads instantly.",
    RU: "Быстрые одностраничные сайты с высокой конверсией для мгновенного сбора заявок.",
    UA: "Швидкі односторінкові сайти з високою конверсією для миттєвого збору заявок."
  },
  "Corporate Website": {
    EN: "High-performance multi-page websites that build trust and showcase your business.",
    RU: "Мощные многостраничные сайты, вызывающие доверие и презентующие ваш бизнес.",
    UA: "Потужні багатосторінкові сайти, що викликають довіру та презентують ваш бізнес."
  },
  "E-commerce": {
    EN: "Turnkey e-commerce platforms optimized for maximum sales and secure payments.",
    RU: "Интернет-магазины под ключ, оптимизированные для максимальных продаж и безопасных оплат.",
    UA: "Інтернет-магазини під ключ, оптимізовані для максимальних продажів та безпечних оплат."
  },
  "Social & CRM": {
    EN: "Seamlessly connect your social media and messengers directly into your CRM system.",
    RU: "Бесшовная связка ваших соцсетей и мессенджеров напрямую в единую CRM систему.",
    UA: "Безшовна зв'язка ваших соцмереж та месенджерів безпосередньо в єдину CRM систему."
  },
  "CRM from Scratch": {
    EN: "Complete implementation and setup of a CRM tailored perfectly to your company.",
    RU: "Полное внедрение и настройка CRM-системы, идеально адаптированной под вашу компанию.",
    UA: "Повне впровадження та налаштування CRM-системи, ідеально адаптованої під вашу компанію."
  },
  "CRM Enhancement": {
    EN: "Deep audit and modernization of your existing CRM to automate routine tasks.",
    RU: "Глубокий аудит и доработка вашей текущей CRM для устранения ошибок и автоматизации рутины.",
    UA: "Глибокий аудит та доопрацювання вашої поточної CRM для усунення помилок і автоматизації рутини."
  },
  "24/7 Bot": {
    EN: "Smart 24/7 consultant bot instantly answering common customer questions.",
    RU: "Умный бот-консультант, мгновенно отвечающий на частые вопросы ваших клиентов 24/7.",
    UA: "Розумний бот-консультант, що миттєво відповідає на часті запитання ваших клієнтів 24/7."
  },
  "AI Comm Bot": {
    EN: "Advanced AI assistant to communicate with clients and capture details autonomously.",
    RU: "Продвинутый ИИ-ассистент, который общается с клиентами и собирает заявки как живой человек.",
    UA: "Просунутий ШІ-асистент, який спілкується з клієнтами та збирає заявки як жива людина."
  },
  "Custom AI Solutions": {
    EN: "Tailored AI algorithms and tools to automate your specific business logic.",
    RU: "Индивидуальные ИИ-алгоритмы и инструменты под уникальные задачи вашего бизнеса.",
    UA: "Індивідуальні ШІ-алгоритми та інструменти під унікальні завдання вашого бізнесу."
  }
};

// --- 4 УРОВНЯ СЛОЖНОСТИ (ПЛАНА) ПОД КАЖДУЮ УСЛУГУ ---
const planDescDict = {
  "Landing Page": [
    { EN: "A clean, fast landing page to test your offer and capture initial leads.", RU: "Чистый, быстрый лендинг для старта, тестирования оффера и сбора первых заявок.", UA: "Чистий, швидкий лендінг для старту, тестування офферу та збору перших заявок." },
    { EN: "A high-end promo page with custom animations to maximize conversion rates.", RU: "Продвинутый лендинг с премиум-анимацией и сложной структурой для максимальной конверсии.", UA: "Просунутий лендінг з преміум-анімацією та складною структурою для максимальної конверсії." },
    { EN: "Interactive page with complex logic, quizzes, and dynamic content.", RU: "Интерактивная страница со сложной логикой, квизами, калькуляторами и динамическим контентом.", UA: "Інтерактивна сторінка зі складною логікою, квізами, калькуляторами та динамічним контентом." },
    { EN: "High-load promo platform ready for thousands of simultaneous visitors.", RU: "High-load платформа, готовая выдержать огромный трафик с крупных рекламных кампаний.", UA: "High-load платформа, готова витримати величезний трафік із великих рекламних кампаній." }
  ],
  "Corporate Website": [
    { EN: "A modern multi-page site to establish a strong digital presence.", RU: "Современный стильный многостраничник для формирования надежного имиджа компании.", UA: "Сучасний стильний багатосторінковий сайт для формування надійного іміджу компанії." },
    { EN: "Fully equipped business site with a CMS, blog, and advanced forms.", RU: "Полноценный бизнес-сайт с удобной CMS для управления, блогом и сложными формами.", UA: "Повноцінний бізнес-сайт зі зручною CMS для управління, блогом та складними формами." },
    { EN: "Scalable corporate hub with secure client zones and integrations.", RU: "Масштабируемый портал с личными кабинетами для клиентов и внешними интеграциями.", UA: "Масштабований портал з особистими кабінетами для клієнтів та зовнішніми інтеграціями." },
    { EN: "Enterprise-grade web infrastructure with maximum security.", RU: "Инфраструктура Enterprise-уровня с банковской степенью безопасности и изолированными базами.", UA: "Інфраструктура Enterprise-рівня з банківським ступенем безпеки та ізольованими базами." }
  ],
  "E-commerce": [
    { EN: "A clean, fast online store to start selling your products online.", RU: "Аккуратный и быстрый интернет-магазин для уверенного старта онлайн-продаж.", UA: "Акуратний і швидкий інтернет-магазин для впевненого старту онлайн-продажів." },
    { EN: "Advanced store with custom product filtering and payment integrations.", RU: "Продвинутый магазин с умными фильтрами товаров, личным кабинетом и онлайн-оплатой.", UA: "Просунутий магазин з розумними фільтрами товарів, особистим кабінетом та онлайн-оплатою." },
    { EN: "Large-scale e-commerce with inventory sync and CRM integration.", RU: "Крупный e-commerce проект с синхронизацией складов, интеграцией 1С/CRM и сложной логикой доставки.", UA: "Великий e-commerce проєкт із синхронізацією складів, інтеграцією 1С/CRM та складною логікою доставки." },
    { EN: "Enterprise marketplace platform capable of handling massive order volumes.", RU: "Масштабный маркетплейс, способный без задержек обрабатывать тысячи заказов ежедневно.", UA: "Масштабний маркетплейс, здатний без затримок обробляти тисячі замовлень щодня." }
  ],
  "Social & CRM": [
    { EN: "Basic integration to send leads from Instagram/FB into your CRM.", RU: "Базовая интеграция для автоматической отправки заявок из Instagram/FB прямиком в CRM.", UA: "Базова інтеграція для автоматичної відправки заявок з Instagram/FB прямо в CRM." },
    { EN: "Multi-channel sync collecting requests from all messengers into one base.", RU: "Мультиканальная связка: сбор сообщений из Telegram, WhatsApp, Viber и соцсетей в одно окно.", UA: "Мультиканальна зв'язка: збір повідомлень з Telegram, WhatsApp, Viber та соцмереж в одне вікно." },
    { EN: "Advanced routing to assign leads to managers based on logic.", RU: "Сложная логика маршрутизации: автоматическое распределение заявок между менеджерами.", UA: "Складна логіка маршрутизації: автоматичний розподіл заявок між менеджерами." },
    { EN: "Total digital transformation connecting all communication channels seamlessly.", RU: "Глобальная экосистема, объединяющая абсолютно все каналы связи и телефонию в единый поток.", UA: "Глобальна екосистема, що поєднує абсолютно всі канали зв'язку та телефонію в єдиний потік." }
  ],
  "CRM from Scratch": [
    { EN: "Clean implementation of a base CRM to organize your client data.", RU: "Внедрение и настройка базовой CRM (Amo/Bitrix) для наведения порядка в базе клиентов.", UA: "Впровадження та налаштування базової CRM (Amo/Bitrix) для наведення ладу в базі клієнтів." },
    { EN: "Customized CRM with tailored funnels, fields, and access rights.", RU: "Настроенная под ваш бизнес CRM с индивидуальными воронками, полями и правами доступа.", UA: "Налаштована під ваш бізнес CRM з індивідуальними воронками, полями та правами доступу." },
    { EN: "Automated CRM with smart triggers for document generation and tasks.", RU: "Автоматизированная CRM: авто-постановка задач, умные триггеры и автоматическая генерация договоров.", UA: "Автоматизована CRM: авто-постановка завдань, розумні тригери та автоматична генерація договорів." },
    { EN: "Enterprise CRM deployment connecting marketing, sales, and production.", RU: "Внедрение Enterprise-решения, связывающего маркетинг, отдел продаж, склад и производство.", UA: "Впровадження Enterprise-рішення, що пов'язує маркетинг, відділ продажу, склад та виробництво." }
  ],
  "CRM Enhancement": [
    { EN: "Fixing bottlenecks and correcting current settings in your CRM.", RU: "Аудит и исправление критических ошибок в текущих настройках воронки вашей CRM.", UA: "Аудит та виправлення критичних помилок у поточних налаштуваннях воронки вашої CRM." },
    { EN: "Re-engineering workflows to save managers time.", RU: "Пересборка логики работы CRM, добавление новых воронок и автоматизация рутинных действий менеджеров.", UA: "Перезбірка логіки роботи CRM, додавання нових воронок та автоматизація рутинних дій менеджерів." },
    { EN: "Custom API development to connect external software to your CRM.", RU: "Разработка кастомных API-интеграций для связи вашей CRM со сторонними сервисами и сайтами.", UA: "Розробка кастомних API-інтеграцій для зв'язку вашої CRM зі сторонніми сервісами та сайтами." },
    { EN: "Total CRM rebuild into a highly secure, automated enterprise system.", RU: "Полная реновация вашей CRM в высокозащищенную автоматизированную корпоративную систему.", UA: "Повна реновація вашої CRM у високозахищену автоматизовану корпоративну систему." }
  ],
  "24/7 Bot": [
    { EN: "A smart FAQ bot to answer simple customer questions instantly.", RU: "Простой FAQ-бот, который мгновенно отвечает на типовые вопросы о ценах и графике работы.", UA: "Простий FAQ-бот, який миттєво відповідає на типові запитання про ціни та графік роботи." },
    { EN: "Lead generation bot that captures contacts and qualifies clients.", RU: "Бот-лидогенератор, который проводит первичный опрос клиента и собирает контактные данные.", UA: "Бот-лідогенератор, який проводить первинне опитування клієнта та збирає контактні дані." },
    { EN: "Interactive bot with external database checks (e.g. order status).", RU: "Интерактивный бот с доступом к базе (например, проверка статуса заказа по номеру).", UA: "Інтерактивний бот із доступом до бази (наприклад, перевірка статусу замовлення за номером)." },
    { EN: "Omnichannel bot ecosystem integrated across all your digital platforms.", RU: "Омниканальная экосистема ботов, работающая синхронно на сайте, в Telegram, WhatsApp и Instagram.", UA: "Омніканальна екосистема ботів, що працює синхронно на сайті, в Telegram, WhatsApp та Instagram." }
  ],
  "AI Comm Bot": [
    { EN: "Basic ChatGPT integration trained on your general company info.", RU: "Базовая интеграция ChatGPT, обученная на основной информации о вашей компании.", UA: "Базова інтеграція ChatGPT, навчена на основній інформації про вашу компанію." },
    { EN: "Advanced AI trained on your specific services and sales scripts.", RU: "Продвинутый ИИ-ассистент, обученный на ваших услугах, скриптах продаж и прайс-листах.", UA: "Просунутий ШІ-асистент, навчений на ваших послугах, скриптах продажу та прайс-листах." },
    { EN: "Context-aware AI capable of complex negotiations and objection handling.", RU: "Контекстный ИИ, способный вести сложные диалоги, отрабатывать возражения и закрывать сделки.", UA: "Контекстний ШІ, здатний вести складні діалоги, відпрацьовувати заперечення та закривати угоди." },
    { EN: "Autonomous AI communication hub directly injecting qualified leads to CRM.", RU: "Полностью автономный ИИ-центр коммуникации, напрямую передающий теплых клиентов в CRM.", UA: "Повністю автономний ШІ-центр комунікації, що безпосередньо передає теплих клієнтів до CRM." }
  ],
  "Custom AI Solutions": [
    { EN: "Simple AI automation to handle a repetitive text-processing task.", RU: "Простая ИИ-автоматизация для обработки и форматирования входящих текстовых данных.", UA: "Проста ШІ-автоматизація для обробки та форматування вхідних текстових даних." },
    { EN: "AI data extractor to automatically pull info from documents/invoices.", RU: "Умный алгоритм для автоматического извлечения и сортировки данных из документов или счетов.", UA: "Розумний алгоритм для автоматичного вилучення та сортування даних із документів або рахунків." },
    { EN: "Analytical AI that processes massive datasets for business insights.", RU: "Аналитический ИИ, обрабатывающий массивы данных компании и генерирующий готовые бизнес-отчеты.", UA: "Аналітичний ШІ, що обробляє масиви даних компанії та генерує готові бізнес-звіти." },
    { EN: "Private, secure AI ecosystem built exclusively for your enterprise.", RU: "Защищенная приватная ИИ-инфраструктура, разработанная эксклюзивно под уникальные бизнес-процессы корпорации.", UA: "Захищена приватна ШІ-інфраструктура, розроблена ексклюзивно під унікальні бізнес-процеси корпорації." }
  ]
};

// --- STATE ИНИЦИАЛИЗАЦИЯ ---
const activeStack = ref(stacks[0]);
const activeIndex = ref(0);
const activeService = ref(servicesOrder[stacks[0]][0]);

const scrollContainer = ref(null);
const isModalOpen = ref(false);
const selectedPlanName = shallowRef("");
const isDesktop = ref(true);
const isTelegram = ref(false);
const activeMobileIndex = ref(0);
let rafId = null;

// --- DYNAMIC COMPUTED DATA ---
const currentServiceDescription = computed(() => {
  const code = currentLang.value.code;
  const descGroup = serviceDescriptionsDict[activeService.value];
  if (!descGroup) return t('pr_fallback');
  // Fallback на английский, если для текущего языка (например, TR или DE) нет точного перевода в локальном словаре
  return descGroup[code] || descGroup['EN']; 
});

const currentServicesList = computed(() => {
  return servicesOrder[activeStack.value] || [];
});

const currentPlans = computed(() => {
  const code = currentLang.value.code;
  const plansArray = planDescDict[activeService.value];
  if (!plansArray) return [];
  
  const nameKeys = ['pl_n_simp', 'pl_n_med', 'pl_n_comp', 'pl_n_large'];
  const labelKeys = ['pl_l_simp', 'pl_l_med', 'pl_l_comp', 'pl_l_large'];

  return plansArray.map((p, i) => {
    return {
      name: nameKeys[i],
      label: labelKeys[i],
      desc: p[code] || p['EN'],
      originalName: ["Simple Project", "Medium Project", "Complex Project", "Large-Scale Project"][i]
    }
  });
});

const onCarouselScroll = () => {
  if (isDesktop.value || !scrollContainer.value) return;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const cardWidth = window.innerWidth * 0.72;
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
  selectedPlanName.value = plan.originalName;
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

const setActiveService = (service) => {
  activeService.value = service;
  activeMobileIndex.value = 0; 
  if (!isDesktop.value && scrollContainer.value) {
    scrollContainer.value.scrollTo({ left: 0, behavior: "smooth" });
  }
};

const setActiveStack = (stack, index) => {
  const finalIndex = index !== undefined ? index : stacks.indexOf(stack);
  if(finalIndex === -1) return; 

  activeStack.value = stack;
  activeIndex.value = finalIndex;
  activeService.value = servicesOrder[stack][0];
  activeMobileIndex.value = 0; 

  if (!isDesktop.value && scrollContainer.value) {
    scrollContainer.value.scrollTo({ left: 0, behavior: "smooth" });
  }
};
defineExpose({ setActiveStack }); 
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

.pricing-header { margin-bottom: 32px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
.kicker { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; color: #a1a1aa; margin: 0; }
.gradient-title { font-size: 64px; font-weight: 500; letter-spacing: -0.04em; line-height: 1.1; margin: 0; background: linear-gradient(180deg, #ffffff 0%, #71717a 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }

.tab-wrapper { display: flex; justify-content: center; margin-bottom: 40px; }

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

.sub-nav-wrapper { display: flex; justify-content: center; gap: clamp(8px, 2vw, 14px); margin-bottom: 25px; flex-wrap: wrap; }
.sub-btn { position: relative; padding: clamp(10px, 2vw, 12px) clamp(20px, 4vw, 30px); background: #111; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50px; color: rgba(255, 255, 255, 0.72); font-size: clamp(11px, 2vw, 13px); font-weight: 800; text-transform: uppercase; letter-spacing: 0.9px; cursor: pointer; overflow: hidden; transition: all 0.35s cubic-bezier(0.19, 1, 0.22, 1); }
.sub-btn.active { background: #ffffff; color: #000000; border-color: #ffffff; }

.dynamic-service-context { display: flex; justify-content: center; margin-bottom: clamp(40px, 6vw, 60px); text-align: center; height: 24px; }
.service-description { font-size: 15px; color: #a1a1aa; font-weight: 500; letter-spacing: 0.3px; margin: 0; max-width: 700px; line-height: 1.6; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

@media (hover: hover) and (pointer: fine) {
  .sub-btn:not(.active):hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.35); color: #fff; transform: translateY(-2px); }
}

.pricing-carousel { position: relative; }
.cards-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; }

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

  .card-wrapper:hover .card-light { opacity: 1; }
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
.price-val { font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: 2px; line-height: 1; transition: color 0.4s ease; text-transform: uppercase;}
.billing-info { font-size: 11px; color: #98989d; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

.prime-btn { width: 100%; padding: 16px 24px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); background: #141414; color: #ffffff; cursor: pointer; pointer-events: auto; position: relative; overflow: hidden; transition: all 0.4s ease; }
.prime-btn .btn-inner { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
.prime-btn .btn-inner .text { font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: inherit; }
.prime-btn .arrow-wrapper { width: 46px !important; overflow: hidden; display: flex; justify-content: flex-end; }
.prime-btn .luxury-arrow { width: 42px; height: 14px; flex-shrink: 0; transition: transform 0.6s ease; transform: translateX(-14px); color: inherit; }

@media (min-width: 1024px) and (max-width: 1366px) {
  .cards-wrapper { grid-template-columns: repeat(2, 1fr); gap: 40px; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title { 
    font-size: clamp(40px, 6vw, 54px) !important; 
  }
  .cards-wrapper { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}

@media (max-width: 767px) {
  .pricing-luxury { padding: 80px 0; }
  
  .pricing-header { margin-bottom: 24px; gap: 12px; }
  .gradient-title { font-size: clamp(32px, 8.5vw, 42px); }

  .dynamic-service-context { height: auto; margin-bottom: 30px; padding: 0 10px; }
  .service-description { font-size: 13px; }

  .tab-system { 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center;
    align-items: center;
    gap: 8px; 
    background: transparent; 
    border: none; 
    padding: 0; 
    box-shadow: none; 
    height: auto; 
  }
  .tab-indicator { display: none; }
  
  .tab-btn { 
    flex: 0 0 calc(100%); 
    width: 100%;
    height: 46px; 
    padding: 0 12px; 
    font-size: 11.5px; 
    line-height: 1.2;
    border-radius: 12px; 
    background: #111; 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    letter-spacing: 0.3px;
    box-sizing: border-box;
  }
  .tab-btn.active { background: #e5e4e2; color: #000; border-color: transparent; }

  .sub-nav-wrapper { 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center; 
    gap: 8px; 
    margin-bottom: 25px; 
    padding: 0; 
  }
  
  .sub-btn { 
    flex: 0 0 calc(100%); 
    width: 100%;
    height: 46px; 
    padding: 0 12px; 
    font-size: 11.5px; 
    line-height: 1.2;
    letter-spacing: 0.3px;
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    box-sizing: border-box;
  }

  .pricing-carousel {
    width: 100vw;
    margin-left: calc(-50vw + 50%); 
    margin-right: calc(-50vw + 50%);
    padding-top: 20px;
    padding-bottom: 50px; 
  }

  .gpu-scroll {
    display: flex; 
    flex-direction: row; 
    overflow-x: auto; 
    scroll-snap-type: x mandatory; 
    scroll-behavior: smooth; 
    gap: 16px; 
    padding: 0 14vw; 
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; 
    will-change: scroll-position;
  }
  .gpu-scroll::-webkit-scrollbar { display: none; }
  
  .card-wrapper { 
    flex: 0 0 72vw; 
    width: 72vw; 
    scroll-snap-align: center; 
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
  
  .prime-btn { padding: 14px 16px; }
  .prime-btn .btn-inner .text { font-size: 11px; letter-spacing: 0.5px; }
}

@media (max-width: 380px) {
  .gradient-title { font-size: clamp(28px, 8vw, 36px); }
  .card-content { padding: 28px 20px; }
  .plan-name { font-size: 22px; margin-bottom: 12px; }
  .plan-desc { font-size: 13.5px; }
  .price-val { font-size: 13px; letter-spacing: 1px; }
  .billing-info { font-size: 9px; margin-top: 6px; }
  .prime-btn { padding: 12px 14px; }
  .prime-btn .btn-inner .text { font-size: 10px; letter-spacing: 0px; }
}
</style>