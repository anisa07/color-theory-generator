import { colorConverter } from './services/ColorConverter';
import { colorFunc } from './services/ColorFunc';
import { ColorPalette, HSLColor } from './types/color-types';

// Generate a random base color
export function generateRandomBaseColor(): HSLColor {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 40) + 60, // 60-100% saturation
    l: Math.floor(Math.random() * 30) + 40, // 40-70% lightness
  };
}

// Generate 60-30-10 color palette
export function generate60_30_10Palette(
  baseColor: HSLColor,
  scheme: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary',
): ColorPalette {
  let colors: HSLColor[];

  switch (scheme) {
    case 'complementary':
      colors = [baseColor, colorFunc.getComplementaryColor(baseColor)];
      break;
    case 'analogous':
      colors = colorFunc.getAnalogousColors(baseColor);
      break;
    case 'triadic':
      colors = colorFunc.getTriadicColors(baseColor);
      break;
    // case 'tetradic':
    //   colors = colorFunc.getTetradicColors(baseColor);
    //   break;
    case 'split-complementary':
      colors = colorFunc.getSplitComplementaryColors(baseColor);
      break;
    default:
      colors = [baseColor, colorFunc.getComplementaryColor(baseColor)];
  }

  // Primary color (60%) - main color
  const primary = colorConverter.hslToHex(colors[0].h, colors[0].s, colors[0].l);

  // Secondary color (30%) - supporting color
  const secondaryHsl = colors.length > 1 ? colors[1] : colorFunc.adjustLightness(colors[0], -20);
  const secondary = colorConverter.hslToHex(
    secondaryHsl.h,
    Math.max(30, secondaryHsl.s - 20),
    secondaryHsl.l,
  );

  // Accent color (10%) - highlight color
  const accentHsl =
    colors.length > 2
      ? colors[2]
      : colorFunc.adjustSaturation(colorFunc.getComplementaryColor(colors[0]), 20);
  const accent = colorConverter.hslToHex(accentHsl.h, Math.min(100, accentHsl.s + 20), accentHsl.l);

  // Background color - proper light background for good contrast
  const backgroundHsl = colorFunc.getBackgroundColor(colors[0]);
  const background = colorConverter.hslToHex(backgroundHsl.h, backgroundHsl.s, backgroundHsl.l);

  // Foreground color - high contrast color for text readability
  const foregroundHsl = colorFunc.getHighContrastColor(backgroundHsl);
  const foreground = colorConverter.hslToHex(foregroundHsl.h, foregroundHsl.s, foregroundHsl.l);

  // Generate specific foreground colors for each colored background
  const primaryForegroundHsl = colorFunc.getHighContrastColor(colors[0]);
  const primaryForeground = colorConverter.hslToHex(
    primaryForegroundHsl.h,
    primaryForegroundHsl.s,
    primaryForegroundHsl.l,
  );

  const secondaryForegroundHsl = colorFunc.getHighContrastColor(secondaryHsl);
  const secondaryForeground = colorConverter.hslToHex(
    secondaryForegroundHsl.h,
    secondaryForegroundHsl.s,
    secondaryForegroundHsl.l,
  );

  const accentForegroundHsl = colorFunc.getHighContrastColor(accentHsl);
  const accentForeground = colorConverter.hslToHex(
    accentForegroundHsl.h,
    accentForegroundHsl.s,
    accentForegroundHsl.l,
  );

  return {
    primary,
    secondary,
    accent,
    background,
    foreground,
    primaryForeground,
    secondaryForeground,
    accentForeground,
  };
}

// Generate multiple palette variations
export function generatePaletteVariations(baseColor: HSLColor): { [key: string]: ColorPalette } {
  return {
    complementary: generate60_30_10Palette(baseColor, 'complementary'),
    analogous: generate60_30_10Palette(baseColor, 'analogous'),
    triadic: generate60_30_10Palette(baseColor, 'triadic'),
    // tetradic: generate60_30_10Palette(baseColor, 'tetradic'),
    splitComplementary: generate60_30_10Palette(baseColor, 'split-complementary'),
  };
}

// Helper function for scheme descriptions
export function getSchemeDescription(scheme: string): string {
  const descriptions = {
    complementary: 'Colors opposite on the color wheel - creates vibrant, high-contrast palettes',
    analogous: 'Colors adjacent on the color wheel - creates harmonious, peaceful palettes',
    triadic:
      'Three colors equally spaced on the color wheel - creates vibrant yet balanced palettes',
    tetradic: 'Four colors forming a square on the color wheel - creates rich, diverse palettes',
    'split-complementary':
      'Base color plus two colors adjacent to its complement - creates strong contrast with less tension',
  };
  return descriptions[scheme as keyof typeof descriptions] || 'Unknown color scheme';
}
