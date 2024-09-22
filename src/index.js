import { createMap, setPOI } from './map';
import { getCurrentIp, findLocation } from './api';

const map = createMap();

const resultDiv = document.getElementById("result");
const ipInput = document.getElementById("ipInput");

function handleApiResponse(data) {
  if (data) {
    resultDiv.innerHTML = `
      <p>IP: ${data.ip}</p>
      <p>Страна: ${data.country}</p>
      <p>Регион: ${data.region}</p>
      <p>Город: ${data.city}</p>
      <p>Почтовый индекс: ${data.zip}</p>
      <p>Широта: ${data.latitude}</p>
      <p>Долгота: ${data.longitude}</p>
      <p>Часовой пояс: ${data.timezone}</p>
      `;
    setPOI(map, [data.longitude, data.latitude]);
  } else {
    displayError('Произошла ошибка при получении данных.');
  }
}

function displayError(message) {
  resultDiv.innerHTML = message;
}

document.getElementById('find').addEventListener('click', () => {
  const ip = ipInput.value;
  findLocation(ip)
    .then(handleApiResponse)
    .catch(error => {
      console.error('Ошибка:', error);
      displayError('Произошла ошибка при получении данных.');
    });
});

document.getElementById('findCurrent').addEventListener('click', async () => {
  try {
    const ip = await getCurrentIp();
    findLocation(ip)
      .then(handleApiResponse)
      .catch(error => {
        console.error('Ошибка:', error);
        displayError('Произошла ошибка при получении данных.');
      });
  } catch (error) {
    console.error('Ошибка при получении текущего IP:', error);
    displayError('Не удалось определить текущий IP.');
  }
});