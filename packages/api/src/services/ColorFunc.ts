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

  // Calculate relative luminance according to WCAG standards
  getRelativeLuminance(hsl: HSLColor): number {
    const rgb = colorConverter.hslToRgb(hsl.h, hsl.s, hsl.l);

    // Convert to sRGB
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    // Apply gamma correction
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    // Calculate relative luminance using WCAG formula
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  // Calculate contrast ratio between two colors
  getContrastRatio(color1: HSLColor, color2: HSLColor): number {
    const luminance1 = this.getRelativeLuminance(color1);
    const luminance2 = this.getRelativeLuminance(color2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  isLightColor(hsl: HSLColor): boolean {
    return this.getRelativeLuminance(hsl) > 0.5;
  }

  // Get high contrast foreground color with proper WCAG AA compliance (4.5:1 ratio)
  getHighContrastColor(backgroundHsl: HSLColor, minContrastRatio: number = 4.5): HSLColor {
    // Check if background should be treated as neutral
    const isNeutral =
      backgroundHsl.s < 10 ||
      (backgroundHsl.s < 25 && (backgroundHsl.l < 10 || backgroundHsl.l > 95));

    if (isNeutral) {
      // For neutral colors, test softer alternatives and use the one with better contrast
      const darkGrayContrast = this.getContrastRatio(backgroundHsl, { h: 0, s: 0, l: 4 }); // Very dark gray instead of pure black
      const offWhiteContrast = this.getContrastRatio(backgroundHsl, { h: 0, s: 0, l: 98 }); // Off-white instead of pure white

      return darkGrayContrast > offWhiteContrast
        ? { h: 0, s: 0, l: 4 } // Very dark gray (#0a0a0a)
        : { h: 0, s: 0, l: 98 }; // Off-white (#fafafa)
    }

    // For colored backgrounds, prioritize softer, more harmonious foreground colors
    return this.getSofterForegroundColor(backgroundHsl, minContrastRatio);
  }

  // Specialized function for softer foreground colors on colored backgrounds
  getSofterForegroundColor(backgroundHsl: HSLColor, minContrastRatio: number = 4.5): HSLColor {
    let bestForeground: HSLColor;
    let bestContrast = 0;

    // Prioritize softer, more pleasant alternatives - NO pure black/white for colored backgrounds
    const candidates = [
      // Soft grays with subtle warmth
      { h: 0, s: 0, l: 8 }, // Softer dark gray (#141414) - warmer than pure black
      { h: 0, s: 0, l: 95 }, // Soft off-white (#f2f2f2) - warmer than pure white

      // Slightly tinted versions for better harmony with the background
      { h: backgroundHsl.h, s: Math.min(8, backgroundHsl.s), l: 10 }, // Subtly tinted dark
      { h: backgroundHsl.h, s: Math.min(8, backgroundHsl.s), l: 93 }, // Subtly tinted light

      // Complementary tinted for better harmony
      {
        h: colorConverter.normalizeHue(backgroundHsl.h + 180),
        s: Math.min(6, backgroundHsl.s),
        l: 12,
      },
      {
        h: colorConverter.normalizeHue(backgroundHsl.h + 180),
        s: Math.min(6, backgroundHsl.s),
        l: 91,
      },

      // Medium contrast options for very saturated backgrounds
      { h: 0, s: 0, l: 15 }, // Medium dark gray
      { h: 0, s: 0, l: 88 }, // Medium light gray

      // Slightly more aggressive (but still softer than pure) as backup
      { h: 0, s: 0, l: 4 }, // Very dark gray (#0a0a0a)
      { h: 0, s: 0, l: 98 }, // Off-white (#fafafa)

      // Last resort - but still not pure black/white
      { h: 0, s: 0, l: 2 }, // Almost black (#050505)
      { h: 0, s: 0, l: 99 }, // Almost white (#fcfcfc)
    ];

    bestForeground = candidates[0];

    for (const candidate of candidates) {
      const contrast = this.getContrastRatio(backgroundHsl, candidate);
      if (contrast >= minContrastRatio) {
        // If this meets the requirement, use it (prioritizing earlier candidates)
        bestContrast = contrast;
        bestForeground = candidate;
        break; // Use the first candidate that meets requirements
      } else if (contrast > bestContrast) {
        // Keep track of best option if none meet requirements yet
        bestContrast = contrast;
        bestForeground = candidate;
      }
    }

    // If STILL not sufficient contrast, only then consider pure black/white
    if (bestContrast < minContrastRatio) {
      const pureBlackContrast = this.getContrastRatio(backgroundHsl, { h: 0, s: 0, l: 0 });
      const pureWhiteContrast = this.getContrastRatio(backgroundHsl, { h: 0, s: 0, l: 100 });

      // Only use pure colors if absolutely necessary
      if (pureBlackContrast >= minContrastRatio || pureWhiteContrast >= minContrastRatio) {
        return pureBlackContrast > pureWhiteContrast
          ? { h: 0, s: 0, l: 0 } // Pure black (emergency fallback)
          : { h: 0, s: 0, l: 100 }; // Pure white (emergency fallback)
      }
    }

    return bestForeground;
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
