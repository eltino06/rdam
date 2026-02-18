export const theme = {
  colors: {
    primary: '#203450',    // Navy blue
    secondary: '#e0e0e0',  // Light gray
    white: '#ffffff',      // White

    // Semantic aliases
    background: '#203450',
    text: '#ffffff',
    textSecondary: '#e0e0e0',
    border: '#e0e0e0',
    accent: '#ffffff',
  },
  typography: {
    fontFamily: {
      heading: "'Encode Sans', 'Arial', sans-serif",
      body: "'Encode Sans', 'Arial', sans-serif",
      mono: "'Consolas', 'Courier New', monospace",
    },
    fontSize: {
      xs: '0.8333rem',    // 13.33px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.1667rem',    // 18.67px
      xl: '1.5rem',       // 24px
      '2xl': '1.75rem',   // 28px
      '3xl': '2rem',      // 32px
      '4xl': '2.5rem',    // 40px
      '5xl': '3rem',      // 48px
      '6xl': '4rem',      // 64px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
    text: '0 1px 2px rgba(0, 0, 0, 0.4)',
    button: '0 2px 4px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(255, 255, 255, 0.1)',
  },
  borderRadius: {
    xs: '0.25rem',   // 4px
    sm: '0.375rem',  // 6px
    md: '0.625rem',  // 10px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '9999px',
  },
  spacing: {
    1: '0.5rem',   // 8px
    2: '1rem',     // 16px
    3: '1.5rem',   // 24px
    4: '2rem',     // 32px
    6: '3rem',     // 48px
    8: '4rem',     // 64px
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
