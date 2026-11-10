<template>
  <section id="faq" class="faq-luxury" :class="{ 'tg-safe-mode': isTelegram }">
    <div v-if="isDesktop && !isTelegram" class="ambient-glow" v-once></div>

    <div class="container">
      
      <!-- 🌟 Заголовок с идеальным скроллом и центрированием -->
      <div class="section-header">
        <span class="kicker">{{ t('faq_kicker') }}</span>
        
        <div class="title-scroll-wrapper">
          <h2 class="gradient-title" v-html="t('faq_title')"></h2>
        </div>
        
        <p class="section-subtitle">{{ t('faq_sub') }}</p>
      </div>

      <div class="faq-list">
        <!-- Обертка карточек -->
        <div 
          v-for="(item, index) in currentFaqs" 
          :key="index + currentLang.code"
          class="faq-card-wrapper"
        >
          <!-- 🚀 Карточка -->
          <div 
            class="faq-card"
            :class="{ 'is-open': activeIndex === index }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ item.question }}</h3>
              
              <div class="icon-cross" v-once>
                <span class="line horizontal"></span>
                <span class="line vertical"></span>
              </div>
            </div>
            
            <transition 
              @enter="onEnter" 
              @after-enter="onAfterEnter" 
              @leave="onLeave"
            >
              <div v-show="activeIndex === index" class="faq-answer-wrapper">
                <div class="answer-inner">
                  <p v-html="item.answer"></p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- 🌟 Кнопка вызова действия (из Expertise.vue) -->
      <div class="section-cta-wrapper">
        <button class="main-action-btn" @click="$emit('open-contact')">
          {{ t('btn_discuss') }}
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { t, currentLang } from "../composables/useLanguage";

defineEmits(['open-contact']);

const faqDict = {
  EN: [
    { question: "How do we start, and what are the payment terms?", answer: "The project kicks off after a <b>50% deposit</b> is made. Our lead developers are frequently booked with large-scale projects, so this deposit securely reserves the next available slot in our team's production schedule.<br><br>For smaller projects, the remaining balance is paid prior to the final deployment of the ready solution to your servers. If the project is large-scale and requires extensive development time, we divide the payment into transparent development milestones. The final payment structure is always determined strictly on an individual basis with our manager during a call." },
    { question: "How is communication and development control structured?", answer: "We value your time, which is why we build a fully transparent yet unobtrusive process. A dedicated personal manager is assigned to your project for the entire development period.<br><br>If any questions arise during the work process, you can confidently reach out to them during their working hours. We highly respect our team's personal time, therefore, <b>outside of working hours, the manager is offline and will not respond to messages</b>, but will absolutely get back to you first thing at the start of the next business day." },
    { question: "What if we want to add a new feature during the development process?", answer: "Brilliant ideas often emerge during development. If a new feature (e.g., a complex integration system or a new section) was not included in the initial technical specification, we process it as a <b>Change Request</b>.<br><br>We transparently estimate the cost of adding the new feature to the project before proceeding with implementation. This process is always discussed individually with the manager." },
    { question: "Who owns the rights to the design and source code after the project is completed?", answer: "You receive 100% exclusive rights to the product. Upon final payment, we hand over absolutely all source materials: code repositories (GitHub), master design files (Figma), and full intellectual property rights.<br><br>No hidden licenses, code subscriptions, or vendor lock-in to our agency—the product becomes your full and independent business asset." },
    { question: "Do you provide project support after release?", answer: "Absolutely. We don't just hand over the source code; we build a long-term partnership. We offer two collaboration options:<br><br><b>1. Hourly support.</b> Once the project is fully completed and accepted by you, any revisions or additions of new features are billed at the developer's hourly rate.<br><b>2. Monthly subscription.</b> After the project release, we can transition you to a subscription model. This means the project will be fully maintained on an ongoing basis as long as your subscription is active. This includes revisions, adding minor new features, and server monitoring.<br><br>The optimal support format is always discussed individually with your manager." },
    { question: "Do you sign an NDA (Non-Disclosure Agreement)?", answer: "Certainly. The confidentiality of your business idea, trade secrets, and client databases is our absolute priority. We are ready to sign a strict Non-Disclosure Agreement (NDA) even before our first introductory call." }
  ],
  RU: [
    { question: "Как мы начинаем работу и каковы условия оплаты?", answer: "Проект стартует после внесения <b>предоплаты 50%</b>. Наши ведущие разработчики часто заняты крупными проектами, поэтому этот депозит надежно бронирует следующий доступный слот в графике команды.<br><br>Для небольших проектов остаток оплачивается перед финальным развертыванием готового решения на ваших серверах. Если проект масштабный и требует длительной разработки, мы делим оплату на прозрачные этапы. Итоговая структура оплаты всегда определяется строго индивидуально с менеджером на созвоне." },
    { question: "Как выстроена коммуникация и контроль разработки?", answer: "Мы ценим ваше время, поэтому выстраиваем полностью прозрачный, но ненавязчивый процесс. На весь период разработки за вашим проектом закрепляется персональный менеджер.<br><br>Если в процессе работы возникают вопросы, вы можете смело обращаться к нему в рабочие часы. Мы очень уважаем личное время нашей команды, поэтому <b>в нерабочее время менеджер находится офлайн и не отвечает на сообщения</b>, но обязательно свяжется с вами первым делом в начале следующего рабочего дня." },
    { question: "Что если мы захотим добавить новую функцию в процессе разработки?", answer: "Блестящие идеи часто появляются во время разработки. Если новая функция (например, сложная интеграция или новый раздел) не была включена в первоначальное ТЗ, мы оформляем ее как <b>Запрос на изменение (Change Request)</b>.<br><br>Мы прозрачно оцениваем стоимость добавления новой функции в проект перед тем, как приступить к реализации. Этот процесс всегда обсуждается индивидуально с менеджером." },
    { question: "Кому принадлежат права на дизайн и код после завершения проекта?", answer: "Вы получаете 100% эксклюзивных прав на продукт. После финальной оплаты мы передаем абсолютно все исходные материалы: репозитории кода (GitHub), мастер-файлы дизайна (Figma) и полные права на интеллектуальную собственность.<br><br>Никаких скрытых лицензий, подписок на код или привязки к нашему агентству — продукт становится вашим полным и независимым бизнес-активом." },
    { question: "Предоставляете ли вы поддержку проекта после релиза?", answer: "Абсолютно. Мы не просто передаем исходный код, мы строим долгосрочное партнерство. Мы предлагаем два варианта сотрудничества:<br><br><b>1. Почасовая поддержка.</b> После того как проект полностью завершен и принят вами, любые доработки или добавление новых функций оплачиваются по часовой ставке разработчика.<br><b>2. Ежемесячная подписка.</b> После релиза проекта мы можем перевести вас на модель подписки. Это значит, что проект будет полностью обслуживаться на постоянной основе, пока активна подписка. Это включает доработки, добавление небольших функций и мониторинг серверов.<br><br>Оптимальный формат поддержки всегда обсуждается индивидуально с вашим менеджером." },
    { question: "Подписываете ли вы NDA (Соглашение о неразглашении)?", answer: "Конечно. Конфиденциальность вашей бизнес-идеи, коммерческой тайны и баз данных клиентов — наш абсолютный приоритет. Мы готовы подписать строгое Соглашение о неразглашении (NDA) еще до нашего первого ознакомительного звонка." }
  ],
  UA: [
    { question: "Як ми розпочинаємо роботу та які умови оплати?", answer: "Проєкт стартує після внесення <b>передоплати 50%</b>. Наші провідні розробники часто зайняті великими проєктами, тому цей депозит надійно бронює наступний доступний слот у графіку команди.<br><br>Для невеликих проєктів залишок оплачується перед фінальним розгортанням готового рішення на ваших серверах. Якщо проєкт масштабний і вимагає тривалої розробки, ми ділимо оплату на прозорі етапи. Підсумкова структура оплати завжди визначається суворо індивідуально з менеджером під час дзвінка." },
    { question: "Як побудована комунікація та контроль розробки?", answer: "Ми цінуємо ваш час, тому вибудовуємо повністю прозорий, але ненав'язливий процес. На весь період розробки за вашим проєктом закріплюється персональний менеджер.<br><br>Якщо в процесі роботи виникають питання, ви можете сміливо звертатися до нього в робочі години. Ми дуже поважаємо особистий час нашої команди, тому <b>в неробочий час менеджер знаходиться офлайн і не відповідає на повідомлення</b>, але обов'язково зв'яжеться з вами в першу чергу на початку наступного робочого дня." },
    { question: "Що як ми захочемо додати нову функцію в процесі розробки?", answer: "Блискучі ідеї часто з'являються під час розробки. Якщо нова функція (наприклад, складна інтеграція або новий розділ) не була включена в початкове ТЗ, ми оформлюємо її як <b>Запит на зміну (Change Request)</b>.<br><br>Ми прозоро оцінюємо вартість додавання нової функції в проєкт перед тим, як приступити до реалізації. Цей процес завжди обговорюється індивідуально з менеджером." },
    { question: "Кому належать права на дизайн і код після завершення проєкту?", answer: "Ви отримуєте 100% ексклюзивних прав на продукт. Після фінальної оплаты мы передаємо абсолютно всі вихідні матеріали: репозиторії коду (GitHub), майстер-файлы дизайну (Figma) та повні права на інтелектуальну власність.<br><br>Жодних прихованих ліцензій, підписок на код або прив'язки до нашого агентства — продукт стає вашим повним і незалежним бізнес-активом." },
    { question: "Чи надаєте ви підтримку проєкту після релізу?", answer: "Абсолютно. Ми не просто передаємо вихідний код, ми будуємо довгострокове партнерство. Ми пропонуємо два варіанти співпраці:<br><br><b>1. Погодинна підтримка.</b> Після того як проєкт повністю завершений і прийнятий вами, будь-які допрацювання або додавання нових функцій оплачуються за погодинною ставкою розробника.<br><b>2. Щомісячна підписка.</b> Після релізу проєкту ми можемо перевести вас на модель підписки. Це означає, що проєкт буде повністю обслуговуватися на постійній основі, поки активна підписка. Це включає допрацювання, додавання невеликих функцій та моніторинг серверів.<br><br>Оптимальный формат підтримки завжди обговорюється індивідуально з вашим менеджером." },
    { question: "Чи підписуєте ви NDA (Угоду про нерозголошення)?", answer: "Звісно. Конфіденційність вашої бізнес-ідеї, комерційної таємниці та баз даних клієнтів — наш абсолютний пріоритет. Ми готові підписати сувору Угоду про нерозголошення (NDA) ще до нашого першого ознайомчого дзвінка." }
  ],
  TR: [
    { question: "Nasıl başlıyoruz ve ödeme koşulları nelerdir?", answer: "Proje, <b>%50 ön ödeme</b> yapıldıktan sonra başlar. Kıdemli yazılımcılarımız genellikle büyük projelerle meşgul olduğundan, bu ön ödeme ekibimizin üretim programındaki bir sonraki uygun zaman dilimini güvenle rezerve eder.<br><br>Daha küçük projeler için kalan bakiye, hazır çözümün sunucularınıza nihai kurulumundan önce ödenir. Proje büyük ölçekliyse ve uzun geliştirme süresi gerektiriyorsa, ödemeyi şeffaf aşamalara böleriz. Nihai ödeme yapısı, her zaman yöneticimizle yapılan görüşmede bireysel olarak belirlenir." },
    { question: "İletişim ve geliştirme kontrolü nasıl yapılandırılır?", answer: "Zamanınıza değer veriyoruz, bu nedenle tamamen şeffaf ancak rahatsız etmeyen bir süreç inşa ediyoruz. Tüm geliştirme süreci boyunca projenize özel bir kişisel yönetici atanır.<br><br>Çalışma sürecinde herhangi bir soru ortaya çıkarsa, çalışma saatleri içinde yöneticinizle rahatça iletişime geçebilirsiniz. Ekibimizin kişisel zamanına son derece saygı duyuyoruz, bu nedenle <b>mesai saatleri dışında yönetici çevrim dışıdır ve mesajlara yanıt vermez</b>, ancak bir sonraki iş gününün başında ilk iş olarak size geri dönecektir." },
    { question: "Geliştirme sürecinde yeni bir özellik eklemek istersek ne olur?", answer: "Harika fikirler genellikle geliştirme sırasında ortaya çıkar. Yeni bir özellik (örneğin karmaşık bir entegrasyon sistemi veya yeni bir bölüm) ilk teknik şartnameye dahil edilmediyse, bunu bir <b>Değişiklik Talebi (Change Request)</b> olarak işleriz.<br><br>Uygulamaya geçmeden önce yeni özelliği projeye eklemenin maliyetini şeffaf bir şekilde değerlendiririz. Bu süreç her zaman yönetici ile bireysel olarak görüşülür." },
    { question: "Proje tamamlandıktan sonra tasarım ve kaynak kodunun hakları kime ait olur?", answer: "Ürünün %100 özel haklarına sahip olursunuz. Son ödemenin ardından tüm kaynak materyalleri teslim ediyoruz: kod depoları (GitHub), ana tasarım dosyaları (Figma) ve tüm fikri mülkiyet hakları.<br><br>Gizli lisanslar, kod abonelikleri veya ajansımıza bağımlılık yoktur — ürün tamamen sizin bağımsız ticari varlığınız haline gelir." },
    { question: "Yayınlandıktan sonra proje desteği sağlıyor musunuz?", answer: "Kesinlikle. Sadece kaynak kodunu teslim etmekle kalmıyor, uzun vadeli bir ortaklık kuruyoruz. İki iş birliği seçeneği sunuyoruz:<br><br><b>1. Saatlik destek.</b> Proje tamamen tamamlanıp tarafınızdan kabul edildikten sonra, yapılan revizyonlar veya yeni özellik eklemeleri yazılımcının saatlik ücreti üzerinden faturalandırılır.<br><b>2. Aylık abonelik.</b> Proje yayınlandıktan sonra sizi abonelik modeline geçirebiliriz. Bu, aboneliğiniz aktif olduğu sürece projenin sürekli olarak bakımdan geçeceği anlamına gelir. Buna revizyonlar, küçük yeni özelliklerin eklenmesi ve sunucu takibi dahildir.<br><br>En uygun destek formatı her zaman yöneticinizle bireysel olarak görüşülür." },
    { question: "Gizlilik Sözleşmesi (NDA) imzalıyor musunuz?", answer: "Elbette. İş fikrinizin, ticari sırlarınızın ve müşteri veritabanlarınızın gizliliği mutlak önceliğimizdir. İlk tanıtım görüşmemizden önce bile katı bir Gizlilik Sözleşmesi (NDA) imzalamaya hazırız." }
  ],
  DE: [
    { question: "Wie starten wir und wie sind die Zahlungsbedingungen?", answer: "Das Projekt startet nach einer <b>Anzahlung von 50%</b>. Dies reserviert zuverlässig den nächsten freien Platz im Produktionsplan unseres Teams.<br><br>Bei kleineren Projekten wird der Restbetrag vor dem finalen Deployment bezahlt. Bei Großprojekten teilen wir die Zahlung in transparente Meilensteine auf. Die Struktur wird immer individuell besprochen." },
    { question: "Wie ist die Kommunikation und Kontrolle strukturiert?", answer: "Wir schätzen Ihre Zeit und bauen einen transparenten Prozess auf. Für die gesamte Entwicklungszeit wird Ihnen ein persönlicher Manager zugewiesen.<br><br><b>Außerhalb der Arbeitszeiten ist der Manager offline</b>, wird sich aber am nächsten Werktag sofort bei Ihnen melden." },
    { question: "Was ist, wenn wir während der Entwicklung eine neue Funktion hinzufügen möchten?", answer: "Wenn eine neue Funktion nicht im ursprünglichen Lastenheft enthalten war, bearbeiten wir sie als <b>Change Request</b>.<br><br>Wir schätzen transparent die Kosten für das Hinzufügen der neuen Funktion, bevor wir mit der Umsetzung beginnen." },
    { question: "Wem gehören die Rechte an Design und Code nach Abschluss?", answer: "Sie erhalten 100% exklusive Rechte am Produkt. Nach der Schlusszahlung übergeben wir alle Quellmaterialien (GitHub, Figma) und geistigen Eigentumsrechte.<br><br>Keine versteckten Lizenzen oder Bindungen an unsere Agentur." },
    { question: "Bieten Sie Projektunterstützung nach dem Release an?", answer: "Absolut. Wir bieten zwei Optionen:<br><br><b>1. Stündlicher Support.</b> Anpassungen werden nach Stundensatz berechnet.<br><b>2. Monatliches Abonnement.</b> Das Projekt wird laufend gewartet, inklusive Anpassungen und Serverüberwachung.<br><br>Das optimale Format wird individuell besprochen." },
    { question: "Unterschreiben Sie ein NDA (Geheimhaltungsvereinbarung)?", answer: "Sicherlich. Die Vertraulichkeit Ihrer Geschäftsidee ist unsere Priorität. Wir sind bereit, noch vor unserem ersten Gespräch ein strenges NDA zu unterzeichnen." }
  ],
  FR: [
    { question: "Comment commençons-nous et quelles sont les conditions de paiement ?", answer: "Le projet démarre après un <b>acompte de 50%</b>. Cela réserve en toute sécurité le prochain créneau disponible dans le planning de notre équipe.<br><br>Pour les petits projets, le solde est payé avant le déploiement final. Pour les grands projets, nous divisons le paiement en étapes transparentes." },
    { question: "Comment la communication est-elle structurée ?", answer: "Nous valorisons votre temps. Un manager personnel est assigné à votre projet pour toute la période de développement.<br><br><b>En dehors des heures de travail, le manager est hors ligne</b>, mais vous recontactera dès le début du jour ouvrable suivant." },
    { question: "Et si nous voulons ajouter une nouvelle fonctionnalité ?", answer: "Si une nouvelle fonctionnalité n'était pas incluse dans les spécifications initiales, nous la traitons comme une <b>Demande de changement (Change Request)</b>.<br><br>Nous estimons de manière transparente le coût avant de procéder à la mise en œuvre." },
    { question: "À qui appartiennent les droits après l'achèvement du projet ?", answer: "Vous recevez 100% des droits exclusifs. Lors du paiement final, nous remettons tous les documents sources (GitHub, Figma) et les droits de propriété intellectuelle.<br><br>Aucune licence cachée ou dépendance envers notre agence." },
    { question: "Fournissez-vous un support après le lancement ?", answer: "Absolument. Nous offrons deux options :<br><br><b>1. Support horaire.</b> Les révisions sont facturées au taux horaire.<br><b>2. Abonnement mensuel.</b> Le projet est entièrement maintenu (révisions, surveillance des serveurs).<br><br>Le format optimal est discuté individuellement." },
    { question: "Signez-vous un NDA (Accord de non-divulgation) ?", answer: "Certainement. La confidentialité de votre idée est notre priorité absolue. Nous sommes prêts à signer un NDA strict avant même notre premier appel." }
  ],
  ES: [
    { question: "¿Cómo empezamos y cuáles son las condiciones de pago?", answer: "El proyecto arranca tras un <b>depósito del 50%</b>. Esto reserva de forma segura el próximo espacio disponible en el calendario de nuestro equipo.<br><br>Para proyectos pequeños, el saldo se paga antes del despliegue final. Para grandes proyectos, dividimos el pago en hitos transparentes." },
    { question: "¿Cómo se estructura la comunicación y el control?", answer: "Valoramos su tiempo. Se asigna un gerente personal a su proyecto durante todo el período de desarrollo.<br><br><b>Fuera del horario laboral, el gerente está desconectado</b>, pero se pondrá en contacto con usted a primera hora del siguiente día hábil." },
    { question: "¿Qué pasa si queremos añadir una nueva función?", answer: "Si no se incluyó una nueva función en la especificación inicial, la procesamos como una <b>Solicitud de Cambio (Change Request)</b>.<br><br>Estimamos de forma transparente el costo antes de proceder con la implementación." },
    { question: "¿A quién pertenecen los derechos después de completar el proyecto?", answer: "Usted recibe el 100% de los derechos exclusivos. Tras el pago final, entregamos todos los materiales de origen (GitHub, Figma) y los derechos de propiedad intelectual.<br><br>Sin licencias ocultas ni dependencia de nuestra agencia." },
    { question: "¿Proporcionan soporte después del lanzamiento?", answer: "Absoluto. Ofrecemos dos opciones:<br><br><b>1. Soporte por horas.</b> Las revisiones se facturan por hora.<br><b>2. Suscripción mensual.</b> El proyecto se mantiene por completo (revisiones, monitoreo de servidores).<br><br>El formato óptimo se discute individualmente." },
    { question: "¿Firman un NDA (Acuerdo de confidencialidad)?", answer: "Ciertamente. La confidencialidad de su idea es nuestra máxima prioridad. Estamos listos para firmar un NDA estricto incluso antes de nuestra primera llamada." }
  ]
};

const currentFaqs = computed(() => {
  return faqDict[currentLang.value.code] || faqDict.EN;
});

const activeIndex = ref(null);
const isDesktop = ref(true);
const isTelegram = ref(false);
let resizeTimer = null;

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const onEnter = (el) => {
  el.style.transition = 'none';
  el.style.height = 'auto';
  el.style.opacity = '1';
  el.style.overflow = 'visible';
};

const onAfterEnter = (el) => {
  el.style.height = 'auto';
};

const onLeave = (el) => {
  el.style.transition = 'none';
  el.style.height = '0px';
  el.style.opacity = '0';
  el.style.overflow = 'hidden';
};

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
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener("resize", checkDevice, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkDevice);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.faq-luxury {
  contain: layout style;
  padding: 150px 0px;
  background-color: transparent !important;
  color: #ffffff;
  font-family: "Plus Jakarta Sans", sans-serif;
  position: relative;
  z-index: 1;
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility; 
  isolation: isolate;
}

.ambient-glow { 
  position: absolute; 
  top: 150px; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  width: 1000px; 
  height: 400px; 
  background: radial-gradient(ellipse closest-side, rgba(255, 255, 255, 0.02) 0%, transparent 100%); 
  filter: blur(60px); 
  z-index: -1; 
  pointer-events: none;
}

.container { 
  max-width: 900px; 
  margin: 0px auto; 
  padding: 0px 40px; 
  position: relative; 
  z-index: 10; 
}

/* 🌟 СТИЛИ ЗАГОЛОВКА */
.section-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  gap: 16px;
}

.kicker {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #a1a1aa;
  margin-bottom: 0;
}

.title-scroll-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.gradient-title {
  font-size: 64px;
  font-weight: 500;
  margin: 0px;
  letter-spacing: -0.04em;
  line-height: 1.2;
  padding-bottom: 0.15em;
  padding-left: 0.25em;
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.section-subtitle { 
  font-size: 16px; 
  color: #8e8e93; 
  font-weight: 400; 
  letter-spacing: 0.5px; 
  margin: 0px; 
  max-width: 600px; 
}

/* 🌟 СТИЛИ FAQ КАРТОЧЕК */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: clamp(32px, 5vw, 48px);
}

.faq-card-wrapper {
  display: block;
}

.faq-card {
  background: linear-gradient(180deg, #0a0a0a, #060606); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 20px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

@media (hover: hover) and (pointer: fine) {
  .faq-card:hover {
    border-color: rgba(255, 255, 255, 0.3); 
  }
}

.faq-card.is-open {
  border-color: #e5e4e2;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  gap: 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; 
}

.faq-question h3 {
  font-size: 19px;
  font-weight: 500;
  margin: 0px;
  color: #ffffff;
  line-height: 27px;
  letter-spacing: -0.2px;
}

.icon-cross {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.line {
  position: absolute;
  background: #a1a1aa;
  border-radius: 2px;
  transition: background 0.3s ease;
}

.line.horizontal { top: 9px; left: 0px; width: 20px; height: 2px; }
.line.vertical { top: 0px; left: 9px; width: 2px; height: 20px; }

.faq-card.is-open .icon-cross {
  transform: rotate(135deg);
}

.faq-card.is-open .line {
  background: #ffffff;
}

.faq-answer-wrapper {
  overflow: hidden;
}

.answer-inner {
  padding: 0px 32px 32px 32px; 
}

.answer-inner :deep(p) {
  margin: 0px;
  color: #e4e4e7;
  font-size: 16px;
  line-height: 27px;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.answer-inner :deep(b) {
  color: #ffffff;
  font-weight: 600;
}

.answer-inner :deep(i) {
  color: #8e8e93;
  font-style: normal;
  font-size: 14px;
  display: block;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* --- СТИЛИ ДЛЯ ГЛАВНОЙ КНОПКИ СЕКЦИИ (ТОЧНАЯ КОПИЯ ИЗ EXPERTISE.VUE) --- */
.section-cta-wrapper {
  margin-top: clamp(40px, 5vw, 60px);
  display: flex;
  justify-content: center;
  width: 100%;
}

.main-action-btn {
  background-color: #E6E6E6;
  color: #050505;
  border: none;
  border-radius: 100px;
  padding: 24px 80px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #ffffff;
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

/* 🌟 АДАПТИВНОСТЬ */
@media (min-width: 1024px) and (max-width: 1200px) {
  .gradient-title { font-size: clamp(48px, 5vw, 56px); }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gradient-title {
    font-size: clamp(40px, 6vw, 54px) !important;
  }
}

@media (max-width: 767px) {
  .faq-luxury { padding: 80px 0px; }
  .container { padding: 0px 20px; }
  
  .section-header { margin-bottom: 24px; gap: 12px; }
  
  .kicker {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.45em;
    margin-right: -0.45em;
  }

  /* 🌟 Обертка для мобильного скролла */
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

  .section-subtitle { font-size: 14px; }

  .faq-list { margin-top: 32px; }

  .faq-question { padding: 24px 20px; }
  .faq-question h3 { font-size: 16px; line-height: 22px; font-weight: 500; letter-spacing: -0.2px; }
  
  .answer-inner { padding: 0px 20px 24px 20px; }
  .answer-inner :deep(p) { font-size: 14px; line-height: 24px; letter-spacing: 0.2px; }
  
  .icon-cross { width: 18px; height: 18px; }
  .line.horizontal { top: 8px; width: 18px; left: 0px; }
  .line.vertical { left: 8px; height: 18px; top: 0px; }

  .section-cta-wrapper { margin-top: 40px; }
  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}
</style>