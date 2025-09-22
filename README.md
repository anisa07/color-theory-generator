# 🎨 Color Theory Generator

A sophisticated color palette generator based on color theory principles, featuring the **60-30-10 design rule** with support for both **light and dark theme variants**. Generate harmonious color schemes for your web applications with proper contrast calculations and real-time website previews.

## ✨ Features

### 🎯 **Color Theory Based**

- **60-30-10 Rule**: Professional design principle where 60% is dominant, 30% is secondary, 10% is accent
- **4 Color Harmony Schemes**: Complementary, Analogous, Triadic, Split-Complementary
- **Smart Contrast Calculation**: Automatic foreground colors for optimal text readability

### 🌗 **Dual Theme Support**

- **Light & Dark Themes**: Generate both variants simultaneously
- **Intelligent Color Inversion**: Maintains harmony while adapting to theme requirements
- **Theme Comparison**: Interactive toggle between light and dark previews

### 🎨 **Advanced Color Generation**

- **8-Color Palettes**: Primary, Secondary, Accent, Background, Foreground + individual foreground colors
- **Custom Base Colors**: Start with your brand color or generate random palettes
- **Multiple Variations**: Generate all color schemes at once for comparison

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anisa07/color-theory-generator.git
cd color-theory-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

### 🔗 **API Endpoints**

#### Generate Single Palette

```http
GET /colors?scheme=complementary&baseColor=%23667eea
```

#### Generate Dual Themes

```http
GET /colors?scheme=complementary&dualTheme=true&baseColor=%23667eea
```

#### Generate All Variations

```http
GET /colors?variations=true&baseColor=%23667eea
```

#### Random Palette Generation

```http
GET /colors/random
GET /colors/random?dualTheme=true
```

#### Color Harmony Information

```http
GET /colors/harmony/complementary
```

## 📋 API Response Format

### Single Palette Response

```json
{
  "baseColor": "hsl(243, 80%, 62%)",
  "scheme": "complementary",
  "palette": {
    "primary": "#667eea",
    "secondary": "#f093fb",
    "accent": "#4facfe",
    "background": "#ffffff",
    "foreground": "#333333",
    "primaryForeground": "#ffffff",
    "secondaryForeground": "#000000",
    "accentForeground": "#ffffff"
  },
  "colorTheory": {
    "rule": "60-30-10",
    "description": "Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights"
  }
}
```

### Dual Theme Response

```json
{
  "baseColor": "hsl(243, 80%, 62%)",
  "scheme": "complementary",
  "dualThemePalette": {
    "light": {
      "primary": "#667eea",
      "secondary": "#f093fb",
      "accent": "#4facfe",
      "background": "#ffffff",
      "foreground": "#333333",
      "theme": "light"
    },
    "dark": {
      "primary": "#8b9cff",
      "secondary": "#c167d1",
      "accent": "#6bb6ff",
      "background": "#1a1a1a",
      "foreground": "#ffffff",
      "theme": "dark"
    }
  }
}
```

## 🎮 Usage Example

Usage example can be found here

1. **Open your browser** to `http://localhost:3000`
2. **Choose options**:
   - Select color scheme (Complementary, Analogous, etc.)
   - Pick a starting color (optional)
   - Enable "Light & Dark Themes" for dual theme generation
3. **Generate colors** using any of the three buttons:
   - **Generate Palette**: Single scheme with your options
   - **Random Colors**: Multiple random schemes
   - **All Variations**: All schemes with your base color

### 💡 **Pro Tips**

- **Start with your brand color** as the base to maintain brand consistency
- **Use "All Variations"** to compare different harmony schemes side-by-side
- **Enable dual themes** to see how colors adapt between light and dark modes
- **Click color swatches** to copy values and experiment with variations
- **Use the website preview** to see real-world application of your palette

![https://github.com/anisa07/color-theory-generator/src/sample/example.png](https://github.com/anisa07/color-theory-generator/blob/main/src/sample/example.png)

## 🎨 Color Theory Concepts

### **60-30-10 Rule**

- **60% Primary**: Dominant color for backgrounds and large areas
- **30% Secondary**: Supporting color for secondary elements
- **10% Accent**: Highlight color for buttons and call-to-actions

### **Color Harmony Schemes**

| Scheme                  | Description                       | Use Case                        |
| ----------------------- | --------------------------------- | ------------------------------- |
| **Complementary**       | Colors opposite on the wheel      | High contrast, vibrant designs  |
| **Analogous**           | Adjacent colors                   | Harmonious, calming designs     |
| **Triadic**             | Three evenly spaced colors        | Balanced, vibrant palettes      |
| **Split-Complementary** | Base + two adjacent to complement | High contrast with less tension |

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Technology Stack

- **Backend**: TypeScript + Express.js + Node.js
- **Color Theory**: Custom HSL/RGB algorithms
- **Development**: ts-node-dev, ESLint, Prettier

### Code Quality

- **TypeScript**: Strong typing for better development experience
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Automatic code formatting
- **CSS Variables**: Maintainable and themeable styles

## 🌈 Features in Detail

### **Smart Color Generation**

- **HSL Color Space**: More intuitive color manipulations
- **Lightness Adjustment**: Proper contrast for text readability
- **Saturation Control**: Prevents overwhelming color combinations
- **Hue Relationships**: Maintains color harmony across themes

### **Accessibility Focus**

- **WCAG Guidelines**: Colors meet contrast ratio requirements
- **Individual Foreground Colors**: Each background gets its optimal text color
- **Theme Adaptability**: Works in both light and dark environments

### **Interactive Features**

- **Click to Copy**: Copy any color value to clipboard
- **Base Color Update**: Copied colors automatically update the color picker
- **Theme Comparison**: Toggle between light/dark themes instantly
