//////////////
// Конфигурация
const KONAEV_CENTER = {lat: 43.865, lng: 77.053};
const SERVICE_RADIUS_KM = 10;
const WHATSAPP_NUMBER = '77477921430';

// Новая система цен
const MIN_PRICE = 600; // 0-1.5 км
const PRICE_PER_100M = 30; // за каждые 100 метров после 1.5 км

// --- Локализация ---
const i18n = {
  ru: {
    orderTitle: 'Оформление заказа',
    calcBtn: 'Рассчитать стоимость',
    sendOrder: 'СОЗДАТЬ ЗАКАЗ',
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
    sizePlaceholder: 'Размеры (например: 50×40×30 см)',
    productPlaceholder: 'Название товара (например: Документы, Еда, Одежда)',
    senderPlaceholder: 'Имя отправителя (необязательно)',
    receiverPlaceholder: 'Имя получателя (необязательно)',
    phonePlaceholder: '+7 7xx xxx xx xx',
    actionNote: 'Нажмите чтобы отправить все данные в WhatsApp',
    instructions: 'Как это работает:',
    step1: 'Заполните форму и рассчитайте стоимость',
    step2: 'Нажмите кнопку отправки',
    step3: 'Все данные готовы',
    step4: 'Подтвердите заказ в чате с оператором',
    coordinates: 'Координаты',
    fromCoords: 'Координаты точки A',
    toCoords: 'Координаты точки B'
  },
  kz: {
    orderTitle: 'Тапсырыс беру',
    calcBtn: 'Жіберу құнын есептеу',
    sendOrder: 'ТАПСЫРЫС ЖАСАУ',
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
    sizePlaceholder: 'Өлшемдер (мысалы: 50×40×30 см)',
    productPlaceholder: 'Тауар атауы (мысалы: Құжаттар, Тамақ, Киім)',
    senderPlaceholder: 'Жіберуші аты (міндетті емес)',
    receiverPlaceholder: 'Алушы аты (міндетті емес)',
    phonePlaceholder: '+7 7xx xxx xx xx',
    actionNote: 'Барлық деректерді WhatsApp-ке жіберу үшін басыңыз',
    instructions: 'Бұл қалай жұмыс істейді:',
    step1: 'Форманы толтырып, құнды есептеңіз',
    step2: 'Жіберу түймесін басыңіз',
    step3: 'Барлық деректер WhatsApp-ке автоматты түрде ауысады',
    step4: 'Оператормен сөйлесуде тапсырысты растаңіз',
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
  
  document.querySelectorAll('.lbl')[0].textContent = t.fromLabel;
  document.querySelectorAll('.lbl')[1].textContent = t.toLabel;
  document.querySelectorAll('.lbl')[2].textContent = t.packageLabel;
  document.querySelectorAll('.lbl')[3].textContent = t.phoneLabel;
  
  document.querySelector('.map-header').innerHTML = `
    <span class="map-icon">🗺️</span>
    ${t.mapLabel}
    <div class="zone-badge">${t.zoneBadge}</div>
  `;
  
  document.getElementById('size').placeholder = t.sizePlaceholder;
  document.getElementById('productName').placeholder = t.productPlaceholder;
  document.getElementById('senderName').placeholder = t.senderPlaceholder;
  document.getElementById('receiverName').placeholder = t.receiverPlaceholder;
  document.getElementById('phone').placeholder = t.phonePlaceholder;
  document.querySelector('.action-note').textContent = t.actionNote;
  
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
  .coords-display {
    background: white;
    padding: 8px 12px;
    border-radius: 8px;
    border: 2px solid #2563eb;
    margin: 10px 0;
    font-family: 'Inter', monospace;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(style);

// --- Функции для работы с координатами ---
function formatCoordinates(lat, lng, precision = 6) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(precision)}°${latDir}, ${Math.abs(lng).toFixed(precision)}°${lngDir}`;
}

function createGoogleMapsRouteLink(fromLat, fromLng, toLat, toLng) {
  return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
}

// --- Обновление полей координатами ---
function updateCoordinateFields() {
  const a = markerA.getLatLng();
  const b = markerB.getLatLng();
  
  document.getElementById('fromAddress').value = formatCoordinates(a.lat, a.lng);
  document.getElementById('toAddress').value = formatCoordinates(b.lat, b.lng);
}

markerA.on('dragend', () => {
  calculatePrice();
  updateCoordinateFields();
  showTempPopup(markerA, 'Координаты обновлены!');
});

markerB.on('dragend', () => {
  calculatePrice();
  updateCoordinateFields();
  showTempPopup(markerB, 'Координаты обновлены!');
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

// --- НОВАЯ СИСТЕМА РАСЧЕТА ЦЕНЫ ---
function calculatePrice() {
  const a = markerA.getLatLng();
  const b = markerB.getLatLng();
  
  if (!inServiceArea(a.lat, a.lng) || !inServiceArea(b.lat, b.lng)) {
    document.querySelector('.price-amount').textContent = 'Вне зоны';
    document.querySelector('.price-label').textContent = 'доставка невозможна';
    return null;
  }
  
  const km = haversineDistance(a.lat, a.lng, b.lat, b.lng);
  let price = 0;
  
  // Новая система расчетов
  if (km <= 1.5) {
    price = MIN_PRICE; // 0-1.5 км = 600 тг
  } else {
    // Конвертируем километры в метры и вычитаем первые 1500 метров
    const meters = km * 1000;
    const metersAfter1500 = meters - 1500;
    
    // Рассчитываем количество 100-метровых отрезков
    const hundredMeterBlocks = Math.ceil(metersAfter1500 / 100);
    
    // Цена = 600 + (количество 100-метровых отрезков * 30)
    price = MIN_PRICE + (hundredMeterBlocks * PRICE_PER_100M);
  }
  
  // Округляем до целого
  price = Math.round(price);
  
  document.querySelector('.price-amount').textContent = `${price} ₸`;
  document.querySelector('.price-label').textContent = `≈ ${km.toFixed(1)} км`;
  
  return { km, price };
}

document.getElementById('calcBtn').addEventListener('click', () => {
  const result = calculatePrice();
  if (result) {
    const priceDisplay = document.querySelector('.price-display');
    priceDisplay.style.transform = 'scale(1.05)';
    setTimeout(() => {
      priceDisplay.style.transform = 'scale(1)';
    }, 200);
  }
});

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
  const senderName = document.getElementById('senderName').value.trim();
  const receiverName = document.getElementById('receiverName').value.trim();
  const productName = document.getElementById('productName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const size = document.getElementById('size').value.trim();
  
  const priceInfo = calculatePrice();
  const a = markerA.getLatLng();
  const b = markerB.getLatLng();
  
  let message = `🚚 *НОВЫЙ ЗАКАЗ JETEM EXPRESS* 🚚\n\n`;
  
  // Точка A - Отправитель
  message += `📍 *ОТКУДА:*\n`;
  if (fromHouse) message += `Дом ${fromHouse}`;
  if (fromApt) message += `, кв. ${fromApt}`;
  if (fromFloor) message += `, ${fromFloor} этаж`;
  if (senderName) message += `\n👤 Отправитель: ${senderName}`;
  message += `\n📌 Координаты: ${formatCoordinates(a.lat, a.lng)}\n\n`;
  
  // Точка B - Получатель
  message += `🎯 *КУДА:*\n`;
  if (toHouse) message += `Дом ${toHouse}`;
  if (toApt) message += `, кв. ${toApt}`;
  if (toFloor) message += `, ${toFloor} этаж`;
  if (receiverName) message += `\n👤 Получатель: ${receiverName}`;
  message += `\n📌 Координаты: ${formatCoordinates(b.lat, b.lng)}\n\n`;
  
  // Контактная информация
  message += `📞 *ТЕЛЕФОН:* ${phone}\n\n`;
  
  // Информация о товаре
  if (productName) {
    message += `📦 *НАЗВАНИЕ ТОВАРА:* ${productName}\n`;
  }
  if (size) {
    message += `📏 *РАЗМЕРЫ УПАКОВКИ:* ${size}\n\n`;
  } else if (productName) {
    message += `\n`;
  }
  
  // Стоимость и маршрут
  if (priceInfo) {
    message += `💰 *СТОИМОСТЬ ДОСТАВКИ:* ${priceInfo.price} ₸\n`;
    message += `📏 *РАССТОЯНИЕ:* ${priceInfo.km.toFixed(2)} км\n\n`;
    
    // Готовый маршрут (ТОЛЬКО Google Maps)
    message += `🗺️ *АДРЕС*\n`;
    message += `${createGoogleMapsRouteLink(a.lat, a.lng, b.lat, b.lng)}\n\n`;
  }
  
  message += `_Заказ создан через сайт • ${new Date().toLocaleString('ru-RU')}_`;
  
  return encodeURIComponent(message);
}

// --- Функция для быстрого копирования координат ---
function setupCoordinateCopy() {
  markerA.on('click', function() {
    const coords = markerA.getLatLng();
    const coordText = formatCoordinates(coords.lat, coords.lng);
    copyToClipboard(coordText);
  });
  
  markerB.on('click', function() {
    const coords = markerB.getLatLng();
    const coordText = formatCoordinates(coords.lat, coords.lng);
    copyToClipboard(coordText);
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Координаты скопированы: ', text);
  }).catch(err => {
    console.error('Ошибка копирования: ', err);
  });
}

function showTempPopup(marker, message) {
  marker.bindPopup(message).openPopup();
  setTimeout(() => {
    marker.closePopup();
  }, 2000);
}

// --- Отправка в WhatsApp ---
document.getElementById('sendOrder').addEventListener('click', () => {
  const fromHouse = document.getElementById('fromHouse').value.trim();
  const toHouse = document.getElementById('toHouse').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  if (!fromHouse || !toHouse || !phone) {
    alert('Пожалуйста, заполните все обязательные поля: номера домов и телефон');
    return;
  }
  
  const priceInfo = calculatePrice();
  if (!priceInfo) {
    alert('Невозможно рассчитать стоимость. Проверьте, что обе точки находятся в зоне обслуживания.');
    return;
  }
  
  const message = generateWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  
  window.open(whatsappUrl, '_blank');
  
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
updateCoordinateFields(); // Заполняем координатами при загрузке
calculatePrice();
setupCoordinateCopy();

// Добавляем информацию о координатах в интерфейс
function addCoordinatesInfo() {
  const mapContainer = document.querySelector('.map-section');
  const coordsInfo = document.createElement('div');
  coordsInfo.className = 'coords-display';
  coordsInfo.innerHTML = `
    <div><strong>🟢 Точка A:</strong> <span id="coordsA">${formatCoordinates(markerA.getLatLng().lat, markerA.getLatLng().lng)}</span></div>
    <div><strong>🔴 Точка B:</strong> <span id="coordsB">${formatCoordinates(markerB.getLatLng().lat, markerB.getLatLng().lng)}</span></div>
    <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
      🔍 зажмите маркер и выберите координаты 
    </div>
  `;
  mapContainer.insertBefore(coordsInfo, document.getElementById('map'));
}

// Обновление отображения координат в реальном времени
function updateCoordinatesDisplay() {
  const coordsA = document.getElementById('coordsA');
  const coordsB = document.getElementById('coordsB');
  
  if (coordsA && coordsB) {
    const a = markerA.getLatLng();
    const b = markerB.getLatLng();
    coordsA.textContent = formatCoordinates(a.lat, a.lng);
    coordsB.textContent = formatCoordinates(b.lat, b.lng);
  }
}

// Обновляем отображение координат при перемещении маркеров
markerA.on('drag', updateCoordinatesDisplay);
markerB.on('drag', updateCoordinatesDisplay);

// Инициализируем дополнительную информацию
setTimeout(() => {
  addCoordinatesInfo();
}, 500);
