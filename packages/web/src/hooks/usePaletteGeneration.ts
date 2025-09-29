import { useState, useCallback } from 'react';
import type { ColorScheme, ColorPalette, DualThemePalette } from '@color-theory/shared';

interface PaletteState {
  palette?: ColorPalette;
  dualThemePalette?: DualThemePalette;
  palettes?: Record<string, ColorPalette>;
  dualThemePalettes?: Record<string, DualThemePalette>;
}

export function usePaletteGeneration() {
  const [state, setState] = useState<PaletteState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateColors = useCallback(
    async (baseColor: string, scheme: ColorScheme, dualTheme: boolean) => {
      setLoading(true);
      setError(null);

      try {
        let url = `/colors?scheme=${scheme}`;

        if (baseColor && baseColor !== '#000000') {
          url += `&baseColor=${encodeURIComponent(baseColor)}`;
        }

        if (dualTheme) {
          url += '&dualTheme=true';
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to generate colors: ${response.statusText}`);
        }

        const data = await response.json();

        if (dualTheme && data.dualThemePalette) {
          setState({ dualThemePalette: data.dualThemePalette });
        } else {
          setState({ palette: data.palette });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const generateRandomColors = useCallback(async (dualTheme: boolean) => {
    setLoading(true);
    setError(null);

    try {
      let url = '/colors/random';
      if (dualTheme) {
        url += '?dualTheme=true';
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to generate random colors: ${response.statusText}`);
      }

      const data = await response.json();

      if (dualTheme && data.dualThemePalettes) {
        setState({ dualThemePalettes: data.dualThemePalettes });
      } else {
        setState({ palettes: data.palettes });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAllVariations = useCallback(async (baseColor: string, dualTheme: boolean) => {
    setLoading(true);
    setError(null);

    try {
      let url = '/colors?variations=true';

      if (baseColor && baseColor !== '#000000') {
        url += `&baseColor=${encodeURIComponent(baseColor)}`;
      }

      if (dualTheme) {
        url += '&dualTheme=true';
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to generate variations: ${response.statusText}`);
      }

      const data = await response.json();

      if (dualTheme && data.dualThemePalettes) {
        setState({ dualThemePalettes: data.dualThemePalettes });
      } else {
        setState({ palettes: data.palettes });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Wrapper methods that match the expected interface
  const generateSinglePalette = useCallback(
    (baseColor: string, scheme: ColorScheme, dualTheme: boolean) => {
      return generateColors(baseColor, scheme, dualTheme);
    },
    [generateColors],
  );

  const generateDualTheme = useCallback(
    (baseColor: string, scheme: ColorScheme) => {
      return generateColors(baseColor, scheme, true);
    },
    [generateColors],
  );

  const generateMultiplePalettes = useCallback(
    (baseColor: string, dualTheme: boolean) => {
      return generateAllVariations(baseColor, dualTheme);
    },
    [generateAllVariations],
  );

  return {
    ...state,
    loading,
    error,
    generateColors,
    generateRandomColors,
    generateAllVariations,
    generateSinglePalette,
    generateDualTheme,
    generateMultiplePalettes,
  };
}
