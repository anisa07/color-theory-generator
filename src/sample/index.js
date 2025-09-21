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

  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating colors...</div>';
    document.getElementById('preview-section').style.display = 'none';

    let url = `/colors?scheme=${scheme}`;

    if (baseColor && baseColor !== '#000000') {
      url += `&baseColor=${encodeURIComponent(baseColor)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate colors');
    }

    displaySinglePalette(data);
  } catch (error) {
    document.getElementById('results').innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function generateRandomColors() {
  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating random colors...</div>';
    document.getElementById('preview-section').style.display = 'none';

    const response = await fetch('/colors/random');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate random colors');
    }

    displayMultiplePalettes(data);
  } catch (error) {
    document.getElementById('results').innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function showAllVariations() {
  const baseColorInput = document.getElementById('baseColor');
  const baseColor = baseColorInput.value;

  try {
    document.getElementById('results').innerHTML =
      '<div class="loading">Generating all variations...</div>';
    document.getElementById('preview-section').style.display = 'none';

    let url = '/colors?variations=true';

    if (baseColor && baseColor !== '#000000') {
      url += `&baseColor=${encodeURIComponent(baseColor)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate variations');
    }

    displayMultiplePalettes(data);
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
  const colorUsage = {
    primary: '60% - Main/dominant color for large areas',
    secondary: '30% - Supporting color for secondary elements',
    accent: '10% - Highlight color for buttons & call-to-actions',
    background: 'Light background variant',
    foreground: 'Dark text/contrast color',
    primaryForeground: 'Text color for primary backgrounds',
    secondaryForeground: 'Text color for secondary backgrounds',
    accentForeground: 'Text color for accent backgrounds',
  };

  return Object.entries(palette)
    .map(
      ([colorName, colorValue]) => `
                <div class="color-row">
                    <div class="color-swatch" 
                         style="background-color: ${colorValue}" 
                         onclick="copyToClipboard('${colorValue}')"
                         title="Click to copy ${colorValue}">
                    </div>
                    <div class="color-info">
                        <div class="color-name">${colorName.charAt(0).toUpperCase() + colorName.slice(1)}</div>
                        <div class="color-value">${colorValue}</div>
                        <div class="color-usage">${colorUsage[colorName] || ''}</div>
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
                            <button class="preview-btn" style="background: transparent !important; border: 2px solid ${palette.primary} !important; color: ${palette.primary} !important;">
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

// Generate initial colors on page load
window.addEventListener('load', generateRandomColors);
