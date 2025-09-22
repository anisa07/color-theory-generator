import { colorFunc } from '../services/ColorFunc';
import { colorConverter } from '../services/ColorConverter';

// Test function to validate contrast ratios
export function validateContrastRatio(
  background: string,
  foreground: string,
): {
  contrastRatio: number;
  isValid: boolean;
  level: 'AAA' | 'AA' | 'Fail';
} {
  const bgHsl = colorConverter.hexToHsl(background);
  const fgHsl = colorConverter.hexToHsl(foreground);

  const contrastRatio = colorFunc.getContrastRatio(bgHsl, fgHsl);

  let level: 'AAA' | 'AA' | 'Fail' = 'Fail';
  if (contrastRatio >= 7.0) {
    level = 'AAA';
  } else if (contrastRatio >= 4.5) {
    level = 'AA';
  }

  return {
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    isValid: contrastRatio >= 4.5,
    level,
  };
}

// Test all foreground colors in a palette
export function validatePaletteContrasts(palette: any): {
  primary: any;
  secondary: any;
  accent: any;
  background: any;
} {
  return {
    primary: validateContrastRatio(palette.primary, palette.primaryForeground),
    secondary: validateContrastRatio(palette.secondary, palette.secondaryForeground),
    accent: validateContrastRatio(palette.accent, palette.accentForeground),
    background: validateContrastRatio(palette.background, palette.foreground),
  };
}
