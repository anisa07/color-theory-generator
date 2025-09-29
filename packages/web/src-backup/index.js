const HEX_6_COLOR = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// Global palette storage for preview buttons
let paletteStorage = {};
let paletteCounter = 0;

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const result = HEX_6_COLOR.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

async function generateColors() {
  const scheme = document.getElementById('scheme').value;
  const baseColorInput = document.getElementById('baseColor');
  const baseColor = baseColorInput.value;
  const dualTheme = document.getElementById('dualTheme').checked;

  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating colors...</div>';
    document.getElementById('preview-section').style.display = 'none';

    let url = `/colors?scheme=${scheme}`;

    if (baseColor && baseColor !== '#000000') {
      url += `&baseColor=${encodeURIComponent(baseColor)}`;
    }

    if (dualTheme) {
      url += '&dualTheme=true';
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate colors');
    }

    if (dualTheme && data.dualThemePalette) {
      displayDualThemePalette(data);
    } else {
      displaySinglePalette(data);
    }
  } catch (error) {
    document.getElementById('results').innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function generateRandomColors() {
  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating random colors...</div>';

    const dualTheme = document.getElementById('dualTheme').checked;
    let url = '/colors/random';

    if (dualTheme) {
      url += '?dualTheme=true';
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate random colors');
    }

    if (dualTheme && data.dualThemePalettes) {
      displayMultipleDualThemes(data);
    } else {
      displayMultiplePalettes(data);
    }
  } catch (error) {
    document.getElementById('results').innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function showAllVariations() {
  const baseColorInput = document.getElementById('baseColor');
  const baseColor = baseColorInput.value;
  const dualTheme = document.getElementById('dualTheme').checked;

  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating all variations...</div>';

    let url = '/colors?variations=true';

    if (baseColor && baseColor !== '#000000') {
      url += `&baseColor=${encodeURIComponent(baseColor)}`;
    }

    if (dualTheme) {
      url += '&dualTheme=true';
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate variations');
    }

    if (dualTheme && data.dualThemePalettes) {
      displayMultipleDualThemes(data);
    } else {
      displayMultiplePalettes(data);
    }
  } catch (error) {
    document.getElementById('results').innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

function displaySinglePalette(data) {
  const paletteId = `palette_${paletteCounter++}`;
  paletteStorage[paletteId] = data.palette;

  const html = `
                <div class="palette-grid">
                    <div class="palette-card">
                        <div class="palette-title">${data.scheme} Color Scheme</div>
                        ${renderPaletteColors(data.palette)}
                        <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${paletteId}'])">Display sample</button>
                    </div>
                </div>
            `;

  document.getElementById('results').innerHTML = html;
  //   showWebsitePreview(data.palette);
}

function displayDualThemePalette(data) {
  const lightPaletteId = `palette_${paletteCounter++}`;
  const darkPaletteId = `palette_${paletteCounter++}`;
  paletteStorage[lightPaletteId] = data.dualThemePalette.light;
  paletteStorage[darkPaletteId] = data.dualThemePalette.dark;

  const html = `
                <div class="dual-theme-container">
                    <h2 class="dual-theme-title">${data.scheme} Color Scheme - Light & Dark Themes</h2>
                    <div class="palette-grid dual-theme-grid">
                        <div class="palette-card light-theme">
                            <div class="palette-title">☀️ Light Theme</div>
                            ${renderPaletteColors(data.dualThemePalette.light)}
                            <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${lightPaletteId}'])">Preview Light</button>
                        </div>
                        <div class="palette-card dark-theme">
                            <div class="palette-title">🌙 Dark Theme</div>
                            ${renderPaletteColors(data.dualThemePalette.dark)}
                            <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${darkPaletteId}'])">Preview Dark</button>
                        </div>
                    </div>
                    <div class="theme-comparison">
                        <button class="btn primary" onclick="showDualThemeComparison(paletteStorage['${lightPaletteId}'], paletteStorage['${darkPaletteId}'])">Compare Both Themes</button>
                    </div>
                </div>
            `;

  document.getElementById('results').innerHTML = html;
}

function displayMultiplePalettes(data) {
  const palettes = data.palettes;
  const paletteCards = Object.entries(palettes)
    .map(([schemeName, palette]) => {
      const paletteId = `palette_${paletteCounter++}`;
      paletteStorage[paletteId] = palette;
      return `
                <div class="palette-card">
                    <div class="palette-title">${schemeName.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                    ${renderPaletteColors(palette)}
                    <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${paletteId}'])">Display sample</button>
                </div>
            `;
    })
    .join('');

  const html = `
                <div class="palette-grid">
                    ${paletteCards}
                </div>
            `;

  document.getElementById('results').innerHTML = html;
}

function renderPaletteColors(palette) {
  //   const colorUsage = {
  //     primary: '60% - Main/dominant color for large areas',
  //     secondary: '30% - Supporting color for secondary elements',
  //     accent: '10% - Highlight color for buttons & call-to-actions',
  //     background: 'Light background variant',
  //     foreground: 'Dark text/contrast color',
  //     primaryForeground: 'Text color for primary backgrounds',
  //     secondaryForeground: 'Text color for secondary backgrounds',
  //     accentForeground: 'Text color for accent backgrounds',
  //   };
  //   <div class="color-usage">${colorUsage[colorName] || ''}</div>

  return Object.entries(palette)
    .filter(([colorName, colorValue]) => {
      // Only show actual color values (hex colors), skip theme indicators
      return (
        typeof colorValue === 'string' &&
        colorValue.startsWith('#') &&
        colorValue !== 'dark' &&
        colorValue !== 'light'
      );
    })
    .map(
      ([colorName, colorValue]) => `
                <div class="color-row">
                    <div class="color-name">${colorName.charAt(0).toUpperCase() + colorName.slice(1)}</div>
                    <div class="color-info">
                        <div class="color-swatch" 
                             style="background-color: ${colorValue}" 
                            onclick="copyToClipboard('${colorValue}')"
                            title="Click to copy ${colorValue}">
                        </div>
                        <div class="color-value">${colorValue}</div>
                    </div>
                </div>
            `,
    )
    .join('');
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);

    // Update the color picker with the copied color if it's a valid hex color
    if (HEX_6_COLOR.test(text)) {
      document.getElementById('baseColor').value = text;
    }

    // Show a temporary notification
    const notification = document.createElement('div');
    notification.textContent = `Copied ${text}! Click to use as base color.`;
    notification.className = 'notification';
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// CSS animation is now defined in style.css
function showWebsitePreview(palette) {
  if (!palette || typeof palette !== 'object') {
    console.error('Invalid palette data:', palette);
    return;
  }

  document.getElementById('preview-section').style.display = 'block';

  // Use server-generated foreground colors for proper contrast
  const primaryForeground = palette.primaryForeground;
  const secondaryForeground = palette.secondaryForeground;
  const accentForeground = palette.accentForeground;

  const preview = document.getElementById('website-preview');
  preview.innerHTML = `
                <!-- Header -->
                <header class="preview-header" style="background-color: ${palette.primary}; color: ${primaryForeground};">
                    <div class="preview-logo" style="color: ${primaryForeground};">
                        YourBrand
                    </div>
                    <nav class="preview-nav">
                        <a href="#" style="color: ${primaryForeground};">Home</a>
                        <a href="#" style="color: ${secondaryForeground}; background-color: ${palette.secondary};">About</a>
                        <a href="#" style="color: ${primaryForeground};">Services</a>
                        <a href="#" style="color: ${primaryForeground};">Contact</a>
                    </nav>
                </header>

                <!-- Main Content -->
                <main class="preview-main" style="background-color: ${palette.background}; color: ${palette.foreground};">
                    <section class="preview-hero">
                        <h1 style="color: ${palette.foreground};">Welcome to Our Amazing Service</h1>
                        <p style="color: ${palette.foreground}; opacity: 0.8;">
                            Discover how our color palette creates a harmonious and professional look for your website
                        </p>
                        <div class="preview-buttons">
                            <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                                Get Started
                            </button>
                            <button class="preview-btn" style="background-color: ${palette.secondary} !important; color: ${secondaryForeground} !important; border: none !important;">
                                Learn More
                            </button>
                            <button class="preview-btn" style="background: transparent !important; border: 2px solid ${palette.foreground} !important; color: ${palette.foreground} !important;">
                                Contact Us
                            </button>
                        </div>
                    </section>

                    <section class="preview-cards">
                        <div class="preview-card" style="background-color: ${palette.primary}; color: ${primaryForeground};">
                            <h3>Primary Feature (60%)</h3>
                            <p>This card uses the primary color, representing 60% of your design. It's the dominant color that sets the overall tone.</p>
                            <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                                Primary Action
                            </button>
                        </div>
                        
                        <div class="preview-card" style="background-color: ${palette.secondary}; color: ${secondaryForeground};">
                            <h3>Secondary Feature (30%)</h3>
                            <p>This card showcases the secondary color, making up 30% of the design. It complements the primary color beautifully.</p>
                            <button class="preview-btn" style="background-color: ${palette.primary} !important; color: ${primaryForeground} !important; border: none !important;">
                                Secondary Action
                            </button>
                        </div>
                        
                        <div class="preview-card" style="background-color: ${palette.background}; color: ${palette.foreground}; border: 2px solid ${palette.secondary};">
                            <h3>Neutral Background</h3>
                            <p>This card uses the background color with proper contrast. Notice how the text remains readable.</p>
                            <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                                <strong>Accent Button (10%)</strong>
                            </button>
                        </div>
                    </section>
                </main>

                <!-- Footer -->
                <footer class="preview-footer" style="background-color: ${palette.foreground}; color: ${palette.background};">
                    <p>© 2025 YourBrand. This footer uses foreground and background colors for optimal contrast.</p>
                    <div style="margin-top: 15px;">
                        <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important; margin: 0 5px;">
                            Newsletter
                        </button>
                        <button class="preview-btn" style="background: transparent !important; border: 2px solid ${palette.background} !important; color: ${palette.background} !important; margin: 0 5px;">
                            Follow Us
                        </button>
                    </div>
                </footer>
            `;

  //   Smooth scroll to preview
  setTimeout(() => {
    document.getElementById('preview-section').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 100);
}

function displayMultipleDualThemes(data) {
  const dualThemePalettes = data.dualThemePalettes;
  const schemeCards = Object.entries(dualThemePalettes)
    .map(([schemeName, dualPalette]) => {
      const lightPaletteId = `palette_${paletteCounter++}`;
      const darkPaletteId = `palette_${paletteCounter++}`;
      paletteStorage[lightPaletteId] = dualPalette.light;
      paletteStorage[darkPaletteId] = dualPalette.dark;

      return `
                <div class="scheme-container">
                    <h3 class="scheme-title">${schemeName.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
                    <div class="dual-theme-pair">
                        <div class="palette-card light-theme">
                            <div class="palette-title">☀️ Light</div>
                            <div>${renderPaletteColors(dualPalette.light)}</div>
                            <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${lightPaletteId}'])">Preview</button>
                        </div>
                        <div class="palette-card dark-theme">
                            <div class="palette-title">🌙 Dark</div>
                            <div>${renderPaletteColors(dualPalette.dark)}</div>
                            <button class="btn primary outline" onclick="showWebsitePreview(paletteStorage['${darkPaletteId}'])">Preview</button>
                        </div>
                    </div>
                    <div class="theme-comparison">
                        <button class="btn primary small" onclick="showDualThemeComparison(paletteStorage['${lightPaletteId}'], paletteStorage['${darkPaletteId}'])">Compare Themes</button>
                    </div>
                </div>
            `;
    })
    .join('');

  const html = `
                <div class="dual-themes-grid">
                    <h2 class="dual-themes-header">All Color Schemes - Light & Dark Themes</h2>
                    ${schemeCards}
                </div>
            `;

  document.getElementById('results').innerHTML = html;
}

function showDualThemeComparison(lightPalette, darkPalette) {
  if (!lightPalette || !darkPalette) {
    console.error('Invalid palette data for comparison');
    return;
  }

  document.getElementById('preview-section').style.display = 'block';

  const preview = document.getElementById('website-preview');
  preview.innerHTML = `
    <div class="theme-comparison-container">
      <div class="theme-toggle-buttons">
        <button class="theme-toggle active" onclick="switchThemePreview('light', this)">☀️ Light Theme</button>
        <button class="theme-toggle" onclick="switchThemePreview('dark', this)">🌙 Dark Theme</button>
      </div>
      
      <div id="light-preview" class="theme-preview active">
        ${generatePreviewHTML(lightPalette)}
      </div>
      
      <div id="dark-preview" class="theme-preview" style="display: none;">
        ${generatePreviewHTML(darkPalette)}
      </div>
    </div>
  `;

  // Store palettes for theme switching
  window.currentLightPalette = lightPalette;
  window.currentDarkPalette = darkPalette;

  setTimeout(() => {
    document.getElementById('preview-section').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 100);
}

function switchThemePreview(theme, button) {
  // Update button states
  document.querySelectorAll('.theme-toggle').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');

  // Show/hide theme previews
  const lightPreview = document.getElementById('light-preview');
  const darkPreview = document.getElementById('dark-preview');

  if (theme === 'light') {
    lightPreview.style.display = 'block';
    darkPreview.style.display = 'none';
  } else {
    lightPreview.style.display = 'none';
    darkPreview.style.display = 'block';
  }
}

function generatePreviewHTML(palette) {
  const primaryForeground = palette.primaryForeground;
  const secondaryForeground = palette.secondaryForeground;
  const accentForeground = palette.accentForeground;

  return `
    <!-- Header -->
    <header class="preview-header" style="background-color: ${palette.primary}; color: ${primaryForeground};">
        <div class="preview-logo" style="color: ${primaryForeground};">
            YourBrand
        </div>
        <nav class="preview-nav">
            <a href="#" style="color: ${primaryForeground};">Home</a>
            <a href="#" style="color: ${secondaryForeground}; background-color: ${palette.secondary};">About</a>
            <a href="#" style="color: ${primaryForeground};">Services</a>
            <a href="#" style="color: ${primaryForeground};">Contact</a>
        </nav>
    </header>

    <!-- Main Content -->
    <main class="preview-main" style="background-color: ${palette.background}; color: ${palette.foreground};">
        <section class="preview-hero">
            <h1 style="color: ${palette.foreground};">Welcome to Our Amazing Service</h1>
            <p style="color: ${palette.foreground}; opacity: 0.8;">
                Discover how your color palette creates a harmonious and professional look for your website
            </p>
            <div class="preview-buttons">
                <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                    Get Started
                </button>
                <button class="preview-btn" style="background-color: ${palette.secondary} !important; color: ${secondaryForeground} !important; border: none !important;">
                    Learn More
                </button>
                <button class="preview-btn" style="background: transparent !important; border: 2px solid ${palette.foreground} !important; color: ${palette.foreground} !important;">
                    Contact Us
                </button>
            </div>
        </section>

        <section class="preview-cards">
            <div class="preview-card" style="background-color: ${palette.primary}; color: ${primaryForeground};">
                <h3>Primary Feature (60%)</h3>
                <p>This card uses the primary color, representing 60% of your design. It's the dominant color that sets the overall tone.</p>
                <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                    Primary Action
                </button>
            </div>
            
            <div class="preview-card" style="background-color: ${palette.secondary}; color: ${secondaryForeground};">
                <h3>Secondary Feature (30%)</h3>
                <p>This card showcases the secondary color, making up 30% of the design. It complements the primary color beautifully.</p>
                <button class="preview-btn" style="background-color: ${palette.primary} !important; color: ${primaryForeground} !important; border: none !important;">
                    Secondary Action
                </button>
            </div>
            
            <div class="preview-card" style="background-color: ${palette.background}; color: ${palette.foreground}; border: 2px solid ${palette.secondary};">
                <h3>Neutral Background</h3>
                <p>This card uses the background color with proper contrast. Notice how the text remains readable.</p>
                <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important;">
                    <strong>Accent Button (10%)</strong>
                </button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="preview-footer" style="background-color: ${palette.foreground}; color: ${palette.background};">
        <p>© 2025 YourBrand. This footer uses foreground and background colors for optimal contrast.</p>
        <div style="margin-top: 15px;">
            <button class="preview-btn" style="background-color: ${palette.accent} !important; color: ${accentForeground} !important; border: none !important; margin: 0 5px;">
                Newsletter
            </button>
            <button class="preview-btn" style="background: transparent !important; border: 2px solid ${palette.background} !important; color: ${palette.background} !important; margin: 0 5px;">
                Follow Us
            </button>
        </div>
    </footer>
  `;
}

// Generate initial colors on page load
window.addEventListener('load', generateRandomColors);
