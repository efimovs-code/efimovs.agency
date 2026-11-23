<template>
  <section class="cmp-section">
    <div class="cmp-container">
      
      <!-- Заголовок в едином стиле сайта -->
      <div ref="headerRef" class="section-header">
        <span class="kicker">{{ localizedContent.kicker }}</span>
        <h2 ref="titleRef" class="gradient-title">{{ localizedContent.title }}</h2>
        <p ref="subtitleRef" class="section-subtitle">
          {{ localizedContent.subBefore }}<span class="subtitle-brand">Efimovs Agency</span>{{ localizedContent.subAfter }}
        </p>
      </div>

      <div
        class="glass-shell"
        :style="{
          '--active-color': selectedPlatform.color,
          '--active-glow': selectedPlatform.glow
        }"
      >
        <!-- DESKTOP: 1. Efimovs Agency | 2. Конструкторы | 3. Что сравниваем -->
        <template v-if="isDesktop">
          <div class="table-head">
            <div class="col-our">
              Efimovs Agency
            </div>

            <div ref="desktopDropdownRef" class="col-other dropdown-anchor">
              <button
                type="button"
                class="platform-trigger-desktop"
                :aria-expanded="isDropdownOpen"
                aria-haspopup="listbox"
                @click.stop="toggleDropdown"
              >
                <svg
                  class="trigger-icon"
                  :style="{ filter: `drop-shadow(0 0 8px ${selectedPlatform.glow})` }"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  v-html="selectedPlatform.svg"
                ></svg>
                <span class="trigger-name">{{ selectedPlatform.name }}</span>
                <svg
                  :class="['trigger-chevron', { open: isDropdownOpen }]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <Transition name="dropdown-pop">
                <div
                  v-if="isDropdownOpen"
                  class="platform-dropdown-menu"
                  role="listbox"
                >
                  <span class="dropdown-caption">{{ localizedContent.dropdownHint }}</span>
                  <button
                    v-for="item in platforms"
                    :key="item.id"
                    type="button"
                    role="option"
                    :aria-selected="selectedPlatformId === item.id"
                    :class="['dropdown-item', { active: selectedPlatformId === item.id }]"
                    @click="choosePlatform(item.id)"
                  >
                    <svg
                      class="dropdown-icon"
                      :style="selectedPlatformId === item.id ? { filter: `drop-shadow(0 0 8px ${item.glow})` } : undefined"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      v-html="item.svg"
                    ></svg>
                    <span class="dropdown-name">{{ item.name }}</span>
                  </button>
                </div>
              </Transition>
            </div>

            <div class="col-crit">{{ localizedContent.colCrit }}</div>
          </div>

          <div class="table-body">
            <div
              v-for="(row, idx) in localizedContent.rows"
              :key="idx"
              class="table-row"
            >
              <!-- Статичная колонка Efimovs Agency -->
              <div class="col-our">
                {{ row.our }}
              </div>

              <!-- Обновляется ТОЛЬКО колонка выбранного сервиса -->
              <div class="col-other">
                <Transition name="cell-fade" mode="out-in">
                  <span :key="selectedPlatform.id + '-' + langCode" class="cell-text">
                    {{ selectedPlatform.issues[idx] }}
                  </span>
                </Transition>
              </div>

              <!-- Статичная колонка критериев -->
              <div class="col-crit">
                {{ row.crit }}
              </div>
            </div>
          </div>
        </template>

        <!-- MOBILE / TABLET: Без изменений -->
        <template v-else>
          <div ref="mobileDropdownRef" class="mobile-switch-wrap dropdown-anchor">
            <div class="segmented-control" role="tablist">
              <div
                class="segment-indicator"
                :style="{ transform: activeTab === 'our' ? 'translate3d(0%, 0, 0)' : 'translate3d(100%, 0, 0)' }"
              ></div>

              <button
                type="button"
                role="tab"
                :aria-selected="activeTab === 'our'"
                :class="['segment-btn', { active: activeTab === 'our' }]"
                @click="activateOurTab"
              >
                Efimovs Agency
              </button>

              <button
                type="button"
                role="tab"
                :aria-selected="activeTab === 'other'"
                :aria-expanded="isDropdownOpen"
                :class="['segment-btn', { active: activeTab === 'other' }]"
                @click.stop="handleMobileCompetitorClick"
              >
                <svg
                  class="segment-platform-icon"
                  :style="{ filter: `drop-shadow(0 0 6px ${selectedPlatform.glow})` }"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  v-html="selectedPlatform.svg"
                ></svg>
                <span>{{ selectedPlatform.name }}</span>
                <svg
                  :class="['segment-chevron', { open: isDropdownOpen }]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <!-- Выпадающий список сервисов -->
            <Transition name="dropdown-pop">
              <div
                v-if="isDropdownOpen"
                class="platform-dropdown-menu is-mobile"
                role="listbox"
              >
                <span class="dropdown-caption">{{ localizedContent.dropdownHint }}</span>
                <button
                  v-for="item in platforms"
                  :key="item.id"
                  type="button"
                  role="option"
                  :aria-selected="selectedPlatformId === item.id"
                  :class="['dropdown-item', { active: selectedPlatformId === item.id }]"
                  @click="choosePlatform(item.id)"
                >
                  <svg
                    class="dropdown-icon"
                    :style="selectedPlatformId === item.id ? { filter: `drop-shadow(0 0 8px ${item.glow})` } : undefined"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    v-html="item.svg"
                  ></svg>
                  <span class="dropdown-name">{{ item.name }}</span>
                </button>
              </div>
            </Transition>
          </div>

          <Transition name="tab-fade" mode="out-in">
            <div :key="activeTab + '-' + selectedPlatform.id + '-' + langCode" class="mobile-list">
              <div
                v-for="(row, idx) in localizedContent.rows"
                :key="idx"
                class="mobile-row"
              >
                <span class="mobile-crit">{{ row.crit }}</span>

                <div v-if="activeTab === 'our'" class="mobile-val is-our">
                  {{ row.our }}
                </div>

                <div v-else class="mobile-val is-other">
                  {{ selectedPlatform.issues[idx] }}
                </div>
              </div>
            </div>
          </Transition>
        </template>

        <!-- Подвал с кнопкой в точном стиле expertise.js -->
        <div class="table-footer">
          <button
            type="button"
            class="main-action-btn"
            @click="$emit('open-contact')"
          >
            {{ localizedContent.cta }}
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { currentLang } from '../composables/useLanguage';

defineEmits(['open-contact']);

const langCode = computed(() => currentLang.value?.code || 'RU');

const contentDict = {
  RU: {
    kicker: 'МЫ ПРОТИВ КОНСТРУКТОРОВ',
    title: 'Почему стоит выбрать нас?',
    subBefore: 'Сравните ',
    subAfter: ' с известными сервисами',
    dropdownHint: 'Выберите сервис',
    colCrit: 'Что сравниваем',
    cta: 'Обсудить проект',
    rows: [
      {
        crit: 'Ежемесячные платежи',
        our: '$0 в месяц — вы платите один раз за создание сайта, без вечной аренды.'
      },
      {
        crit: 'Кому принадлежит сайт',
        our: 'На 100% ваш навсегда — сайт принадлежит только вам, его никто не отключит.'
      },
      {
        crit: 'Комиссия с ваших продаж',
        our: '0% комиссии — все деньги от клиентов идут напрямую вам, без посредников.'
      },
      {
        crit: 'Скорость на телефоне',
        our: 'Открывается мгновенно — клиенты не ждут загрузку и не уходят к конкурентам.'
      },
      {
        crit: 'Дизайн и впечатление',
        our: 'Индивидуальный дизайн под вас — сайт выглядит дорого и вызывает доверие с первой секунды.'
      }
    ]
  },
  UA: {
    kicker: 'МИ ПРОТИ КОНСТРУКТОРІВ',
    title: 'Чому варто обрати нас?',
    subBefore: 'Порівняйте ',
    subAfter: ' з відомими сервісами',
    dropdownHint: 'Оберіть сервіс',
    colCrit: 'Що порівнюємо',
    cta: 'Обговорити проєкт',
    rows: [
      {
        crit: 'Щомісячні платежі',
        our: '$0 на місяць — ви платите один раз за створення сайту, без вічної оренди.'
      },
      {
        crit: 'Кому належить сайт',
        our: 'На 100% ваш назавжди — сайт належить лише вам, його ніхто не вимкне.'
      },
      {
        crit: 'Комісія з ваших продажів',
        our: '0% комісії — усі гроші від клієнтів ідуть напряму вам, без посередників.'
      },
      {
        crit: 'Швидкість на телефоні',
        our: 'Відкривається миттєво — клієнти не чекають завантаження і не йдуть до конкурентів.'
      },
      {
        crit: 'Дизайн і враження',
        our: 'Індивідуальний дизайн під вас — сайт виглядає дорого та викликає довіру з першої секунди.'
      }
    ]
  },
  EN: {
    kicker: 'CUSTOM VS BUILDERS',
    title: 'Why Choose Efimovs Agency?',
    subBefore: 'Compare ',
    subAfter: ' with popular platforms',
    dropdownHint: 'Select a platform',
    colCrit: 'What we compare',
    cta: 'Discuss project',
    rows: [
      {
        crit: 'Monthly payments',
        our: '$0 per month — you pay once to build your website, with zero ongoing rent.'
      },
      {
        crit: 'Who owns the website',
        our: '100% yours forever — full ownership with zero risk of anyone shutting it down.'
      },
      {
        crit: 'Commission on your sales',
        our: '0% commission — every dollar from your customers goes straight to you.'
      },
      {
        crit: 'Speed on mobile phones',
        our: 'Opens instantly — visitors never wait around or leave for a faster competitor.'
      },
      {
        crit: 'Design & first impression',
        our: 'Custom-crafted for your brand — looks premium and builds trust from second one.'
      }
    ]
  }
};

const localizedContent = computed(() => contentDict[langCode.value] || contentDict.EN);

const platformsData = [
  {
    id: 'shopify',
    name: 'Shopify',
    color: '#95BF47',
    glow: 'rgba(149, 191, 71, 0.36)',
    svg: `
      <path d="M15.8 6.2V5.3C15.8 3.2 14.1 1.5 12 1.5C9.9 1.5 8.2 3.2 8.2 5.3V6.2H5.2L4 21.5H14.5V6.2H15.8Z" fill="#95BF47"/>
      <path d="M14.5 6.2H18.8L20 21.5H14.5V6.2Z" fill="#5E8E3E"/>
      <path d="M9.7 6.2V5.3C9.7 4.03 10.73 3 12 3C13.27 3 14.3 4.03 14.3 5.3V6.2" stroke="#E8F5D0" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M13.6 11.1C13.1 10.8 12.4 10.6 11.8 10.6C10.9 10.6 10.3 11 10.3 11.7C10.3 12.4 10.9 12.7 11.9 13.1C13.1 13.5 13.8 14.1 13.8 15.2C13.8 16.5 12.7 17.4 11.2 17.4C10.3 17.4 9.5 17.1 8.9 16.7L9.4 15.4C10 15.8 10.6 16 11.2 16C11.9 16 12.3 15.7 12.3 15.2C12.3 14.6 11.8 14.3 10.9 14C9.7 13.5 8.9 12.9 8.9 11.8C8.9 10.5 10 9.4 11.7 9.4C12.5 9.4 13.3 9.6 13.9 9.9L13.6 11.1Z" fill="#FFFFFF"/>
    `,
    issues: {
      RU: [
        'От $39 до $399 каждый месяц за сам сервис + ещё $100–$300/мес за нужные функции.',
        'Вы берёте магазин в аренду: перестали платить каждый месяц — его сразу закрыли.',
        'Забирает до 2% с каждой вашей продажи сверху, кроме обычной комиссии банка.',
        'Чем больше функций вы подключаете, тем медленнее открываются страницы с товарами.',
        'Стандартные шаблоны — ваш магазин выглядит точно так же, как тысячи других.'
      ],
      UA: [
        'Від $39 до $399 щомісяця за сам сервіс + ще $100–$300/міс за потрібні функції.',
        'Ви берете магазин в оренду: перестали платить щомісяця — його одразу закрили.',
        'Забирає до 2% з кожного вашого продажу зверху, окрім звичайної комісії банку.',
        'Чим більше функцій ви підключаєте, тим повільніше відкриваються сторінки з товарами.',
        'Стандартні шаблони — ваш магазин виглядає так само, як тисячі інших.'
      ],
      EN: [
        '$39 to $399 every month just for the plan, plus $100–$300/mo for basic store add-ons.',
        'You are renting your store: stop paying the monthly bill and it gets shut off.',
        'Takes up to 2% extra from every single sale on top of standard bank fees.',
        'The more features you add, the slower your product pages load on mobile.',
        'Standard templates make your store look just like thousands of competitors.'
      ]
    }
  },
  {
    id: 'webflow',
    name: 'Webflow',
    color: '#146EF5',
    glow: 'rgba(20, 110, 245, 0.42)',
    svg: `
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#146EF5"/>
      <path d="M18.5 7.5L15.4 16.8H12.5L13.8 12.5C12.8 14.1 11.2 15.8 8.7 16.8V13.7C10.2 13 11.3 11.7 11.9 10.2H8.7V7.5H12.9V10.4L14.1 7.5H18.5Z" fill="#FFFFFF"/>
    `,
    issues: {
      RU: [
        'От $29 до $212 каждый месяц просто за то, чтобы сайт работал и не отключался.',
        'Вы привязаны к сервису: перенести готовый рабочий сайт к себе нельзя.',
        'Забирает до 2% с каждого заказа и ограничивает, сколько товаров можно добавить.',
        'Когда на сайте много страниц и товаров, всё начинает заметно притормаживать.',
        'Любая нестандартная идея или сложный калькулятор требуют дорогих доработок.'
      ],
      UA: [
        'Від $29 до $212 щомісяця просто за те, щоб сайт працював і не вимикався.',
        'Ви прив’язані до сервісу: перенести готовий робочий сайт до себе неможливо.',
        'Забирає до 2% з кожного замовлення й обмежує, скільки товарів можна додати.',
        'Коли на сайті багато сторінок і товарів, усе починає помітно пригальмовувати.',
        'Будь-яка нестандартна ідея чи складний калькулятор вимагають дорогих доробок.'
      ],
      EN: [
        '$29 to $212 every single month just to keep your website live and running.',
        'You stay tied to their service — moving a working site to your own hosting is impossible.',
        'Takes up to 2% per order and puts strict limits on how many products you can list.',
        'Once your site grows with more pages and items, loading speeds start to drop.',
        'Any custom feature or interactive calculator requires costly workarounds.'
      ]
    }
  },
  {
    id: 'wix',
    name: 'Wix',
    color: '#F7B529',
    glow: 'rgba(247, 181, 41, 0.38)',
    svg: `
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#F7B529"/>
      <path d="M6.2 8.2H8.1L9.5 13.8L11.1 8.2H12.9L14.5 13.8L15.9 8.2H17.8L15.5 16.2H13.6L12 10.8L10.4 16.2H8.5L6.2 8.2Z" fill="#09090B"/>
    `,
    issues: {
      RU: [
        'От $17 до $159 каждый месяц пожизненно, иначе на вашем сайте будет чужая реклама.',
        'Сайт навсегда заперт внутри Wix — забрать его себе или перенести в другое место нельзя.',
        'Берёт повышенный процент с каждой оплаты и ограничивает удобные способы приёма денег.',
        'Сайты на Wix тяжело грузятся на телефонах, из-за чего клиенты уходят и Google хуже их показывает.',
        'Шаблонные блоки и устаревшие эффекты, которые сразу выдают дешёвый конструктор.'
      ],
      UA: [
        'Від $17 до $159 щомісяця довічно, інакше на вашому сайті буде чужа реклама.',
        'Сайт назавжди замкнений усередині Wix — забрати його собі чи перенести неможливо.',
        'Бере підвищений відсоток із кожної оплати й обмежує зручні способи прийому грошей.',
        'Сайти на Wix важко вантажаться на телефонах, через що клієнти йдуть і Google гірше їх показує.',
        'Шаблонні блоки та застарілі ефекти, які одразу видають дешевий конструктор.'
      ],
      EN: [
        '$17 to $159 every month forever, otherwise Wix displays its own ads on your site.',
        'Locked inside Wix permanently — you can never move or export your site elsewhere.',
        'Charges higher fees per payment and limits which payment methods you can connect.',
        'Heavy pages load slowly on phones, driving visitors away and hurting Google rankings.',
        'Cookie-cutter blocks and dated effects that immediately look like a cheap template.'
      ]
    }
  },
  {
    id: 'tilda',
    name: 'Tilda',
    color: '#FF6B4A',
    glow: 'rgba(255, 107, 74, 0.40)',
    svg: `
      <circle cx="12" cy="12" r="10" fill="#FF6B4A"/>
      <path d="M16.9 13.4C16 14.5 14.9 15 13.7 15C12.5 15 11.5 14.3 10.6 13.6C9.9 13 9.3 12.6 8.7 12.6C8.1 12.6 7.6 13 7.2 13.7L5.7 12.5C6.5 11.2 7.6 10.6 8.8 10.6C10 10.6 11 11.3 11.9 12C12.6 12.6 13.2 13 13.8 13C14.4 13 14.9 12.6 15.4 11.9L16.9 13.4Z" fill="#FFFFFF"/>
    `,
    issues: {
      RU: [
        '$15–$30 каждый месяц за каждый сайт + платные сервисы для приёма заявок и оплат.',
        'Сайт работает, пока вы платите аренду. Забыли оплатить тариф — сайт пропал из сети.',
        'Неудобная корзина для больших продаж и жёсткие ограничения по количеству товаров.',
        'На телефоне насыщенные страницы грузятся долго — часть людей закрывает сайт, не дождавшись.',
        'Однотипные блоки, которые ваши клиенты видели уже на сотнях других сайтов.'
      ],
      UA: [
        '$15–$30 щомісяця за кожен сайт + платні сервіси для прийому заявок і оплат.',
        'Сайт працює, поки ви платите оренду. Забули оплатити тариф — сайт зник із мережі.',
        'Незручний кошик для великих продажів і жорсткі обмеження за кількістю товарів.',
        'На телефоні насичені сторінки вантажаться довго — частина людей закриває сайт, не дочекавшись.',
        'Однотипні блоки, які ваші клієнти бачили вже на сотнях інших сайтів.'
      ],
      EN: [
        '$15–$30 every month per site, plus extra paid services for forms and payments.',
        'Your site only stays online while you pay rent — miss a payment and it goes offline.',
        'Clunky checkout for growing stores and strict limits on how many items you can sell.',
        'Rich pages take too long to load on phones, causing visitors to leave early.',
        'Familiar standard blocks your customers have already seen on hundreds of sites.'
      ]
    }
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    color: '#2B8CBE',
    glow: 'rgba(43, 140, 190, 0.42)',
    svg: `
      <circle cx="12" cy="12" r="10" fill="#21759B"/>
      <path d="M12 3.8C7.48 3.8 3.8 7.48 3.8 12C3.8 16.52 7.48 20.2 12 20.2C16.52 20.2 20.2 16.52 20.2 12C20.2 7.48 16.52 3.8 12 3.8ZM4.9 12C4.9 10.97 5.12 9.99 5.51 9.1L8.92 18.44C6.53 17.28 4.9 14.83 4.9 12ZM12 19.1C11.3 19.1 10.62 18.99 9.98 18.8L12.12 12.59L14.31 18.59C14.33 18.63 14.35 18.66 14.37 18.69C13.63 18.95 12.83 19.1 12 19.1ZM12.98 8.67C13.41 8.65 13.8 8.6 13.8 8.6C14.19 8.55 14.14 7.98 13.75 8.01C13.75 8.01 12.59 8.1 11.84 8.1C11.14 8.1 9.96 8.01 9.96 8.01C9.57 7.98 9.52 8.57 9.91 8.6C9.91 8.6 10.28 8.65 10.67 8.67L11.79 11.73L10.22 16.43L7.61 8.67C8.04 8.65 8.43 8.6 8.43 8.6C8.82 8.55 8.77 7.98 8.38 8.01C8.38 8.01 7.22 8.1 6.47 8.1C6.33 8.1 6.17 8.1 6.01 8.09C7.27 6.17 9.48 4.9 12 4.9C13.85 4.9 15.54 5.61 16.8 6.77C16.77 6.77 16.74 6.76 16.71 6.76C16.01 6.76 15.51 7.37 15.51 8.03C15.51 8.62 15.85 9.12 16.21 9.71C16.49 10.19 16.8 10.8 16.8 11.68C16.8 12.29 16.57 13 16.26 13.98L15.54 16.38L12.98 8.67ZM15.61 18.09L17.77 11.83C18.18 10.82 18.31 10.01 18.31 9.29C18.31 9.03 18.29 8.79 18.26 8.56C18.79 9.58 19.1 10.75 19.1 12C19.1 14.64 17.66 16.94 15.61 18.09Z" fill="#FFFFFF"/>
    `,
    issues: {
      RU: [
        'Постоянные траты на платные шаблоны, дополнения и мастера, который всё это чинит.',
        'Формально сайт ваш, но он держится на чужих дополнениях — одно обновление может всё сломать.',
        'Чтобы принимать оплаты, рассрочки и вести учёт заказов, нужно докупать платные модули.',
        'Без дорогой настройки и постоянной чистки сайт со временем начинает сильно тормозить.',
        'Часто взламывают через устаревшие дополнения, а после обновлений может съехать вёрстка.'
      ],
      UA: [
        'Постійні витрати на платні шаблони, доповнення та майстра, який усе це лагодить.',
        'Формально сайт ваш, але він тримається на чужих доповненнях — одне оновлення може все зламати.',
        'Щоб приймати оплати, розстрочки та вести облік замовлень, потрібно докуповувати платні модулі.',
        'Без дорогого налаштування та постійного чищення сайт із часом починає сильно гальмувати.',
        'Часто зламують через застарілі доповнення, а після оновлень може поїхати вигляд сторінок.'
      ],
      EN: [
        'Ongoing bills for paid themes, add-ons, and a developer to keep fixing things.',
        'Held together by dozens of third-party add-ons — one update can break the whole site.',
        'Accepting payments, subscriptions, or managing orders requires buying extra add-ons.',
        'Without expensive tuning and regular cleanup, the site gets sluggish over time.',
        'Vulnerable to hacks through outdated add-ons, and updates often break page layouts.'
      ]
    }
  }
];

const selectedPlatformId = ref('shopify');
const activeTab = ref('our');
const isDropdownOpen = ref(false);
const isDesktop = ref(true);

const desktopDropdownRef = ref(null);
const mobileDropdownRef = ref(null);

const platforms = computed(() => {
  const code = langCode.value;
  return platformsData.map((item) => ({
    id: item.id,
    name: item.name,
    color: item.color,
    glow: item.glow,
    svg: item.svg,
    issues: item.issues[code] || item.issues.EN
  }));
});

const selectedPlatform = computed(() => {
  return platforms.value.find((p) => p.id === selectedPlatformId.value) || platforms.value[0];
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const activateOurTab = () => {
  activeTab.value = 'our';
  isDropdownOpen.value = false;
};

const handleMobileCompetitorClick = () => {
  if (activeTab.value !== 'other') {
    activeTab.value = 'other';
    isDropdownOpen.value = true;
  } else {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const choosePlatform = (id) => {
  selectedPlatformId.value = id;
  if (!isDesktop.value) {
    activeTab.value = 'other';
  }
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!isDropdownOpen.value) return;
  const target = event.target;
  const inDesktop = desktopDropdownRef.value && desktopDropdownRef.value.contains(target);
  const inMobile = mobileDropdownRef.value && mobileDropdownRef.value.contains(target);
  if (!inDesktop && !inMobile) {
    isDropdownOpen.value = false;
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

const headerRef = ref(null);
const titleRef = ref(null);
const subtitleRef = ref(null);

let resizeTimer = null;
let resizeObserver = null;

const fitSingleLine = (el, maxWidth, minSize) => {
  if (!el || !maxWidth) return;
  el.style.fontSize = '';
  let currentSize = parseFloat(window.getComputedStyle(el).fontSize);

  while (el.scrollWidth > maxWidth && currentSize > minSize) {
    currentSize -= 0.2;
    el.style.fontSize = `${currentSize}px`;
  }
};

const fitHeaderTexts = () => {
  const wrap = headerRef.value;
  if (!wrap) return;
  const maxWidth = wrap.clientWidth;
  if (!maxWidth) return;

  fitSingleLine(titleRef.value, maxWidth, 18);
  fitSingleLine(subtitleRef.value, maxWidth, 12);
};

watch([() => localizedContent.value.title, () => localizedContent.value.subAfter, langCode], () => {
  nextTick(fitHeaderTexts);
});

const checkDevice = () => {
  fitHeaderTexts();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const nextDesktop = window.innerWidth >= 1024;
    if (nextDesktop !== isDesktop.value) {
      isDesktop.value = nextDesktop;
      isDropdownOpen.value = false;
    }
    nextTick(fitHeaderTexts);
  }, 100);
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  fitHeaderTexts();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeaderTexts);
  }
  if (typeof ResizeObserver !== 'undefined' && headerRef.value) {
    resizeObserver = new ResizeObserver(fitHeaderTexts);
    resizeObserver.observe(headerRef.value);
  }
  window.addEventListener('resize', checkDevice, { passive: true });
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkDevice);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
  if (resizeObserver) resizeObserver.disconnect();
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.cmp-section {
  position: relative;
  padding: clamp(80px, 10vw, 140px) 0;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.cmp-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* --- ЗАГОЛОВОК --- */
.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 0 auto 64px;
  gap: 16px;
}

.kicker {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #98989d;
  margin: 0;
  margin-right: -0.3em;
}

.gradient-title {
  font-size: 64px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.04em;
  padding-bottom: 0.08em;
  padding-inline: 4px;
  max-width: 100%;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  white-space: nowrap;
}

.section-subtitle {
  margin: 4px 0 0;
  max-width: 100%;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.005em;
  color: #8e8e93;
  white-space: nowrap;
}

.subtitle-brand {
  color: #e4e4e7;
  font-weight: 500;
}

/* --- ОСНОВНОЙ КОНТЕЙНЕР --- */
.glass-shell {
  position: relative;
  width: 100%;
  border-radius: 28px;
  background: linear-gradient(180deg, #0b0b0d 0%, #050506 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
}

/* --- ЯКОРЬ И ВЫПАДАЮЩЕЕ МЕНЮ --- */
.dropdown-anchor {
  position: relative;
}

.platform-dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 36px;
  width: 244px;
  padding: 8px;
  border-radius: 22px;
  background: rgba(16, 16, 18, 0.96);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 40;
}

.platform-dropdown-menu.is-mobile {
  left: auto;
  right: 16px;
  top: calc(100% + 4px);
  width: 224px;
}

.dropdown-caption {
  display: block;
  padding: 6px 14px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #636366;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #98989d;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease, color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.platform-dropdown-menu.is-mobile .dropdown-item {
  padding: 11px 14px;
  font-size: 15px;
}

@media (hover: hover) and (pointer: fine) {
  .dropdown-item:not(.active):hover {
    background: rgba(255, 255, 255, 0.045);
    color: #e4e4e7;
  }
}

.dropdown-item.active {
  background: rgba(255, 255, 255, 0.085);
  color: #ffffff;
  font-weight: 600;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: filter 0.3s ease;
}

.platform-dropdown-menu.is-mobile .dropdown-icon {
  width: 22px;
  height: 22px;
}

.dropdown-name {
  letter-spacing: -0.01em;
}

.dropdown-pop-enter-active,
.dropdown-pop-leave-active {
  transition: opacity 0.22s cubic-bezier(0.19, 1, 0.22, 1), transform 0.22s cubic-bezier(0.19, 1, 0.22, 1);
  transform-origin: top left;
}

.platform-dropdown-menu.is-mobile.dropdown-pop-enter-active,
.platform-dropdown-menu.is-mobile.dropdown-pop-leave-active {
  transform-origin: top right;
}

.dropdown-pop-enter-from,
.dropdown-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* --- DESKTOP TABLE: 1. Efimovs Agency | 2. Конструкторы | 3. Что сравниваем --- */
.table-head,
.table-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.12fr 1.12fr 0.76fr;
  align-items: stretch;
}

.table-head {
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.table-head > div {
  padding: 26px 44px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.table-head .col-our {
  position: relative;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
  border-right: 1px solid rgba(255, 255, 255, 0.09);
  border-top-left-radius: 27px;
}

.table-head .col-other {
  padding-block: 18px;
}

.table-head .col-crit {
  color: #71717a;
}

.platform-trigger-desktop {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  height: 46px;
  padding: 0 18px 0 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

@media (hover: hover) and (pointer: fine) {
  .platform-trigger-desktop:hover {
    background: rgba(255, 255, 255, 0.075);
    border-color: var(--active-color);
  }
}

.trigger-icon {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  transition: filter 0.3s ease;
}

.trigger-chevron {
  width: 16px;
  height: 16px;
  color: #a1a1aa;
  transition: transform 0.28s cubic-bezier(0.19, 1, 0.22, 1), color 0.2s ease;
  flex-shrink: 0;
}

.trigger-chevron.open {
  transform: rotate(180deg);
  color: #ffffff;
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background-color 0.25s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.015);
}

.table-row > div {
  padding: 32px 44px;
  font-size: 17px;
  line-height: 1.58;
  display: flex;
  align-items: center;
}

.table-row .col-our {
  color: #ffffff;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.09);
}

.table-row .col-other {
  color: #a1a1aa;
  font-weight: 400;
}

.table-row .col-crit {
  font-weight: 600;
  color: #f4f4f5;
}

.cell-text {
  display: block;
}

.cell-fade-enter-active,
.cell-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.cell-fade-enter-from {
  opacity: 0;
  transform: translateY(3px);
}

.cell-fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

/* --- MOBILE SEGMENTED SWITCH --- */
.mobile-switch-wrap {
  position: relative;
  z-index: 10;
  padding: 16px 16px 6px;
}

.segmented-control {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  border-radius: 14px;
  background: #121215;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.segment-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e4e2 100%);
  transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform;
  z-index: 1;
}

.segment-btn {
  position: relative;
  z-index: 2;
  height: 44px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: #8e8e93;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-tap-highlight-color: transparent;
}

.segment-platform-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.segment-chevron {
  width: 13px;
  height: 13px;
  opacity: 0.7;
  transition: transform 0.28s cubic-bezier(0.19, 1, 0.22, 1);
  flex-shrink: 0;
}

.segment-chevron.open {
  transform: rotate(180deg);
}

.segment-btn.active {
  color: #050505;
  font-weight: 800;
}

.segment-btn.active .segment-chevron {
  opacity: 1;
}

.mobile-list {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 4px 18px 8px;
}

.mobile-row {
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-row:last-child {
  border-bottom: none;
}

.mobile-crit {
  font-size: 12px;
  font-weight: 500;
  color: #8e8e93;
  letter-spacing: 0.01em;
}

.mobile-val {
  font-size: 15px;
  line-height: 1.44;
}

.mobile-val.is-our {
  color: #ffffff;
  font-weight: 500;
}

.mobile-val.is-other {
  color: #d4d4d8;
  font-weight: 400;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* --- FOOTER & КНОПКА (В ТОЧНОМ СТИЛЕ expertise.js) --- */
.table-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px 44px;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom-left-radius: 27px;
  border-bottom-right-radius: 27px;
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
}

@media (hover: hover) and (pointer: fine) {
  .main-action-btn:hover {
    background-color: #ffffff;
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  }
}

.main-action-btn:active {
  transform: scale(0.98);
}

/* --- АДАПТИВ --- */
@media (max-width: 1023px) {
  .cmp-container {
    max-width: 640px;
    padding: 0 20px;
  }

  .glass-shell {
    border-radius: 26px;
  }

  .section-header {
    margin-bottom: 34px;
    gap: 14px;
  }

  .section-subtitle {
    margin-top: 4px;
    font-size: 22px;
  }

  .table-footer {
    padding: 18px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }
}

@media (max-width: 767px) {
  .cmp-section {
    padding: 72px 0;
  }

  .cmp-container {
    padding: 0 16px;
  }

  .section-header {
    margin-bottom: 26px;
    gap: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.35em;
    margin-right: -0.35em;
  }

  .gradient-title {
    font-size: clamp(26px, 7.6vw, 38px);
  }

  .section-subtitle {
    margin-top: 2px;
    font-size: 19px;
  }

  .main-action-btn {
    width: 100%;
    padding: 20px 24px;
    font-size: 14px;
  }
}

@media (max-width: 374px) {
  .segment-btn {
    font-size: 10px;
    letter-spacing: 0.03em;
    gap: 5px;
  }

  .mobile-list {
    padding: 4px 14px 6px;
  }

  .mobile-val {
    font-size: 14px;
  }
}
</style>