<template>
  <div class="careers-fullscreen">
    <div class="tally-content">
      
      <!-- 🌟 Умная кнопка назад 🌟 -->
      <a href="#" @click.prevent="goBack" class="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Website
      </a>

      <div class="tally-form-container">
        <div class="tally-header">
          <h1>Efimovs Agency | Candidate Profile</h1>
        </div>

        <form @submit.prevent="handleSubmit" class="tally-form">
          <div class="tally-field">
            <label>Full Name <span class="asterisk">*</span></label>
            <input type="text" v-model="form.fullName" required />
          </div>

          <div class="tally-field">
            <label>Preferred Contact Method <span class="asterisk">*</span></label>
            <div class="custom-select" @click.stop="toggleDropdown('contactMethod')">
              <div class="select-wrapper">
                <div class="select-box" :class="{ 'focus': activeDropdown === 'contactMethod' }">
                  <span :class="{ 'placeholder': !form.contactMethod }">{{ form.contactMethod || '' }}</span>
                  <span class="chevron" :class="{ 'rotated': activeDropdown === 'contactMethod' }"></span>
                </div>
              </div>
              <Transition name="smooth-dropdown">
                <div v-show="activeDropdown === 'contactMethod'" class="options-list">
                  <div class="option" @click.stop="selectOption('contactMethod', 'Telegram')">Telegram</div>
                  <div class="option" @click.stop="selectOption('contactMethod', 'WhatsApp')">WhatsApp</div>
                  <div class="option" @click.stop="selectOption('contactMethod', 'Viber')">Viber</div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="tally-field">
            <label>Enter Username/Phone <span class="asterisk">*</span></label>
            <input type="text" v-model="form.username" required />
          </div>

          <div class="tally-field">
            <label>Role <span class="asterisk">*</span></label>
            <div class="custom-select" @click.stop="toggleDropdown('role')">
              <div class="select-wrapper">
                <div class="select-box" :class="{ 'focus': activeDropdown === 'role' }">
                  <span :class="{ 'placeholder': !form.role }">{{ form.role || '' }}</span>
                  <span class="chevron" :class="{ 'rotated': activeDropdown === 'role' }"></span>
                </div>
              </div>
              <Transition name="smooth-dropdown">
                <div v-show="activeDropdown === 'role'" class="options-list">
                  <div class="option" @click.stop="selectOption('role', 'Sales Manager')">Sales Manager</div>
                  <div class="option" @click.stop="selectOption('role', 'Fullstack Developer')">Fullstack Developer</div>
                  <div class="option" @click.stop="selectOption('role', 'Mobile Developer')">Mobile Developer</div>
                  <div class="option" @click.stop="selectOption('role', 'UI/UX Designer')">UI/UX Designer</div>
                  <div class="option" @click.stop="selectOption('role', 'AI & Automation Engineer')">AI & Automation Engineer</div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="tally-field">
            <label>Core Tech Stack & Tools <span class="asterisk">*</span></label>
            <textarea v-model="form.techStack" required rows="4" data-lenis-prevent="true"></textarea>
          </div>

          <div class="tally-field">
            <label>Link to Portfolio <span class="asterisk">*</span></label>
            <input type="url" v-model="form.portfolio" required />
          </div>

          <div class="tally-field">
            <label>Years of Commercial Experience <span class="asterisk">*</span></label>
            <div class="custom-select" @click.stop="toggleDropdown('experience')">
              <div class="select-wrapper">
                <div class="select-box" :class="{ 'focus': activeDropdown === 'experience' }">
                  <span :class="{ 'placeholder': !form.experience }">{{ form.experience || '' }}</span>
                  <span class="chevron" :class="{ 'rotated': activeDropdown === 'experience' }"></span>
                </div>
              </div>
              <Transition name="smooth-dropdown">
                <div v-show="activeDropdown === 'experience'" class="options-list">
                  <div class="option" @click.stop="selectOption('experience', 'Less than 1 year')">Less than 1 year</div>
                  <div class="option" @click.stop="selectOption('experience', '1-3 years')">1-3 years</div>
                  <div class="option" @click.stop="selectOption('experience', '3-5 years')">3-5 years</div>
                  <div class="option" @click.stop="selectOption('experience', '5+ years')">5+ years</div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="tally-field">
            <label>English Level <span class="asterisk">*</span></label>
            <div class="custom-select" @click.stop="toggleDropdown('englishLevel')">
              <div class="select-wrapper">
                <div class="select-box" :class="{ 'focus': activeDropdown === 'englishLevel' }">
                  <span :class="{ 'placeholder': !form.englishLevel }">{{ form.englishLevel || '' }}</span>
                  <span class="chevron" :class="{ 'rotated': activeDropdown === 'englishLevel' }"></span>
                </div>
              </div>
              <Transition name="smooth-dropdown">
                <div v-show="activeDropdown === 'englishLevel'" class="options-list">
                  <div class="option" @click.stop="selectOption('englishLevel', 'B1 (Intermediate)')">B1 (Intermediate)</div>
                  <div class="option" @click.stop="selectOption('englishLevel', 'B2 (Upper-Intermediate)')">B2 (Upper-Intermediate)</div>
                  <div class="option" @click.stop="selectOption('englishLevel', 'C1 (Advanced)')">C1 (Advanced)</div>
                  <div class="option" @click.stop="selectOption('englishLevel', 'I\'m Native')">I'm Native</div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="tally-field" v-if="form.role !== 'Sales Manager'">
            <label>Weekly Availability <span class="asterisk">*</span></label>
            <div class="custom-select" @click.stop="toggleDropdown('weeklyAvailability')">
              <div class="select-wrapper">
                <div class="select-box" :class="{ 'focus': activeDropdown === 'weeklyAvailability' }">
                  <span :class="{ 'placeholder': !form.weeklyAvailability }">{{ form.weeklyAvailability || '' }}</span>
                  <span class="chevron" :class="{ 'rotated': activeDropdown === 'weeklyAvailability' }"></span>
                </div>
              </div>
              <Transition name="smooth-dropdown">
                <div v-show="activeDropdown === 'weeklyAvailability'" class="options-list">
                  <div class="option" @click.stop="selectOption('weeklyAvailability', '10-20 hours (Part-time)')">10-20 hours (Part-time)</div>
                  <div class="option" @click.stop="selectOption('weeklyAvailability', '20-40 hours (Full-Time)')">20-40 hours (Full-Time)</div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="tally-field">
            <label>Your Local Time Zone <span class="asterisk">*</span></label>
            <input type="text" v-model="form.timeZone" required />
          </div>

          <div class="tally-field">
            <label>Record a 1-minute intro in English to "stand out" (Loom/Google Drive)</label>
            <input type="url" v-model="form.introVideo" />
          </div>

          <div class="tally-field checkbox-field">
            <label class="tally-checkbox">
              <input type="checkbox" v-model="form.agreement" required />
              <span class="checkbox-box">
                <svg v-if="form.agreement" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="#ffffff" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="checkbox-text">Agreement <span class="asterisk">*</span><br>
              <span class="checkbox-subtext">{{ agreementText }}</span>
              </span>
            </label>
          </div>

          <div class="tally-submit-wrapper">
            <button type="submit" class="tally-submit-btn" :disabled="isSubmitting || !isFormValid">
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  fullName: '', contactMethod: '', username: '', role: '', techStack: '', portfolio: '',
  experience: '', englishLevel: '', weeklyAvailability: '', timeZone: '', introVideo: '', agreement: false
});

const isSubmitting = ref(false);
const activeDropdown = ref(null);

const agreementText = computed(() => {
  if (form.value.role === 'Sales Manager') {
    return 'I confirm my agreement to the 15% commission model and commit to working one of the schedules outlined in the PDF guide.';
  } else {
    return 'I agree to the project-based payment model and confirm my commitment to responsive team communication and strict project deadlines.';
  }
});

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const selectOption = (field, value) => {
  form.value[field] = value;
  activeDropdown.value = null;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const isFormValid = computed(() => {
  const isAvailabilityValid = form.value.role === 'Sales Manager' ? true : !!form.value.weeklyAvailability;

  return form.value.fullName && form.value.contactMethod && form.value.username && 
         form.value.role && form.value.techStack && form.value.portfolio && 
         form.value.experience && form.value.englishLevel && isAvailabilityValid && 
         form.value.timeZone && form.value.agreement;
});

// 🌟 ИДЕАЛЬНЫЙ ВОЗВРАТ: Просто идем на главную, роутер сам вернет нас на нужный пиксель 🌟
const goBack = async () => {
  await router.push('/');
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  try {
    const payload = {
      ...form.value,
      username: `${form.value.contactMethod}: ${form.value.username}`
    };

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Ошибка сети при отправке данных');
    }
    
    setTimeout(() => {
      isSubmitting.value = false;
      alert('Application received. Thank you.');
      goBack();
    }, 800);

  } catch (error) {
    console.error('Submit error:', error);
    isSubmitting.value = false;
    alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0px;
  padding: 0px;
  color: #37352f;
}

.careers-fullscreen {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 999999;
}

.tally-content {
  width: 100%;
  max-width: 760px; 
  margin: 0px auto; 
  background: transparent; 
  box-shadow: none; 
  border-radius: 0px; 
  padding: 40px 20px 80px 20px; 
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0px;
  color: #666666;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  margin-bottom: 20px;
}

.btn-back:hover {
  color: #000000;
}

.tally-form-container {
  padding: 0px;
}

.tally-header { margin-bottom: 48px; }
.tally-header h1 { font-size: 32px; font-weight: 700; margin: 0px; letter-spacing: -0.5px; }
.tally-form { display: flex; flex-direction: column; gap: 32px; }
.tally-field { display: flex; flex-direction: column; gap: 8px; }
.tally-field label { font-size: 16px; font-weight: 600; }
.asterisk { background: #f1f1f0; padding: 2px 5px; border-radius: 4px; font-size: 12px; vertical-align: middle; margin-left: 4px; }

input[type="text"], input[type="url"], textarea {
  width: 100%; padding: 10px 14px; background-color: #ffffff; border: 1px solid #d9d9d9;
  border-radius: 8px; font-size: 16px; line-height: 24px; outline: none;
}
textarea { resize: vertical; min-height: 100px; }

input[type="text"]:hover, input[type="url"]:hover, textarea:hover, .custom-select:hover .select-box {
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
}
input:focus, textarea:focus, .select-box.focus {
  border-color: #90c2fb; box-shadow: 0px 0px 0px 3px #e0f0ff, 0px 4px 16px rgba(0, 0, 0, 0.08);
}

.custom-select { position: relative; width: 100%; cursor: pointer; }
.select-wrapper { transition: transform 0.1s ease; }
.select-wrapper:active { transform: scale(0.99); }
.select-box {
  width: 100%; padding: 10px 14px; background-color: #ffffff; border: 1px solid #d9d9d9;
  border-radius: 8px; font-size: 16px; display: flex; justify-content: space-between; align-items: center; min-height: 46px;
}
.select-box .placeholder { color: transparent; }
.chevron { width: 12px; height: 12px; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2337352f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-size: cover; transition: 0.3s; }
.chevron.rotated { transform: rotate(180deg); }

.options-list {
  position: absolute; top: calc(100% + 6px); left: 0px; width: 100%; background: #ffffff;
  border: 1px solid #eaeaea; border-radius: 8px; box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100; max-height: 250px; overflow-y: auto; padding: 6px;
}
.option { padding: 10px 12px; font-size: 15px; border-radius: 6px; cursor: pointer; }
.option:hover { background-color: #f1f1f0; }

.smooth-dropdown-enter-active, .smooth-dropdown-leave-active { transition: opacity 0.2s, transform 0.2s; }
.smooth-dropdown-enter-from, .smooth-dropdown-leave-to { opacity: 0; transform: translateY(-8px); }

.checkbox-field { margin-top: 16px; }
.tally-checkbox { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.tally-checkbox input { position: absolute; opacity: 0; width: 0px; height: 0px; }
.checkbox-box { width: 20px; height: 20px; flex-shrink: 0; background: #ffffff; border: 1px solid #d9d9d9; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
.tally-checkbox input:checked ~ .checkbox-box { background: #000000; border-color: #000000; }
.checkbox-text { font-size: 16px; font-weight: 600; line-height: 24px; }
.checkbox-subtext { display: block; font-weight: 400; margin-top: 4px; transition: opacity 0.2s ease; }

.checkbox-box svg {
  width: 14px;
  height: 14px;
  display: block;
}

.tally-submit-wrapper { margin-top: 24px; }
.tally-submit-btn { padding: 12px 24px; background-color: #000000; color: #ffffff; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; }
.tally-submit-btn:hover:not(:disabled) { background-color: #333333; }
.tally-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>