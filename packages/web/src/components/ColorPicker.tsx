// ColorPicker component
import { useState } from 'react';
import type { ColorScheme } from '@color-theory/shared';

interface ColorPickerProps {
  onGenerateSingle: (baseColor: string, scheme: ColorScheme, dualTheme: boolean) => Promise<void>;
  onGenerateDual: (baseColor: string, scheme: ColorScheme) => Promise<void>;
  onGenerateMultiple: (baseColor: string, dualTheme: boolean) => Promise<void>;
  onGenerateRandom: (dualTheme: boolean) => Promise<void>;
  loading: boolean;
}

const schemes: { value: ColorScheme; label: string }[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split Complementary' },
];

export function ColorPicker({
  onGenerateSingle,
  onGenerateMultiple,
  onGenerateRandom,
  loading,
}: ColorPickerProps) {
  const [baseColor, setBaseColor] = useState('#6B46C1');
  const [scheme, setScheme] = useState<ColorScheme>('complementary');
  const [dual, setDual] = useState(false);

  const handleGenerateSingle = () => {
    onGenerateSingle(baseColor, scheme, dual);
  };

  const handleGenerateMultiple = () => {
    onGenerateMultiple(baseColor, dual);
  };

  const handleGenerateRandom = () => {
    onGenerateRandom(dual);
  };

  return (
    <div className="color-picker">
      <h2 className="color-picker__title">Color Generator</h2>

      <form className="color-picker__form">
        <div className="form-group">
          <label htmlFor="baseColor">Base Color</label>
          <div className="color-input-group">
            <input
              id="baseColor"
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="color-input"
              disabled={loading}
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#6B46C1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group checkbox">
          <label htmlFor="dualColor">Dual theme</label>
          <input
            id="dualColor"
            type="checkbox"
            defaultChecked={dual}
            onChange={() => {
              setDual(!dual);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheme">Color Scheme</label>
          <select
            id="scheme"
            value={scheme}
            onChange={(e) => setScheme(e.target.value as ColorScheme)}
            disabled={loading}
          >
            {schemes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={handleGenerateSingle}
            disabled={loading}
            className="btn btn--primary"
          >
            {loading ? 'Generating...' : 'Single Palette'}
          </button>

          <button
            type="button"
            onClick={handleGenerateMultiple}
            disabled={loading}
            className="btn btn--secondary"
          >
            All Variations
          </button>

          <button
            type="button"
            onClick={handleGenerateRandom}
            disabled={loading}
            className="btn btn--secondary"
          >
            Generate random
          </button>
        </div>
      </form>
    </div>
  );
}
