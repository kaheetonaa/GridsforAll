import Map from 'ol/Map.js';
import View from 'ol/View.js';
import ImageLayer from 'ol/layer/Image.js';
import RasterSource from 'ol/source/Raster.js';
import VectorSource from 'ol/source/Vector.js';
import Source from 'ol/source/ImageTile.js';
import Grid from 'ol-grid';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import Cluster from 'ol/source/Cluster.js';
import Fill from 'ol/style/Fill.js';
import Text from 'ol/style/Text.js';
import cross from '/assets/cross.svg';
import building_cross from '/assets/building_cross.svg';

//Drawing overlay

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
let select_coord = [centerX, centerY];
let select = 0;
let select_name = "";
let status = "";

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /**
   * Your drawings need to be inside this function otherwise they will be reset when 
   * you resize the browser window and the canvas goes will be cleared.
   */
  drawStuff();
}

resizeCanvas();

function drawStuff() {
  // do your drawing stuff here
  ctx.clearRect(0, 0, centerX * 2, centerY * 2);//clear background
  if (select > 0) {
    ctx.strokeStyle = 'red';
    ctx.beginPath()
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(select_coord[0] + 8, select_coord[1] + 8);
    ctx.stroke();
    ctx.font = 'bold 16px Courier'; // Default font if none provided
    ctx.fillStyle = 'red'; // Default color if none provided
    ctx.textAlign = 'center'; // Default alignment if none provided
    
    if (select_coord[1] > centerY) {
      ctx.fillText(select_name, centerX, centerY - 16);
    } else {
      ctx.fillText(select_name, centerX, centerY + 16);
    }
  } else {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1; // Or whatever thickness you want
    ctx.setLineDash([1, 3]);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash to solid
  }
}


let grid_style = new Style({
  image: new Icon({
    color: 'white',
    scale: 1,
    crossOrigin: 'anonymous',
    src: cross,
  }),
})


var buildings = new VectorSource({
  projection: 'EPSG:3857',
  url: 'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/main/data/output.geojson',
  format: new GeoJSON
});

const building_cluster = new Cluster({
  distance: 50,
  minDistance: 1,
  source: buildings,
});

const styleCache = {};

const building_layer = new VectorLayer({
  className: 'building',
  source: building_cluster,
  style: function (feature) {
    const size = feature.get('features').length;
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new Icon({
          color: 'red',
          scale: 1,
          crossOrigin: 'anonymous',
          src: building_cross,
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: 'red',
          }),
          offsetX: 10,
          offsetY: 10
        })
      });
      styleCache[size] = style;

    }
    return style;
  },
});





const raster = new RasterSource({
  sources: [
    new Source({
      attributions:
        'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url:
        'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    }),
  ],
  operation: function (pixels) {
    function invert_color(pixel) {
      const red = 255 - pixel[0];
      const green = 255 - pixel[1];
      const blue = 255 - pixel[2];
      pixel[0] = red;
      pixel[1] = green;
      pixel[2] = blue;
      return pixel;
    }

    function rgb2hsl(pixel) {
      let r = pixel[0] / 255;
      let g = pixel[1] / 255;
      let b = pixel[2] / 255;

      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      // lightness is the average of the largest and smallest color components
      var lum = (max + min) / 2;
      var hue;
      var sat;
      if (max == min) { // no saturation
        hue = 0;
        sat = 0;
      } else {
        var c = max - min; // chroma
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        sat = c / (1 - Math.abs(2 * lum - 1));
        switch (max) {
          case r:
            // hue = (g - b) / c;
            // hue = ((g - b) / c) % 6;
            // hue = (g - b) / c + (g < b ? 6 : 0);
            break;
          case g:
            hue = (b - r) / c + 2;
            break;
          case b:
            hue = (r - g) / c + 4;
            break;
        }
      }
      let h = Math.round(hue * 60); // °
      let s = Math.round(sat * 100); // %
      let l = Math.round(lum * 100); // %

      pixel[0] = h;
      pixel[1] = s;
      pixel[2] = l;

      return pixel;
    }

    function hsl2rgb(pixel) {
      h = pixel[0];
      s = pixel[1];
      l = pixel[2];

      let r, g, b, m, c, x

      if (!isFinite(h)) h = 0
      if (!isFinite(s)) s = 0
      if (!isFinite(l)) l = 0

      h /= 60
      if (h < 0) h = 6 - (-h % 6)
      h %= 6

      s = Math.max(0, Math.min(1, s / 100))
      l = Math.max(0, Math.min(1, l / 100))

      c = (1 - Math.abs((2 * l) - 1)) * s
      x = c * (1 - Math.abs((h % 2) - 1))

      if (h < 1) {
        r = c
        g = x
        b = 0
      } else if (h < 2) {
        r = x
        g = c
        b = 0
      } else if (h < 3) {
        r = 0
        g = c
        b = x
      } else if (h < 4) {
        r = 0
        g = x
        b = c
      } else if (h < 5) {
        r = x
        g = 0
        b = c
      } else {
        r = c
        g = 0
        b = x
      }

      m = l - c / 2
      pixel[0] = Math.round((r + m) * 255)
      pixel[1] = Math.round((g + m) * 255)
      pixel[2] = Math.round((b + m) * 255)
      return pixel;
    }

    const hsl = rgb2hsl(pixels[0]);
    hsl[1] *= 0;
    hsl[2] *= 1;

    return invert_color(hsl2rgb(hsl));

  },
});

const map = new Map({
  layers: [
    new ImageLayer({
      source: raster,
    }), building_layer
  ],
  target: 'map',
  view: new View({
    center: [11834170.421, 1879590.664],
    zoom: 6,
    maxZoom: 18,
  }),
});


let grid_size_list = [250000, 50000, 5000, 1000, 200]
let grid_size = grid_size_list[0]
let grid = new Grid({ originCoordinate: [0, 0], rotationAnchorCoordinate: [0, 1], xGridSize: grid_size, yGridSize: grid_size, style: grid_style });
map.addInteraction(grid)

raster.on('beforeoperations', () => {
  status = "Loading basemap,might take times";
})
raster.on('afteroperations', () => {
  status = "Done loading basemap";
})
map.on('movestart', (e) => {
  select = 0;
  drawStuff();
})
map.on('moveend', (e) => {
  //console.log(building_layer['className_'])
  //console.log('center' + map.getPixelFromCoordinate(map.getView().getCenter()))
  map.forEachFeatureAtPixel(map.getPixelFromCoordinate(
    map.getView().getCenter()),
    (features) => {
      if (features['values_']['features'].length > 0) {
        select = 1; //have selected
        //console.log(map.getPixelFromCoordinate(features['values_']['features'][0]['values_']['geometry']['flatCoordinates']));
        select_coord = map.getPixelFromCoordinate(features['values_']['features'][0]['values_']['geometry']['flatCoordinates']);
        select_name = features['values_']['features'][0]['values_']['(1) BUILDING NAME '];
        return true;
      }
    },
    {
      layerFilter: (layer) => { return layer['className_'] == 'building' },
      hitTolerance: 100,
    })
  let zoom = map.getView().getZoom();
  if (zoom <= 8) {
    grid_size = grid_size_list[0]
  }
  if (zoom <= 11 && zoom > 8) {
    grid_size = grid_size_list[1]
  }
  if (zoom <= 14 && zoom > 11) {
    grid_size = grid_size_list[2]
  }
  if (zoom <= 16 && zoom > 14) {
    grid_size = grid_size_list[3]
  }
  if (zoom > 16) {
    grid_size = grid_size_list[4]
  }
  grid.setXGridSize(grid_size)
  grid.setYGridSize(grid_size)
  drawStuff();
})
