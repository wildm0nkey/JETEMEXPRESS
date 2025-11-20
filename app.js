// Конфигурация
const KONAEV_CENTER = {lat: 43.865, lng: 77.053};
const SERVICE_RADIUS_KM = 10; // Уменьшил зону обслуживания
const RATE_PER_BLOCK = 600;
const BLOCK_KM = 2;
const WHATSAPP_NUMBER = '77473522909';

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
    packageLabel: '📦 Информация о товаре',
    phoneLabel: '📞 Контактный телефон',
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
    step4: 'Подтвердите заказ в чате с оператором'
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
    packageLabel: '📦 Тауар туралы ақпарат',
    phoneLabel: '📞 Байланыс телефоны',
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
    step4: 'Оператормен сөйлесуде тапсырысты растаңыз'
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
  document.querySelectorAll('.lbl')[2].textContent = t.packageLabel;
  document.querySelectorAll('.lbl')[3].textContent = t.phoneLabel;
  
  document.querySelector('.map-header').innerHTML = `
    <span class="map-icon">🗺️</span>
    ${t.mapLabel}
    <div class="zone-badge">${t.zoneBadge}</div>
  `;
  
  document.querySelector('.file-text').textContent = t.fileText;
  document.getElementById('size').placeholder = t.sizePlaceholder;
  document.getElementById('phone').placeholder = t.phonePlaceholder;
  document.querySelector('.action-note').textContent = t.actionNote;
  
  // Обновляем инструкции
  document.querySelector('.instructions h3').textContent = t.instructions;
  const steps = document.querySelectorAll('.step');
  steps[0].innerHTML = `<span class="step-number">1</span>${t.step1}`;
  steps[1].innerHTML = `<span class="step-number">2</span>${t.step2}`;
  steps[2].innerHTML = `<span class="step-number">3</span>${t.step3}`;
  steps[3].innerHTML = `<span class="step-number">4</span>${t.step4}`;
}

document.getElementById('langBtn').addEventListener('click', () => {
  currentLang = (currentLang === 'ru') ? 'kz' : 'ru';
  const langText = document.querySelector('.lang-text');
  const langFlag = document.querySelector('.lang-flag');
  
  if (currentLang === 'kz') {
    langText.textContent = 'РУС';
    langFlag.textContent = '🇷🇺';
  } else {
    langText.textContent = 'КЗ';
    langFlag.textContent = '🇰🇿';
  }
  
  applyLang();
});

// --- Map & markers ---
const map = L.map('map').setView([KONAEV_CENTER.lat, KONAEV_CENTER.lng], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Зона обслуживания
L.circle([KONAEV_CENTER.lat, KONAEV_CENTER.lng], {
  radius: SERVICE_RADIUS_KM * 1000,
  color: '#2563eb',
  fillColor: '#3b82f6',
  fillOpacity: 0.1,
  weight: 2
}).addTo(map);

let markerA = L.marker([KONAEV_CENTER.lat, KONAEV_CENTER.lng], {
  draggable: true,
  icon: L.divIcon({
    html: '🟢 A',
    className: 'custom-marker',
    iconSize: [40, 40]
  })
}).addTo(map).bindPopup('Точка A (Откуда)');

let markerB = L.marker([KONAEV_CENTER.lat + 0.01, KONAEV_CENTER.lng + 0.01], {
  draggable: true,
  icon: L.divIcon({
    html: '🔴 B',
    className: 'custom-marker',
    iconSize: [40, 40]
  })
}).addTo(map).bindPopup('Точка B (Куда)');

// Стили для маркеров
const style = document.createElement('style');
style.textContent = `
  .custom-marker {
    background: none !important;
    border: none !important;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
`;
document.head.appendChild(style);

// --- Автозаполнение адресов ---
async function setAddressFromMarker(marker, inputId) {
  const latlng = marker.getLatLng();
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
    const data = await res.json();
    if (data.display_name) {
      document.getElementById(inputId).value = data.display_name.split(',')[0];
    }
  } catch (e) {
    console.warn('Geocode failed', e);
  }
}

markerA.on('dragend', () => {
  calculatePrice();
  setAddressFromMarker(markerA, 'fromAddress');
});

markerB.on('dragend', () => {
  calculatePrice();
  setAddressFromMarker(markerB, 'toAddress');
});

// --- Расчет расстояния ---
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = v => v * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + 
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function inServiceArea(lat, lng) {
  return haversineDistance(lat, lng, KONAEV_CENTER.lat, KONAEV_CENTER.lng) <= SERVICE_RADIUS_KM;
}

// --- Расчет цены ---
function calculatePrice() {
  const a = markerA.getLatLng();
  const b = markerB.getLatLng();
  
  if (!inServiceArea(a.lat, a.lng) || !inServiceArea(b.lat, b.lng)) {
    document.querySelector('.price-amount').textContent = 'Вне зоны';
    document.querySelector('.price-label').textContent = 'доставка невозможна';
    return null;
  }
  
  const km = haversineDistance(a.lat, a.lng, b.lat, b.lng);
  const blocks = Math.ceil(km / BLOCK_KM) || 1;
  const price = Math.max(RATE_PER_BLOCK, blocks * RATE_PER_BLOCK);
  
  document.querySelector('.price-amount').textContent = `${price} ₸`;
  document.querySelector('.price-label').textContent = `≈ ${km.toFixed(1)} км`;
  
  return { km, price, blocks };
}

document.getElementById('calcBtn').addEventListener('click', () => {
  const result = calculatePrice();
  if (result) {
    // Анимация успешного расчета
    const priceDisplay = document.querySelector('.price-display');
    priceDisplay.style.transform = 'scale(1.05)';
    setTimeout(() => {
      priceDisplay.style.transform = 'scale(1)';
    }, 200);
  }
});

// --- Обработка файлов ---
document.getElementById('photo').addEventListener('change', function(e) {
  const files = e.target.files;
  const fileNames = document.getElementById('fileNames');
  
  if (files.length > 0) {
    let names = [];
    for (let file of files) {
      names.push(file.name);
    }
    fileNames.textContent = `Выбрано: ${names.join(', ')}`;
  } else {
    fileNames.textContent = '';
  }
});

// --- Формирование сообщения для WhatsApp ---
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
  const size = document.getElementById('size').value.trim();
  
  const priceInfo = calculatePrice();
  
  let message = `🚚 *НОВЫЙ ЗАКАЗ JETEM EXPRESS* 🚚\n\n`;
  
  message += `📍 *ОТКУДА:*\n`;
  message += `${fromAddress}`;
  if (fromHouse) message += `, д. ${fromHouse}`;
  if (fromApt) message += `, кв. ${fromApt}`;
  if (fromFloor) message += `, ${fromFloor} этаж`;
  message += `\n\n`;
  
  message += `🎯 *КУДА:*\n`;
  message += `${toAddress}`;
  if (toHouse) message += `, д. ${toHouse}`;
  if (toApt) message += `, кв. ${toApt}`;
  if (toFloor) message += `, ${toFloor} этаж`;
  message += `\n\n`;
  
  message += `📞 *ТЕЛЕФОН:* ${phone}\n\n`;
  
  if (size) {
    message += `📦 *РАЗМЕРЫ:* ${size}\n\n`;
  }
  
  if (priceInfo) {
    message += `💰 *СТОИМОСТЬ:* ${priceInfo.price} ₸\n`;
    message += `📏 *РАССТОЯНИЕ:* ${priceInfo.km.toFixed(2)} км\n\n`;
  }
  
  message += `_Заказ создан через сайт_`;
  
  return encodeURIComponent(message);
}

// --- Отправка в WhatsApp ---
document.getElementById('sendOrder').addEventListener('click', () => {
  // Проверка обязательных полей
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const toAddress = document.getElementById('toAddress').value.trim();
  const fromHouse = document.getElementById('fromHouse').value.trim();
  const toHouse = document.getElementById('toHouse').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  if (!fromAddress || !toAddress || !fromHouse || !toHouse || !phone) {
    alert('Пожалуйста, заполните все обязательные поля: адреса и телефон');
    return;
  }
  
  const priceInfo = calculatePrice();
  if (!priceInfo) {
    alert('Невозможно рассчитать стоимость. Проверьте, что обе точки находятся в зоне обслуживания.');
    return;
  }
  
  const message = generateWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  
  // Открываем WhatsApp в новом окне
  window.open(whatsappUrl, '_blank');
  
  // Показываем подтверждение
  const btn = document.getElementById('sendOrder');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="btn-icon">✅</span>Данные готовы!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = 'linear-gradient(135deg, var(--success), #059669)';
  }, 3000);
});

// --- Инициализация ---
applyLang();
calculatePrice();

// Устанавливаем начальные адреса
setTimeout(() => {
  setAddressFromMarker(markerA, 'fromAddress');
  setAddressFromMarker(markerB, 'toAddress');
}, 1000);
