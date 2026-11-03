<template>
  <div 
    class="ea-chat-root"
    :class="{ 'portfolio-offset': isPortfolio }"
  >
    <!-- Кнопка вызова -->
    <button v-if="!isOpen" @click="toggleChat" class="ea-glass-btn" aria-label="Open AI Chat">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <!-- Окно чата -->
    <transition name="ea-fade">
      <div v-if="isOpen" class="ea-glass-window">
        <!-- Хедер -->
        <div class="ea-header">
          <div class="ea-header-left">
            <div class="ea-status-dot"></div>
            <div class="ea-header-text">
              <h4>Efimovs Agency</h4>
              <p>AI Discovery Assistant</p>
            </div>
          </div>
          <button @click="toggleChat" class="ea-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Область сообщений -->
        <div class="ea-chat-body" ref="chatBody">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['ea-msg-wrapper', msg.role]"
          >
            <div class="ea-msg-bubble">{{ msg.content }}</div>
          </div>
          
          <div v-if="isLoading" class="ea-msg-wrapper assistant">
            <div class="ea-msg-bubble ea-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Поле ввода -->
        <form class="ea-footer" @submit.prevent="sendMessage">
          <input 
            v-model="input" 
            type="text" 
            placeholder="Напишите ваш вопрос..." 
            :disabled="isLoading"
            class="ea-input"
          />
          <button type="submit" :disabled="!input.trim() || isLoading" class="ea-send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Точная проверка страницы Портфолио
const isPortfolio = computed(() => route.name === 'Portfolio' || route.path.includes('portfolio'))

const isOpen = ref(false)
const input = ref('')
const isLoading = ref(false)
const chatBody = ref(null)

const messages = ref([
  { 
    role: 'assistant', 
    content: 'Приветствую! Я AI-ассистент Efimovs Agency. Мы создаем high-end сайты и ИИ-автоматизацию для бизнеса. Какой проект вы планируете запустить?' 
  }
])

const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollToBottom()
}

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return

  messages.value.push({ role: 'user', content: input.value })
  input.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.value })
    })
    
    // Получаем реальный ответ от сервера
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Сбой сети (возможно, папка api лежит не в корне проекта)')
    }
    
    messages.value.push({ role: 'assistant', content: data.reply })
  } catch (error) {
    // Выводим ТОЧНУЮ ошибку на экран
    messages.value.push({ 
      role: 'assistant', 
      content: `🚨 Ошибка системы: ${error.message}` 
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}

.ea-chat-root {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.ea-chat-root.portfolio-offset {
  bottom: 88px !important;
}

.ea-glass-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(212, 175, 55, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  margin: 0;
  padding: 0;
}

.ea-glass-btn:hover {
  transform: scale(1.05);
  border-color: rgba(212, 175, 55, 0.8);
  box-shadow: 0 10px 28px rgba(212, 175, 55, 0.25);
}

.ea-glass-window {
  width: 360px;
  height: 500px;
  max-height: calc(100vh - 120px);
  border-radius: 20px;
  background: rgba(12, 12, 12, 0.75);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
}

.ea-header {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}

.ea-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ea-status-dot {
  width: 7px;
  height: 7px;
  background-color: #D4AF37;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.7);
}

.ea-header-text h4 {
  margin: 0;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.ea-header-text p {
  margin: 1px 0 0 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 10px;
}

.ea-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.ea-close-btn:hover {
  color: #ffffff;
}

.ea-chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ea-chat-body::-webkit-scrollbar {
  width: 4px;
}

.ea-chat-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.ea-msg-wrapper {
  display: flex;
  width: 100%;
}

.ea-msg-wrapper.user {
  justify-content: flex-end;
}

.ea-msg-wrapper.assistant {
  justify-content: flex-start;
}

.ea-msg-bubble {
  max-width: 85%;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.45;
  border-radius: 14px;
}

.ea-msg-wrapper.user .ea-msg-bubble {
  background: rgba(212, 175, 55, 0.18);
  color: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-bottom-right-radius: 2px;
}

.ea-msg-wrapper.assistant .ea-msg-bubble {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom-left-radius: 2px;
}

.ea-typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 14px !important;
}

.ea-typing span {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: typing 1.4s infinite both;
}

.ea-typing span:nth-child(1) { animation-delay: 0s; }
.ea-typing span:nth-child(2) { animation-delay: 0.2s; }
.ea-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-3px); }
}

.ea-footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.ea-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px 14px;
  color: #ffffff;
  font-size: 12px;
  outline: none;
  transition: border-color 0.25s;
}

.ea-input:focus {
  border-color: rgba(212, 175, 55, 0.5);
}

.ea-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.ea-send-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #D4AF37;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  padding: 0;
}

.ea-send-btn:hover:not(:disabled) {
  background: #f0c94a;
  transform: scale(1.05);
}

.ea-send-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
}

.ea-send-btn:disabled svg {
  stroke: rgba(255, 255, 255, 0.25);
}

.ea-fade-enter-active, .ea-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.ea-fade-enter-from, .ea-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>