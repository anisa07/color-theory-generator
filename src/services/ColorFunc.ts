import { HSLColor } from '../types/color-types';
import { colorConverter } from './ColorConverter';

class ColorFunc {
  getComplementaryColor(hsl: HSLColor): HSLColor {
    return {
      h: colorConverter.normalizeHue(hsl.h + 180),
      s: hsl.s,
      l: hsl.l,
    };
  }

  getAnalogousColors(hsl: HSLColor): HSLColor[] {
    return [
      { h: colorConverter.normalizeHue(hsl.h - 30), s: hsl.s, l: hsl.l },
      hsl,
      { h: colorConverter.normalizeHue(hsl.h + 30), s: hsl.s, l: hsl.l },
    ];
  }

  getTriadicColors(hsl: HSLColor): HSLColor[] {
    return [
      hsl,
      { h: colorConverter.normalizeHue(hsl.h + 120), s: hsl.s, l: hsl.l },
      { h: colorConverter.normalizeHue(hsl.h + 240), s: hsl.s, l: hsl.l },
    ];
  }

  //   getTetradicColors(hsl: HSLColor): HSLColor[] {
  //     return [
  //       hsl,
  //       { h: colorConverter.normalizeHue(hsl.h + 90), s: hsl.s, l: hsl.l },
  //       { h: colorConverter.normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l },
  //       { h: colorConverter.normalizeHue(hsl.h + 270), s: hsl.s, l: hsl.l },
  //     ];
  //   }

  getSplitComplementaryColors(hsl: HSLColor): HSLColor[] {
    return [
      hsl,
      { h: colorConverter.normalizeHue(hsl.h + 150), s: hsl.s, l: hsl.l },
      { h: colorConverter.normalizeHue(hsl.h + 210), s: hsl.s, l: hsl.l },
    ];
  }

  adjustLightness(hsl: HSLColor, adjustment: number): HSLColor {
    return {
      h: hsl.h,
      s: hsl.s,
      l: Math.max(0, Math.min(100, hsl.l + adjustment)),
    };
  }

  adjustSaturation(hsl: HSLColor, adjustment: number): HSLColor {
    return {
      h: hsl.h,
      s: Math.max(0, Math.min(100, hsl.s + adjustment)),
      l: hsl.l,
    };
  }

  isLightColor(hsl: HSLColor): boolean {
    const rgb = colorConverter.hslToRgb(hsl.h, hsl.s, hsl.l);
    // Using relative luminance formula (ITU-R BT.709)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  }

  getHighContrastColor(backgroundHsl: HSLColor): HSLColor {
    // Check if background should be treated as neutral
    // Only neutral if very low saturation, OR if both low saturation AND extreme lightness
    const isNeutral =
      backgroundHsl.s < 10 ||
      (backgroundHsl.s < 25 && (backgroundHsl.l < 10 || backgroundHsl.l > 95));

    if (this.isLightColor(backgroundHsl)) {
      // If background is light, return dark foreground for contrast
      const saturation = isNeutral ? 0 : Math.min(100, backgroundHsl.s + 30);
      const hue = isNeutral ? 0 : backgroundHsl.h;
      return { h: hue, s: saturation, l: 15 };
    } else {
      // If background is dark, return light foreground for contrast
      const saturation = isNeutral ? 0 : Math.max(10, backgroundHsl.s - 30);
      const hue = isNeutral ? 0 : backgroundHsl.h;
      return { h: hue, s: saturation, l: 90 };
    }
  }

  getBackgroundColor(baseHsl: HSLColor): HSLColor {
    // Check if color should be treated as neutral
    // Only neutral if very low saturation, OR if both low saturation AND extreme lightness
    const isNeutral = baseHsl.s < 10 || (baseHsl.s < 25 && (baseHsl.l < 10 || baseHsl.l > 95));

    if (this.isLightColor(baseHsl)) {
      // If base is light, make background dark for contrast
      const saturation = isNeutral ? 0 : Math.max(10, baseHsl.s - 40);
      const hue = isNeutral ? 0 : baseHsl.h;
      const lightness = isNeutral ? 20 : 25;
      return { h: hue, s: saturation, l: lightness };
    } else {
      // If base is dark, make background light for contrast
      const saturation = isNeutral ? 0 : Math.max(10, baseHsl.s - 50);
      const hue = isNeutral ? 0 : baseHsl.h;
      return { h: hue, s: saturation, l: 95 };
    }
  }

  // Generate light theme background (light backgrounds)
  getLightBackgroundColor(baseHsl: HSLColor): HSLColor {
    const isNeutral = baseHsl.s < 10 || (baseHsl.s < 25 && (baseHsl.l < 10 || baseHsl.l > 95));
    const saturation = isNeutral ? 0 : Math.max(5, baseHsl.s - 50);
    const hue = isNeutral ? 0 : baseHsl.h;
    return { h: hue, s: saturation, l: 95 };
  }

  // Generate dark theme background (dark backgrounds)
  getDarkBackgroundColor(baseHsl: HSLColor): HSLColor {
    const isNeutral = baseHsl.s < 10 || (baseHsl.s < 25 && (baseHsl.l < 10 || baseHsl.l > 95));
    const saturation = isNeutral ? 0 : Math.max(10, baseHsl.s - 40);
    const hue = isNeutral ? 0 : baseHsl.h;
    const lightness = isNeutral ? 15 : 20;
    return { h: hue, s: saturation, l: lightness };
  }

  // Generate dark theme variant by inverting lightness relationships
  convertToDarkTheme(hsl: HSLColor): HSLColor {
    // Invert lightness while preserving hue and adjusting saturation
    const newLightness = 100 - hsl.l;
    // Slightly reduce saturation for dark themes to avoid overwhelming colors
    const newSaturation = Math.max(30, hsl.s - 10);

    return {
      h: hsl.h,
      s: newSaturation,
      l: Math.max(20, Math.min(80, newLightness)),
    };
  }

  // Generate light theme variant
  convertToLightTheme(hsl: HSLColor): HSLColor {
    // Keep original lightness but ensure it's in light range
    const newLightness = hsl.l < 50 ? 100 - hsl.l : hsl.l;

    return {
      h: hsl.h,
      s: hsl.s,
      l: Math.max(40, Math.min(85, newLightness)),
    };
  }
}

const colorFunc = new ColorFunc();

export { colorFunc };
