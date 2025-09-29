import { colorConverter } from './ColorConverter';
import { colorFunc } from './ColorFunc';
import { ColorPalette, HSLColor, DualThemePalette } from '../types/color-types';

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

  // Generate specific foreground colors for each colored background with higher contrast requirement (7:1 for AA+)
  const primaryForegroundHsl = colorFunc.getHighContrastColor(colors[0], 7.0);
  const primaryForeground = colorConverter.hslToHex(
    primaryForegroundHsl.h,
    primaryForegroundHsl.s,
    primaryForegroundHsl.l,
  );

  const secondaryForegroundHsl = colorFunc.getHighContrastColor(secondaryHsl, 7.0);
  const secondaryForeground = colorConverter.hslToHex(
    secondaryForegroundHsl.h,
    secondaryForegroundHsl.s,
    secondaryForegroundHsl.l,
  );

  const accentForegroundHsl = colorFunc.getHighContrastColor(accentHsl, 7.0);
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

// Generate both light and dark theme palettes
export function generateDualThemePalette(
  baseColor: HSLColor,
  scheme: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary',
): DualThemePalette {
  // Generate base colors using the same logic
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
    case 'split-complementary':
      colors = colorFunc.getSplitComplementaryColors(baseColor);
      break;
    default:
      colors = [baseColor, colorFunc.getComplementaryColor(baseColor)];
  }

  // Generate Light Theme
  const lightPrimary = colorConverter.hslToHex(colors[0].h, colors[0].s, colors[0].l);
  const lightSecondaryHsl =
    colors.length > 1 ? colors[1] : colorFunc.adjustLightness(colors[0], -20);
  const lightSecondary = colorConverter.hslToHex(
    lightSecondaryHsl.h,
    Math.max(30, lightSecondaryHsl.s - 20),
    lightSecondaryHsl.l,
  );
  const lightAccentHsl =
    colors.length > 2
      ? colors[2]
      : colorFunc.adjustSaturation(colorFunc.getComplementaryColor(colors[0]), 20);
  const lightAccent = colorConverter.hslToHex(
    lightAccentHsl.h,
    Math.min(100, lightAccentHsl.s + 20),
    lightAccentHsl.l,
  );

  const lightBackgroundHsl = colorFunc.getLightBackgroundColor(colors[0]);
  const lightBackground = colorConverter.hslToHex(
    lightBackgroundHsl.h,
    lightBackgroundHsl.s,
    lightBackgroundHsl.l,
  );
  const lightForegroundHsl = colorFunc.getHighContrastColor(lightBackgroundHsl);
  const lightForeground = colorConverter.hslToHex(
    lightForegroundHsl.h,
    lightForegroundHsl.s,
    lightForegroundHsl.l,
  );

  // Generate Dark Theme
  const darkPrimaryHsl = colorFunc.convertToDarkTheme(colors[0]);
  const darkPrimary = colorConverter.hslToHex(darkPrimaryHsl.h, darkPrimaryHsl.s, darkPrimaryHsl.l);

  const darkSecondaryHsl = colorFunc.convertToDarkTheme(lightSecondaryHsl);
  const darkSecondary = colorConverter.hslToHex(
    darkSecondaryHsl.h,
    darkSecondaryHsl.s,
    darkSecondaryHsl.l,
  );

  const darkAccentHsl = colorFunc.convertToDarkTheme(lightAccentHsl);
  const darkAccent = colorConverter.hslToHex(darkAccentHsl.h, darkAccentHsl.s, darkAccentHsl.l);

  const darkBackgroundHsl = colorFunc.getDarkBackgroundColor(colors[0]);
  const darkBackground = colorConverter.hslToHex(
    darkBackgroundHsl.h,
    darkBackgroundHsl.s,
    darkBackgroundHsl.l,
  );
  const darkForegroundHsl = colorFunc.getHighContrastColor(darkBackgroundHsl);
  const darkForeground = colorConverter.hslToHex(
    darkForegroundHsl.h,
    darkForegroundHsl.s,
    darkForegroundHsl.l,
  );

  // Generate foreground colors for colored backgrounds with higher contrast requirement (7:1 for AA+)
  const lightPrimaryForegroundHsl = colorFunc.getHighContrastColor(colors[0], 7.0);
  const lightPrimaryForeground = colorConverter.hslToHex(
    lightPrimaryForegroundHsl.h,
    lightPrimaryForegroundHsl.s,
    lightPrimaryForegroundHsl.l,
  );

  const lightSecondaryForegroundHsl = colorFunc.getHighContrastColor(lightSecondaryHsl, 7.0);
  const lightSecondaryForeground = colorConverter.hslToHex(
    lightSecondaryForegroundHsl.h,
    lightSecondaryForegroundHsl.s,
    lightSecondaryForegroundHsl.l,
  );

  const lightAccentForegroundHsl = colorFunc.getHighContrastColor(lightAccentHsl, 7.0);
  const lightAccentForeground = colorConverter.hslToHex(
    lightAccentForegroundHsl.h,
    lightAccentForegroundHsl.s,
    lightAccentForegroundHsl.l,
  );

  const darkPrimaryForegroundHsl = colorFunc.getHighContrastColor(darkPrimaryHsl, 7.0);
  const darkPrimaryForeground = colorConverter.hslToHex(
    darkPrimaryForegroundHsl.h,
    darkPrimaryForegroundHsl.s,
    darkPrimaryForegroundHsl.l,
  );

  const darkSecondaryForegroundHsl = colorFunc.getHighContrastColor(darkSecondaryHsl, 7.0);
  const darkSecondaryForeground = colorConverter.hslToHex(
    darkSecondaryForegroundHsl.h,
    darkSecondaryForegroundHsl.s,
    darkSecondaryForegroundHsl.l,
  );

  const darkAccentForegroundHsl = colorFunc.getHighContrastColor(darkAccentHsl, 7.0);
  const darkAccentForeground = colorConverter.hslToHex(
    darkAccentForegroundHsl.h,
    darkAccentForegroundHsl.s,
    darkAccentForegroundHsl.l,
  );

  const lightTheme: ColorPalette = {
    primary: lightPrimary,
    secondary: lightSecondary,
    accent: lightAccent,
    background: lightBackground,
    foreground: lightForeground,
    primaryForeground: lightPrimaryForeground,
    secondaryForeground: lightSecondaryForeground,
    accentForeground: lightAccentForeground,
    theme: 'light',
  };

  const darkTheme: ColorPalette = {
    primary: darkPrimary,
    secondary: darkSecondary,
    accent: darkAccent,
    background: darkBackground,
    foreground: darkForeground,
    primaryForeground: darkPrimaryForeground,
    secondaryForeground: darkSecondaryForeground,
    accentForeground: darkAccentForeground,
    theme: 'dark',
  };

  return {
    light: lightTheme,
    dark: darkTheme,
    scheme,
    baseColor: colorConverter.hslToHex(baseColor.h, baseColor.s, baseColor.l),
  };
}

// Generate multiple palette variations
export function generatePaletteVariations(baseColor: HSLColor): { [key: string]: ColorPalette } {
  return {
    complementary: generate60_30_10Palette(baseColor, 'complementary'),
    analogous: generate60_30_10Palette(baseColor, 'analogous'),
    triadic: generate60_30_10Palette(baseColor, 'triadic'),
    splitComplementary: generate60_30_10Palette(baseColor, 'split-complementary'),
  };
}

// Generate dual theme variations for all schemes
export function generateDualThemeVariations(baseColor: HSLColor): {
  [key: string]: DualThemePalette;
} {
  return {
    complementary: generateDualThemePalette(baseColor, 'complementary'),
    analogous: generateDualThemePalette(baseColor, 'analogous'),
    triadic: generateDualThemePalette(baseColor, 'triadic'),
    splitComplementary: generateDualThemePalette(baseColor, 'split-complementary'),
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
