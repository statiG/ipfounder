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

export function createMap() {
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
      projection: 'EPSG:4326'
    })
  });

  return map;
}

export function setPOI(map, coordinates) {
  // Создаем стиль для маркера (POI)
  const iconStyle = new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/v6.15.1/examples/data/icon.png',
      scale: 0.5
    })
  });

  // Создаем новый векторный слой, если он еще не существует
  if (!poiLayer) {
    poiLayer = new VectorLayer({
      source: new VectorSource()
    });
    map.addLayer(poiLayer);
  } else {
    poiLayer.getSource().clear();
  }

  // Создаем новую геометрию точки (Point) на основе полученных координат
  const point = new Point(coordinates);

  const feature = new Feature({
    geometry: point
  });
  feature.setStyle(iconStyle);

  poiLayer.getSource().addFeature(feature);
}