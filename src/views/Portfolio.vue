<template>
  <section class="portfolio-page">
    
    <div class="premium-hero">
      <div class="hero-ambient-glow"></div>
      <div class="hero-ambient-core"></div>

      <div class="hero-nav">
        <router-link to="/" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>{{ t('port_back') }}</span>
        </router-link>
      </div>
      
      <div class="hero-content">
        <p id="subtitle" class="cinematic-reveal">{{ t('port_subtitle') }}</p>
        <h1 class="hero-title cinematic-reveal delay-100">
          <span class="hero-line">{{ t('port_hero_1') }}</span>
          <span class="hero-line">{{ t('port_hero_2') }}</span>
        </h1>
      </div>
    </div>

    <div class="cases-editorial-wrapper">
      
      <section 
        v-for="(item, index) in visibleCases" 
        :key="item.id + currentLang.code" 
        :id="item.id"
        class="editorial-section hypnotic-section"
        :ref="(el) => { if (el && !projectRefs.includes(el)) projectRefs.push(el) }"
      >
        <div class="container">
          
          <div class="editorial-case">
            
            <div class="case-visual-hero hypnotic-item delay-1" :class="{'mobile-app-layout': item.category.includes('Mobile') || item.category.includes('Мобильная') || item.category.includes('Мобільна') || item.category.includes('Móvil') || item.category.includes('Mobil')}">
              <transition-group name="cinematic-fade" tag="div" class="slider-wrapper">
                <img 
                  v-for="(img, imgIndex) in item.images" 
                  :key="img"
                  v-show="activeSlides[item.id] === imgIndex"
                  :src="img" 
                  :alt="item.title" 
                  class="case-media absolute-img" 
                  loading="lazy" 
                  decoding="async" 
                />
              </transition-group>
              
              <div class="media-overlay"></div>

              <div class="case-hero-typography">
                <h2 class="case-title">{{ item.title }}</h2>
              </div>
            </div>

            <div class="case-meta-bar hypnotic-item delay-2">
              <div class="meta-item">
                <span class="meta-label">{{ t('port_meta_dir') }}</span>
                <span class="case-category">{{ item.category }}</span>
              </div>
              <div class="meta-item year-item">
                <span class="meta-label">{{ t('port_meta_year') }}</span>
                <span class="meta-value">{{ item.year }}</span>
              </div>
            </div>

            <div class="case-content-grid hypnotic-item delay-3">
              
              <div class="grid-col challenge-col">
                <h4 class="spec-label">
                  <span class="status-dot problem"></span>
                  {{ t('port_challenge') }}
                </h4>
                <p class="spec-text" v-html="item.challenge"></p>
              </div>
              
              <div class="grid-col solution-col">
                <h4 class="spec-label">
                  <span class="status-dot solution"></span>
                  {{ t('port_solution') }}
                </h4>
                <p class="spec-text" v-html="item.solution"></p>
              </div>
              
              <div class="grid-col button-col" v-if="item.link !== '#'">
                <a :href="item.link" target="_blank" rel="noopener noreferrer" class="visit-btn-wrapper">
                  <div class="visit-btn-inner">
                    <span class="visit-text">{{ t('port_btn_live') }}</span>
                    <div class="visit-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
              <div class="grid-col button-col" v-else>
                <div class="private-badge-wrapper" :title="t('port_title_nda')">
                  <div class="private-badge-inner">
                    <span class="private-text">{{ t('port_btn_private') }}</span>
                    <div class="private-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div class="project-separator hypnotic-item delay-4" v-if="index !== visibleCases.length - 1"></div>

        </div>
      </section>

      <div class="container load-more-container" v-if="visibleCount < localizedCases.length">
        <button class="btn-load-more" @click="loadMoreProjects">
          <span>{{ t('port_btn_load') }}</span>
        </button>
      </div>

    </div>
    
    <div class="container hypnotic-section" :ref="(el) => { if (el && !projectRefs.includes(el)) projectRefs.push(el) }">
      <div class="cta-section hypnotic-item delay-1">
        <h2 class="cta-title">{{ t('port_cta_title') }}</h2>
        <button class="btn-silver-wrapper" @click="openModal()">
          <div class="btn-solid-silver-inner">
            <span class="btn-text">{{ t('port_cta_btn') }}</span>
          </div>
        </button>

        <div class="social-footer-wrapper">
          <p class="social-footer-text">{{ t('port_social_text') }}</p>
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
              <svg viewBox="0 0 24 24" fill="none" shape-rendering="geometricPrecision" class="social-svg">
                <g v-html="social.icon"></g>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>

    <Transition name="scroll-fade">
      <button 
        v-if="showScrollTop" 
        class="scroll-top-btn" 
        @mousedown="scrollToTop"
        @touchstart="scrollToTop"
        @click="scrollToTop"
        :aria-label="t('port_back')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </Transition>

    <ContactModal
      :isOpen="isModalOpen"
      :initialStack="selectedStack"
      :initialService="selectedService"
      @close="isModalOpen = false"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { t, currentLang } from '../composables/useLanguage';
import ContactModal from '../components/ContactModal.vue';

const route = useRoute();
const isDesktop = ref(true);
let lastWidth = 0;

const isModalOpen = ref(false);
const selectedStack = ref("");
const selectedService = ref("");
const showScrollTop = ref(false);

const openModal = (stack = "", service = "") => {
  selectedStack.value = stack;
  selectedService.value = service;
  isModalOpen.value = true;
};

const socials = [
  {
    name: "X",
    link: "https://x.com/efimovsagency?s=21",
    icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>'
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/efimovs.agency?stkn=MXF4enEyYjVwMWs5bA%3D%3D&utm_source=qr",
    icon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H7ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM18.5 6.75C19.1904 6.75 19.75 6.19036 19.75 5.5C19.75 4.80964 19.1904 4.25 18.5 4.25C17.8096 4.25 17.25 4.80964 17.25 5.5C17.25 6.19036 17.8096 6.75 18.5 6.75ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z" fill="currentColor"/>',
  },
  {
    name: "TikTok",
    link: "https://www.tiktok.com/@efimovs.agency?_r=1&_t=ZS-99fWmXTcfSe",
    icon: '<path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="currentColor"/>',
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/efimovs-agency/?viewAsMember=true",
    icon: '<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.11-4 0v5.6h-3v-11h3v1.77c1.4-2.59 7-2.78 7 2.48v6.75z" fill="currentColor"/>',
  }
];

const baseCases = [
  { id: 'aima', link: 'https://aimamarketing.ai', year: '2025', images: ['/images/aima-1.png', '/images/aima-2.png', '/images/aima-3.png'] },
  { id: 'geometriya', link: 'https://geometriya-web.vercel.app/', year: '2026', images: ['/images/geometriya-1.png', '/images/geometriya-2.png', '/images/geometriya-3.png', '/images/geometriya-4.png'] },
  { id: 'qr-cafe', link: 'https://qr-cafe-beige.vercel.app', year: '2026', images: ['/images/qrcafe-1.png', '/images/qrcafe-2.png', '/images/qrcafe-3.png', '/images/qrcafe-4.png'] },
  { id: 'corporate-sports', link: 'https://play.google.com/store/apps/details?id=com.corporatesports.club', year: '2024', images: ['/images/sports-1.png', '/images/sports-2.png', '/images/sports-3.png'] },
  { id: 'shortlyst', link: 'https://shortlyst.ai', year: '2025', images: ['/images/shortlyst-1.png', '/images/shortlyst-2.png', '/images/shortlyst-3.png'] },
  { id: 'vitolker', link: 'https://play.google.com/store/apps/details?id=com.vitolker.client.app', year: '2023', images: ['/images/vitolker-1.png', '/images/vitolker-2.png', '/images/vitolker-3.png'] }
];

const caseTranslations = {
  EN: {
    aima: { title: 'AiMA Platform', category: 'Web Development', challenge: 'Marketing teams struggled to sustain high-volume content, leading to <strong class="text-glow">declining engagement and unscalable manual workflows</strong>.', solution: 'Developed a fast and convenient application with <strong class="text-glow">clear charts and automated content generation</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Web Development', challenge: 'A furniture manufacturer needed to showcase their portfolio and <strong class="text-glow">simplify booking a consultation</strong>.', solution: 'Developed a user-friendly single-page website: added <strong class="text-glow">smooth text, beautiful photos, and an easy way to get in touch</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Web Development', challenge: 'A local cafe needed a fast, digital presence to replace their outdated menu and <strong class="text-glow">provide a quick way to book a table</strong>.', solution: 'Created a user-friendly website with <strong class="text-glow">beautiful effects, a custom online menu, and convenient booking</strong>.' },
    'corporate-sports': { title: 'Corporate Sports Club', category: 'Mobile Development', challenge: 'Corporate teams needed a centralized platform to <strong class="text-glow">manage sports events, team registrations, and schedules</strong>.', solution: 'Delivered a robust mobile application to <strong class="text-glow">streamline sports event management and community engagement</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Web Development', challenge: 'Recruiters spent 70% of their time manually sourcing candidates with <strong class="text-glow">no automated way to track engagement</strong>.', solution: 'Built a full-stack SaaS platform featuring <strong class="text-glow">AI-driven LinkedIn analysis</strong> for precise candidate matching.' },
    vitolker: { title: 'Vitolker', category: 'Mobile Development', challenge: 'Businesses needed secure communication for <strong class="text-glow">internal team and client interactions</strong>.', solution: 'Developed a secure messenger guaranteeing <strong class="text-glow">excellent calls and instant messaging</strong>.' }
  },
  RU: {
    aima: { title: 'AiMA Platform', category: 'Веб-разработка', challenge: 'Маркетинговые команды не справлялись с объемами контента, что вело к <strong class="text-glow">падению вовлеченности и рутине</strong>.', solution: 'Разработали быструю и удобную программу с <strong class="text-glow">понятными графиками и автоматической генерацией контента</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Веб-разработка', challenge: 'Производителю мебели требовалось показать портфолио и <strong class="text-glow">упростить запись на консультацию</strong>.', solution: 'Разработали удобный сайт в одну страницу: добавили <strong class="text-glow">плавний текст, красивые фотографии и легкий способ связаться</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Веб-разработка', challenge: 'Локальному кафе требовалось цифровое меню и <strong class="text-glow">быстрый способ бронирования столиков</strong>.', solution: 'Создали удобный сайт с <strong class="text-glow">красивыми эффектами, индивидуальным онлайн меню и удобным бронированием</strong>.' },
    'corporate-sports': { title: 'Корпоративный Спортклуб', category: 'Мобильная разработка', challenge: 'Командам требовалась единая платформа для <strong class="text-glow">управления мероприятиями, регистрацией и расписанием</strong>.', solution: 'Создали мощное мобильное приложение для <strong class="text-glow">оптимизации управления спортивными событиями</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Веб-разработка', challenge: 'Рекрутеры тратили 70% времени на ручной поиск, <strong class="text-glow">не имея автоматизации отслеживания откликов</strong>.', solution: 'Разработали full-stack SaaS платформу с <strong class="text-glow">ИИ-анализом LinkedIn</strong> для точного подбора кандидатов.' },
    vitolker: { title: 'Vitolker', category: 'Мобильная разработка', challenge: 'Бизнесу требовалась защищенная связь для <strong class="text-glow">общения внутри команды и с заказчиками</strong>.', solution: 'Разработали безопасный мессенджер, гарантирующий <strong class="text-glow">отличные звонки и мгновенную переписку</strong>.' }
  },
  UA: {
    aima: { title: 'AiMA Platform', category: 'Веб-розробка', challenge: 'Маркетингові команди не справлялися з обсягами контенту, що призводило до <strong class="text-glow">падіння залученості та рутини</strong>.', solution: 'Розробили швидку та зручну програму зі <strong class="text-glow">зрозумілими графіками та автоматичною генерацією контенту</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Веб-розробка', challenge: 'Виробнику меблів було нужно показати портфоліо та <strong class="text-glow">спростити запис на консультацію</strong>.', solution: 'Розробили зручний сайт в одну сторінку: додали <strong class="text-glow">плавний текст, красиві фотографії та легкий спосіб зв\'язатися</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Веб-розробка', challenge: 'Локальному кафе було потрібно цифрове меню та <strong class="text-glow">швидкий спосіб бронювання столиків</strong>.', solution: 'Створили зручний сайт з <strong class="text-glow">красивими ефектами, індивідуальним онлайн меню та зручним бронюванням</strong>.' },
    'corporate-sports': { title: 'Корпоративний Спортклуб', category: 'Мобільна розробка', challenge: 'Командам потрібна була єдина платформа для <strong class="text-glow">управління заходами, реєстрацією та розкладом</strong>.', solution: 'Створили потужний мобільний додаток для <strong class="text-glow">оптимізації управління спортивними подіями</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Веб-розробка', challenge: 'Рекрутери витрачали 70% часу на ручний пошук, <strong class="text-glow">не маючи автоматизації відстеження відгуків</strong>.', solution: 'Розробили full-stack SaaS платформу з <strong class="text-glow">ШІ-аналізом LinkedIn</strong> для точного підбору кандидатів.' },
    vitolker: { title: 'Vitolker', category: 'Мобільна розробка', challenge: 'Бізнесу була потрібна захищена комунікація для <strong class="text-glow">спілкування всередині команди та з замовниками</strong>.', solution: 'Розробили безпечний месенджер, що гарантує <strong class="text-glow">відмінні дзвінки та миттєве листування</strong>.' }
  },
  TR: {
    aima: { title: 'AiMA Platform', category: 'Web Geliştirme', challenge: 'Pazarlama ekipleri yüksek hacimli içerik üretimini sürdürmekte zorlanıyordu, bu da <strong class="text-glow">düşen etkileşim ve ölçeklenemeyen manuel süreçlere</strong> yol açıyordu.', solution: '<strong class="text-glow">Net grafikler ve otomatik içerik üretimi</strong> sunan hızlı ve kullanışlı bir uygulama geliştirdik.' },
    geometriya: { title: 'Geometriya', category: 'Web Geliştirme', challenge: 'Bir mobilya üreticisinin portföyünü sergilemesi ve <strong class="text-glow">danışmanlık randevusu almayı kolaylaştırması</strong> gerekiyordu.', solution: 'Kullanıcı dostu tek sayfalık bir web sitesi geliştirdik: <strong class="text-glow">akıcı metinler, harika fotoğraflar ve kolay iletişim yolu</strong> ekledik.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Web Geliştirme', challenge: 'Yerel bir kafenin eski menüsünü yenilemek ve <strong class="text-glow">hızlı masa rezerve etme imkanı sunmak</strong> için dijital bir çözüme ihtiyacı vardı.', solution: '<strong class="text-glow">Etkileyici efektler, özel online menü ve pratik rezervasyon</strong> içeren kullanıcı dostu bir web sitesi oluşturduk.' },
    'corporate-sports': { title: 'Kurumsal Spor Kulübü', category: 'Mobil Geliştirme', challenge: 'Kurumsal ekiplerin <strong class="text-glow">spor etkinliklerini, takım kayıtlarını ve takvimleri yönetmek</strong> için merkezi bir platforma ihtiyacı vardı.', solution: '<strong class="text-glow">Spor etkinlik yönetimini ve topluluk katılımını kolaylaştıran</strong> güçlü bir mobil uygulama sunduk.' },
    shortlyst: { title: 'Shortlyst', category: 'Web Geliştirme', challenge: 'İnsan kaynakları uzmanları, adayları manuel olarak aramak için zamanlarının %70\'ini harcıyordu ve <strong class="text-glow">yanıtları takip edecek otomatik bir sistemleri yoktu</strong>.', solution: 'Hassas aday eşleştirmesi için <strong class="text-glow">Yapay Zeka destekli LinkedIn analizine</strong> sahip full-stack bir SaaS platformu inşa ettik.' },
    vitolker: { title: 'Vitolker', category: 'Mobil Geliştirme', challenge: 'İşletmelerin <strong class="text-glow">ekip içi ve müşteri iletişiminde</strong> güvenli bir çözüme ihtiyacı vardı.', solution: '<strong class="text-glow">Yüksek kaliteli aramalar ve anlık mesajlaşma</strong> garantisi sunan güvenli bir mesajlaşma uygulaması geliştirdik.' }
  },
  DE: {
    aima: { title: 'AiMA Platform', category: 'Webentwicklung', challenge: 'Marketing-Teams kämpften mit hohem Content-Volumen, was zu <strong class="text-glow">sinkendem Engagement und unskalierbaren manuellen Workflows</strong> führte.', solution: 'Entwickelten eine schnelle und praktische Anwendung mit <strong class="text-glow">übersichtlichen Diagrammen und automatisierter Content-Erstellung</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Webentwicklung', challenge: 'Ein Möbelhersteller musste sein Portfolio präsentieren und <strong class="text-glow">die Terminbuchung vereinfachen</strong>.', solution: 'Entwickelten eine benutzerfreundliche Single-Page-Website: mit <strong class="text-glow">flüssigem Text, schönen Fotos und einer einfachen Kontaktmöglichkeit</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Webentwicklung', challenge: 'Ein lokales Café benötigte eine schnelle, digitale Präsenz, um sein veraltetes Menü zu ersetzen und <strong class="text-glow">eine schnelle Tischreservierung zu ermöglichen</strong>.', solution: 'Erstellten eine benutzerfreundliche Website mit <strong class="text-glow">schönen Effekten, einem individuellen Online-Menü und bequemer Buchung</strong>.' },
    'corporate-sports': { title: 'Firmen-Sportclub', category: 'Mobile Entwicklung', challenge: 'Unternehmensteams benötigten eine zentrale Plattform, um <strong class="text-glow">Sportveranstaltungen, Teamanmeldungen und Zeitpläne zu verwalten</strong>.', solution: 'Bereitstellung einer robusten mobilen Anwendung zur <strong class="text-glow">Optimierung des Sport-Event-Managements und der Community-Bindung</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Webentwicklung', challenge: 'Personalvermittler verbrachten 70% ihrer Zeit mit der manuellen Kandidatensuche, mit <strong class="text-glow">keiner automatisierten Möglichkeit, das Engagement zu verfolgen</strong>.', solution: 'Aufbau einer Full-Stack-SaaS-Plattform mit <strong class="text-glow">KI-gesteuerter LinkedIn-Analyse</strong> für präzises Kandidaten-Matching.' },
    vitolker: { title: 'Vitolker', category: 'Mobile Entwicklung', challenge: 'Unternehmen benötigten eine sichere Kommunikation für <strong class="text-glow">interne Team- und Kundeninteraktionen</strong>.', solution: 'Entwickelten einen sicheren Messenger, der <strong class="text-glow">hervorragende Anrufe und Sofortnachrichten</strong> garantiert.' }
  },
  FR: {
    aima: { title: 'AiMA Platform', category: 'Développement Web', challenge: 'Les équipes marketing peinaient à soutenir un volume élevé de contenu, entraînant <strong class="text-glow">une baisse de l\'engagement et des flux de travail manuels</strong>.', solution: 'Développement d\'une application rapide et pratique avec <strong class="text-glow">des graphiques clairs et une génération de contenu automatisée</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Développement Web', challenge: 'Un fabricant de meubles devait présenter son portfolio et <strong class="text-glow">simplifier la prise de rendez-vous</strong>.', solution: 'Développement d\'un site web d\'une seule page convivial : ajout <strong class="text-glow">de texte fluide, de belles photos et d\'un moyen simple de nous contacter</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Développement Web', challenge: 'Un café local avait besoin d\'une présence numérique rapide pour remplacer son menu obsolète et <strong class="text-glow">offrir un moyen rapide de réserver une table</strong>.', solution: 'Création d\'un site web convivial avec <strong class="text-glow">de superbes effets, un menu en ligne personnalisé et une réservation pratique</strong>.' },
    'corporate-sports': { title: 'Club de Sport', category: 'Développement Mobile', challenge: 'Les équipes d\'entreprise avaient besoin d\'une plateforme pour <strong class="text-glow">gérer les événements sportifs, les inscriptions et les horaires</strong>.', solution: 'Livraison d\'une application mobile robuste pour <strong class="text-glow">rationaliser la gestion des événements sportifs et l\'engagement</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Développement Web', challenge: 'Les recruteurs passaient 70% de leur temps à rechercher manuellement des candidats <strong class="text-glow">sans moyen automatisé de suivre l\'engagement</strong>.', solution: 'Création d\'une plateforme SaaS Full-stack avec <strong class="text-glow">analyse LinkedIn pilotée par l\'IA</strong> pour un recrutement précis.' },
    vitolker: { title: 'Vitolker', category: 'Développement Mobile', challenge: 'Les entreprises avaient besoin d\'une communication sécurisée pour <strong class="text-glow">les interactions en interne et avec les clients</strong>.', solution: 'Développement d\'une messagerie sécurisée garantissant <strong class="text-glow">d\'excellents appels et une messagerie instantanée</strong>.' }
  },
  ES: {
    aima: { title: 'AiMA Platform', category: 'Desarrollo Web', challenge: 'Los equipos de marketing luchaban por mantener un alto volumen de contenido, lo que provocaba <strong class="text-glow">una disminución de la participación y flujos de trabajo manuales</strong>.', solution: 'Desarrollamos una aplicación rápida y práctica con <strong class="text-glow">gráficos claros y generación de contenido automatizada</strong>.' },
    geometriya: { title: 'Geometriya', category: 'Desarrollo Web', challenge: 'Un fabricante de muebles necesitaba mostrar su portafolio y <strong class="text-glow">simplificar la reserva de una consulta</strong>.', solution: 'Desarrollamos un sitio web de una sola página fácil de usar: agregamos <strong class="text-glow">texto fluido, hermosas fotos y una forma fácil de contactar</strong>.' },
    'qr-cafe': { title: 'QR Cafe', category: 'Desarrollo Web', challenge: 'Un café local necesitaba una presencia digital rápida para reemplazar su menú y <strong class="text-glow">proporcionar una forma rápida de reservar una mesa</strong>.', solution: 'Creamos un sitio web fácil de usar con <strong class="text-glow">hermosos efectos, un menú en línea personalizado y reservas convenientes</strong>.' },
    'corporate-sports': { title: 'Club de Deportes', category: 'Desarrollo Móvil', challenge: 'Los equipos corporativos necesitaban una plataforma para <strong class="text-glow">gestionar eventos deportivos, inscripciones y horarios</strong>.', solution: 'Se entregó una aplicación móvil robusta para <strong class="text-glow">optimizar la gestión de eventos deportivos y la participación</strong>.' },
    shortlyst: { title: 'Shortlyst', category: 'Desarrollo Web', challenge: 'Los reclutadores pasaban el 70% de su tiempo buscando candidatos manualmente <strong class="text-glow">sin una forma automatizada de seguimiento</strong>.', solution: 'Se creó una plataforma SaaS full-stack con <strong class="text-glow">análisis de LinkedIn impulsado por IA</strong> para una selección precisa.' },
    vitolker: { title: 'Vitolker', category: 'Desarrollo Móvil', challenge: 'Las empresas necesitaban una comunicación segura para <strong class="text-glow">las interacciones internas del equipo y con los clientes</strong>.', solution: 'Desarrollamos un mensajero seguro que garantiza <strong class="text-glow">excelentes llamadas y mensajería instantánea</strong>.' }
  }
};

const localizedCases = computed(() => {
  const langData = caseTranslations[currentLang.value.code] || caseTranslations.EN;
  return baseCases.map(c => ({
    ...c,
    ...langData[c.id]
  }));
});

const visibleCount = ref(4); 
const visibleCases = computed(() => localizedCases.value.slice(0, visibleCount.value));

const loadMoreProjects = () => {
  visibleCount.value += 4; 
  nextTick(() => {
    projectRefs.value.forEach((el) => {
      if (el && observer) observer.observe(el);
    });
  });
};

const initialSlides = {};
baseCases.forEach(c => { initialSlides[c.id] = 0; });
const activeSlides = ref(initialSlides);

let sliderInterval;
const projectRefs = ref([]);
let observer = null;

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 800;
};

const scrollToTop = () => {
  if (window.lenis) {
    window.lenis.scrollTo(0, {
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      force: true 
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (route.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
};

onMounted(() => {
  sliderInterval = setInterval(() => {
    visibleCases.value.forEach(c => {
      if (c.images && c.images.length > 1) {
        activeSlides.value[c.id] = (activeSlides.value[c.id] + 1) % c.images.length;
      }
    });
  }, 3500); 
  
  lastWidth = window.innerWidth;
  isDesktop.value = window.innerWidth >= 1024;
  
  window.addEventListener("resize", checkDevice, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true }); 

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1, 
    rootMargin: "0px 0px -100px 0px" 
  });

  nextTick(() => {
    projectRefs.value.forEach((el) => {
      if (el) observer.observe(el);
    });

    setTimeout(() => {
      if (route.hash) {
        const targetEl = document.querySelector(route.hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  });
});

onBeforeUnmount(() => {
  clearInterval(sliderInterval);
  window.removeEventListener("resize", checkDevice);
  window.removeEventListener("scroll", handleScroll); 
  if (observer) observer.disconnect();
});

const checkDevice = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth !== lastWidth) {
    isDesktop.value = currentWidth >= 1024;
    lastWidth = currentWidth;
  }
};
</script>

<style scoped>
.portfolio-page { 
  padding: 0px 0px 150px 0px; 
  min-height: 1000px; 
  position: relative; 
  z-index: 1; 
  font-family: "Plus Jakarta Sans", sans-serif; 
  background-color: #000000; 
  color: #ffffff;
  overflow-x: hidden; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.container { 
  max-width: 1400px; 
  margin: 0px auto; 
  padding: 0px 40px; 
}

/* === 🌟 АНИМАЦИИ 🌟 === */
.hypnotic-item {
  opacity: 0;
  transform: translateY(120px) scale(0.85) translateZ(0px);
  filter: blur(10px); 
  transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), 
              filter 1.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;
}

.hypnotic-section.is-visible .hypnotic-item {
  opacity: 1;
  transform: translateY(0px) scale(1) translateZ(0px);
  filter: blur(0px);
}

.delay-1 { transition-delay: 0.1s; } 
.delay-2 { transition-delay: 0.3s; } 
.delay-3 { transition-delay: 0.5s; } 
.delay-4 { transition-delay: 0.7s; } 

/* === 🌟 HERO БЛОК 🌟 === */
.premium-hero {
  position: relative;
  width: 100%;
  height: 850px; 
  min-height: 700px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: hidden;
  background: #000000;
}

.hero-ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2500px; 
  height: 2500px; 
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.04) 0px, rgba(0, 0, 0, 0) 750px);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
  transform: translate(-1250px, -1250px) translateZ(0px); 
  animation: breatheAndRotate 15s linear infinite;
}

.hero-ambient-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1000px; 
  height: 1000px; 
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.06) 0px, rgba(0, 0, 0, 0) 250px);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
  transform: translate(-500px, -500px) translateZ(0px); 
  animation: breatheFast 5s ease-in-out infinite alternate;
}

@keyframes breatheAndRotate {
  0% { transform: translate(-1250px, -1250px) translateZ(0px) scale(0.9) rotate(0deg); opacity: 0.6; }
  50% { transform: translate(-1250px, -1250px) translateZ(0px) scale(1.1) rotate(180deg); opacity: 1; }
  100% { transform: translate(-1250px, -1250px) translateZ(0px) scale(0.9) rotate(360deg); opacity: 0.6; }
}

@keyframes breatheFast {
  0% { transform: translate(-500px, -500px) translateZ(0px) scale(0.9); opacity: 0.4; }
  100% { transform: translate(-500px, -500px) translateZ(0px) scale(1.1); opacity: 1; }
}

.hero-nav { position: absolute; top: 60px; left: 60px; z-index: 10; }

.back-link { 
  display: inline-flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.4); text-decoration: none; 
  font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; transition: color 0.4s ease; 
}
.back-link svg { width: 16px; height: 16px; transition: transform 0.4s ease; }
.back-link:hover { color: #ffffff; }
.back-link:hover svg { transform: translateX(-5px); }

.hero-content {
  position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 1200px; 
  margin-top: -60px; 
  width: 100%;
  padding: 0 20px;
}

#subtitle { text-transform: uppercase; letter-spacing: 12px; font-size: 11px; margin: 0px 0px 35px 0px; font-weight: 800; color: #d4af37; }

/* === УПРАВЛЕНИЕ ЗАГОЛОВКОМ (ДЕСКТОП) === */
.hero-title { 
  font-size: clamp(32px, 6.5vw, 96px); 
  font-weight: 800; 
  margin: 0px auto; 
  letter-spacing: -0.5px; /* Корректный межбуквенный интервал */
  word-spacing: 0.12em;   /* Аккуратный отступ между словами на десктопе */
  line-height: 1.22;      /* Исключает срез нижних элементов букв (g, y, p) */
  background: linear-gradient(180deg, #ffffff 0px, #c0c0c0 50%, #555555 100%);
  -webkit-background-clip: text !important; 
  background-clip: text !important; 
  color: transparent !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hero-line {
  display: block;
  white-space: nowrap;
  padding-bottom: 0.08em; /* Выделение пространства под маску для нижних выносов букв */
}

.pulse-dot { color: #d4af37; -webkit-text-fill-color: initial; display: inline-block; animation: pulseDot 2.5s ease-in-out infinite alternate; }

@keyframes pulseDot {
  0% { opacity: 0.7;}
  100% { opacity: 1;}
}

.cinematic-reveal { opacity: 0; filter: blur(20px); transform: scale(0.95) translateY(20px); animation: slowCinematicFade 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slowCinematicFade { 0% { opacity: 0; filter: blur(20px); transform: scale(0.95) translateY(20px); } 100% { opacity: 1; filter: blur(0px); transform: scale(1) translateY(0px); } }

/* === 🌟 ОБОЛОЧКА СЕКЦИЙ 🌟 === */
.cases-editorial-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editorial-section {
  width: 100%;
  padding: 0px; 
  scroll-margin-top: 120px; 
}

.editorial-case {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* === 🌟 ВИЗУАЛ 🌟 === */
.case-visual-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; 
  border-radius: 24px;
  overflow: hidden;
  background: #09090b;
  transform: translateZ(0px);
  cursor: pointer;
  z-index: 1;
}

.slider-wrapper {
  position: absolute;
  inset: 0px;
  width: 100%;
  height: 100%;
}

.absolute-img {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.case-media {
  object-fit: cover;
  image-rendering: -webkit-optimize-contrast; 
  -webkit-backface-visibility: hidden; 
  filter: grayscale(0) brightness(1.05);
  transform: scale(1.03) translateZ(0px);
  will-change: opacity;
}

.cinematic-fade-enter-active,
.cinematic-fade-leave-active {
  transition: opacity 0.8s ease-in-out; 
}
.cinematic-fade-enter-from,
.cinematic-fade-leave-to {
  opacity: 0;
}

.media-overlay {
  position: absolute;
  inset: 0px;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.4) 250px, transparent 500px);
  pointer-events: none;
  z-index: 2;
}

.case-hero-typography {
  position: absolute;
  bottom: 75px; 
  left: 50px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 6px; 
}

.case-title {
  font-size: 62px; 
  font-weight: 800;
  margin: 0px;
  letter-spacing: -2px;
  line-height: 62px;
  color: #ffffff;
  overflow-wrap: break-word; 
}

/* === 🌟 МЕТАДАННЫЕ 🌟 === */
.case-meta-bar {
  display: flex;
  align-items: flex-start;
  gap: 80px; 
  padding: 40px 0px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.12); 
  margin-bottom: 40px;
  position: relative;
  z-index: 5; 
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 12px; 
}

.meta-label {
  font-size: 12px; 
  font-weight: 800;
  color: #a1a1aa; 
  text-transform: uppercase;
  letter-spacing: 3px;
  white-space: nowrap; 
}

.meta-value, .case-category {
  font-size: 20px; 
  color: #ffffff; 
  font-weight: 700;
  letter-spacing: -0.5px;
  white-space: nowrap; 
}

.case-category {
  color: #d4af37;
}

/* === 🌟 СЕТКА ТЕКСТА 🌟 === */
.case-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 50px; 
  align-items: stretch; 
  position: relative;
  z-index: 5;
}

.grid-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
}

.challenge-col {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding-right: 30px;
}

.solution-col {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding-right: 30px;
}

.button-col {
  align-items: flex-start;
  justify-content: center; 
  padding-left: 10px;
}

.spec-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  font-weight: 800;
  color: #8a8a93; 
  text-transform: uppercase;
  letter-spacing: 4px;
  margin: 0px 0px 20px 0px;
}

.status-dot {
  width: 8px; 
  height: 8px; 
  border-radius: 8px; 
  display: inline-block;
}
.status-dot.problem {
  background-color: #ff453a; 
}
.status-dot.solution {
  background-color: #32d74b; 
}

.spec-text {
  font-size: 16px;
  line-height: 29px; 
  color: #a1a1aa; 
  margin: 0px;
  font-weight: 400;
  max-width: 380px; 
  letter-spacing: 0.3px; 
}

:deep(.text-glow) {
  color: #ffffff; 
  font-weight: 600; 
}

/* === 🌟 КНОПКИ ПРОЕКТОВ 🌟 === */
.visit-btn-wrapper {
  display: inline-block;
  text-decoration: none;
  border-radius: 100px;
  position: relative; 
}

.visit-btn-inner {
  display: inline-flex; align-items: center; gap: 20px; 
  padding: 16px 20px 16px 35px; 
  border-radius: 100px;
  background: #ffffff; 
  text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
  width: max-content; 
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease;
  transform: translateZ(0px);
  backface-visibility: hidden;
  will-change: transform;
}

.visit-text { color: #000000; }

.visit-icon { 
  display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; 
  background: #000000; color: #ffffff; border-radius: 34px; 
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
  transform: translateZ(0px);
}
.visit-icon svg { width: 14px; height: 14px; stroke-width: 2px; }

@media (hover: hover) and (pointer: fine) {
  .visit-btn-wrapper:hover .visit-btn-inner {
    background: #d4af37; 
    transform: translateY(-3px) translateZ(0px); 
  }
  .visit-btn-wrapper:hover .visit-icon { 
    transform: translateX(5px) translateZ(0px); 
  }
}

.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0 40px 0; 
  margin: 0 auto;
  width: 100%;
}

.btn-load-more {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff; 
  padding: 14px 40px; 
  border-radius: 100px;
  font-family: inherit;
  font-size: 12px; 
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  outline: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateZ(0px);
  backface-visibility: hidden;
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .btn-load-more:hover {
    background: rgba(255, 255, 255, 0.05); 
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px) translateZ(0px); 
  }
}

.private-badge-wrapper {
  display: inline-block;
  border-radius: 100px;
  padding: 1px; 
  background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%);
  position: relative;
}

.private-badge-inner {
  display: inline-flex; 
  align-items: center; 
  gap: 15px;
  padding: 15px 20px 15px 30px;
  border-radius: 100px;
  background: #09090b; 
  color: #8a8a93;
  font-size: 12px; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 2px;
  cursor: default;
  width: max-content;
}

.private-icon {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 34px; 
  height: 34px;
  background: rgba(255,255,255,0.05); 
  border-radius: 50%;
  color: #a1a1aa;
}
.private-icon svg { width: 14px; height: 14px; stroke-width: 2px; }

.project-separator {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1); 
  margin: 100px 0px; 
}

.cta-section { margin-top: 40px; text-align: center; padding: 100px 0px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
.cta-title { font-size: 42px; font-weight: 800; margin: 0px 0px 40px 0px; letter-spacing: -1.5px; }

.btn-silver-wrapper {
  display: inline-block;
  background: transparent;
  border: none;
  padding: 0px;
  cursor: pointer;
  outline: none;
  border-radius: 100px;
}

.btn-solid-silver-inner { 
  display: inline-flex; align-items: center; justify-content: center; 
  background: #e5e4e2; 
  color: #000000; 
  padding: 20px 50px; 
  border-radius: 100px; 
  font-size: 15px; 
  font-weight: 800; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  text-decoration: none; 
  font-family: inherit; 
  transition: transform 0.3s ease, background-color 0.3s ease;
  transform: translateZ(0px);
  backface-visibility: hidden;
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .btn-silver-wrapper:hover .btn-solid-silver-inner { 
    background: #ffffff; 
    transform: translateY(-3px) translateZ(0px); 
  }
}

.social-footer-wrapper {
  margin-top: 80px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.social-footer-text {
  font-size: 14px;
  color: #8a8a93;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin: 0;
}

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
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform, filter; 
  transform: translateZ(0);
}

@media (hover: hover) and (pointer: fine) {
  .social-link-minimal:hover { color: #ffffff; }
  .social-link-minimal:hover .social-svg {
    transform: translateY(-4px) scale(1.15);
  }
}

.scroll-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateZ(0);
}

.scroll-top-btn svg {
  width: 22px;
  height: 22px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease;
}

@media (hover: hover) and (pointer: fine) {
  .scroll-top-btn:hover {
    background: #e5e4e2; 
    border-color: #ffffff;
    box-shadow: none; 
  }
  
  .scroll-top-btn:hover svg {
    color: #000000;
  }
}

.scroll-fade-enter-active, 
.scroll-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-fade-enter-from, 
.scroll-fade-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* === АДАПТИВНОСТЬ === */

@media (max-width: 1024px) {
  .hero-nav { left: 40px; top: 40px; }
  .case-title { font-size: 42px; }
  
  .case-meta-bar {
    gap: 40px; 
  }

  .case-content-grid { 
    grid-template-columns: 1fr 1fr; 
    gap: 40px; 
  }
  .grid-col.solution-col {
    border-right: none;
    padding-right: 0px;
  }
  .grid-col.button-col { 
    grid-column: span 2; 
    align-items: flex-start; 
    padding-top: 20px; 
    padding-left: 0px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}

/* МОБИЛЬНЫЕ СТИЛИ (НЕ ТРОГАЛИСЬ) */
@media (max-width: 768px) {
  .premium-hero { 
    height: auto;
    min-height: 500px; 
    padding: 110px 15px 60px 15px; 
  } 
  .hero-nav { left: 20px; top: 20px; }
  
  .hero-content {
    margin-top: 0px; 
    padding: 0px;
    width: 100%;
  }

  .hero-title {
    font-size: clamp(26px, 7vw, 44px);
    letter-spacing: 0px !important;
    word-spacing: 0.18em;
    line-height: 1.22;
  }

  .hero-line {
    white-space: nowrap;
    display: block;
    text-align: center;
  }

  #subtitle { 
    font-size: 11px; 
    letter-spacing: 6px;
    margin-bottom: 20px; 
  }
  
  .container { padding: 0px 15px; } 
  
  .case-visual-hero { 
    aspect-ratio: 16 / 9; 
    border-radius: 16px; 
  }

  .case-visual-hero.mobile-app-layout {
    aspect-ratio: 3 / 4; 
  }
  
  .case-visual-hero.mobile-app-layout .case-media {
    transform: scale(1.15) translateZ(0px); 
    object-position: center center;
  }
  
  .case-hero-typography { left: 20px; bottom: 15px; gap: 2px; }
  .case-title { font-size: 24px; line-height: 28px; }
  
  .media-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.2) 80px, transparent 150px);
  }
  
  .case-meta-bar {
    display: flex; 
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 24px 0px;
    padding: 24px 0px;
    margin-bottom: 20px;
  }
  
  .meta-item {
    width: auto; 
  }

  .year-item {
    display: none !important; 
  }
  
  .meta-label, .meta-value, .case-category {
    white-space: normal;
    overflow-wrap: break-word;
  }

  .meta-value, .case-category {
    font-size: 18px; 
  }

  .case-content-grid { 
    display: flex;
    flex-direction: column;
    gap: 40px; 
  }
  
  .grid-col { 
    width: 100%;
    align-items: flex-start; 
    border-right: none !important; 
    padding-right: 0px !important; 
  }
  
  .spec-text { 
    font-size: 16px; 
    line-height: 26px; 
    max-width: 100%; 
  }

  .grid-col.button-col { 
    border-top: none; 
    padding-top: 10px; 
    padding-left: 0px; 
  } 
  
  .visit-btn-wrapper { width: 100%; display: block; }
  .visit-btn-inner { width: 100%; justify-content: center; padding: 16px 20px; position: relative; }
  .visit-btn-inner .visit-icon { position: absolute; right: 16px; }
  
  .private-badge-wrapper { width: 100%; display: block; }
  .private-badge-inner { width: 100%; justify-content: center; padding: 16px 20px; position: relative; }
  .private-badge-inner .private-icon { position: absolute; right: 16px; }

  .project-separator { margin: 60px 0px; }
  
  .load-more-container {
    padding: 40px 0 0px 0; 
    margin-top: 20px;
  }

  .btn-load-more {
    width: max-content; 
    padding: 14px 32px;
    font-size: 11px;
  }

  .cta-section { margin-top: 40px; padding: 60px 0px; }
  .cta-title { font-size: 32px; }
  
  .btn-solid-silver-inner { 
    padding: 14px 32px; 
    font-size: 13px; 
    letter-spacing: 1.5px; 
  }

  .social-footer-wrapper {
    margin-top: 50px;
    padding-top: 35px;
    gap: 25px;
  }
  
  .social-footer-text {
    font-size: 13px;
    max-width: 280px;
    line-height: 1.5;
    text-align: center;
  }
  
  .socials-row { gap: 25px; }

  .scroll-top-btn {
    bottom: 25px;
    right: 25px;
    width: 50px;
    height: 50px;
  }
}
</style>