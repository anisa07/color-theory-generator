# 🎨 Color Theory Generator

A sophisticated color palette generator built as a monorepo with React frontend and Express.js API. Generate harmonious color schemes using the **60-30-10 design rule** with support for light and dark themes.

## ✨ Features

- **Color Theory Based**: Complementary, Analogous, Triadic, Split-Complementary schemes
- **60-30-10 Rule**: Professional design principle for balanced color palettes
- **Dual Theme Support**: Generate light and dark theme variants simultaneously
- **WCAG Compliant**: Automatic contrast calculations for accessibility
- **React Frontend**: Modern web interface with real-time preview
- **Website Preview**: See your colors applied to a realistic website mockup

## 🏗️ Architecture

```
packages/
├── shared/     # Shared TypeScript types and utilities
├── api/        # Express.js API server
└── web/        # React + Vite frontend
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Development

```bash
# Clone and install dependencies
git clone https://github.com/anisa07/color-theory-generator.git
cd color-theory-generator
npm install

# Start both API (port 3000) and React app (port 3001)
npm run dev

# Build all packages
npm run build
```

## 🔗 API Endpoints

- `GET /colors?scheme=complementary&baseColor=%23667eea` - Generate single palette
- `GET /colors?dualTheme=true` - Generate light & dark themes
- `GET /colors/random` - Generate random palettes
- `GET /colors?variations=true` - Generate all scheme variations

## 🎨 Usage Example

![https://github.com/anisa07/color-theory-generator/sample/example.png](https://github.com/anisa07/color-theory-generator/blob/main/sample/example.png)

1. Open `http://localhost:3001` in your browser
2. Choose a base color and color scheme
3. Generate single palettes, dual themes, or all variations
4. Preview colors on a realistic website mockup
5. Click any color to copy its value

## 📦 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Color Theory**: Custom HSL algorithms with WCAG compliance
- **Architecture**: npm workspaces monorepo

## 📄 License

ISC License