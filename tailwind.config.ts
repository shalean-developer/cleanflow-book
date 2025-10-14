import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Classes used in dynamic contexts or that might be purged incorrectly
    'container',
    'prose',
    'prose-sm',
    'prose-lg',
    'mx-auto',
    'text-center',
    'animate-fade-up',
    'animate-fade-up-delay-1',
    'animate-fade-up-delay-2',
    'animate-fade-up-delay-3',
    'animate-fade-up-scale',
    'animate-slide-in-left',
    'animate-slide-in-right',
    'animate-float',
    'scrollbar-hide',
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
    'line-clamp-4',
    'line-clamp-5',
    'line-clamp-6',
  ],
  // Preserve CSS custom properties and @layer directives
  important: true, // Ensure custom CSS takes precedence
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate, 
    tailwindcssTypography,
    // Plugin to inject CSS custom properties
    function({ addBase }: any) {
      addBase({
        ':root': {
          '--background': '0 0% 100%',
          '--foreground': '260 13% 15%',
          '--card': '0 0% 100%',
          '--card-foreground': '260 13% 15%',
          '--popover': '0 0% 100%',
          '--popover-foreground': '260 13% 15%',
          '--primary': '215 100% 49%',
          '--primary-foreground': '0 0% 100%',
          '--primary-glow': '191 60% 39%',
          '--secondary': '210 40% 98%',
          '--secondary-foreground': '260 13% 15%',
          '--muted': '210 40% 98%',
          '--muted-foreground': '0 0% 33%',
          '--accent': '14 88% 62%',
          '--accent-foreground': '0 0% 100%',
          '--destructive': '0 84.2% 60.2%',
          '--destructive-foreground': '0 0% 100%',
          '--border': '210 14% 89%',
          '--input': '210 14% 89%',
          '--ring': '215 100% 49%',
          '--radius': '0.75rem',
          '--sidebar-background': '0 0% 98%',
          '--sidebar-foreground': '240 5.3% 26.1%',
          '--sidebar-primary': '240 5.9% 10%',
          '--sidebar-primary-foreground': '0 0% 98%',
          '--sidebar-accent': '240 4.8% 95.9%',
          '--sidebar-accent-foreground': '240 5.9% 10%',
          '--sidebar-border': '220 13% 91%',
          '--sidebar-ring': '217.2 10.6% 64.9%',
        },
      });
    },
  ],
} satisfies Config;
