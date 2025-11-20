// Конфигурация
const KONAEV_CENTER = {lat: 43.865, lng: 77.053};
const SERVICE_RADIUS_KM = 10;
const RATE_PER_BLOCK = 600;
const BLOCK_KM = 2;
const WHATSAPP_NUMBER = '77471943102';

// --- Локализация ---
const i18n = {
  ru: {
    orderTitle: 'Оформление заказа',
    calcBtn: 'Рассчитать стоимость',
    sendOrder: 'Перейти к отправке в WhatsApp',
    success: 'Заказ успешно отправлен!',
    price: 'Цена',
    support: 'Поддержка',
    step: 'Шаг 1 из 2',
    fromLabel: '📍 Откуда забрать',
    toLabel: '🎯 Куда доставить',
    packageLabel: '📦 Информация о доставке',
    phoneLabel: '📞 Контактный телефон',
    nameLabel: '👤 Ваше имя',
    namePlaceholder: 'Как к вам обращаться?',
    itemLabel: '📦 Что нужно доставить?',
    itemPlaceholder: 'Опишите что нужно доставить',
    mapLabel: '🗺️ Карта доставки',
    zoneBadge: 'Зона обслуживания: 10 км',
    fileText: 'Добавить фото товара',
    sizePlaceholder: 'Размеры (например: 50×40×30 см)',
    phonePlaceholder: '+7 7xx xxx xx xx',
    actionNote: 'Нажмите чтобы отправить все данные в WhatsApp',
    instructions: 'Как это работает:',
    step1: 'Заполните форму и рассчитайте стоимость',
    step2: 'Нажмите кнопку отправки',
    step3: 'Все данные автоматически перейдут в WhatsApp',
    step4: 'Подтвердите заказ в чате с оператором',
    coordinates: 'Координаты',
    fromCoords: 'Координаты точки A',
    toCoords: 'Координаты точки B'
  },
  kz: {
    orderTitle: 'Тапсырыс беру',
    calcBtn: 'Жіберу құнын есептеу',
    sendOrder: 'WhatsApp-ке жіберуге өту',
    success: 'Тапсырыс сәтті жіберілді!',
    price: 'Бағасы',
    support: 'Қолдау',
    step: '1-қадам 2-ден',
    fromLabel: '📍 Қайдан алу керек',
    toLabel: '🎯 Қайда жеткізу керек',
    packageLabel: '📦 Жеткізу туралы ақпарат',
    phoneLabel: '📞 Байланыс телефоны',
    nameLabel: '👤 Сіздің атыңыз',
    namePlaceholder: 'Сізге қалай жүгіну керек?',
    itemLabel: '📦 Нені жеткізу керек?',
    itemPlaceholder: 'Нені жеткізу керектігін сипаттаңыз',
    mapLabel: '🗺️ Жеткізу картасы',
    zoneBadge: 'Қызмет көрсету аймағы: 10 км',
    fileText: 'Тауардың суретін қосу',
    sizePlaceholder: 'Өлшемдер (мысалы: 50×40×30 см)',
    phonePlaceholder: '+7 7xx xxx xx xx',
    actionNote: 'Барлық деректерді WhatsApp-ке жіберу үшін басыңыз',
    instructions: 'Бұл қалай жұмыс істейді:',
    step1: 'Форманы толтырып, құнды есептеңіз',
    step2: 'Жіберу түймесін басыңыз',
    step3: 'Барлық деректер WhatsApp-ке автоматты түрде ауысады',
    step4: 'Оператормен сөйлесуде тапсырысты растаңыз',
    coordinates: 'Координаталар',
    fromCoords: 'А нүктесінің координаталары',
    toCoords: 'B нүктесінің координаталары'
  }
};

let currentLang = 'ru';

function applyLang() {
  const t = i18n[currentLang];
  document.getElementById('orderTitle').textContent = t.orderTitle;
  document.getElementById('calcBtn').innerHTML = `<span class="btn-icon">💰</span>${t.calcBtn}`;
  document.getElementById('sendOrder').innerHTML = `<span class="btn-icon">🚀</span>${t.sendOrder}`;
  document.querySelector('.step-indicator').textContent = t.step;
  document.querySelector('.support-link').innerHTML = `<span class="wa-icon">💬</span>${t.support}`;
  
  // Обновляем лейблы
  document.querySelectorAll('.lbl')[0].textContent = t.fromLabel;
  document.querySelectorAll('.lbl')[1].textContent = t.toLabel;
  document.querySelectorAll('.lbl')[2].textContent = t.phoneLabel;
  document.querySelectorAll('.lbl')[3].textContent = t.nameLabel;
  document.querySelectorAll('.lbl')[4].textContent = t.packageLabel;
  
  document.querySelector('.map-header').innerHTML = `
    <span class="map-icon">🗺️</span>
    ${t.mapLabel}
    <div class="zone-badge">${t.zoneBadge}</div>
  `;
  
  document.querySelector('.file-text').textContent = t.fileText;
  document.getElementById('size').placeholder = t.sizePlaceholder;
  document.getElementById('phone').placeholder = t.phonePlaceholder;
  document.getElementById('clientName').placeholder = t.namePlaceholder;
  document.getElementById('itemName').placeholder = t.itemPlaceholder;
  document.querySelector('.action-note').textContent = t.actionNote;
  
  // Обновляем инструкции
  document.querySelector('.instructions h3').textContent = t.instructions;
  const steps = document.querySelectorAll('.step');
  steps[0].innerHTML = `<span class="step-number">1</span>${t.step1}`;
  steps[1].innerHTML = `<span class="step-number">2</span>${t.step2}`;
  steps[2].innerHTML = `<span class="step-number">3</span>${t.step3}`;
  steps[3].innerHTML = `<span class="step-number">4</span>${t.step4}`;
}

// ... остальной код локализации без изменений ...

// --- Удаляем функцию копирования координатов (убираем эту часть) ---
// УДАЛИТЬ ВЕСЬ БЛОК setupCoordinateCopy и связанные функции

// --- Улучшенная функция формирования сообщения для WhatsApp ---
function generateWhatsAppMessage() {
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const toAddress = document.getElementById('toAddress').value.trim();
  const fromHouse = document.getElementById('fromHouse').value.trim();
  const toHouse = document.getElementById('toHouse').value.trim();
  const fromApt = document.getElementById('fromApt').value.trim();
  const toApt = document.getElementById('toApt').value.trim();
  const fromFloor = document.getElementById('fromFloor').value.trim();
  const toFloor = document.getElementById('toFloor').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const clientName = document.getElementById('clientName').value.trim();
  const itemName = document.getElementById('itemName').value.trim();
  const size = document.getElementById('size').value.trim();
  
  const priceInfo = calculatePrice();
  const a = markerA.getLatLng();
  const b = markerB.getLatLng();
  
  const t = i18n[currentLang];
  
  let message = `🚚 *НОВЫЙ ЗАКАЗ JETEM EXPRESS* 🚚\n\n`;
  
  // Информация о клиенте
  message += `👤 *КЛИЕНТ:* ${clientName}\n`;
  message += `📞 *ТЕЛЕФОН:* ${phone}\n\n`;
  
  message += `📍 *${t.fromLabel.toUpperCase()}:*\n`;
  message += `${fromAddress}`;
  if (fromHouse) message += `, д. ${fromHouse}`;
  if (fromApt) message += `, кв. ${fromApt}`;
  if (fromFloor) message += `, ${fromFloor} этаж`;
  message += `\n`;
  
  // Координаты точки A
  message += `*${t.fromCoords}:* ${formatCoordinates(a.lat, a.lng)}\n`;
  message += `🗺️ *Карта A:* ${createGoogleMapsLink(a.lat, a.lng)}\n\n`;
  
  message += `🎯 *${t.toLabel.toUpperCase()}:*\n`;
  message += `${toAddress}`;
  if (toHouse) message += `, д. ${toHouse}`;
  if (toApt) message += `, кв. ${toApt}`;
  if (toFloor) message += `, ${toFloor} этаж`;
  message += `\n`;
  
  // Координаты точки B
  message += `*${t.toCoords}:* ${formatCoordinates(b.lat, b.lng)}\n`;
  message += `🗺️ *Карта B:* ${createGoogleMapsLink(b.lat, b.lng)}\n\n`;
  
  // Информация о товаре
  message += `📦 *ЧТО ДОСТАВИТЬ:* ${itemName}\n`;
  if (size) {
    message += `📏 *РАЗМЕРЫ:* ${size}\n`;
  }
  
  // Информация о файлах
  const files = document.getElementById('photo').files;
  if (files.length > 0) {
    message += `📷 *ФОТОГРАФИЙ:* ${files.length}\n`;
  }
  message += `\n`;
  
  if (priceInfo) {
    message += `💰 *СТОИМОСТЬ ДОСТАВКИ:* ${priceInfo.price} ₸\n`;
    message += `📏 *РАССТОЯНИЕ:* ${priceInfo.km.toFixed(2)} км\n\n`;
  }
  
  message += `📍 *ЦЕНТР ЗОНЫ ОБСЛУЖИВАНИЯ:* ${formatCoordinates(KONAEV_CENTER.lat, KONAEV_CENTER.lng)}\n\n`;
  
  message += `_Заказ создан через сайт • ${new Date().toLocaleString('ru-RU')}_`;
  
  return encodeURIComponent(message);
}

// --- Функция для отправки в WhatsApp с фото ---
async function sendToWhatsApp() {
  // Проверка обязательных полей
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const toAddress = document.getElementById('toAddress').value.trim();
  const fromHouse = document.getElementById('fromHouse').value.trim();
  const toHouse = document.getElementById('toHouse').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const clientName = document.getElementById('clientName').value.trim();
  const itemName = document.getElementById('itemName').value.trim();
  
  if (!fromAddress || !toAddress || !fromHouse || !toHouse || !phone || !clientName || !itemName) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }
  
  const priceInfo = calculatePrice();
  if (!priceInfo) {
    alert('Невозможно рассчитать стоимость. Проверьте, что обе точки находятся в зоне обслуживания.');
    return;
  }
  
  const message = generateWhatsAppMessage();
  const files = document.getElementById('photo').files;
  
  // Если есть фото, используем другой подход
  if (files.length > 0) {
    // Для фото сначала отправляем сообщение, потом пользователь вручную отправляет фото
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Показываем инструкцию для фото
    setTimeout(() => {
      alert(`✅ Данные заказа отправлены в WhatsApp!\n\n📷 Теперь пожалуйста, отправьте ${files.length} фото товара в этот же чат.`);
    }, 1000);
    
  } else {
    // Если фото нет, просто отправляем сообщение
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
  
  // Показываем подтверждение
  const btn = document.getElementById('sendOrder');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="btn-icon">✅</span>Данные отправлены!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = 'linear-gradient(135deg, var(--success), #059669)';
  }, 3000);
}

// --- Обновляем обработчик кнопки отправки ---
document.getElementById('sendOrder').addEventListener('click', sendToWhatsApp);

// --- Инициализация ---
applyLang();
calculatePrice();

// Устанавливаем начальные адреса
setTimeout(() => {
  setAddressFromMarker(markerA, 'fromAddress');
  setAddressFromMarker(markerB, 'toAddress');
}, 1000);
