<template>
  <Teleport to="body">
    <Transition name="modal-luxury">
      <div v-if="isOpen" class="m-overlay" @click.self="$emit('close')">
        <div class="m-window">
          <!-- CLOSE MODAL BUTTON -->
          <button
            type="button"
            class="m-close-text"
            :aria-label="t('port_back')"
            @click="$emit('close')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="back-arrow"
            >
              <line x1="20" y1="12" x2="4" y2="12"></line>
              <polyline points="10 18 4 12 10 6"></polyline>
            </svg>
            {{ t('port_back') }}
          </button>

          <div class="m-content">
            <!-- STEP HEADER -->
            <div v-if="step < 5" class="m-header">
              <div class="m-meta">
                <span class="step-count">
                  {{ t('mod_step') }} 0{{ step }} <span class="dim">/ 04</span>
                </span>
              </div>

              <Transition name="fade" mode="out-in">
                <div :key="step" class="header-titles">
                  <h2 v-if="step === 1" class="m-headline">
                    {{ t('mod_choose_design') }}
                  </h2>

                  <div v-else-if="step === 2">
                    <h2 class="m-headline">{{ t('mod_sel_plan') }}</h2>
                    <p class="sub-text">
                      {{ t('mod_cust_setup') }} <b>{{ selectedDesignLabel }}</b>
                    </p>
                  </div>

                  <h2 v-else-if="step === 3" class="m-headline">
                    {{ t('mod_proj_det') }}
                  </h2>

                  <div v-else-if="step === 4">
                    <h2 class="m-headline">{{ t('mod_fin_touch') }}</h2>
                    <div v-if="form.plan" class="summary-chip">
                      {{ t('mod_sel_plan_chip') }}
                      <span class="silver-text">{{ selectedPlanLabel }} / {{ selectedDesignLabel }}</span>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- STEP BODY -->
            <div class="m-body">
              <Transition name="fade" mode="out-in">
                <div :key="step" class="step-container">
                  <!-- STEP 1: CHOOSE DEVELOPMENT TYPE -->
                  <div v-if="step === 1" class="m-grid-cards">
                    <div
                      v-for="opt in designOptions"
                      :key="opt.key"
                      role="button"
                      :class="['luxury-card', 'design-card', { active: form.designType === opt.key }]"
                      @click="form.designType = opt.key"
                    >
                      <div class="card-text-wrapper">
                        <span class="card-title">{{ t(opt.titleKey) }}</span>
                        <span class="card-desc">{{ t(opt.descKey) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- STEP 2: CHOOSE PROJECT SCALE AND PRICING -->
                  <div v-else-if="step === 2" class="m-plans-list">
                    <div
                      v-for="(plan, idx) in computedPlans"
                      :key="plan.name"
                      role="button"
                      :class="['plan-card-large', { active: form.plan === plan.name }]"
                      :style="{ transitionDelay: idx * 50 + 'ms' }"
                      @click="form.plan = plan.name"
                    >
                      <div class="plan-info">
                        <span class="plan-badge">{{ t(plan.labelKey) }}</span>
                        <span class="plan-title">{{ t(plan.nameKey) }}</span>
                      </div>
                      <div class="plan-quote">
                        <span class="quote-main">{{ plan.priceRange }}</span>
                      </div>
                      <div class="card-glow"></div>
                    </div>
                  </div>

                  <!-- STEP 3: OPTIONAL REFERENCE LINK -->
                  <div v-else-if="step === 3" class="step-4-wrapper">
                    <div class="input-group step-4-bottom">
                      <label for="refLinkInput">{{ t('mod_ref_link') }}</label>
                      <div class="input-wrapper">
                        <input
                          id="refLinkInput"
                          v-model="form.refLink"
                          type="text"
                          placeholder="https://..."
                          autocomplete="off"
                          class="luxury-input"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- STEP 4: MESSENGER AND CONTACT DETAILS -->
                  <div v-else-if="step === 4">
                    <div class="messenger-selector">
                      <label class="selector-label">{{ t('mod_pref_msgr') }}</label>
                      <div class="messenger-grid">
                        <div
                          v-for="(ms, idx) in messengers"
                          :key="ms.name"
                          role="button"
                          :class="['ms-card', 'color-variant-' + idx, { active: form.messenger === ms.name }]"
                          @click="selectMessenger(ms.name)"
                        >
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
                        <label for="userNameInput">{{ t('mod_ph_name') }}</label>
                        <div class="input-wrapper fixed-height">
                          <input
                            id="userNameInput"
                            v-model="form.name"
                            type="text"
                            :placeholder="t('mod_ph_name_ex')"
                            autocomplete="off"
                            class="luxury-input"
                          />
                        </div>
                      </div>

                      <div class="input-group half">
                        <label for="userContactInput">{{ contactLabel }}</label>

                        <!-- WHATSAPP PHONE WITH COUNTRY PICKER -->
                        <div v-if="form.messenger === 'WhatsApp'" class="phone-smart-wrapper fixed-height">
                          <div
                            role="button"
                            class="country-trigger"
                            :class="{ active: isCountryOpen }"
                            @click.stop="toggleCountryDropdown"
                          >
                            <span class="flag-text">{{ selectedCountry.code }}</span>
                            <span class="dial-code">{{ selectedCountry.dial_code }}</span>
                            <svg
                              class="chevron"
                              :class="{ rotated: isCountryOpen }"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>

                          <div class="input-wrapper phone-flex">
                            <input
                              id="userContactInput"
                              v-model="phoneBody"
                              type="tel"
                              placeholder="00 000 0000"
                              autocomplete="off"
                              class="luxury-input phone-input"
                              @input="filterPhoneInput"
                            />
                          </div>

                          <Transition name="dropdown-anim">
                            <div v-if="isCountryOpen" class="country-dropdown" @wheel.stop @touchmove.stop>
                              <div class="search-wrap">
                                <div class="search-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                  </svg>
                                </div>
                                <input
                                  ref="searchInput"
                                  v-model="searchQuery"
                                  :placeholder="t('mod_find_country')"
                                  autocomplete="off"
                                  class="country-search"
                                  @click.stop
                                />
                              </div>
                              <div class="country-list">
                                <div
                                  v-for="c in filteredCountries"
                                  :key="c.code"
                                  class="country-item"
                                  @click="selectCountry(c)"
                                >
                                  <span class="c-code-text">{{ c.code }}</span>
                                  <span class="c-name">{{ c.name }}</span>
                                  <span class="c-dial">{{ c.dial_code }}</span>
                                </div>
                              </div>
                            </div>
                          </Transition>
                        </div>

                        <!-- TELEGRAM OR EMAIL INPUT -->
                        <div v-else class="input-wrapper fixed-height">
                          <input
                            id="userContactInput"
                            v-model="form.contact"
                            type="text"
                            :placeholder="contactPlaceholder"
                            autocomplete="off"
                            class="luxury-input"
                            @input="handleContactInput"
                          />
                          <Transition name="fade">
                            <span
                              v-if="form.messenger === 'Telegram' && form.contact.length > 0 && !form.contact.startsWith('@')"
                              class="input-error"
                            >
                              {{ t('mod_err_at') }}
                            </span>
                          </Transition>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- STEP 5: SUCCESS CONFIRMATION -->
                  <div v-else-if="step === 5" class="success-screen">
                    <div class="success-circle">
                      <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h2 class="m-headline small">{{ t('mod_succ_title') }}</h2>
                    <p class="success-msg">
                      {{ t('mod_succ_desc') }}
                      <span class="silver-text">{{ form.messenger }}</span>
                      {{ t('mod_succ_desc2') }}
                    </p>

                    <div class="m-receipt">
                      <div class="receipt-header">{{ t('mod_rec_head') }}</div>
                      <div class="receipt-row">
                        <span class="label">{{ t('mod_rec_srv') }}</span>
                        <span class="value">{{ selectedDesignLabel }}</span>
                      </div>
                      <div class="receipt-row highlight">
                        <span class="label">{{ t('mod_rec_plan') }}</span>
                        <span class="value silver">{{ selectedPlanLabel }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- MODAL FOOTER NAVIGATION -->
            <div v-if="step < 5" class="m-footer">
              <button
                v-if="step > startStep"
                type="button"
                class="btn-text-back"
                @click="goBack"
              >
                {{ t('mod_btn_back') }}
              </button>
              <div v-else></div>

              <button
                type="button"
                :disabled="!isValid || loading"
                class="btn-silver-action"
                @click="handleNext"
              >
                <span class="btn-text">
                  {{ step === 4 ? (loading ? t('mod_btn_proc') : t('mod_btn_sched')) : t('mod_btn_next') }}
                </span>
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
import { t } from "../composables/useLanguage";

// PROPS AND EVENTS
const props = defineProps({
  isOpen: Boolean,
  initialDesignType: {
    type: String,
    default: ""
  },
  initialPlan: {
    type: String,
    default: ""
  }
});

defineEmits(["close"]);

// STATE
const step = ref(1);
const startStep = ref(1);
const loading = ref(false);

const isCountryOpen = ref(false);
const phoneBody = ref("");
const searchQuery = ref("");
const selectedCountry = ref({ name: "Ukraine", dial_code: "+380", code: "UA" });
const searchInput = ref(null);

let savedScrollY = 0;
let isMobileLocked = false;

// STATIC DATA OPTIONS
const countries = [
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "France", dial_code: "+33", code: "FR" },
  { name: "Germany", dial_code: "+49", code: "DE" },
  { name: "Israel", dial_code: "+972", code: "IL" },
  { name: "Italy", dial_code: "+39", code: "IT" },
  { name: "Poland", dial_code: "+48", code: "PL" },
  { name: "Spain", dial_code: "+34", code: "ES" },
  { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Ukraine", dial_code: "+380", code: "UA" },
  { name: "UAE", dial_code: "+971", code: "AE" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "United States", dial_code: "+1", code: "US" }
];

const designOptions = [
  { key: "custom", titleKey: "mod_opt_custom_title", descKey: "mod_opt_custom_desc" },
  { key: "template", titleKey: "mod_opt_template_title", descKey: "mod_opt_template_desc" },
  { key: "layout", titleKey: "mod_opt_layout_title", descKey: "mod_opt_layout_desc" }
];

const basePlans = [
  { name: "Simple Project", labelKey: "pl_l_simp", nameKey: "pl_n_simp" },
  { name: "Medium Project", labelKey: "pl_l_med", nameKey: "pl_n_med" },
  { name: "Complex Project", labelKey: "pl_l_comp", nameKey: "pl_n_comp" }
];

const messengers = [
  {
    name: "Telegram",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>'
  },
  {
    name: "WhatsApp",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.0357 2C6.51179 2 2.01786 6.49393 2.01786 12.0179C2.01786 13.7796 2.48125 15.5036 3.34732 17.0161L2 22L7.09821 20.6607C8.55625 21.5018 10.258 22.0179 12.0179 22.0179C17.5418 22.0179 22.0357 17.5239 22.0357 12C22.0357 6.49393 17.5418 2 12.0357 2ZM12.0357 20.1348C10.5071 20.1348 8.98393 19.7241 7.65089 18.9571L7.32946 18.7616L4.32143 19.5643L5.12411 16.5562L4.92857 16.2348C4.14375 14.8786 3.73304 13.3339 3.73304 11.7857C3.73304 7.20625 7.45446 3.48482 12.0357 3.48482C16.617 3.48482 20.3384 7.20625 20.3384 11.7857C20.3205 16.383 16.5991 20.1348 12.0357 20.1348ZM16.7946 14.558C16.5446 14.433 15.2946 13.8259 15.0625 13.7366C14.8304 13.6473 14.6696 13.6116 14.5089 13.8616C14.3482 14.1116 13.8839 14.6473 13.7411 14.8259C13.5982 14.9866 13.4554 15.0223 13.2054 14.8973C12.9554 14.7723 12.1518 14.5045 11.1875 13.6652C10.4554 13.0045 9.9375 12.2009 9.8125 11.9509C9.6875 11.7009 9.79464 11.5759 9.91964 11.4509C10.0268 11.3438 10.1696 11.1652 10.2946 11.0223C10.4196 10.8795 10.4732 10.7723 10.5446 10.6116C10.6161 10.4509 10.5804 10.3259 10.5268 10.2009C10.4732 10.0759 10.0089 8.95089 9.83036 8.48661C9.63393 8.04018 9.45536 8.11161 9.33036 8.11161C9.20536 8.11161 9.0625 8.11161 8.90179 8.11161C8.74107 8.11161 8.47321 8.18304 8.24107 8.43304C8.00893 8.68304 7.36607 9.29018 7.36607 10.5223C7.36607 11.7545 8.24107 12.9509 8.38393 13.1295C8.50893 13.308 10.0804 15.7366 12.4821 16.7723C13.0536 17.0223 13.4821 17.1652 13.8214 17.2723C14.3929 17.4509 14.9107 17.433 15.3214 17.3795C15.7857 17.308 16.7321 16.808 16.9286 16.2545C17.125 15.7009 17.125 15.2188 17.0714 15.1295C17.0179 15.0223 16.8839 14.9866 16.6518 14.8616L16.7946 14.558Z"/></svg>'
  },
  {
    name: "Email",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
  }
];

const pricingData = {
  template: ["$300 - $600", "$700 - $1,200", "$1,400 - $2,500+"],
  layout: ["$400 - $800", "$900 - $1,800", "$2,000 - $4,000+"],
  custom: ["$800 - $1,500", "$1,500 - $3,500", "$3,500 - $6,000+"]
};

const form = reactive({
  designType: "",
  plan: "",
  refLink: "",
  contact: "@",
  name: "",
  messenger: "Telegram"
});

// COMPUTED PROPERTIES
const computedPlans = computed(() => {
  const prices = pricingData[form.designType || "template"];
  return basePlans.map((plan, index) => ({
    ...plan,
    priceRange: prices[index]
  }));
});

const contactLabel = computed(() =>
  form.messenger === "WhatsApp" ? t("mod_ph_phone") : t("mod_ph_contact")
);

const contactPlaceholder = computed(() =>
  form.messenger === "Telegram" ? "@username" : "email@example.com"
);

const filteredCountries = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return countries.filter(
    (c) => c.name.toLowerCase().includes(query) || c.dial_code.includes(query)
  );
});

const selectedPlanLabel = computed(() => {
  const planObj = basePlans.find((p) => p.name === form.plan);
  return planObj ? t(planObj.nameKey) : form.plan;
});

const selectedDesignLabel = computed(() => {
  const designObj = designOptions.find((d) => d.key === form.designType);
  return designObj ? t(designObj.titleKey) : form.designType;
});

const isValid = computed(() => {
  if (step.value === 1) return Boolean(form.designType);
  if (step.value === 2) return Boolean(form.plan);
  if (step.value === 3) return true;

  if (step.value === 4) {
    if (form.name.trim().length < 2) return false;

    if (form.messenger === "WhatsApp") {
      return phoneBody.value.length >= 7 && phoneBody.value.length <= 15;
    }
    if (form.messenger === "Telegram") {
      return form.contact.startsWith("@") && form.contact.length > 2;
    }
    if (form.messenger === "Email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact);
    }
  }
  return true;
});

// HELPER FUNCTIONS
const isMobileViewport = () => window.innerWidth < 1024;

const mapPlanToBudget = (planName) => {
  if (planName === "Simple Project") return "< $1,000";
  if (planName === "Medium Project") return "$1,000 — $3,000";
  if (planName === "Complex Project") return "$3,000 — $6,000";
  return "Більше $6,000";
};

const toggleCountryDropdown = () => {
  isCountryOpen.value = !isCountryOpen.value;
  if (isCountryOpen.value && !isMobileViewport()) {
    nextTick(() => searchInput.value?.focus({ preventScroll: true }));
  }
};

const selectCountry = (country) => {
  selectedCountry.value = country;
  isCountryOpen.value = false;
  searchQuery.value = "";
};

const filterPhoneInput = (e) => {
  phoneBody.value = e.target.value.replace(/\D/g, "");
};

const selectMessenger = (name) => {
  form.messenger = name;
  form.contact = name === "Telegram" ? "@" : "";
  phoneBody.value = "";
};

const handleContactInput = (e) => {
  if (form.messenger === "Telegram") {
    const val = e.target.value;
    form.contact = !val.startsWith("@") ? "@" + val.replace(/@/g, "") : val;
  }
};

const goBack = () => {
  if (step.value > startStep.value) step.value--;
};

const handleNext = () => {
  if (step.value === 4) {
    sendRequest();
  } else {
    step.value++;
  }
};

const closeCountryDropdown = () => {
  isCountryOpen.value = false;
};

// SCROLL LOCK MANAGEMENT (NEVER SET overflow: hidden OR position: fixed ON DESKTOP)
const isInsideModalScrollArea = (target) => {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest(".country-dropdown") || target.closest(".m-content"));
};

const lockTouch = (e) => {
  if (!isInsideModalScrollArea(e.target)) {
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();
  }
};

const lockDesktopWheel = (e) => {
  if (!isInsideModalScrollArea(e.target)) {
    e.preventDefault();
  }
};

const lockDesktopScrollKeys = (e) => {
  const tag = e.target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

  const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
  if (scrollKeys.includes(e.key)) {
    e.preventDefault();
  }
};

const pinDesktopScroll = () => {
  if (window.scrollY !== savedScrollY) {
    window.scrollTo({ top: savedScrollY, behavior: "instant" });
  }
};

const applyScrollLock = () => {
  savedScrollY = window.lenis ? window.lenis.scroll : window.scrollY;

  if (window.lenis) {
    window.lenis.stop();
  }

  if (isMobileViewport()) {
    isMobileLocked = true;
    document.body.style.backgroundColor = "#000000";
    document.body.style.setProperty("overflow", "hidden", "important");
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.setProperty("top", `-${savedScrollY}px`, "important");
    document.body.style.setProperty("left", "0", "important");
    document.body.style.setProperty("right", "0", "important");
    document.body.style.setProperty("width", "100%", "important");
    document.addEventListener("touchmove", lockTouch, { passive: false, capture: true });
  } else {
    isMobileLocked = false;
    window.addEventListener("wheel", lockDesktopWheel, { passive: false, capture: true });
    window.addEventListener("keydown", lockDesktopScrollKeys, { capture: true });
    window.addEventListener("scroll", pinDesktopScroll, { passive: true });
  }
};

const clearScrollLock = () => {
  window.removeEventListener("wheel", lockDesktopWheel, { capture: true });
  window.removeEventListener("keydown", lockDesktopScrollKeys, { capture: true });
  window.removeEventListener("scroll", pinDesktopScroll);
  document.removeEventListener("touchmove", lockTouch, { capture: true });

  if (isMobileLocked) {
    isMobileLocked = false;
    document.body.style.backgroundColor = "";
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("left");
    document.body.style.removeProperty("right");
    document.body.style.removeProperty("width");
  }

  window.scrollTo({ top: savedScrollY, behavior: "instant" });

  if (window.lenis) {
    window.lenis.start();
    window.lenis.scrollTo(savedScrollY, { immediate: true, force: true });
  }
};

// MODAL OPEN AND CLOSE WATCHER
watch(
  () => props.isOpen,
  (open, wasOpen) => {
    if (open) {
      applyScrollLock();

      form.designType = "";
      form.plan = "";
      form.refLink = "";
      form.name = "";
      phoneBody.value = "";
      form.contact = form.messenger === "Telegram" ? "@" : "";

      if (props.initialDesignType && props.initialPlan) {
        form.designType = props.initialDesignType;
        form.plan = props.initialPlan;
        step.value = 3;
        startStep.value = 3;
      } else {
        step.value = 1;
        startStep.value = 1;
      }
    } else if (wasOpen) {
      clearScrollLock();
    }
  },
  { immediate: true }
);

// SUBMIT FORM TO TELEGRAM API
const sendRequest = async () => {
  loading.value = true;

  const finalContact =
    form.messenger === "WhatsApp"
      ? `${selectedCountry.value.dial_code} ${phoneBody.value}`
      : form.contact;

  const text = `💎 *NEW WEB LEAD*\n--------------------\n👤 ${form.name}\n📞 ${finalContact} (${form.messenger})\n--------------------\n🎨 Тип разработки: ${selectedDesignLabel.value}\n💎 Тариф: ${selectedPlanLabel.value}\n💰 Ожидаемый бюджет: ${mapPlanToBudget(form.plan)}\n🔗 Ссылка: ${form.refLink || "Нет"}`;

  try {
    const response = await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      step.value = 5;
    } else {
      throw new Error(result.error || "Failed to send");
    }
  } catch (e) {
    alert(t("mod_err_send"));
  } finally {
    loading.value = false;
  }
};

// LIFECYCLE
onMounted(() => {
  window.addEventListener("click", closeCountryDropdown);
});

onUnmounted(() => {
  window.removeEventListener("click", closeCountryDropdown);
  if (props.isOpen) {
    clearScrollLock();
  }
});
</script>

<style scoped>
/* FONT SMOOTHING */
.m-window,
.m-window * {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}

/* OVERLAY AND MODAL WINDOW */
.m-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transform: translate3d(0, 0, 0);
  will-change: opacity;
  overscroll-behavior: none;
}

.m-window {
  width: 100%;
  max-width: 640px;
  min-height: 500px;
  max-height: 95vh;
  background: #000000;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  padding: 40px 50px;
  font-family: "Plus Jakarta Sans", sans-serif;
  display: flex;
  flex-direction: column;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

/* CLOSE BUTTON */
.m-close-text {
  position: absolute;
  top: 40px;
  left: 50px;
  background: transparent;
  border: none;
  color: #aaaaaa;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.3s ease;
  z-index: 20;
  padding: 0;
  font-family: inherit;
}

.m-close-text .back-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

/* SCROLLABLE CONTENT AREA */
.m-content {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
  overscroll-behavior-y: contain;
  display: flex;
  flex-direction: column;
}

.m-content::-webkit-scrollbar {
  width: 0px;
  display: none;
}

.step-container {
  width: 100%;
  box-sizing: border-box;
}

/* STEP HEADER */
.m-header {
  margin-top: auto;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.m-meta {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 13px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 700;
  color: #777777;
  width: 100%;
}

.header-titles {
  margin-top: 4px;
  width: 100%;
  text-align: center;
}

.m-headline {
  font-size: clamp(20px, 5.4vw, 34px);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: -0.03em;
  word-spacing: 0.14em;
  line-height: 1.15;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
}

.m-headline.small {
  font-size: clamp(20px, 5.2vw, 28px);
  margin-bottom: 15px;
}

.silver-text {
  color: #ffffff;
}

.sub-text {
  font-size: 15px;
  color: #aaaaaa;
  margin-top: 8px;
  margin-bottom: 25px;
  line-height: 1.5;
  text-align: center;
}

.sub-text b {
  color: #ffffff;
  font-weight: 600;
  margin: 0 5px;
}

.summary-chip {
  font-size: 15px;
  color: #aaaaaa;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.m-body {
  margin-bottom: auto;
}

.step-4-wrapper {
  display: flex;
  flex-direction: column;
}

.step-4-bottom {
  margin-top: 10px;
}

/* STEP 1: DESIGN CARDS */
.m-grid-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.luxury-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  text-align: center;
}

.luxury-card.active {
  border-color: #ffffff;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 80%);
}

.design-card {
  padding: 18px 22px;
}

.design-card .card-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 2;
  transition: 0.3s;
}

.design-card .card-title {
  font-size: 17px;
  color: #e5e4e2;
  font-weight: 700;
}

.design-card .card-desc {
  font-size: 13px;
  color: #888888;
  font-weight: 500;
  line-height: 1.4;
}

.luxury-card.active .card-title {
  color: #ffffff;
}

.luxury-card.active .card-desc {
  color: #bbbbbb;
}

/* STEP 2: PRICING PLANS */
.m-plans-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card-large {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  transition: 0.3s ease;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

.plan-card-large.active {
  border-color: #ffffff;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 80%);
}

.plan-card-large.active .card-glow {
  opacity: 1;
}

.plan-quote {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 4px;
  position: relative;
  z-index: 2;
}

.quote-main {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ffffff;
  transition: 0.3s;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plan-badge {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #e5e4e2;
}

.plan-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.card-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  opacity: 0;
  transition: 0.5s;
  pointer-events: none;
  border-radius: inherit;
}

/* STEP 4: MESSENGER SELECTOR AND INPUTS */
.messenger-selector {
  margin-bottom: 35px;
}

.selector-label {
  display: block;
  font-size: 13px;
  text-transform: uppercase;
  color: #c4c4c4;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-bottom: 16px;
}

.messenger-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.ms-card {
  position: relative;
  background: rgba(15, 15, 15, 0.6);
  border-radius: 16px;
  cursor: pointer;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform: translate3d(0, 0, 0);
}

.ms-card.color-variant-0 {
  --theme: #0088cc;
}

.ms-card.color-variant-1 {
  --theme: #25d366;
}

.ms-card.color-variant-2 {
  --theme: #ffffff;
}

.ms-card .ms-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ms-card .ms-icon-wrapper {
  width: 28px;
  height: 28px;
  color: #e5e4e2;
  transition: all 0.4s ease;
}

.ms-card .ms-icon-wrapper svg {
  width: 100%;
  height: 100%;
}

.ms-card .ms-name {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #e5e4e2;
  transition: all 0.4s ease;
}

.ms-card .ms-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, var(--theme), transparent 60%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.ms-card .ms-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 100%, var(--theme), transparent 70%);
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.ms-card.active {
  transform: translateY(-2px);
  border-color: var(--theme);
  background: linear-gradient(165deg, rgba(20, 20, 20, 0.9), rgba(0, 0, 0, 0.95));
}

.ms-card.active .ms-border {
  opacity: 1;
}

.ms-card.active .ms-glow {
  opacity: 0.5;
}

.ms-card.active .ms-icon-wrapper {
  color: var(--theme);
  transform: translateY(-2px);
}

.ms-card.active .ms-name {
  color: #ffffff;
}

/* FORM INPUTS */
.input-group {
  margin-bottom: 25px;
  position: relative;
}

.input-group label {
  display: block;
  font-size: 13px;
  text-transform: uppercase;
  color: #c4c4c4;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.input-group.half {
  width: 50%;
}

.fixed-height {
  height: 48px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.luxury-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0 0 8px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  outline: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s;
}

.luxury-input::placeholder {
  color: #444444;
  font-weight: 400;
  transition: color 0.3s;
}

.luxury-input:focus {
  border-bottom-color: #ffffff;
}

.luxury-input:focus::placeholder {
  color: #666666;
}

.input-error {
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 11px;
  color: #ff4444;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.luxury-input:-webkit-autofill,
.luxury-input:-webkit-autofill:hover,
.luxury-input:-webkit-autofill:focus,
.luxury-input:-webkit-autofill:active {
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* WHATSAPP COUNTRY DROPDOWN */
.phone-smart-wrapper {
  display: flex;
  gap: 10px;
  position: relative;
  align-items: flex-end;
}

.phone-flex {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.country-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  height: 40px;
  min-width: 110px;
  position: relative;
  margin-bottom: 2px;
}

.country-trigger.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
}

.flag-text {
  font-weight: 800;
  font-size: 14px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dial-code {
  font-weight: 500;
  color: #cccccc;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.chevron {
  width: 14px;
  margin-left: auto;
  color: #666666;
  transition: 0.3s;
}

.country-trigger.active .chevron {
  color: #ffffff;
  transform: rotate(180deg);
}

.phone-input {
  font-family: monospace;
  letter-spacing: 1px;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  padding-bottom: 10px !important;
}

.country-search {
  width: 100%;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 16px;
  outline: none;
}

.country-search::placeholder {
  color: #444444;
}

.country-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: rgba(0, 0, 0, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  max-height: 260px;
  overflow: hidden;
  z-index: 99999;
  transform-origin: bottom right;
}

.search-wrap {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.search-icon {
  width: 14px;
  color: #555555;
}

.country-list {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 5px 0;
  overscroll-behavior: contain;
}

.country-list::-webkit-scrollbar {
  width: 4px;
}

.country-list::-webkit-scrollbar-track {
  background: transparent;
}

.country-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.country-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.6);
}

.country-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.c-code-text {
  font-weight: 800;
  font-size: 12px;
  color: #e5e4e2;
  width: 25px;
}

.c-name {
  flex: 1;
  font-size: 13px;
  color: #cccccc;
  font-weight: 500;
}

.c-dial {
  color: #666666;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.8;
}

/* FOOTER NAVIGATION */
.m-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding-bottom: 15px;
  transform: translate3d(0, 0, 0);
}

.btn-text-back {
  background: none;
  border: none;
  color: #e5e4e2;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: 0.3s;
  padding: 10px 20px;
}

.btn-silver-action {
  position: relative;
  background: linear-gradient(135deg, #ffffff, #a0a0a0);
  border: none;
  padding: 18px 42px;
  border-radius: 100px;
  cursor: pointer;
  transition: 0.4s;
  transform: translate3d(0, 0, 0);
}

.btn-silver-action .btn-text {
  color: #000000;
  font-weight: 800;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  z-index: 2;
}

.btn-shine-wrap {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform: skewX(-20deg) translate3d(-250%, 0, 0);
}

.btn-silver-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* STEP 5: SUCCESS SCREEN */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  text-align: center;
  transform: translate3d(0, 0, 0);
}

.success-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 30px;
  color: #ffffff;
}

.check-icon {
  width: 40px;
  height: 40px;
}

.success-msg {
  color: #aaaaaa;
  font-size: 16px;
  line-height: 1.6;
  max-width: 450px;
  margin-top: 15px;
  margin-bottom: 30px;
}

.m-receipt {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 30px;
  margin-top: 15px;
  backdrop-filter: blur(10px);
  animation: enter-receipt 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards;
  transform: translate3d(0, 0, 0);
}

.receipt-header {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666666;
  margin-bottom: 20px;
  text-align: left;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
}

.receipt-row .label {
  color: #aaaaaa;
  font-weight: 500;
}

.receipt-row .value {
  color: #e5e4e2;
  font-weight: 700;
  text-align: right;
}

.receipt-row.highlight .value.silver {
  color: #ffffff;
}

/* TRANSITIONS AND KEYFRAMES */
@keyframes enter-receipt {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-luxury-enter-active,
.modal-luxury-leave-active {
  transition: opacity 0.15s ease-out;
}

.modal-luxury-enter-from,
.modal-luxury-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-anim-enter-active,
.dropdown-anim-leave-active {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
}

.dropdown-anim-enter-from,
.dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* DESKTOP HOVER STATES */
@media (hover: hover) and (pointer: fine) {
  .m-close-text:hover {
    color: #ffffff;
  }
  .m-close-text:hover .back-arrow {
    transform: translateX(-5px);
  }
  .luxury-card:not(.active):hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.05);
  }
  .plan-card-large:not(.active):hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  .ms-card:not(.active):hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(25, 25, 25, 0.9);
  }
  .ms-card:not(.active):hover .ms-border {
    opacity: 0.5;
  }
  .country-trigger:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.5);
  }
  .country-item:hover {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.15), transparent);
    padding-left: 25px;
  }
  .btn-text-back:hover {
    color: #ffffff;
  }
  .btn-silver-action:not(:disabled):hover {
    transform: translateY(-2px);
  }
  .btn-silver-action:not(:disabled):hover .btn-shine {
    transform: skewX(-20deg) translate3d(300%, 0, 0);
    transition: transform 0.7s;
  }
}

/* COMPACT DESKTOP HEIGHT (<= 900PX) */
@media (max-height: 900px) and (min-width: 768px) {
  .m-window {
    padding: 30px 40px !important;
  }
  .m-close-text {
    top: 30px;
    left: 40px;
  }
  .m-header {
    margin-bottom: 20px !important;
    padding-top: 10px !important;
    margin-top: 20px !important;
  }
  .m-headline {
    font-size: 32px !important;
    margin-bottom: 15px !important;
  }
  .sub-text {
    margin-top: -10px !important;
    margin-bottom: 15px !important;
  }
  .m-plans-list {
    gap: 8px !important;
  }
  .plan-card-large {
    padding: 15px 20px !important;
  }
  .ms-card {
    height: 75px !important;
  }
  .ms-icon-wrapper,
  .ms-icon-wrapper svg {
    width: 24px !important;
    height: 24px !important;
  }
  .input-group {
    margin-bottom: 18px !important;
  }
  .m-footer {
    margin-top: 20px !important;
  }
  .btn-silver-action {
    padding: 15px 35px !important;
  }
}

/* MOBILE RESPONSIVE STYLES (<= 767PX) */
@media (max-width: 767px) {
  .m-overlay {
    position: fixed !important;
    inset: 0 !important;
    width: 100vw !important;
    height: 100dvh !important;
    background: #000000 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    padding: 0 !important;
    transform: none !important;
  }
  .m-window {
    border-radius: 0 !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    background: #000000 !important;
    transform: none !important;
  }
  .m-close-text {
    top: 24px !important;
    left: 20px !important;
    font-size: 11px !important;
  }
  .m-close-text .back-arrow {
    width: 16px !important;
    height: 16px !important;
  }
  .m-content {
    padding: 70px 20px 20px 20px !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
    justify-content: flex-start !important;
  }
  .m-header {
    margin-bottom: 20px !important;
    padding-top: 0 !important;
  }
  .m-headline {
    font-size: clamp(19px, 5.6vw, 26px) !important;
    white-space: nowrap !important;
  }
  .sub-text {
    font-size: 14px !important;
    margin-bottom: 15px !important;
  }
  .m-body {
    display: flex !important;
    flex-direction: column !important;
    flex: 0 0 auto !important;
    padding: 5px 0 !important;
  }
  .m-grid-cards {
    gap: 10px !important;
  }
  .luxury-card {
    min-height: 55px !important;
    border-radius: 14px !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
  }
  .design-card {
    padding: 16px 14px !important;
  }
  .design-card .card-title {
    font-size: 15px !important;
  }
  .design-card .card-desc {
    font-size: 12px !important;
  }
  .plan-card-large {
    padding: 16px 20px !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 14px !important;
  }
  .luxury-card.active,
  .plan-card-large.active {
    border: 1px solid #ffffff !important;
    background: #080808 !important;
  }
  .plan-info {
    gap: 2px !important;
  }
  .plan-title {
    font-size: 16px !important;
  }
  .plan-badge {
    font-size: 10px !important;
  }
  .quote-main {
    font-size: 12px !important;
  }
  .messenger-selector {
    margin-bottom: 24px !important;
  }
  .messenger-grid {
    gap: 8px !important;
  }
  .ms-card {
    height: 60px !important;
  }
  .ms-icon-wrapper svg {
    width: 20px !important;
    height: 20px !important;
  }
  .ms-name {
    font-size: 9px !important;
    letter-spacing: 1px;
  }
  .input-group {
    margin-bottom: 12px !important;
  }
  .input-group label {
    margin-bottom: 8px !important;
    font-size: 11px !important;
  }
  .form-row {
    flex-direction: column !important;
    gap: 24px !important;
  }
  .input-group.half {
    width: 100% !important;
  }
  .input-group.step-4-bottom {
    margin-top: 15px !important;
    margin-bottom: 0 !important;
  }
  .country-trigger {
    min-width: 105px !important;
    height: 48px !important;
    margin-bottom: 0 !important;
    background: rgba(10, 10, 10, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
  .country-trigger.active {
    border-color: rgba(255, 255, 255, 0.9) !important;
  }
  .luxury-input,
  .phone-input {
    padding-bottom: 12px !important;
    touch-action: manipulation !important;
  }
  .country-search {
    touch-action: manipulation !important;
  }
  .phone-smart-wrapper {
    width: 100%;
  }
  .flag-text,
  .dial-code {
    font-size: 13px !important;
  }
  .m-footer {
    flex-direction: column-reverse !important;
    gap: 10px !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    padding-top: 20px !important;
  }
  .btn-silver-action {
    width: 100% !important;
    padding: 15px !important;
    border-radius: 12px !important;
  }
  .btn-silver-action .btn-text {
    font-size: 14px !important;
  }
  .btn-text-back {
    width: 100% !important;
    padding: 12px !important;
    font-size: 13px !important;
  }
  .country-dropdown {
    width: calc(100vw - 40px) !important;
    max-height: 220px !important;
    touch-action: pan-y !important;
  }
}

/* SMALL MOBILE SCREEN HEIGHT (<= 700PX) */
@media (max-width: 767px) and (max-height: 700px) {
  .m-close-text {
    top: 18px !important;
    left: 16px !important;
  }
  .m-content {
    padding-top: 60px !important;
  }
  .m-header {
    margin-bottom: 10px !important;
  }
  .m-headline {
    font-size: clamp(18px, 5.2vw, 22px) !important;
  }
  .m-grid-cards {
    gap: 8px !important;
  }
  .design-card {
    padding: 12px 10px !important;
  }
  .plan-card-large {
    padding: 10px 14px !important;
  }
  .ms-card {
    height: 55px !important;
  }
  .input-group {
    margin-bottom: 10px !important;
  }
  .btn-silver-action {
    padding: 12px !important;
  }
  .m-footer {
    padding-top: 12px !important;
    gap: 8px !important;
  }
}
</style>