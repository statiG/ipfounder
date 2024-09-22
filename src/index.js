import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
let poiLayer;

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 4,
    projection: 'EPSG:3857'
  })
});

const resultDiv = document.getElementById("result");
const ipInput = document.getElementById("ipInput");

document.getElementById('find').addEventListener('click', () => {
  const ip = ipInput.value;
  findLocation(ip);
});

document.getElementById('findCurrent').addEventListener('click', async () => {
  try {
    const ip = await getCurrentIp();
    findLocation(ip);
  } catch (error) {
    console.error('Ошибка при получении текущего IP:', error);
    resultDiv.innerHTML = 'Не удалось определить текущий IP.';
  }
});

// Асинхронная функция для получения текущего IP-адреса
async function getCurrentIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Ошибка при получении текущего IP:', error);
    return null;
  }
}

// Функция для поиска местоположения по IP-адресу
async function findLocation(ip) {
  resultDiv.innerHTML = '';
  const url = `https://ipapi.co/${ip || 'myip'}/json/`;
  try {
    const response = await fetch(url);
    const data = await response.json();
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
    setPOI([data.longitude, data.latitude]);
  } catch (error) {
    console.error('Ошибка при запросе:', error);
    resultDiv.innerHTML = 'Произошла ошибка при получении данных.';
  }
}
  function setPOI(coordinates) {
    // Создаем стиль для маркера (POI)
    const iconStyle = new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/v6.15.1/examples/data/icon.png', // Путь к иконке маркера
        scale: 0.5 // Масштаб иконки
      })
    });
  
    // Создаем новый векторный слой, если он еще не существует
    if (!poiLayer) {
      poiLayer = new VectorLayer({
        source: new VectorSource()
      });
      map.addLayer(poiLayer);
    }
  
    // Создаем новую геометрию точки (Point) на основе полученных координат
    const point = new Point(coordinates);
  
    // Создаем новый объект Feature, представляющий точку на карте,
    // с заданной геометрией и стилем
    const feature = new Feature({
      geometry: point
    });
    feature.setStyle(iconStyle);
  
    // Добавляем созданный Feature в источник векторного слоя
    poiLayer.getSource().addFeature(feature);
  
    // Центрируем карту на добавленной точке
    map.getView().setCenter(coordinates);
  }