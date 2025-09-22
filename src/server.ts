// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {
  generateRandomBaseColor,
  generate60_30_10Palette,
  generatePaletteVariations,
  generateDualThemePalette,
  generateDualThemeVariations,
  getSchemeDescription,
} from './services/color-theory';
import { HEX_6_COLOR } from './params/config';
import { HSLColor } from './types/color-types';
import { colorConverter } from './services/ColorConverter';
import { validatePaletteContrasts } from './utils/contrastValidator';

dotenv.config();

const app = express();
app.use(express.json());
// Serve static files from the sample directory
app.use(express.static(path.join(__dirname, 'sample')));

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'sample/index.html'));
});

app.get('/colors', (req, res) => {
  try {
    const {
      scheme = 'complementary',
      baseColor,
      variations,
      dualTheme,
    } = req.query as {
      scheme?: 'complementary' | 'analogous' | 'triadic' | 'split-complementary';
      baseColor?: string;
      variations?: string;
      dualTheme?: string;
    };

    // Generate or parse base color
    const baseHsl: HSLColor =
      baseColor && HEX_6_COLOR.test(baseColor)
        ? colorConverter.hexToHsl(baseColor)
        : generateRandomBaseColor();

    // Generate palette(s)
    if (dualTheme === 'true' && variations === 'true') {
      // Generate dual theme variations for all schemes
      const allDualVariations = generateDualThemeVariations(baseHsl);
      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        dualThemePalettes: allDualVariations,
        colorTheory: {
          rule: '60-30-10',
          description:
            'Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights',
          themes: ['light', 'dark'],
          schemes: Object.keys(allDualVariations),
        },
      });
    } else if (dualTheme === 'true') {
      // Generate dual theme for single scheme
      const dualPalette = generateDualThemePalette(baseHsl, scheme);
      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        scheme,
        dualThemePalette: dualPalette,
        colorTheory: {
          rule: '60-30-10',
          description:
            'Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights',
          themes: ['light', 'dark'],
          schemeDescription: getSchemeDescription(scheme),
        },
      });
    } else if (variations === 'true') {
      const allVariations = generatePaletteVariations(baseHsl);
      res.json({
        baseColor: `#${baseHsl.h.toString(16).padStart(2, '0')}${baseHsl.s.toString(16).padStart(2, '0')}${baseHsl.l.toString(16).padStart(2, '0')}`,
        palettes: allVariations,
        colorTheory: {
          rule: '60-30-10',
          description:
            'Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights',
          schemes: Object.keys(allVariations),
        },
      });
    } else {
      const palette = generate60_30_10Palette(baseHsl, scheme);
      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        scheme,
        palette,
        colorTheory: {
          rule: '60-30-10',
          description:
            'Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights',
          schemeDescription: getSchemeDescription(scheme),
        },
      });
    }
  } catch (error) {
    console.error('Color generation error:', error);
    res.status(400).json({
      error: 'Invalid color generation request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Generate random color endpoint
app.get('/colors/random', (req, res) => {
  try {
    const { dualTheme } = req.query as { dualTheme?: string };
    const baseHsl = generateRandomBaseColor();

    if (dualTheme === 'true') {
      const allDualSchemes = generateDualThemeVariations(baseHsl);
      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        dualThemePalettes: allDualSchemes,
        colorTheory: {
          rule: '60-30-10 Color Rule',
          description:
            'A design principle where 60% is the dominant color, 30% is secondary, and 10% is accent',
          themes: ['light', 'dark'],
        },
      });
    } else {
      const allSchemes = generatePaletteVariations(baseHsl);
      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        palettes: allSchemes,
        colorTheory: {
          rule: '60-30-10 Color Rule',
          description:
            'A design principle where 60% is the dominant color, 30% is secondary, and 10% is accent',
        },
      });
    }
  } catch (error) {
    console.error('Random color generation error:', error);
    res.status(500).json({ error: 'Failed to generate random colors' });
  }
});

// Get color harmony information
app.get('/colors/harmony/:scheme', (req, res) => {
  try {
    const { scheme } = req.params;
    const validSchemes = [
      'complementary',
      'analogous',
      'triadic',
      'tetradic',
      'split-complementary',
    ];

    if (!validSchemes.includes(scheme)) {
      return res.status(400).json({
        error: 'Invalid scheme',
        validSchemes,
        message: 'Please use one of the supported color harmony schemes',
      });
    }

    const baseHsl = generateRandomBaseColor();
    const palette = generate60_30_10Palette(baseHsl, scheme as any);

    res.json({
      scheme,
      description: getSchemeDescription(scheme),
      baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
      palette,
      usage: {
        primary: '60% - Use for backgrounds, large areas',
        secondary: '30% - Use for secondary elements, borders',
        accent: '10% - Use for buttons, highlights, call-to-actions',
        background: 'Base background color',
        foreground: 'Text and high-contrast elements',
      },
    });
  } catch (error) {
    console.error('Harmony generation error:', error);
    res.status(500).json({ error: 'Failed to generate color harmony' });
  }
});

// Test contrast validation endpoint
app.get('/colors/test-contrast', (req, res) => {
  try {
    const {
      scheme = 'complementary',
      baseColor,
      dualTheme,
    } = req.query as {
      scheme?: 'complementary' | 'analogous' | 'triadic' | 'split-complementary';
      baseColor?: string;
      dualTheme?: string;
    };

    const baseHsl: HSLColor =
      baseColor && HEX_6_COLOR.test(baseColor)
        ? colorConverter.hexToHsl(baseColor)
        : generateRandomBaseColor();

    if (dualTheme === 'true') {
      const dualPalette = generateDualThemePalette(baseHsl, scheme);
      const lightContrasts = validatePaletteContrasts(dualPalette.light);
      const darkContrasts = validatePaletteContrasts(dualPalette.dark);

      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        scheme,
        palettes: dualPalette,
        contrastValidation: {
          light: lightContrasts,
          dark: darkContrasts,
        },
      });
    } else {
      const palette = generate60_30_10Palette(baseHsl, scheme);
      const contrasts = validatePaletteContrasts(palette);

      res.json({
        baseColor: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`,
        scheme,
        palette,
        contrastValidation: contrasts,
      });
    }
  } catch (error) {
    console.error('Contrast test error:', error);
    res.status(500).json({ error: 'Failed to test contrast' });
  }
});

// central error handler example
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
