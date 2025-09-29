// WebsitePreview component
import type { ColorPalette } from '@color-theory/shared';

interface WebsitePreviewProps {
  palette: ColorPalette;
  onClose: () => void;
}

export function WebsitePreview({ palette, onClose }: WebsitePreviewProps) {
  return (
    <div className="website-preview">
      <div className="website-preview__header">
        <div className="website-preview__title">Website Preview</div>
        <button className="website-preview__close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div
        className="website-preview__content"
        style={{
          backgroundColor: palette.background,
          color: palette.foreground,
        }}
      >
        {/* Navigation */}
        <nav
          className="preview-nav"
          style={{ backgroundColor: palette.primary, color: palette.primaryForeground }}
        >
          <div className="preview-nav__brand preview__barnd">Your Brand</div>
          <div className="preview-nav__menu">
            <span
              style={{
                color: palette.primaryForeground,
                textDecoration: 'underline',
                fontWeight: 'semi-bold',
              }}
            >
              Home
            </span>
            <span style={{ color: palette.primaryForeground }}>About</span>
            <span style={{ color: palette.primaryForeground }}>Services</span>
            <span style={{ color: palette.primaryForeground }}>Contact</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="preview-hero">
          <div className="preview-hero__content">
            <div className="preview-hero__container">
              {/* Skewed Background */}
              <div
                className="preview_hero__background"
                style={{
                  background: `linear-gradient(127deg, ${palette.primary} 0%, ${palette.accent} 50%, ${palette.secondary} 100%)`,
                }}
              />
              <h1 className="preview-hero__title">Welcome to Your Website</h1>
            </div>
            <p className="preview-hero__subtitle" style={{ color: palette.foreground }}>
              This is how your content will look with the selected color palette. The colors follow
              the 60-30-10 rule for balanced visual hierarchy.
            </p>
            <div className="preview-hero__buttons">
              <button
                className="preview-btn preview-btn--primary"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.primaryForeground,
                }}
              >
                Primary Action
              </button>
              <button
                className="preview-btn preview-btn--secondary"
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.secondaryForeground,
                }}
              >
                Secondary Action
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="preview-content">
          <div className="preview-content__grid">
            <article
              className="preview-card"
              style={{ transform: 'scale(0.95)', border: `1px solid ${palette.accent}` }}
            >
              <div
                className="preview-card__header"
                style={{ backgroundColor: palette.accent, color: palette.accentForeground }}
              >
                <h3>Accent Feature</h3>
              </div>
              <div className="preview-card__body">
                <p style={{ color: palette.foreground }}>
                  Your content goes here. This demonstrates how text and elements look with your
                  color scheme.
                </p>
                <a
                  href="#"
                  style={{
                    background: palette.accent,
                    color: palette.accentForeground,
                    padding: '0.5rem',
                  }}
                  className="preview__skew"
                >
                  Learn more →
                </a>
              </div>
            </article>

            <article
              className="preview-card"
              style={{ transform: 'scale(1.15)', border: `2px solid ${palette.primary}` }}
            >
              <div
                className="preview-card__header"
                style={{ backgroundColor: palette.primary, color: palette.primaryForeground }}
              >
                <h3>Primary Feature</h3>
              </div>
              <div className="preview-card__body">
                <p style={{ color: palette.foreground }}>
                  Notice how the colors create a harmonious and accessible reading experience.
                </p>
                <a
                  href="#"
                  style={{
                    color: palette.primaryForeground,
                    backgroundColor: palette.primary,
                    padding: '0.5rem',
                  }}
                  className="preview__skew"
                >
                  Learn more →
                </a>
              </div>
            </article>

            <article
              className="preview-card"
              style={{ transform: 'scale(0.95)', border: `1px solid ${palette.secondary}` }}
            >
              <div
                className="preview-card__header"
                style={{ backgroundColor: palette.secondary, color: palette.secondaryForeground }}
              >
                <h3>Secondary Feature</h3>
              </div>
              <div className="preview-card__body">
                <p style={{ color: palette.foreground }}>
                  The palette follows WCAG guidelines for optimal contrast and readability.
                </p>
                <a
                  href="#"
                  style={{
                    color: palette.secondaryForeground,
                    background: palette.secondary,
                    padding: '0.5rem',
                  }}
                  className="preview__skew"
                >
                  Learn more →
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="preview-footer"
          style={{ backgroundColor: palette.primary, color: palette.primaryForeground }}
        >
          <div className="preview-footer__content">
            <div className="preview-footer__brand">
              <h4
                className="preview__barnd"
                style={{
                  color: palette.accentForeground,
                  background: palette.accent,
                }}
              >
                Your Brand
              </h4>
              <p>Building beautiful experiences with thoughtful design.</p>
            </div>
            <div className="preview-footer__links">
              <div>
                <h5 style={{ fontWeight: 'bolder' }}>Quick Links</h5>
                <ul>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      Services
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 style={{ fontWeight: 'bolder' }}>Contact</h5>
                <ul>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      Email Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      Call Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: palette.primaryForeground, textDecoration: 'underline' }}
                    >
                      Visit Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
