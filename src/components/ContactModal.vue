<template>
  <Teleport to="body">
    <Transition name="modal-luxury">
      <div v-if="isOpen" class="m-overlay" @click.self="$emit('close')">
        
        <div class="m-window">
          
          <button class="m-close-text" @click="$emit('close')" :aria-label="t('port_back') || 'НАЗАД'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="back-arrow">
              <line x1="20" y1="12" x2="4" y2="12"></line>
              <polyline points="10 18 4 12 10 6"></polyline>
            </svg>
            {{ t('port_back') || 'НАЗАД' }}
          </button>

          <div class="m-content custom-scroll-hidden">
            
            <div class="m-header" v-if="step < 7">
              <div class="m-progress-track">
                <div class="m-progress-bar" :style="{ transform: `scaleX(${step / 6})` }">
                  <div class="bar-flare"></div>
                </div>
              </div>
              
              <div class="m-meta">
                <span class="step-count">{{ t('mod_step') || 'ШАГ' }} 0{{ step }} <span class="dim">/ 06</span></span>
              </div>

              <Transition name="fade" mode="out-in">
                <div :key="step" class="header-titles">
                  
                  <h2 class="m-headline" v-if="step === 1" v-html="formatHeadline(t('mod_choose_dir') || 'Выберите направление')"></h2>
                  
                  <h2 class="m-headline" v-else-if="step === 2" v-html="formatHeadline(t('mod_req_service') || 'Какая услуга нужна?')"></h2>
                  
                  <div v-else-if="step === 3">
                    <h2 class="m-headline" v-html="formatHeadline(t('mod_sel_plan') || 'Масштаб задачи')"></h2>
                    <p class="sub-text">{{ t('mod_cust_setup') || 'Детализация для:' }} <b>{{ t(serviceKeyMap[form.service]) || form.service }}</b></p>
                  </div>
                  
                  <h2 class="m-headline" v-else-if="step === 4" v-html="formatHeadline(t('mod_proj_det') || 'Детали проекта')"></h2>
                  
                  <h2 class="m-headline" v-else-if="step === 5" v-html="formatHeadline(t('mod_targ_inv') || 'Ориентировочный бюджет')"></h2>
                  
                  <div v-else-if="step === 6">
                    <h2 class="m-headline" v-html="formatHeadline(t('mod_fin_touch') || 'Финальный штрих')"></h2>
                    <div class="summary-chip" v-if="form.plan">
                      {{ t('mod_sel_plan_chip') || 'Выбрано:' }} <span class="silver-text">{{ t(serviceKeyMap[form.service]) || form.service }} / {{ selectedPlanLabel }}</span>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="m-body">
              <Transition name="fade" mode="out-in">
                <div :key="step" class="step-container" :class="{ 'is-step-4': step === 4 }">
                  
                  <!-- ШАГ 1: Выбор глобального направления -->
                  <div v-if="step === 1">
                    <div class="m-grid-cards">
                      <div
                        v-for="s in stacks"
                        :key="s"
                        @click="setStack(s)"
                        :class="['luxury-card', { active: form.stack === s }]"
                        role="button"
                      >
                        <span class="card-text">{{ t(stackKeyMap[s]) || s }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- ШАГ 2: Выбор конкретной услуги -->
                  <div v-else-if="step === 2">
                    <div class="m-grid-cards">
                      <div
                        v-for="item in services[form.stack]"
                        :key="item"
                        @click="setService(item)"
                        :class="['luxury-card', 'white-theme', { active: form.service === item }]"
                        role="button"
                      >
                        <span class="card-text">{{ t(serviceKeyMap[item]) || item }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- ШАГ 3: Выбор масштаба/тарифа -->
                  <div v-else-if="step === 3">
                    <div class="m-plans-list">
                      <div
                        v-for="(plan, idx) in currentServicePlans"
                        :key="plan.name"
                        @click="selectPlan(plan)"
                        :class="['plan-card-large', { active: form.plan === plan.name }]"
                        :style="{ transitionDelay: idx * 50 + 'ms' }"
                        role="button"
                      >
                        <div class="plan-info">
                          <span class="plan-badge">{{ t(plan.labelKey) }}</span>
                          <span class="plan-title">{{ t(plan.nameKey) }}</span>
                        </div>
                        <div class="plan-quote">
                          <span class="quote-main">{{ t('pr_quote') || 'ОБСУДИТЬ' }}</span>
                        </div>
                        <div class="card-glow"></div>
                      </div>
                    </div>
                  </div>

                  <!-- ШАГ 4: Специфичные вопросы по B2B (Сайты, Автоматизация, ИИ) -->
                  <div v-else-if="step === 4" class="step-4-wrapper">
                    
                    <div class="step-4-top">
                      <!-- Вопрос для Конверсионных сайтов -->
                      <div v-if="isWebStack" class="input-group" style="margin-bottom: 0;">
                        <label>{{ t('mod_have_design') || 'Есть ли у вас дизайн (макет в Figma)?' }}</label>
                        <div class="m-grid-cards">
                          <div v-for="opt in webDesignOptions" 
                               :key="opt.key" @click="form.webDesignStatus = opt.key" 
                               :class="['luxury-card', { active: form.webDesignStatus === opt.key }]" role="button">
                            <span class="card-text">{{ t(opt.key) || opt.def }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Вопрос для Автоматизации CRM -->
                      <div v-else-if="isAutoStack" class="input-group" style="margin-bottom: 0;">
                        <label>{{ t('mod_crm_base') || 'Где сейчас ведете базу клиентов?' }}</label>
                        <div class="m-grid-cards">
                          <div v-for="opt in crmOptions" 
                               :key="opt.key" @click="form.crmStatus = opt.key" 
                               :class="['luxury-card', { active: form.crmStatus === opt.key }]" role="button">
                            <span class="card-text">{{ t(opt.key) || opt.def }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Вопрос для AI-Ассистентов -->
                      <div v-else-if="isAIStack" class="input-group" style="margin-bottom: 0;">
                        <label>{{ t('mod_ai_data') || 'Есть ли готовые скрипты / база знаний для ИИ?' }}</label>
                        <div class="m-grid-cards">
                          <div v-for="opt in aiOptions" 
                               :key="opt.key" @click="form.aiDataStatus = opt.key" 
                               :class="['luxury-card', { active: form.aiDataStatus === opt.key }]" role="button">
                            <span class="card-text">{{ t(opt.key) || opt.def }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="input-group step-4-bottom">
                      <label for="refLinkInput">{{ t('mod_ref_link') || 'Ссылка на текущий сайт / соцсеть (необязательно)' }}</label>
                      <div class="input-wrapper">
                        <input id="refLinkInput" v-model="form.refLink" type="text" placeholder="https://instagram.com/..." autocomplete="off" class="luxury-input" />
                        <div class="input-line"></div>
                      </div>
                    </div>

                  </div>

                  <!-- ШАГ 5: Бюджет -->
                  <div v-else-if="step === 5">
                    <div class="input-group budget-group" style="margin-bottom: 0;">
                      <div class="input-header-flex">
                        <label>{{ t('mod_inv_range') || 'Комфортный бюджет проекта' }}</label>
                        <div class="currency-switcher">
                          <button type="button" :class="{ active: form.currency === 'USD' }" @click="form.currency = 'USD'">USD</button>
                          <button type="button" :class="{ active: form.currency === 'EUR' }" @click="form.currency = 'EUR'">EUR</button>
                        </div>
                      </div>

                      <div class="budget-wrapper luxury-input-group">
                        <span class="currency-symbol">{{ currencySymbol }}</span>
                        <input type="text" id="budgetInput" v-model="displayBudget" @input="handleBudgetInput" required placeholder="500" autocomplete="off" class="luxury-input budget-input" />
                        <div class="input-line"></div>
                      </div>
                    </div>
                  </div>

                  <!-- ШАГ 6: Контакты -->
                  <div v-else-if="step === 6">
                    <div class="messenger-selector">
                      <label class="selector-label">{{ t('mod_pref_msgr') || 'Куда прислать расчет?' }}</label>
                      <div class="messenger-grid">
                        <div v-for="(ms, idx) in messengers" :key="ms.name" @click="selectMessenger(ms.name)" :class="['ms-card', 'color-variant-' + idx, { active: form.messenger === ms.name }]" role="button">
                          <div class="ms-content">
                            <div class="ms-icon-wrapper" v-html="ms.icon"></div>
                            <span class="ms-name">{{ ms.name }}</span>
                          </div>
                          <div class="ms-border"></div>
                          <div class="ms-glow"></div>
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="input-group half">
                        <label for="userNameInput">{{ t('mod_ph_name') || 'Ваше имя' }}</label>
                        <div class="input-wrapper fixed-height">
                          <input id="userNameInput" v-model="form.name" type="text" placeholder="Иван" autocomplete="off" class="luxury-input" />
                          <div class="input-line"></div>
                        </div>
                      </div>

                      <div class="input-group half">
                        <label for="userContactInput">{{ contactLabel }}</label>
                        
                        <div v-if="form.messenger === 'WhatsApp'" class="phone-smart-wrapper fixed-height">
                          <div class="country-trigger" :class="{ active: isCountryOpen }" @click.stop="toggleCountryDropdown" role="button">
                            <span class="flag-text">{{ selectedCountry.code }}</span>
                            <span class="dial-code">{{ selectedCountry.dial_code }}</span>
                            <svg class="chevron" :class="{ rotated: isCountryOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </div>

                          <div class="input-wrapper phone-flex">
                            <input id="userContactInput" v-model="phoneBody" type="tel" placeholder="00 000 0000" autocomplete="off" class="luxury-input phone-input" @input="filterPhoneInput" />
                            <div class="input-line"></div>
                          </div>

                          <Transition name="dropdown-anim">
                            <div v-if="isCountryOpen" class="country-dropdown" @wheel.stop @touchmove.stop>
                              <div class="search-wrap">
                                <div class="search-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <input v-model="searchQuery" :placeholder="t('mod_find_country') || 'Search country...'" autocomplete="off" class="country-search" @click.stop ref="searchInput" />
                              </div>
                              <div class="country-list custom-scroll">
                                <div v-for="c in limitedCountries" :key="c.code" class="country-item" @click="selectCountry(c)">
                                  <span class="c-code-text">{{ c.code }}</span>
                                  <span class="c-name">{{ c.name }}</span>
                                  <span class="c-dial">{{ c.dial_code }}</span>
                                </div>
                              </div>
                            </div>
                          </Transition>
                        </div>

                        <div v-else class="input-wrapper fixed-height">
                          <input id="userContactInput" v-model="form.contact" type="text" :placeholder="contactPlaceholder" autocomplete="off" class="luxury-input" @input="handleContactInput" @blur="validateEmailOnBlur" />
                          <div class="input-line"></div>
                          <Transition name="fade">
                            <span v-if="form.messenger === 'Telegram' && form.contact.length > 0 && !form.contact.startsWith('@')" class="input-error">{{ t('mod_err_at') || 'Нужен символ @' }}</span>
                          </Transition>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ШАГ 7: Финиш -->
                  <div v-else-if="step === 7" class="success-screen step-wrapper center">
                    <div class="success-circle">
                      <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <div class="circle-pulse"></div>
                    </div>
                    <h2 class="m-headline small">{{ t('mod_succ_title') || 'Заявка принята' }}</h2>
                    <p class="success-msg">{{ t('mod_succ_desc') || 'Мы скоро свяжемся с вами через' }} <span class="silver-text">{{ form.messenger }}</span> {{ t('mod_succ_desc2') || 'для обсуждения деталей.' }}</p>
                    
                    <div class="m-receipt">
                      <div class="receipt-header">{{ t('mod_rec_head') || 'Детали запроса' }}</div>
                      <div class="receipt-row"><span class="label">{{ t('mod_rec_srv') || 'Услуга' }}</span><span class="value">{{ t(serviceKeyMap[form.service]) || form.service }}</span></div>
                      <div class="receipt-row highlight"><span class="label">{{ t('mod_rec_plan') || 'Тариф' }}</span><span class="value silver">{{ selectedPlanLabel }}</span></div>
                      <div class="receipt-row highlight">
                        <span class="label">{{ t('mod_rec_budg') || 'Бюджет' }}</span>
                        <span class="value silver">{{ displayBudget ? displayBudget + ' ' + form.currency : (t('mod_tbd') || 'По согласованию') }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Transition>
            </div>

            <div class="m-footer" v-if="step < 7">
              <button v-if="step > startStep" @click="goBack" class="btn-text-back">{{ t('mod_btn_back') || 'НАЗАД' }}</button>
              <div v-else></div>
              <button @click="handleNext" :disabled="!isValid || loading" class="btn-silver-action">
                <span class="btn-text">{{ step === 6 ? (loading ? (t('mod_btn_proc') || 'ОТПРАВКА...') : (t('mod_btn_sched') || 'ПОЛУЧИТЬ РАСЧЕТ')) : (t('mod_btn_next') || 'ДАЛЕЕ') }}</span>
                <div class="btn-shine-wrap"><div class="btn-shine"></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, onUnmounted } from "vue";
import { t } from '../composables/useLanguage'; 

const props = defineProps({
  isOpen: Boolean,
  initialStack: String,
  initialService: String,
  initialPlan: String
});

const emit = defineEmits(["close"]);

const formatHeadline = (text) => {
  if (!text) return '';
  const words = text.trim().split(' ');
  if (words.length <= 1) return text;
  const last = words.pop();
  return `${words.join(' ')} <span class="silver-text">${last}</span>`;
};

const step = ref(1);
const startStep = ref(1);
const loading = ref(false);
const isMobile = ref(false);

const isCountryOpen = ref(false);
const phoneBody = ref("");
const searchQuery = ref("");
const selectedCountry = ref({ name: "Ukraine", dial_code: "+380", code: "UA" });
const searchInput = ref(null);

const displayBudget = ref("");
const rawBudget = ref("");

const emailError = ref(false);
let unlockTimeout = null;

// Сокращенный список стран
const countries = [
  { name: "Australia", dial_code: "+61", code: "AU" }, { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Canada", dial_code: "+1", code: "CA" }, { name: "France", dial_code: "+33", code: "FR" },
  { name: "Germany", dial_code: "+49", code: "DE" }, { name: "Israel", dial_code: "+972", code: "IL" },
  { name: "Italy", dial_code: "+39", code: "IT" }, { name: "Poland", dial_code: "+48", code: "PL" }, 
  { name: "Spain", dial_code: "+34", code: "ES" }, { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Ukraine", dial_code: "+380", code: "UA" }, { name: "UAE", dial_code: "+971", code: "AE" }, 
  { name: "United Kingdom", dial_code: "+44", code: "GB" }, { name: "United States", dial_code: "+1", code: "US" }
];

// --- МАППИНГ КЛЮЧЕЙ ДЛЯ ПЕРЕВОДА ---
const stackKeyMap = {
  "Conversion Websites": "exp_card1_title",
  "Lead Automation": "exp_card2_title",
  "AI Assistants": "exp_card3_title"
};

const serviceKeyMap = {
  "Landing Page": "srv_opt_web_1",
  "Corporate Website": "srv_opt_web_2",
  "E-commerce": "srv_opt_web_3",
  "Social & CRM": "srv_opt_crm_1",
  "CRM from Scratch": "srv_opt_crm_2",
  "CRM Enhancement": "srv_opt_crm_3",
  "24/7 Bot": "srv_opt_ai_1",
  "AI Comm Bot": "srv_opt_ai_2",
  "Custom AI Solutions": "srv_opt_ai_3"
};

// --- Опции 4-го шага с оригинальными русскими фоллбеками ---
const webDesignOptions = [
  { key: 'mod_opt_figma', def: 'Да, готов к верстке' },
  { key: 'mod_opt_ref', def: 'Есть только референсы' },
  { key: 'mod_opt_scratch', def: 'Нужен дизайн с нуля' }
];

const crmOptions = [
  { key: 'mod_crm_none', def: 'Нигде / В тетрадке / Excel' },
  { key: 'mod_crm_exist', def: 'Есть CRM, нужна донастройка' },
  { key: 'mod_crm_custom', def: 'Самописная система' }
];

const aiOptions = [
  { key: 'mod_ai_ready', def: 'Да, всё прописано' },
  { key: 'mod_ai_partial', def: 'Есть частично (FAQ)' },
  { key: 'mod_ai_none', def: 'Нужно собирать с нуля' }
];

// --- СТРУКТУРА ДАННЫХ B2B ---
const stacks = ["Conversion Websites", "Lead Automation", "AI Assistants"];

const services = {
  "Conversion Websites": ["Landing Page", "Corporate Website", "E-commerce"],
  "Lead Automation": ["Social & CRM", "CRM from Scratch", "CRM Enhancement"],
  "AI Assistants": ["24/7 Bot", "AI Comm Bot", "Custom AI Solutions"]
};

// --- ТАРИФЫ ---
const defaultPlans = [
  { name: "Simple Project", labelKey: "pl_l_simp", nameKey: "pl_n_simp" }, 
  { name: "Medium Project", labelKey: "pl_l_med", nameKey: "pl_n_med" }, 
  { name: "Complex Project", labelKey: "pl_l_comp", nameKey: "pl_n_comp" },
  { name: "Large-Scale Project", labelKey: "pl_l_large", nameKey: "pl_n_large" }
];

const plansDatabase = { default: defaultPlans };

const messengers = [
  { name: "Telegram", icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>' },
  { name: "WhatsApp", icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.0357 2C6.51179 2 2.01786 6.49393 2.01786 12.0179C2.01786 13.7796 2.48125 15.5036 3.34732 17.0161L2 22L7.09821 20.6607C8.55625 21.5018 10.258 22.0179 12.0179 22.0179C17.5418 22.0179 22.0357 17.5239 22.0357 12C22.0357 6.49393 17.5418 2 12.0357 2ZM12.0357 20.1348C10.5071 20.1348 8.98393 19.7241 7.65089 18.9571L7.32946 18.7616L4.32143 19.5643L5.12411 16.5562L4.92857 16.2348C4.14375 14.8786 3.73304 13.3339 3.73304 11.7857C3.73304 7.20625 7.45446 3.48482 12.0357 3.48482C16.617 3.48482 20.3384 7.20625 20.3384 11.7857C20.3205 16.383 16.5991 20.1348 12.0357 20.1348ZM16.7946 14.558C16.5446 14.433 15.2946 13.8259 15.0625 13.7366C14.8304 13.6473 14.6696 13.6116 14.5089 13.8616C14.3482 14.1116 13.8839 14.6473 13.7411 14.8259C13.5982 14.9866 13.4554 15.0223 13.2054 14.8973C12.9554 14.7723 12.1518 14.5045 11.1875 13.6652C10.4554 13.0045 9.9375 12.2009 9.8125 11.9509C9.6875 11.7009 9.79464 11.5759 9.91964 11.4509C10.0268 11.3438 10.1696 11.1652 10.2946 11.0223C10.4196 10.8795 10.4732 10.7723 10.5446 10.6116C10.6161 10.4509 10.5804 10.3259 10.5268 10.2009C10.4732 10.0759 10.0089 8.95089 9.83036 8.48661C9.63393 8.04018 9.45536 8.11161 9.33036 8.11161C9.20536 8.11161 9.0625 8.11161 8.90179 8.11161C8.74107 8.11161 8.47321 8.18304 8.24107 8.43304C8.00893 8.68304 7.36607 9.29018 7.36607 10.5223C7.36607 11.7545 8.24107 12.9509 8.38393 13.1295C8.50893 13.308 10.0804 15.7366 12.4821 16.7723C13.0536 17.0223 13.4821 17.1652 13.8214 17.2723C14.3929 17.4509 14.9107 17.433 15.3214 17.3795C15.7857 17.308 16.7321 16.808 16.9286 16.2545C17.125 15.7009 17.125 15.2188 17.0714 15.1295C17.0179 15.0223 16.8839 14.9866 16.6518 14.8616L16.7946 14.558Z"/></svg>' },
  { name: "Email", icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>' },
];

const form = reactive({
  stack: "", service: "", plan: "", budget: "",
  webDesignStatus: "", crmStatus: "", aiDataStatus: "", refLink: "",
  contact: "@", name: "", messenger: "Telegram",
  currency: "USD"
});

// Проверки для 4 шага
const isWebStack = computed(() => form.stack === "Conversion Websites");
const isAutoStack = computed(() => form.stack === "Lead Automation");
const isAIStack = computed(() => form.stack === "AI Assistants");

const contactLabel = computed(() => form.messenger === 'WhatsApp' ? (t('mod_ph_phone') || 'Номер телефона') : (t('mod_ph_contact') || 'Ваш контакт'));
const contactPlaceholder = computed(() => form.messenger === "Telegram" ? "@username" : "email@example.com");

const currencySymbol = computed(() => {
  if (form.currency === 'EUR') return '€';
  return '$';
});

const limitedCountries = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return countries.filter(c => c.name.toLowerCase().includes(query) || c.dial_code.includes(query)).slice(0, 25);
});

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact));

const currentServicePlans = computed(() => plansDatabase[form.service] || plansDatabase["default"]);

const selectedPlanLabel = computed(() => {
  const planObj = currentServicePlans.value.find(p => p.name === form.plan);
  return planObj ? (t(planObj.nameKey) || form.plan) : form.plan;
});

const handleBudgetInput = (e) => {
  let val = e.target.value.replace(/\D/g, "");
  rawBudget.value = val;
  displayBudget.value = val ? new Intl.NumberFormat("en-US").format(val) : "";
};

const toggleCountryDropdown = () => {
  isCountryOpen.value = !isCountryOpen.value;
  if(isCountryOpen.value && !isMobile.value) {
    nextTick(() => searchInput.value?.focus({ preventScroll: true }));
  }
};

const selectCountry = (c) => {
  selectedCountry.value = c;
  isCountryOpen.value = false;
  searchQuery.value = "";
};

const filterPhoneInput = (e) => phoneBody.value = e.target.value.replace(/[^0-9]/g, '');

const selectMessenger = (name) => {
  form.messenger = name;
  form.contact = name === 'Telegram' ? '@' : '';
};

const handleContactInput = (e) => {
  if (form.messenger === 'Email') emailError.value = false;
  if (form.messenger === 'Telegram') {
    let val = e.target.value;
    form.contact = !val.startsWith('@') ? '@' + val.replace(/@/g, '') : (val === '' ? '@' : val);
  }
};

const validateEmailOnBlur = () => {
  if (form.messenger === 'Email' && form.contact.length > 0) {
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) emailError.value = true;
  }
};

watch(() => form.messenger, (newVal) => {
  form.contact = newVal === 'Telegram' ? "@" : "";
  phoneBody.value = "";
  emailError.value = false;
});

const setStack = (s) => form.stack = s;
const setService = (s) => form.service = s;

const selectPlan = (plan) => {
  form.plan = plan.name;
  displayBudget.value = "";
  rawBudget.value = "";
};

const goBack = () => { if (step.value > startStep.value) step.value--; };
const handleNext = () => step.value === 6 ? send() : step.value++;
const handleCloseClick = () => isCountryOpen.value = false;

const lockTouch = (e) => {
  if (isMobile.value && !e.target.closest('.country-dropdown') && !e.target.closest('.m-content')) {
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();
  }
};

const toggleAppVisibility = (hide) => {
  if (!isMobile.value) return;
  document.body.style.backgroundColor = hide ? '#000000' : '';
};

const clearScrollLock = () => {
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overscroll-behavior');
  document.body.style.removeProperty('overscroll-behavior');
};

onMounted(() => {
  isMobile.value = window.innerWidth < 1024;
  window.addEventListener('click', handleCloseClick);
});

onUnmounted(() => {
  if (unlockTimeout) clearTimeout(unlockTimeout);
  window.removeEventListener('click', handleCloseClick);
  document.removeEventListener('touchmove', lockTouch);
  if (window.lenis) window.lenis.start();
  clearScrollLock();
  toggleAppVisibility(false);
});

watch(() => props.isOpen, (open) => {
  if (unlockTimeout) {
    clearTimeout(unlockTimeout);
    unlockTimeout = null;
  }

  if (open) {
    if (window.lenis) window.lenis.stop();
    
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');
    document.documentElement.style.setProperty('overscroll-behavior', 'none', 'important');
    document.body.style.setProperty('overscroll-behavior', 'none', 'important');
    
    toggleAppVisibility(true);
    document.addEventListener('touchmove', lockTouch, { passive: false });

    // Reset Form
    Object.assign(form, { webDesignStatus: "", crmStatus: "", aiDataStatus: "", refLink: "", name: "", currency: "USD" });
    phoneBody.value = ""; displayBudget.value = ""; rawBudget.value = ""; emailError.value = false;
    form.contact = form.messenger === 'Telegram' ? "@" : "";
    
    // Подхватываем данные напрямую
    form.stack = props.initialStack || "";
    form.service = props.initialService || "";
    form.plan = props.initialPlan || "";

    if (form.plan && form.service) { step.value = 4; startStep.value = 4; }
    else if (form.service) { step.value = 3; startStep.value = 3; }
    else if (form.stack) { step.value = 2; startStep.value = 2; }
    else { step.value = 1; startStep.value = 1; }

  } else {
    toggleAppVisibility(false);
    unlockTimeout = setTimeout(() => {
      clearScrollLock();
      if (window.lenis) window.lenis.start();
      document.removeEventListener('touchmove', lockTouch);
    }, 200);
  }
}, { immediate: true });

const isValid = computed(() => {
  if (step.value === 1) return !!form.stack;
  if (step.value === 2) return !!form.service;
  if (step.value === 3) return !!form.plan;
  if (step.value === 4) {
    if (isWebStack.value) return !!form.webDesignStatus;
    if (isAutoStack.value) return !!form.crmStatus;
    if (isAIStack.value) return !!form.aiDataStatus;
  }
  if (step.value === 5) return rawBudget.value !== ""; 
  
  if (step.value === 6) {
    if (!form.name || form.name.trim().length < 2) return false;
    if (form.messenger === 'WhatsApp') {
        const digitsOnly = phoneBody.value.replace(/\D/g, '');
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
    if (form.messenger === 'Telegram') return form.contact.startsWith('@') && form.contact.length > 2;
    if (form.messenger === 'Email') return isEmailValid.value;
    return form.contact.length > 3;
  }
  return true;
});

// Хелпер для Telegram-отправки (чтобы вытягивать русский текст, если перевода нет)
const getFallback = (options, key) => {
  const opt = options.find(o => o.key === key);
  return opt ? opt.def : key;
};

const send = async () => {
  loading.value = true;
  
  let techInfo = "";
  if (isWebStack.value) techInfo = `📐 Дизайн: ${t(form.webDesignStatus) || getFallback(webDesignOptions, form.webDesignStatus)}`;
  else if (isAutoStack.value) techInfo = `📊 База CRM: ${t(form.crmStatus) || getFallback(crmOptions, form.crmStatus)}`;
  else if (isAIStack.value) techInfo = `🧠 Данные ИИ: ${t(form.aiDataStatus) || getFallback(aiOptions, form.aiDataStatus)}`;
  
  let finalContact = form.messenger === 'WhatsApp' ? `${selectedCountry.value.dial_code} ${phoneBody.value}` : form.contact;
  const finalBudgetVal = displayBudget.value ? `${displayBudget.value} ${form.currency}` : (t('mod_tbd') || "По согласованию");
  
  const localizedStack = t(stackKeyMap[form.stack]) || form.stack;
  const localizedService = t(serviceKeyMap[form.service]) || form.service;

  const text = `💎 *NEW B2B LEAD*\n--------------------\n👤 ${form.name}\n📞 ${finalContact} (${form.messenger})\n--------------------\n🛠 ${localizedStack}\n📌 ${localizedService}\n💎 Тариф: ${selectedPlanLabel.value} (${form.plan})\n💰 Ожидаемый бюджет: ${finalBudgetVal}\n${techInfo}\n🔗 Ссылка: ${form.refLink || 'Нет'}`;
                
  try {
    const response = await fetch('/api/send-telegram', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      step.value = 7;
    } else {
      throw new Error(result.error || 'Failed to send');
    }
  } catch(e) {
    alert("Ошибка соединения. Пожалуйста, попробуйте еще раз.");
  } finally { 
    loading.value = false; 
  }
};
</script>

<style scoped>
/* ВЕСЬ СТИЛЬ ОСТАВЛЯЕМ БЕЗ ИЗМЕНЕНИЙ — ОН ИДЕАЛЕН */
.m-window, .m-window * { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: optimizeLegibility !important; }
.m-overlay { position: fixed; inset: 0; width: 100vw; height: 100vh; height: 100dvh; z-index: 999999; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; padding: 20px; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); will-change: opacity; overscroll-behavior: none; }
.m-window { width: 100%; max-width: 640px; background: #000000; border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.1); position: relative; overflow: hidden; padding: 40px 50px; font-family: "Plus Jakarta Sans", sans-serif; max-height: 95vh; display: flex; flex-direction: column; transform: translate3d(0, 0, 0); backface-visibility: hidden; min-height: 500px; }
.m-close-text { position: absolute; top: 40px; left: 50px; background: transparent; border: none; color: #aaaaaa; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: color 0.3s ease; z-index: 20; padding: 0; font-family: inherit; }
.m-close-text .back-arrow { width: 18px; height: 18px; transition: transform 0.3s ease; }
.m-content { overflow-y: auto; overflow-x: hidden; flex: 1; width: 100%; -webkit-overflow-scrolling: touch; scrollbar-gutter: stable; overscroll-behavior-y: contain; display: flex; flex-direction: column; }
.m-content::-webkit-scrollbar { width: 0px; display: none; }
.step-container { width: 100%; box-sizing: border-box; }
.m-header { margin-top: auto; margin-bottom: 30px; position: relative; z-index: 2; flex-shrink: 0; padding-top: 15px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.m-progress-track { display: none; }
.m-meta { display: flex; justify-content: center; margin-top: 0; margin-bottom: 8px; font-size: 13px; letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700; color: #777; width: 100%; }
.header-titles { margin-top: 4px; width: 100%; text-align: center; }
.m-headline { font-size: 34px; color: #ffffff; font-weight: 700; letter-spacing: -1.2px; line-height: 1.1; text-align: center; }
.m-headline :deep(.silver-text) { background: none; -webkit-background-clip: unset; -webkit-text-fill-color: #ffffff; color: #ffffff; }
.m-headline.small { font-size: 28px; margin-bottom: 15px; }
.silver-text { background: none; -webkit-background-clip: unset; -webkit-text-fill-color: #ffffff; color: #ffffff; }
.sub-text { font-size: 15px; color: #aaaaaa; margin-top: 8px; margin-bottom: 25px; line-height: 1.5; text-align: center; }
.sub-text b { color: #ffffff; font-weight: 600; margin: 0 5px; }
.summary-chip { font-size: 15px; color: #aaaaaa; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }
.m-body { margin-bottom: auto; }
.step-4-wrapper { display: flex; flex-direction: column; }
.step-4-bottom { margin-top: 35px; }
.m-grid-cards { display: grid; grid-template-columns: 1fr; gap: 16px; }
.luxury-card { position: relative; padding: 25px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; cursor: pointer; transition: all 0.4s ease; display: flex; align-items: center; justify-content: center; transform: translate3d(0, 0, 0); backface-visibility: hidden; text-align: center; }
.luxury-card .card-text { position: relative; z-index: 2; font-size: 18px; color: #E5E4E2; font-weight: 600; transition: 0.3s; }
.luxury-card.active { border-color: #ffffff; background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 80%); }
.luxury-card.active .card-text { color: #ffffff; font-weight: 700; }
.luxury-card.white-theme.active { border-color: #ffffff; background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 80%); }
.luxury-card.white-theme.active .card-text { color: #ffffff; font-weight: 700; }
.m-plans-list { display: flex; flex-direction: column; gap: 12px; }
.plan-card-large { display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; cursor: pointer; position: relative; transition: 0.3s ease; transform: translate3d(0, 0, 0); backface-visibility: hidden; }
.plan-card-large.active { border-color: #ffffff; background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 80%); }
.plan-card-large.active .card-glow { opacity: 1; }
.plan-quote { display: flex; flex-direction: column; align-items: flex-end; text-align: right; gap: 4px; position: relative; z-index: 2; }
.quote-main { font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #FFFFFF; transition: 0.3s; }
.plan-card-large.active .quote-main { color: #ffffff; }
.plan-info { display: flex; flex-direction: column; gap: 6px; }
.plan-badge { font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #E5E4E2; }
.plan-title { font-size: 20px; font-weight: 700; color: #fff; }
.card-glow { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent); opacity: 0; transition: 0.5s; pointer-events: none; border-radius: inherit; }
.input-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
.input-header-flex label { margin-bottom: 0; }
.currency-switcher { display: inline-flex; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 4px; gap: 2px; }
.currency-switcher button { background: transparent; border: none; color: #888; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; padding: 8px 18px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; outline: none; }
.currency-switcher button.active { background: rgba(255, 255, 255, 0.15); color: #ffffff; }
.currency-switcher button:hover:not(.active) { color: #fff; background: rgba(255, 255, 255, 0.05); }
.luxury-input-group { position: relative; width: 100%; display: flex; align-items: center; transform: translate3d(0, 0, 0); }
.budget-wrapper { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); padding: 0 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
.budget-wrapper:focus-within { border-color: rgba(255, 255, 255, 0.5); }
.currency-symbol { width: 30px; font-size: 20px; color: #ffffff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.budget-input { font-family: "Plus Jakarta Sans", sans-serif !important; font-size: 18px !important; font-weight: 600 !important; letter-spacing: 0.5px; color: #fff !important; border: none !important; padding: 14px 0 !important; flex: 1; }
.budget-input:focus { border: none !important; }
.budget-input::placeholder { color: rgba(255, 255, 255, 0.25) !important; font-weight: 400; font-family: "Plus Jakarta Sans", sans-serif; font-size: 16px;}
.messenger-selector { margin-bottom: 35px; }
.selector-label { display: block; font-size: 13px; text-transform: uppercase; color: #C4C4C4; letter-spacing: 1.2px; font-weight: 700; margin-bottom: 16px; }
.messenger-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.ms-card { position: relative; background: rgba(15, 15, 15, 0.6); border-radius: 16px; cursor: pointer; height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.05); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); transform: translate3d(0, 0, 0); }
.ms-card.color-variant-0 { --theme: #0088cc; }
.ms-card.color-variant-1 { --theme: #25d366; }
.ms-card.color-variant-2 { --theme: #ffffff; }
.ms-card .ms-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ms-card .ms-icon-wrapper { width: 28px; height: 28px; color: #E5E4E2; transition: all 0.4s ease; }
.ms-card .ms-icon-wrapper svg { width: 100%; height: 100%; }
.ms-card .ms-name { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #E5E4E2; transition: all 0.4s ease; }
.ms-card .ms-border { position: absolute; inset: 0; border-radius: inherit; padding: 2px; background: linear-gradient(135deg, var(--theme), transparent 60%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.4s ease; }
.ms-card .ms-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 100%, var(--theme), transparent 70%); opacity: 0; filter: blur(20px); transition: opacity 0.4s ease; pointer-events: none; }
.ms-card.active { transform: translateY(-2px); border-color: var(--theme); background: linear-gradient(165deg, rgba(20,20,20,0.9), rgba(0,0,0,0.95)); }
.ms-card.active .ms-border { opacity: 1; }
.ms-card.active .ms-glow { opacity: 0.5; }
.ms-card.active .ms-icon-wrapper { color: var(--theme); transform: translateY(-2px); }
.ms-card.active .ms-name { color: #fff; }
.input-group { margin-bottom: 25px; position: relative; }
.input-group label { display: block; font-size: 13px; text-transform: uppercase; color: #C4C4C4; letter-spacing: 1.2px; font-weight: 700; margin-bottom: 12px; }
.form-row { display: flex; gap: 30px; align-items: flex-start; }
.input-group.half { width: 50%; }
.fixed-height { height: 48px; display: flex; align-items: flex-end; position: relative; }
.input-wrapper { position: relative; width: 100%; }
.luxury-input { width: 100%; background: transparent; border: none; padding: 0 0 8px 0; color: #fff; font-size: 18px; font-weight: 500; outline: none; border-bottom: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s; }
.luxury-input::placeholder { color: #444; font-weight: 400; transition: color 0.3s; }
.luxury-input:focus { border-bottom-color: #ffffff; }
.luxury-input:focus::placeholder { color: #666; }
.input-error { position: absolute; bottom: -20px; left: 0; font-size: 11px; color: #ff4444; font-weight: 600; letter-spacing: 0.5px; }
.luxury-input:-webkit-autofill, .luxury-input:-webkit-autofill:hover, .luxury-input:-webkit-autofill:focus, .luxury-input:-webkit-autofill:active{ -webkit-text-fill-color: #fff !important; transition: background-color 5000s ease-in-out 0s; }
.phone-smart-wrapper { display: flex; gap: 10px; position: relative; align-items: flex-end;}
.phone-flex { flex: 1; display: flex; align-items: flex-end;}
.country-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; background: rgba(255,255,255,0.04); padding: 0 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; height: 40px; min-width: 110px; position: relative; margin-bottom: 2px; }
.country-trigger.active { background: rgba(255,255,255,0.08); border-color: rgba(255, 255, 255, 0.5); }
.flag-text { font-weight: 800; font-size: 14px; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
.dial-code { font-weight: 500; color: #ccc; font-size: 14px; letter-spacing: 0.5px; }
.chevron { width: 14px; margin-left: auto; color: #666; transition: 0.3s; }
.country-trigger.active .chevron { color: #ffffff; transform: rotate(180deg); }
.phone-input { font-family: monospace; letter-spacing: 1px; font-size: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important; padding-bottom: 10px !important;}
.country-search { width: 100%; background: transparent; border: none; color: #fff; font-size: 16px; outline: none; }
.country-search::placeholder { color: #444; }
.country-dropdown { position: absolute; bottom: calc(100% + 8px); right: 0; width: 320px; background: rgba(0, 0, 0, 0.98); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; display: flex; flex-direction: column; max-height: 260px; overflow: hidden; z-index: 99999; transform-origin: bottom right; }
.search-wrap { padding: 12px 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.search-icon { width: 14px; color: #555; }
.country-list { overflow-y: auto; flex: 1; min-height: 0; padding: 5px 0; overscroll-behavior: contain; }
.country-list::-webkit-scrollbar { width: 4px; }
.country-list::-webkit-scrollbar-track { background: transparent; }
.country-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 4px; }
.country-list::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.6); }
.country-item { display: flex; align-items: center; gap: 15px; padding: 10px 20px; cursor: pointer; transition: all 0.2s ease; }
.c-code-text { font-weight: 800; font-size: 12px; color: #E5E4E2; width: 25px; }
.c-name { flex: 1; font-size: 13px; color: #ccc; font-weight: 500; }
.c-dial { color: #666; font-size: 12px; font-weight: 700; opacity: 0.8; }
.no-results { padding: 20px; text-align: center; color: #555; font-size: 13px; }
.m-footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; padding-bottom: 15px; transform: translate3d(0, 0, 0);}
.btn-text-back { background: none; border: none; color: #E5E4E2; font-weight: 700; text-transform: uppercase; font-size: 14px; letter-spacing: 1.5px; cursor: pointer; transition: 0.3s; padding: 10px 20px; }
.btn-silver-action { position: relative; background: linear-gradient(135deg, #ffffff, #a0a0a0); border: none; padding: 18px 42px; border-radius: 100px; cursor: pointer; transition: 0.4s; transform: translate3d(0, 0, 0);}
.btn-silver-action .btn-text { color: #000; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 1.5px; position: relative; z-index: 2; }
.btn-shine-wrap { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; }
.btn-shine { position: absolute; top: 0; left: 0; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent); transform: skewX(-20deg) translate3d(-250%, 0, 0); }
.btn-silver-action:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.success-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0; text-align: center; transform: translate3d(0, 0, 0);}
.success-circle { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 30px; color: #ffffff; }
.check-icon { width: 40px; height: 40px; }
.success-msg { color: #aaaaaa; font-size: 16px; line-height: 1.6; max-width: 450px; margin-top: 15px; margin-bottom: 30px; }
.m-receipt { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 30px; margin-top: 15px; backdrop-filter: blur(10px); animation: enter-receipt 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards; transform: translate3d(0, 0, 0);}
.receipt-header { font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 20px; text-align: left; }
.receipt-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 15px; }
.receipt-row .label { color: #aaaaaa; font-weight: 500; }
.receipt-row .value { color: #E5E4E2; font-weight: 700; text-align: right; }
.receipt-row.highlight .value.silver { color: #ffffff; }

@keyframes enter-receipt { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
.modal-luxury-enter-active, .modal-luxury-leave-active { transition: opacity 0.15s ease-out; }
.modal-luxury-enter-from, .modal-luxury-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease-in-out; }
.slide-up-enter-from, .slide-up-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
.dropdown-anim-enter-active, .dropdown-anim-leave-active { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s; }
.dropdown-anim-enter-from, .dropdown-anim-leave-to { opacity: 0; transform: translateY(10px) scale(0.98); }

@media (hover: hover) and (pointer: fine) {
  .m-close-text:hover { color: #ffffff; }
  .m-close-text:hover .back-arrow { transform: translateX(-5px); }
  .luxury-card:not(.active):hover { border-color: rgba(255, 255, 255, 0.2); transform: translateY(-3px) translate3d(0, 0, 0); background: rgba(255, 255, 255, 0.05); }
  .plan-card-large:not(.active):hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.3); transform: translateY(-2px) translate3d(0, 0, 0); }
  .ms-card:not(.active):hover { transform: translateY(-3px) translate3d(0, 0, 0); border-color: rgba(255,255,255,0.1); background: rgba(25,25,25,0.9); }
  .ms-card:not(.active):hover .ms-border { opacity: 0.5; }
  .country-trigger:hover { background: rgba(255,255,255,0.08); border-color: rgba(255, 255, 255, 0.5); }
  .country-item:hover { background: linear-gradient(90deg, rgba(255, 255, 255, 0.15), transparent); padding-left: 25px; }
  .btn-text-back:hover { color: #fff; }
  .btn-silver-action:not(:disabled):hover { transform: translateY(-2px) translate3d(0, 0, 0); }
  .btn-silver-action:not(:disabled):hover .btn-shine { transform: skewX(-20deg) translate3d(300%, 0, 0); transition: transform 0.7s; }
}

@media (max-height: 900px) and (min-width: 768px) {
  .m-window { padding: 30px 40px !important; }
  .m-close-text { top: 30px; left: 40px; }
  .m-header { margin-bottom: 20px !important; padding-top: 10px !important; margin-top: 20px !important; }
  .m-headline { font-size: 32px !important; margin-bottom: 15px !important; }
  .sub-text { margin-top: -10px !important; margin-bottom: 15px !important; }
  .m-plans-list { gap: 8px !important; }
  .plan-card-large { padding: 15px 20px !important; }
  .ms-card { height: 75px !important; }
  .ms-icon-wrapper { width: 24px !important; height: 24px !important; }
  .input-group { margin-bottom: 18px !important;}
  .currency-symbol { font-size: 18px !important;}
  .budget-input { font-size: 18px !important; padding: 8px 0 !important;}
  .ms-icon-wrapper svg { width: 24px; height: 24px;}
  .m-footer { margin-top: 25px !important; }
  .btn-silver-action { padding: 15px 35px !important; }
}

@media (max-width: 767px) {
  .m-overlay { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; background: #000000 !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important; padding: 0 !important; overscroll-behavior: none !important; transform: none !important; -webkit-transform: none !important; z-index: 999999 !important; }
  .m-window { border-radius: 0 !important; border: none !important; padding: 0 !important; width: 100% !important; height: 100dvh !important; max-height: 100dvh !important; display: flex; flex-direction: column; background: #000000 !important; overscroll-behavior: none !important; position: relative !important; z-index: 1 !important; transform: none !important; -webkit-transform: none !important; }
  .m-close-text { position: absolute !important; top: 24px !important; left: 20px !important; font-size: 11px !important; }
  .m-close-text .back-arrow { width: 16px !important; height: 16px !important; }
  .m-content { padding: 70px 20px 20px 20px !important; overflow-y: auto !important; display: flex !important; flex-direction: column !important; flex: 1 1 auto !important; min-height: 0 !important; justify-content: flex-start !important; }
  .m-progress-track { display: none !important; }
  .m-header { margin-top: auto !important; margin-bottom: 24px !important; padding-top: 0 !important; flex-shrink: 0; text-align: center !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
  .m-meta { justify-content: center !important; margin-top: 0 !important; margin-bottom: 8px !important; width: 100% !important; }
  .header-titles { width: 100% !important; text-align: center !important; }
  .m-headline { text-align: center !important; font-size: 28px !important; line-height: 1.1 !important; }
  .sub-text { text-align: center !important; font-size: 14px !important; margin-top: 8px !important; margin-bottom: 15px !important; }
  .summary-chip { text-align: center !important; display: flex !important; justify-content: center !important; flex-wrap: wrap !important; gap: 6px !important; }
  .m-body { display: flex !important; flex-direction: column !important; flex: 0 0 auto !important; margin-bottom: auto !important; padding: 10px 0 !important; }
  .step-container { width: 100% !important; display: flex !important; flex-direction: column !important; flex: 0 0 auto !important; justify-content: flex-start !important; }
  .step-container.is-step-4 { justify-content: flex-start !important; }
  .step-4-wrapper { display: flex !important; flex-direction: column !important; flex: 0 0 auto !important; min-height: auto !important; }
  .m-grid-cards { gap: 16px !important; }
  .m-plans-list { gap: 16px !important; }
  .luxury-card { padding: 18px !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 60px !important; border-radius: 14px !important; background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; }
  .luxury-card .card-text { font-size: 15px !important; color: rgba(255, 255, 255, 0.75) !important; font-weight: 500 !important; }
  .luxury-card.active, .luxury-card.white-theme.active, .plan-card-large.active { border: 1px solid #ffffff !important; background: #080808 !important; }
  .luxury-card.active .card-text, .luxury-card.white-theme.active .card-text { color: #ffffff !important; font-weight: 700 !important; }
  .plan-card-large { padding: 16px 20px !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; border-radius: 14px !important; }
  .plan-info { gap: 2px !important; }
  .plan-title { font-size: 16px !important; }
  .plan-badge { font-size: 10px !important; }
  .plan-quote { text-align: right !important; margin-top: 0 !important; }
  .quote-main { font-size: 12px !important; }
  .messenger-selector { margin-bottom: 24px !important; }
  .input-group { margin-bottom: 12px !important; margin-top: 0 !important; }
  .input-group label { margin-bottom: 8px !important; font-size: 11px !important; }
  .form-row { flex-direction: column !important; gap: 24px !important; }
  .input-group.half { width: 100% !important; }
  .input-group.step-4-bottom { margin-top: 35px !important; margin-bottom: 0 !important; }
  .currency-switcher { width: 100%; display: flex; background: rgba(10, 10, 10, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; }
  .currency-switcher button { flex: 1; padding: 10px 0 !important; font-size: 13px !important; font-weight: 700 !important; color: rgba(255, 255, 255, 0.35) !important; transition: all 0.3s ease !important; }
  .currency-switcher button.active { background: rgba(255, 255, 255, 0.15) !important; color: #ffffff !important; border-radius: 8px !important; }
  .budget-wrapper { height: 48px !important; padding: 0 15px !important; background: rgba(10, 10, 10, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; margin-top: 10px !important; }
  .budget-wrapper:focus-within { border-color: rgba(255, 255, 255, 0.9) !important; }
  .country-trigger { width: auto !important; min-width: 105px !important; height: 48px !important; padding: 0 12px !important; margin-bottom: 0 !important; background: rgba(10, 10, 10, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important; border-radius: 12px !important; }
  .country-trigger.active { border-color: rgba(255, 255, 255, 0.9) !important; }
  .messenger-grid { gap: 8px !important; }
  .ms-card { height: 60px !important; }
  .ms-icon-wrapper svg { width: 20px !important; height: 20px !important; }
  .ms-name { font-size: 9px !important; letter-spacing: 1px; }
  .fixed-height { height: 48px !important; margin-bottom: 0 !important; flex-direction: row !important; align-items: flex-end !important; }
  .luxury-input, .budget-input, .phone-input { font-size: 18px !important; padding-bottom: 12px !important; touch-action: manipulation !important; }
  .country-search { font-size: 16px !important; touch-action: manipulation !important; }
  .currency-symbol { font-size: 18px !important; }
  .phone-smart-wrapper { width: 100%; gap: 10px !important; flex-direction: row !important; }
  .flag-text, .dial-code { font-size: 13px !important; }
  .m-footer { flex-direction: column-reverse !important; gap: 10px !important; padding-bottom: 0 !important; margin-top: 0 !important; padding-top: 25px !important; flex-shrink: 0 !important; }
  .btn-silver-action { width: 100% !important; text-align: center !important; padding: 15px !important; border-radius: 12px !important; }
  .btn-silver-action .btn-text { font-size: 14px !important; }
  .btn-text-back { width: 100% !important; text-align: center !important; padding: 12px !important; font-size: 13px !important; background: transparent !important; }
  .country-dropdown { width: calc(100vw - 40px) !important; bottom: calc(100% + 8px) !important; top: auto !important; transform-origin: bottom right !important; right: 0 !important; position: absolute !important; max-height: 220px !important; touch-action: pan-y !important; }
}

@media (max-width: 767px) and (max-height: 700px) {
  .m-close-text { top: 18px !important; left: 16px !important; }
  .m-content { padding-top: 60px !important; }
  .m-header { margin-bottom: 12px !important; }
  .m-headline { font-size: 24px !important; }
  .m-grid-cards, .m-plans-list { gap: 16px !important; }
  .plan-card-large { padding: 10px 14px !important; }
  .ms-card { height: 55px !important; }
  .fixed-height { height: 48px !important; }
  .input-group { margin-bottom: 10px !important; }
  .btn-silver-action { padding: 12px !important; }
  .m-footer { padding-top: 15px !important; gap: 8px !important; }
}
</style>