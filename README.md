◊◊# Color Theory Generator - Monorepo# 🎨 Color Theory Generator

A comprehensive color theory generator built as a monorepo with separate packages for API backend, web frontend, and shared utilities.A sophisticated color palette generator based on color theory principles, featuring the **60-30-10 design rule** with support for both **light and dark theme variants**. Generate harmonious color schemes for your web applications with proper contrast calculations and real-time website previews.

## 🏗️ Architecture## ✨ Features

This project is organized as a monorepo with the following packages:### 🎯 **Color Theory Based**

```- **60-30-10 Rule**: Professional design principle where 60% is dominant, 30% is secondary, 10% is accent

packages/- **4 Color Harmony Schemes**: Complementary, Analogous, Triadic, Split-Complementary

├── shared/     # Shared types, utilities, and constants- **Smart Contrast Calculation**: Automatic foreground colors for optimal text readability

├── api/        # Express.js API server

└── web/        # Vite-based web interface### 🌗 **Dual Theme Support**

```

- **Light & Dark Themes**: Generate both variants simultaneously

## 🚀 Quick Start- **Intelligent Color Inversion**: Maintains harmony while adapting to theme requirements

- **Theme Comparison**: Interactive toggle between light and dark previews

### Prerequisites

- Node.js >= 18.0.0### 🎨 **Advanced Color Generation**

- npm >= 9.0.0

- **8-Color Palettes**: Primary, Secondary, Accent, Background, Foreground + individual foreground colors

### Installation- **Custom Base Colors**: Start with your brand color or generate random palettes

````bash- **Multiple Variations**: Generate all color schemes at once for comparison

# Install all dependencies for all packages

npm install## 🚀 Quick Start



# Build shared package first (required by other packages)### Prerequisites

npm run build --workspace=packages/shared

```- Node.js (v16 or higher)

- npm or yarn

### Development

### Installation

#### Start both API and Web (recommended)

```bash```bash

# Starts API server on http://localhost:3000 and web dev server on http://localhost:3001# Clone the repository

npm run devgit clone https://github.com/anisa07/color-theory-generator.git

```cd color-theory-generator



#### Start individually# Install dependencies

```bashnpm install

# API server only (http://localhost:3000)

npm run dev:api# Start development server

npm run dev

# Web development server only (http://localhost:3001)  ```

npm run dev:web

```The application will be available at `http://localhost:3000`



### Production Build### Production Build

```bash

# Build all packages```bash

npm run build# Build the project

npm run build

# Build specific packages

npm run build:api# Start production server

npm run build:webnpm start

````

## 📦 Packages### 🔗 **API Endpoints**

### @color-theory/shared#### Generate Single Palette

**Location:** `packages/shared/`

**Purpose:** Common types, interfaces, and utilities used across packages```http

GET /colors?scheme=complementary&baseColor=%23667eea

- TypeScript types for colors, palettes, and API responses```

- Validation patterns (HEX color regex)

- Color scheme definitions#### Generate Dual Themes

- API request/response interfaces

`````http

### @color-theory/api  GET /colors?scheme=complementary&dualTheme=true&baseColor=%23667eea

**Location:** `packages/api/````

**Purpose:** Express.js REST API server for color generation

#### Generate All Variations

**Key Features:**

- 60-30-10 color rule implementation```http

- Multiple color harmony schemes (complementary, analogous, triadic, etc.)GET /colors?variations=true&baseColor=%23667eea

- Dual theme generation (light/dark)```

- WCAG-compliant contrast calculations

- Softer foreground color alternatives#### Random Palette Generation



**API Endpoints:**```http

- `GET /colors` - Generate color paletteGET /colors/random

- `GET /colors/random` - Generate random palettes  GET /colors/random?dualTheme=true

- `GET /colors/test-contrast` - Validate contrast ratios```

- `GET /colors/harmony/:scheme` - Get color harmony info

#### Color Harmony Information

### @color-theory/web

**Location:** `packages/web/````http

**Purpose:** Modern web interface built with ViteGET /colors/harmony/complementary

`````

**Key Features:**

- Interactive color picker## 📋 API Response Format

- Real-time palette generation

- Website preview with generated colors### Single Palette Response

- Dual theme comparison

- Copy-to-clipboard functionality```json

- Responsive design with CSS variables{

  "baseColor": "hsl(243, 80%, 62%)",

## 🛠️ Development Commands "scheme": "complementary",

"palette": {

### Root Level Commands "primary": "#667eea",

````bash "secondary": "#f093fb",

npm run dev          # Start all services    "accent": "#4facfe",

npm run build        # Build all packages      "background": "#ffffff",

npm run lint         # Lint all packages    "foreground": "#333333",

npm run format       # Format all packages    "primaryForeground": "#ffffff",

npm run clean        # Clean build artifacts    "secondaryForeground": "#000000",

```    "accentForeground": "#ffffff"

  },

### Package-Specific Commands  "colorTheory": {

```bash    "rule": "60-30-10",

# API package    "description": "Primary (60%) - dominant, Secondary (30%) - supporting, Accent (10%) - highlights"

npm run dev:api      # Start API server  }

npm run build:api    # Build API}

````

# Web package

npm run dev:web # Start web dev server### Dual Theme Response

npm run build:web # Build web assets

````json

{

## 🎨 Color Theory Features  "baseColor": "hsl(243, 80%, 62%)",

  "scheme": "complementary",

### Supported Color Schemes  "dualThemePalette": {

- **Complementary** - Colors opposite on the color wheel    "light": {

- **Analogous** - Adjacent colors on the color wheel        "primary": "#667eea",

- **Triadic** - Three evenly spaced colors      "secondary": "#f093fb",

- **Split-Complementary** - Base + two adjacent to complement      "accent": "#4facfe",

      "background": "#ffffff",

### 60-30-10 Color Rule      "foreground": "#333333",

- **Primary (60%)** - Dominant color for main elements      "theme": "light"

- **Secondary (30%)** - Supporting color for accents    },

- **Accent (10%)** - Highlight color for call-to-actions    "dark": {

      "primary": "#8b9cff",

### Accessibility Features      "secondary": "#c167d1",

- **WCAG AA/AAA compliance** - Automatic contrast validation      "accent": "#6bb6ff",

- **Softer foreground colors** - Reduces eye strain while maintaining readability      "background": "#1a1a1a",

- **Dual theme support** - Automatic light/dark theme generation      "foreground": "#ffffff",

- **Contrast testing** - Built-in contrast ratio validation      "theme": "dark"

    }

## 📄 License  }

}

This project is licensed under the ISC License.```

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
````
