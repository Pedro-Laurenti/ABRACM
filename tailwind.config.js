import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      "themes": {
        "light": {
          "colors": {
            "background": "#fcfaf8",
            
            "primary": {
              "50": "#fdf8e4",
              "100": "#fbebc3",
              "200": "#f6d785",
              "300": "#f2c247",
              "400": "#ecac0a",
              "500": "#d89b09",
              "600": "#a47907",
              "700": "#715706",
              "800": "#4c3a04",
              "900": "#2a2102",
              "foreground": "#fff",
              "DEFAULT": "#d89b09"
            },
            "secondary": {
              "50": "#fdf7e4",
              "100": "#fae8b6",
              "200": "#f5d778",
              "300": "#f1c63a",
              "400": "#ecb20b",
              "500": "#FEDB71",
              "600": "#a47b07",
              "700": "#715706",
              "800": "#4b3b04",
              "900": "#271f02",
              "foreground": "#140f1f",
              "DEFAULT": "#FEDB71"
            },
            "success": {
              "50": "#effbf1",
              "100": "#d7f7da",
              "200": "#aff0b3",
              "300": "#86e98d",
              "400": "#5ee267",
              "500": "#36db41",
              "600": "#2bb234",
              "700": "#208828",
              "800": "#155f1c",
              "900": "#0a3510",
              "foreground": "#140f1f",
              "DEFAULT": "#36db41"
            },
            "warning": {
              "50": "#fff4e6",
              "100": "#ffddba",
              "200": "#ffc58d",
              "300": "#ffad61",
              "400": "#ff9541",
              "500": "#ff7d22",
              "600": "#e66f1d",
              "700": "#b35617",
              "800": "#803d11",
              "900": "#4d240a",
              "foreground": "#140f1f",
              "DEFAULT": "#ff7d22"
            },
            "danger": {
              "50": "#fbeeee",
              "100": "#f6d1d1",
              "200": "#ec9a9a",
              "300": "#e36565",
              "400": "#d83838",
              "500": "#b92e2e",
              "600": "#8c2323",
              "700": "#661818",
              "800": "#401010",
              "900": "#200808",
              "foreground": "#fff",
              "DEFAULT": "#d83838"
            }
          }
        },
        "dark": {
          "colors": {
            "background": "#1a1a1a",
            "primary": {
              "50": "#2a2102",
              "100": "#4c3a04",
              "200": "#715706",
              "300": "#a47907",
              "400": "#d89b09",
              "500": "#ecac0a",
              "600": "#f2c247",
              "700": "#f6d785",
              "800": "#fbebc3",
              "900": "#fdf8e4",
              "foreground": "#fff",
              "DEFAULT": "#d89b09",
            },
            "secondary": {
              "50": "#271f02",
              "100": "#4b3b04",
              "200": "#715706",
              "300": "#a47b07",
              "400": "#d89f09",
              "500": "#ecb20b",
              "600": "#f1c63a",
              "700": "#f5d778",
              "800": "#fae8b6",
              "900": "#fdf7e4",
              "foreground": "#140f1f",
              "DEFAULT": "#f1c63a"
            },
            "success": {
              "50": "#122b1a",
              "100": "#205a2d",
              "200": "#2e8b40",
              "300": "#3bbd52",
              "400": "#48ee65",
              "500": "#55ff78",
              "600": "#6cff94",
              "700": "#84ffaf",
              "800": "#9bffd8",
              "900": "#b3fffb",
              "foreground": "#140f1f",
              "DEFAULT": "#3bbd52"
            },
            "warning": {
              "50": "#2a1501",
              "100": "#542a03",
              "200": "#7f3e05",
              "300": "#aa5207",
              "400": "#d46609",
              "500": "#e97a1c",
              "600": "#f1903f",
              "700": "#f7a562",
              "800": "#fbbd85",
              "900": "#fee6c5",
              "foreground": "#140f1f",
              "DEFAULT": "#e97a1c"
            },
            "danger": {
              "50": "#200808",
              "100": "#401010",
              "200": "#661818",
              "300": "#8c2323",
              "400": "#b92e2e",
              "500": "#d83838",
              "600": "#e36565",
              "700": "#ec9a9a",
              "800": "#f6d1d1",
              "900": "#fbeeee",
              "foreground": "#fff",
              "DEFAULT": "#d83838"
            }
          }
        }
      }
    })
  ],
};
