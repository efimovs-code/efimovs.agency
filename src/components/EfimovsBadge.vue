<template>
  <a
    href="https://efimovs.agency"
    target="_blank"
    rel="noopener noreferrer"
    class="elite-watermark"
    aria-label="Created by Efimovs Agency"
  >
    <div class="watermark-text">
      <span class="watermark-top" v-once>Created by</span>
      <span class="watermark-bottom" v-once>Efimovs Agency</span>
    </div>
    <img src="/icons/transparent.png" alt="Efimovs Agency" class="watermark-logo" />
  </a>
</template>

<style scoped>
/* =========================================
   🌟 ЭЛИТНАЯ АВТОРСКАЯ ПОДПИСЬ (СТАТИЧНАЯ) 🌟
   ========================================= */
.elite-watermark {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  cursor: pointer;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  
  /* ВЕРНУЛИ ПЛАВНОСТЬ ДЛЯ ХОВЕРА */
  transition: opacity 0.4s ease;
}

/* ВЕРНУЛИ ЭФФЕКТ НАВЕДЕНИЯ ТОЛЬКО ДЛЯ ПК (где есть курсор) */
@media (hover: hover) and (pointer: fine) {
  .elite-watermark:hover {
    opacity: 0.85;
  }
}

.watermark-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  gap: 2px;
}

.watermark-top {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #ffffff; /* Всегда кристально белый */
}

.watermark-bottom {
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  
  /* Максимально светлый платиновый градиент для легкого объема */
  background: linear-gradient(180deg, #ffffff 0%, #e5e5ea 100%);
  background-size: 100% 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.watermark-logo {
  height: 54px; 
  width: auto;
  object-fit: contain;
  image-rendering: high-quality; 
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  
  /* Логотип всегда яркий с микроскопическим свечением */
  filter: drop-shadow(0px 1px 3px rgba(255, 255, 255, 0.15)) brightness(1.1);
}

/* =========================================
   🌟 АДАПТИВНОСТЬ ДЛЯ МОБИЛОК
   ========================================= */
@media (max-width: 767px) {
  .elite-watermark {
    gap: 12px;
  }
  .watermark-top {
    font-size: 9px;
    letter-spacing: 3px;
  }
  .watermark-bottom {
    font-size: 14px;
  }
  .watermark-logo {
    height: 49px;
  }
}
</style>