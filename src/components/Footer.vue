<template>
  <footer id="contacts" class="footer">
    
    <!-- 🚀 Свечение рендерится только на десктопе, сохраняем FPS на телефонах. Добавлен opt-gpu. -->
    <div v-if="isDesktop" class="ambient-glow opt-gpu" v-once></div>

    <div class="container">
      <div class="footer-content">
        
        <div class="footer-top-grid">
          
          <!-- ЛЕВАЯ КОЛОНКА -->
          <div class="grid-column">
            
            <div class="column-header">
              <span class="kicker">{{ t('ft_kicker_left') }}</span>
              <h2 class="gradient-title">{{ t('ft_title_left') }}</h2>
            </div>
            
            <div class="column-body">
              <p class="cta-description">
                {{ t('ft_desc_left') }}
              </p>
              
              <div class="action-group">
                <button class="btn-outline-platinum-trigger" @click="emit('openModal')">
                  <div class="btn-outline-platinum-visual">
                    <span class="text">{{ t('ft_btn_form') }}</span>
                    <div class="btn-flare" v-once></div>
                  </div>
                </button>
              </div>
            </div>

            <div class="career-left-wrapper">
              <router-link to="/careers" class="career-inline-link">
                <div class="career-status">
                  <span class="hiring-dot" v-once></span>
                  <span class="career-label">{{ t('ft_career_title') }}</span>
                </div>
                <p class="career-subtext">
                  {{ t('ft_career_desc') }}<br/>
                  <span class="career-highlight">
                    {{ t('ft_career_link') }}
                    <svg class="career-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="square" />
                    </svg>
                  </span>
                </p>
              </router-link>
            </div>

          </div>

          <!-- ПРАВАЯ КОЛОНКА (ФОРМА) -->
          <div class="grid-column">
            
            <div class="column-header">
              <span class="kicker">{{ t('ft_kicker_right') }}</span>
              <a href="mailto:efimovs.agency@gmail.com" class="gradient-title email-link">
                efimovs.agency@gmail.com
              </a>
            </div>

            <div class="column-body">
              <p class="email-disclaimer" v-html="t('ft_email_disc')"></p>

              <form @submit.prevent="submitB2BForm" class="b2b-form" novalidate>
                <div class="form-row">
                  
                  <div class="input-wrapper">
                    <input 
                      type="text" 
                      v-model="formData.name" 
                      :placeholder="t('ft_ph_name')" 
                      :class="['luxury-input', { 'has-error': errors.name, 'shake-anim': shake.name }]"
                      :disabled="isSubmitting"
                      @input="clearError('name')"
                    />
                    <Transition name="error-fade">
                      <span v-if="errors.name" class="validation-error">{{ errors.name }}</span>
                    </Transition>
                  </div>

                  <div class="input-wrapper">
                    <input 
                      type="email" 
                      v-model="formData.email" 
                      :placeholder="t('ft_ph_email')" 
                      :class="['luxury-input', { 'has-error': errors.email, 'shake-anim': shake.email }]"
                      :disabled="isSubmitting"
                      @input="clearError('email')"
                    />
                    <Transition name="error-fade">
                      <span v-if="errors.email" class="validation-error">{{ errors.email }}</span>
                    </Transition>
                  </div>

                </div>
                
                <div class="form-row">
                  <div class="input-wrapper">
                    <textarea 
                      ref="messageTextarea"
                      v-model="formData.message" 
                      :placeholder="t('ft_ph_msg')" 
                      :class="['luxury-input textarea custom-scrollbar', { 'has-error': errors.message, 'shake-anim': shake.message }]"
                      :disabled="isSubmitting"
                      @input="handleTextareaInput"
                      @wheel.passive="handleTextareaWheel"
                      :data-lenis-prevent="isTextareaScrollable ? 'true' : undefined"
                      :data-scroll-lock="isTextareaScrollable ? 'true' : undefined"
                    ></textarea>
                    <Transition name="error-fade">
                      <span v-if="errors.message" class="validation-error">{{ errors.message }}</span>
                    </Transition>
                  </div>
                </div>
                
                <div class="form-footer">
                  <button type="submit" class="submit-btn-platinum" :disabled="isSubmitting">
                    <span class="btn-text">{{ isSubmitting ? t('ft_btn_sending') : t('ft_btn_send') }}</span>
                    <svg v-if="!isSubmitting" class="submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="square" />
                    </svg>
                  </button>

                  <Transition name="fade">
                    <span v-if="submitStatus !== 'idle'" :class="['status-message', submitStatus]">
                      {{ submitMessage }}
                    </span>
                  </Transition>
                </div>
              </form>
            </div>

          </div>

        </div>

        <!-- НИЖНЯЯ ПАНЕЛЬ С КОПИРАЙТОМ -->
        <div class="footer-base">
          
          <div class="base-left">
            <div class="watermark-wrapper" v-once>
              <EfimovsBadge />
            </div>
          </div>

          <div class="base-center">
            <div class="socials-row" v-once>
              <a
                v-for="(social, index) in socials"
                :key="index"
                :href="social.link"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link-minimal"
                :aria-label="social.name"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  shape-rendering="geometricPrecision"
                  class="social-svg"
                >
                  <g v-if="social.name === 'Facebook'" transform="scale(1.2) translate(-2px, -2px)" v-html="social.icon"></g>
                  <g v-else v-html="social.icon"></g>
                </svg>
              </a>
            </div>
          </div>

          <div class="base-right">
            <div class="copyright-minimal">
              {{ t('ft_copyright') }}
            </div>
          </div>

        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, ref, reactive, onBeforeUnmount, nextTick } from "vue";
import { t } from "../composables/useLanguage";
import EfimovsBadge from "./EfimovsBadge.vue";

const emit = defineEmits(["openModal"]);
const isDesktop = ref(true);
const messageTextarea = ref(null);

const formData = reactive({ name: '', email: '', message: '' });
const isSubmitting = ref(false);
const submitStatus = ref('idle'); 
const submitMessage = ref('');
const isTextareaScrollable = ref(false); 

const errors = reactive({ name: '', email: '', message: '' });
const shake = reactive({ name: false, email: false, message: false });

let resizeTimer = null;

// Статичный массив выведен из реактивности
const socials = [
  {
    name: "X",
    link: "https://x.com/efimovsagency?s=21",
    icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>'
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/efimovs.agency",
    icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM18.5 6.75C19.1904 6.75 19.75 6.19036 19.75 5.5C19.75 4.80964 19.1904 4.25 18.5 4.25C17.8096 4.25 17.25 4.80964 17.25 5.5C17.25 6.19036 17.8096 6.75 18.5 6.75ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" fill="currentColor"/>',
  },
  {
    name: "TikTok",
    link: "https://www.tiktok.com/@efimovs.agency",
    icon: '<path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="currentColor"/>',
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/efimovs-agency/?viewAsMember=true",
    icon: '<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.11-4 0v5.6h-3v-11h3v1.77c1.4-2.59 7-2.78 7 2.48v6.75z" fill="currentColor"/>',
  }
];

const triggerShake = (field) => {
  shake[field] = true;
  setTimeout(() => { shake[field] = false; }, 500); 
};

const clearError = (field) => { errors[field] = ''; };

const handleTextareaInput = () => {
  clearError('message');
  autoResize();
};

const validateForm = () => {
  let isValid = true;
  errors.name = ''; errors.email = ''; errors.message = '';

  if (!formData.name.trim()) {
    errors.name = t('ft_err_name');
    triggerShake('name');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = t('ft_err_email');
    triggerShake('email');
    isValid = false;
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = t('ft_err_email_fmt');
    triggerShake('email');
    isValid = false;
  }

  if (!formData.message.trim()) {
    errors.message = t('ft_err_msg');
    triggerShake('message');
    isValid = false;
  }

  return isValid;
};

const autoResize = () => {
  const el = messageTextarea.value;
  if (!el) return;

  const currentScroll = el.scrollTop;
  el.style.height = '50px';
  const newHeight = el.scrollHeight;

  if (newHeight >= 250) {
    el.style.height = '250px'; 
    el.style.overflowY = 'auto'; 
    el.scrollTop = currentScroll; 
    isTextareaScrollable.value = true; 
  } else {
    el.style.height = newHeight + 'px'; 
    el.style.overflowY = 'hidden'; 
    isTextareaScrollable.value = false; 
  }
};

const handleTextareaWheel = (e) => {
  if (!isTextareaScrollable.value || !messageTextarea.value) return; 

  const el = messageTextarea.value;
  const isAtTop = el.scrollTop === 0;
  const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1; 
  const isScrollingUp = e.deltaY < 0;
  const isScrollingDown = e.deltaY > 0;

  if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
    return;
  }
  e.stopPropagation();
};

const submitB2BForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitStatus.value = 'idle';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      submitStatus.value = 'success';
      submitMessage.value = t('ft_succ_msg');
      formData.name = ''; formData.email = ''; formData.message = '';
      
      nextTick(() => {
        if (messageTextarea.value) {
          messageTextarea.value.style.height = '50px';
          messageTextarea.value.style.overflowY = 'hidden';
          isTextareaScrollable.value = false; 
        }
      });
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    submitStatus.value = 'error';
    submitMessage.value = t('ft_fail_msg');
  } finally {
    isSubmitting.value = false;
    setTimeout(() => { submitStatus.value = 'idle'; }, 5000);
  }
};

const onWindowResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isDesktop.value = window.innerWidth >= 1024;
  }, 100);
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener("resize", onWindowResize, { passive: true });
  
  if (messageTextarea.value) {
    messageTextarea.value.style.height = '50px';
    messageTextarea.value.style.overflowY = 'hidden';
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.footer {
  contain: content;
  position: relative;
  background: #000000 !important;
  padding: 0px;
  overflow: hidden;
  color: #ffffff;
  font-family: "Plus Jakarta Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  isolation: isolate;
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1500px;
  margin: 0px auto;
  padding: 0px 40px;
  position: relative;
  z-index: 10;
}

.footer-content {
  display: flex;
  flex-direction: column;
  padding: 120px 0px 60px 0px;
  width: 100%;
}

.footer-top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 120px;
  align-items: start;
}

.grid-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  max-width: 550px;
  width: 100%;
}

.column-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px; 
  padding: 0px;
  width: 100%;
}

.kicker {
  display: block;
  font-size: 13px; 
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3px; 
  color: #a1a1aa; 
  margin: 0px 0px 16px 0px;
  padding: 0px;
  line-height: 13px;
  text-rendering: optimizeLegibility; 
}

.gradient-title {
  display: block; 
  font-size: 46px;
  font-weight: 700;
  line-height: 50px;
  letter-spacing: -1.5px;
  padding: 0px 0px 5px 0px; 
  margin: 0px 0px -5px 0px; 
  background: linear-gradient(180deg, #ffffff 0px, #a1a1aa 100px);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  word-break: break-word;
  overflow-wrap: break-word;
}

.email-link {
  text-decoration: none;
  transition: opacity 0.4s ease;
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .email-link:hover {
    opacity: 0.85;
  }
}

.column-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.cta-description {
  font-size: 17px;
  line-height: 27px;
  color: #a1a1aa;
  margin: 0px 0px 35px 0px;
  font-weight: 400;
}

.action-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.career-left-wrapper {
  margin-top: 80px;
  width: 100%;
  max-width: 420px;
}

.career-inline-link {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  width: fit-content;
}

.career-status {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.hiring-dot {
  width: 8px; 
  height: 8px; 
  border-radius: 8px;
  background-color: #e5e4e2;
  animation: pulsePlatinumHiring 2.5s ease-in-out infinite alternate;
  will-change: opacity;
}

@media (hover: hover) and (pointer: fine) {
  .career-inline-link:hover .career-label { color: #ffffff; }
  .career-inline-link:hover .career-subtext { color: #d1d1d6; }
  .career-inline-link:hover .career-highlight { color: #ffffff; }
  .career-inline-link:hover .career-arrow { transform: translateX(5px); }
}

@keyframes pulsePlatinumHiring {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.career-label {
  font-size: 13px; 
  font-weight: 800;
  color: #ffffff; 
  text-transform: uppercase;
  letter-spacing: 3px; 
  transition: color 0.4s ease;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.career-subtext {
  font-size: 16px; 
  line-height: 26px;
  color: #a1a1aa; 
  margin: 0px;
  font-weight: 400;
  transition: color 0.4s ease;
  text-rendering: optimizeLegibility;
}

.career-highlight {
  color: #ffffff; 
  font-weight: 600; 
  transition: color 0.4s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.career-arrow {
  width: 16px; 
  height: 16px;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  stroke-width: 2px;
}

/* =========================================
   🌟 ФОРМА B2B 🌟
   ========================================= */
.email-disclaimer {
  font-size: 16px; 
  color: #a1a1aa; 
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 0.3px; 
  margin: 0px;
}

.b2b-form {
  width: 100%;
  margin-top: 25px; 
  display: flex;
  flex-direction: column;
  gap: 32px; 
}

.form-row {
  display: flex;
  gap: 32px; 
  width: 100%;
}

.input-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.luxury-input {
  box-sizing: border-box; 
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding: 16px 0px; 
  color: #ffffff;
  font-size: 18px; 
  line-height: 27px;
  font-family: inherit;
  transition: border-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  border-radius: 0px;
  outline: none;
  will-change: transform, border-color;
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
}

.luxury-input::placeholder {
  color: #666666;
  transition: color 0.3s ease;
}

.luxury-input:focus,
.luxury-input:not(:placeholder-shown) {
  border-bottom-color: #e5e4e2;
}

.luxury-input:focus::placeholder {
  color: transparent;
}

.luxury-input.has-error {
  border-bottom-color: #ff453a !important;
}

@keyframes premiumShake {
  10%, 90% { transform: translate3d(-1px, 0px, 0px); }
  20%, 80% { transform: translate3d(2px, 0px, 0px); }
  30%, 50%, 70% { transform: translate3d(-4px, 0px, 0px); }
  40%, 60% { transform: translate3d(4px, 0px, 0px); }
}

.shake-anim {
  animation: premiumShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translateZ(0);
}

.validation-error {
  position: absolute;
  top: calc(100% + 8px);
  left: 0px;
  color: #ff453a;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  pointer-events: none;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.error-fade-leave-to {
  opacity: 0;
}

/* Технический хак для браузерного автозаполнения - остается */
.luxury-input:-webkit-autofill,
.luxury-input:-webkit-autofill:hover, 
.luxury-input:-webkit-autofill:focus,
.luxury-input:-webkit-autofill:active {
  -webkit-box-shadow: 0px 0px 0px 1000px #000000 inset !important; 
  -webkit-text-fill-color: #ffffff !important; 
  border-bottom-color: #e5e4e2 !important; 
  transition: background-color 5000s ease-in-out 0s;
}

.luxury-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.luxury-input.textarea {
  resize: none; 
  height: 50px; 
  overflow-y: hidden; 
  padding-right: 15px; 
  touch-action: pan-y; 
}

.custom-scrollbar {
  overscroll-behavior: contain; 
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e4e2; }

.form-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px; 
}

.submit-btn-platinum {
  background: transparent;
  border: none;
  color: #e5e4e2;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 15px; 
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  padding: 0px;
  transition: color 0.3s ease;
}

.submit-arrow {
  width: 26px; 
  height: 26px; 
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

@media (hover: hover) and (pointer: fine) {
  .submit-btn-platinum:hover:not(:disabled) { 
    color: #ffffff; 
  }
  .submit-btn-platinum:hover:not(:disabled) .submit-arrow { transform: translateX(6px); }
}

.submit-btn-platinum:disabled { opacity: 0.5; cursor: not-allowed; }

.status-message {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.status-message.success { color: #32d74b; }
.status-message.error { color: #ff453a; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* =========================================
   🌟 КНОПКА ОТКРЫТИЯ ФОРМЫ (ПЛАТИНА) 🌟
   ========================================= */
.btn-outline-platinum-trigger {
  display: inline-flex;
  background: transparent;
  border: none;
  padding: 0px;
  margin: 0px;
  cursor: pointer;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-outline-platinum-visual {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 45px;
  border: 1px solid rgba(229, 228, 226, 0.4);
  border-radius: 100px;
  background: transparent;
  font-size: 14px; 
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform, background-color, border-color;
  -webkit-transform: translateZ(0px);
  transform: translateZ(0px);
}

.btn-outline-platinum-visual .text {
  position: relative;
  z-index: 2;
  color: #ffffff;
  transition: color 0.3s ease;
}

.btn-outline-platinum-visual .btn-flare {
  position: absolute;
  top: 0px;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(229, 228, 226, 0.3), transparent);
  -webkit-transform: skewX(-20deg);
  transform: skewX(-20deg);
  transition: 0.5s;
}

@media (hover: hover) and (pointer: fine) {
  .btn-outline-platinum-trigger:hover .btn-outline-platinum-visual {
    background: #e5e4e2;
    border-color: #e5e4e2;
    transform: translateY(-2px) translateZ(0px);
  }
  .btn-outline-platinum-trigger:hover .btn-outline-platinum-visual .text { color: #000000 !important; }
  .btn-outline-platinum-trigger:hover .btn-outline-platinum-visual .btn-flare { left: 150%; transition: 0.7s; }
}

/* =========================================
   🌟 НИЖНЯЯ ПАНЕЛЬ 🌟
   ========================================= */
.footer-base {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;
  margin-top: 50px;
  width: 100%;
}

.footer-base::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 500px, transparent);
}

.base-left, .base-center, .base-right { flex: 1; }
.base-left { display: flex; justify-content: flex-start; }
.base-center { display: flex; justify-content: center; }
.base-right { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 12px; }

.watermark-wrapper { margin: 0px; }

.socials-row {
  display: flex;
  align-items: center;
  gap: 35px;
}

.social-link-minimal {
  color: #a1a1aa; 
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.social-svg {
  width: 28px; 
  height: auto;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform;
  transform: translateZ(0);
}

@media (hover: hover) and (pointer: fine) {
  .social-link-minimal:hover { color: #ffffff; }
  .social-link-minimal:hover .social-svg {
    transform: translateY(-4px) scale(1.15);
  }
}

.copyright-minimal {
  color: #8e8e93;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* =========================================
   🌟 АДАПТИВ ДЛЯ ПЛАНШЕТОВ И МОБИЛОК 🌟
   ========================================= */
@media (max-width: 1023px) {
  .container { padding: 0px 15px; }
  .footer-content { padding: 80px 0px 40px 0px; }
  
  .footer-top-grid {
    grid-template-columns: 1fr;
    gap: 0px; 
    margin-bottom: 60px;
    text-align: center;
  }

  .grid-column, .column-header, .column-body {
    align-items: center;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
  
  .gradient-title { text-align: center; font-size: 38px; line-height: 42px; }
  .email-link { font-size: 38px; }
  .action-group { align-items: center; }
  
  .career-left-wrapper {
    margin-top: 80px; 
    margin-bottom: 80px; 
    padding: 40px 0px; 
    width: 100%;
    max-width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%);
  }
  .career-inline-link { align-items: center; } 
  .career-status { justify-content: center; width: 100%; }
  .career-highlight { justify-content: center; }

  .form-row { flex-direction: column; gap: 32px; }
  .form-footer { justify-content: center; margin-top: 30px; }

  .footer-base {
    flex-direction: column;
    gap: 40px;
    padding-top: 40px;
  }

  .base-left, .base-center, .base-right { justify-content: center; }
  .base-left { order: 1; }
  .base-center { order: 2; }
  .base-right { order: 3; align-items: center; }
  
  .watermark-wrapper { margin-bottom: -15px; }
}

@media (max-width: 767px) {
  .footer { min-height: auto; } 
  
  .gradient-title { font-size: 32px; line-height: 38px; margin-bottom: 10px; }
  .email-link { font-size: 26px; }
  
  .cta-description, .email-disclaimer, .career-subtext {
    font-size: 14px;
    line-height: 24px;
    padding: 0px 10px; 
    color: #8a8a93; 
  }
  
  .cta-description { margin-bottom: 30px; }
  
  .btn-outline-platinum-trigger { width: 100%; }
  .btn-outline-platinum-visual { 
    width: 300px; 
    padding: 20px 0px !important; 
  }

  .btn-outline-platinum-visual .text {
    font-size: 12px !important; 
    font-weight: 600 !important; 
    letter-spacing: 1px !important; 
    line-height: 1 !important;
  }

  .submit-btn-platinum {
    font-size: 12px !important; 
    font-weight: 600 !important; 
    letter-spacing: 1px !important; 
    line-height: 1 !important;
  }
  
  .b2b-form { margin-top: 40px; gap: 40px; }
  
  .socials-row { gap: 25px; }
  .copyright-minimal { font-size: 12px; text-align: center; }
  
  .kicker { margin-bottom: 12px; }
}

@media (max-width: 380px) {
  .gradient-title { font-size: 26px; line-height: 32px; }
  .email-link { font-size: 20px; }
  
  .btn-outline-platinum-visual { padding: 18px 10px !important; }
  
  .career-left-wrapper {
    margin-top: 60px;
    margin-bottom: 60px;
    padding: 30px 0px;
  }
}

@media (hover: none) {
  .btn-outline-platinum-trigger:active .btn-outline-platinum-visual { background: #e5e4e2; border-color: #e5e4e2; }
  .btn-outline-platinum-trigger:active .btn-outline-platinum-visual .text { color: #000000 !important; }
}
</style>