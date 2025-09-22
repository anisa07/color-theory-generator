export interface HSLColor {
  h: number; // hue (0-360)
  s: number; // saturation (0-100)
  l: number; // lightness (0-100)
}

export interface RGBColor {
  r: number; // red (0-255)
  g: number; // green (0-255)
  b: number; // blue (0-255)
}

export interface ColorPalette {
  primary: string; // 60% - dominant color
  secondary: string; // 30% - supporting color
  accent: string; // 10% - accent/highlight color
  background: string; // background color (light/dark variant)
  foreground: string; // text/foreground color (high contrast)
  primaryForeground: string; // foreground color that contrasts with primary
  secondaryForeground: string; // foreground color that contrasts with secondary
  accentForeground: string; // foreground color that contrasts with accent
  theme?: 'light' | 'dark'; // theme variant
}

export interface DualThemePalette {
  light: ColorPalette;
  dark: ColorPalette;
  scheme: string;
  baseColor: string;
}
