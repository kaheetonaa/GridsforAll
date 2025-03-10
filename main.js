import Map from 'ol/Map.js';
import View from 'ol/View.js';
import ImageLayer from 'ol/layer/Image.js';
import RasterSource from 'ol/source/Raster.js';
import Source from 'ol/source/ImageTile.js';
import Grid from 'ol-grid';
import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';
import cross from './assets/cross.svg'

/**
 * Color manipulation functions below are adapted from
 * https://github.com/d3/d3-color.
 */


/**
 * Convert an RGB pixel into an HCL pixel.
 * @param {Array<number>} pixel A pixel in RGB space.
 * @return {Array<number>} A pixel in HCL space.
 */
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
    const Xn = 0.95047;
    const Yn = 1;
    const Zn = 1.08883;
    const t0 = 4 / 29;
    const t1 = 6 / 29;
    const t2 = 3 * t1 * t1;
    const t3 = t1 * t1 * t1;
    const twoPi = 2 * Math.PI;
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
      let r = pixel[0]/255;
      let g = pixel[1]/255;
      let b = pixel[2]/255;

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
        switch(max) {
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

    /**
     * Convert an HCL pixel into an RGB pixel.
     * @param {Array<number>} pixel A pixel in HCL space.
     * @return {Array<number>} A pixel in RGB space.
     */
    function hsl2rgb (pixel) {
      h=pixel[0];
      s=pixel[1];
      l=pixel[2];

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
    }),
  ],
  target: 'map',
  view: new View({
    center: [11834170.421, 1879590.664],
    zoom: 6,
    maxZoom: 18,
  }),
});

let grid_style = new Style({
  image: new Icon({
    color: 'white',
    scale: 1,
    crossOrigin: 'anonymous',
    src: cross,
  }),
})
let grid_size_list=[250000,50000,5000,1000]
let grid_size=grid_size_list[0]
let grid=new Grid({ originCoordinate: [0, 0], rotationAnchorCoordinate: [0, 1], xGridSize: grid_size, yGridSize: grid_size, style: grid_style });
map.addInteraction(grid)
map.on('moveend', (e) => {
  let zoom= map.getView().getZoom();
  if (zoom<=7){
    grid_size=grid_size_list[0]
  }
  if (zoom<=10 && zoom>7) {
    grid_size=grid_size_list[1]
  }
  if (zoom<=13 && zoom>10) {
    grid_size=grid_size_list[2]
  }
  if (zoom>13) {
    grid_size=grid_size_list[3]
  }
  grid.setXGridSize(grid_size)
  grid.setYGridSize(grid_size)
  console.log(zoom,grid.xGridSize)
})



