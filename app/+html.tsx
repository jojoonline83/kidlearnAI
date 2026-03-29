import { ScrollViewStyleReset } from 'expo-router/html';

/**
 * Custom HTML template for the web build.
 * Controls <head> meta-tags, PWA manifest link, and global CSS.
 * This file is only used during `expo export --platform web`.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* ── Viewport: disable zoom so the app feels native ── */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* ── PWA / Theme ── */}
        <meta name="theme-color" content="#FF6B6B" />
        <meta name="background-color" content="#F0F4FF" />
        <meta name="description" content="Learn AI with Sparky! Fun interactive lessons, quizzes, and coding puzzles for kids aged 7–10." />

        {/* ── iOS PWA (Add to Home Screen) ── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KidLearnAI" />
        <link rel="apple-touch-icon" href="/assets/images/icon.png" />

        {/* ── Android PWA ── */}
        <link rel="manifest" href="/manifest.json" />

        {/* ── Favicon ── */}
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />

        {/* ── Resets needed by Expo ScrollView on web ── */}
        <ScrollViewStyleReset />

        <style>{`
          /* ── Base resets ─────────────────────────────────────── */
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #CBD5E1;   /* visible outside the "phone frame" */
          }

          /* ── Suppress the blue tap flash on mobile browsers ── */
          * {
            -webkit-tap-highlight-color: transparent;
          }

          /* ── Smooth fonts ── */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          /* ── Center the app in a "phone frame" on desktop ──────── */
          #root {
            max-width: 430px;          /* ~iPhone 15 width  */
            min-height: 100svh;        /* fill viewport on mobile */
            margin: 0 auto;
            background-color: #F0F4FF;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);
          }

          /* ── On phones the "frame" should fill the whole screen ── */
          @media (max-width: 480px) {
            html, body { background-color: #F0F4FF; }
            #root {
              max-width: 100%;
              box-shadow: none;
            }
          }

          /* ── Scrollbars: hide on touch, subtle on desktop ── */
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 2px;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
