import { HSLColor, RGBColor } from '../types/color-types';

class ColorConverter {
  hslToRgb(h: number, s: number, l: number): RGBColor {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (1 / 6 <= h && h < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (2 / 6 <= h && h < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (3 / 6 <= h && h < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (4 / 6 <= h && h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else if (5 / 6 <= h && h < 1) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  rgbToHsl(r: number, g: number, b: number): HSLColor {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  hslToHex(h: number, s: number, l: number): string {
    const rgb = this.hslToRgb(h, s, l);
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  hexToHsl(hex: string): HSLColor {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return this.rgbToHsl(r, g, b);
  }

  normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360;
  }
}

const colorConverter = new ColorConverter();

export { colorConverter };
