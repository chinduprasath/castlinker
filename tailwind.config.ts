
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				gold: {
					light: '#d4a017',
					DEFAULT: '#b38600',
					dark: '#946e00'
				},
				cinematic: {
					dark: '#121212',
					DEFAULT: '#1a1a1a',
					light: '#2a2a2a'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.7s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out'
			},
			backgroundImage: {
				'film-grain': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA1LTEwVDEzOjU5OjEzKzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNS0xMFQxNDowMDozOSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNS0xMFQxNDowMDozOSswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplOWZkYzcwOS1mYWZm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')",
				'hero-gradient': 'linear-gradient(109.6deg, rgba(0,0,0,0.9) 11.2%, rgba(20,20,20,0.9) 100.2%)',
				'card-gradient': 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(30,30,30,0.8) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
