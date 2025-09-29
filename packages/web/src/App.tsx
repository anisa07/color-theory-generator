import { useState } from 'react';
import type { ColorPalette } from '@color-theory/shared';
import { ColorPicker } from './components/ColorPicker';
import { PaletteGrid } from './components/PaletteGrid';
import { WebsitePreview } from './components/WebsitePreview';
import { usePaletteGeneration } from './hooks/usePaletteGeneration';

export function App() {
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(null);
  const {
    palette,
    dualThemePalette,
    palettes,
    dualThemePalettes,
    loading,
    generateSinglePalette,
    generateDualTheme,
    generateMultiplePalettes,
    generateRandomColors,
  } = usePaletteGeneration();

  const handleClosePreview = () => {
    setPreviewPalette(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Color Theory Generator</h1>
        <p>Generate beautiful, accessible color palettes using color theory principles</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          <div className="app-sidebar">
            <ColorPicker
              onGenerateSingle={generateSinglePalette}
              onGenerateDual={generateDualTheme}
              onGenerateMultiple={generateMultiplePalettes}
              onGenerateRandom={generateRandomColors}
              loading={loading}
            />
          </div>

          <div className="app-results">
            <PaletteGrid
              palette={palette}
              dualThemePalette={dualThemePalette}
              palettes={palettes}
              dualThemePalettes={dualThemePalettes}
              onPreview={setPreviewPalette}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {previewPalette && <WebsitePreview palette={previewPalette} onClose={handleClosePreview} />}
    </div>
  );
}
