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

    function rgb2hcl(pixel) {
      const red = rgb2xyz(pixel[0]);
      const green = rgb2xyz(pixel[1]);
      const blue = rgb2xyz(pixel[2]);

      const x = xyz2lab(
        (0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn,
      );
      const y = xyz2lab(
        (0.2126729 * red + 0.7151522 * green + 0.072175 * blue) / Yn,
      );
      const z = xyz2lab(
        (0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / Zn,
      );

      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);

      const c = Math.sqrt(a * a + b * b);
      let h = Math.atan2(b, a);
      if (h < 0) {
        h += twoPi;
      }

      pixel[0] = h;
      pixel[1] = c;
      pixel[2] = l;

      return pixel;
    }

    /**
     * Convert an HCL pixel into an RGB pixel.
     * @param {Array<number>} pixel A pixel in HCL space.
     * @return {Array<number>} A pixel in RGB space.
     */
    function hcl2rgb(pixel) {
      const h = pixel[0];
      const c = pixel[1];
      const l = pixel[2];

      const a = Math.cos(h) * c;
      const b = Math.sin(h) * c;

      let y = (l + 16) / 116;
      let x = isNaN(a) ? y : y + a / 500;
      let z = isNaN(b) ? y : y - b / 200;

      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);

      pixel[0] = xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
      pixel[1] = xyz2rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
      pixel[2] = xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

      return pixel;
    }

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
      return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function rgb2xyz(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function xyz2rgb(x) {
      return (
        255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055)
      );
    }

    const hcl = rgb2hcl(pixels[0]);
    hcl[0] = 0;

    hcl[1] *= 0;
    hcl[2] *= 1;

    return invert_color(hcl2rgb(hcl));
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

map.addInteraction(new Grid({ originCoordinate: [0, 0], rotationAnchorCoordinate: [0, 1], xGridSize: 250000, yGridSize: 250000, style: grid_style }));

