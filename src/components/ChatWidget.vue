<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
    // ВЫВОДИМ ТОЧНУЮ ОШИБКУ НА ЭКРАН, А НЕ ЗАГЛУШКУ
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