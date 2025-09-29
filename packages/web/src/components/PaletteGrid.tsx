// PaletteGrid component
import type { ColorPalette, DualThemePalette } from '@color-theory/shared';

interface PaletteGridProps {
  palette?: ColorPalette;
  dualThemePalette?: DualThemePalette;
  palettes?: Record<string, ColorPalette>;
  dualThemePalettes?: Record<string, DualThemePalette>;
  onPreview: (palette: ColorPalette) => void;
  loading: boolean;
}

export function PaletteGrid({
  palette,
  dualThemePalette,
  palettes,
  dualThemePalettes,
  onPreview,
  loading,
}: PaletteGridProps) {
  if (loading) {
    return (
      <div className="palette-grid__loading">
        <div className="loading-spinner"></div>
        <p>Generating beautiful colors...</p>
      </div>
    );
  }

  // Single palette display
  if (palette) {
    return (
      <div className="palette-grid">
        <div className="palette-card">
          <div className="palette-card__title">Generated Color Palette</div>
          <PaletteColors palette={palette} />
          <button className="palette-card__preview-btn" onClick={() => onPreview(palette)}>
            Preview Website
          </button>
        </div>
      </div>
    );
  }

  // Dual theme palette display
  if (dualThemePalette) {
    return (
      <div className="palette-grid">
        <div className="dual-theme-container">
          {/* <h2 className="dual-theme__title">Light & Dark Themes</h2> */}
          <div className="dual-theme__palettes">
            <div className="palette-card palette-card--light">
              <div className="palette-card__title">☀️ Light Theme</div>
              <PaletteColors palette={dualThemePalette.light} />
              <button
                className="palette-card__preview-btn"
                onClick={() => onPreview(dualThemePalette.light)}
              >
                Preview Light
              </button>
            </div>
            <div className="palette-card palette-card--dark">
              <div className="palette-card__title">🌙 Dark Theme</div>
              <PaletteColors palette={dualThemePalette.dark} />
              <button
                className="palette-card__preview-btn"
                onClick={() => onPreview(dualThemePalette.dark)}
              >
                Preview Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple palettes display
  if (palettes) {
    return (
      <div className="palette-grid">
        {Object.entries(palettes).map(([schemeName, p]) => (
          <div key={schemeName} className="palette-card">
            <div className="palette-card__title">
              {schemeName.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
            <PaletteColors palette={p} />
            <button className="palette-card__preview-btn" onClick={() => onPreview(p)}>
              Preview Website
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Multiple dual theme palettes display
  if (dualThemePalettes) {
    return (
      <div className="palette-grid">
        {Object.entries(dualThemePalettes).map(([schemeName, dp]) => (
          <div key={schemeName} className="dual-theme-container">
            <h3 className="dual-theme__title">
              {schemeName.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </h3>
            <div className="dual-theme__palettes">
              <div className="palette-card palette-card--light">
                <div className="palette-card__title">☀️ Light</div>
                <PaletteColors palette={dp.light} />
                <button className="palette-card__preview-btn" onClick={() => onPreview(dp.light)}>
                  Preview
                </button>
              </div>
              <div className="palette-card palette-card--dark">
                <div className="palette-card__title">🌙 Dark</div>
                <PaletteColors palette={dp.dark} />
                <button className="palette-card__preview-btn" onClick={() => onPreview(dp.dark)}>
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="palette-grid__empty">
      <p>No palettes to display. Generate some colors to get started!</p>
    </div>
  );
}

interface PaletteColorsProps {
  palette: ColorPalette;
}

function PaletteColors({ palette }: PaletteColorsProps) {
  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div className="palette-colors">
      {Object.entries(palette)
        .filter(
          ([, colorValue]) =>
            typeof colorValue === 'string' &&
            colorValue.startsWith('#') &&
            colorValue !== 'dark' &&
            colorValue !== 'light',
        )
        .slice(0, 5)
        .map(([colorName, colorValue]) => (
          <div key={colorName} className="color-row">
            <div className="color-row__name">
              {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
            </div>
            <div className="color-row__info">
              <div
                className="color-swatch"
                style={{ backgroundColor: colorValue }}
                onClick={() => copyToClipboard(colorValue)}
                title={`Click to copy ${colorValue}`}
              />
              <div className="color-row__value">{colorValue}</div>
            </div>
          </div>
        ))}
    </div>
  );
}
