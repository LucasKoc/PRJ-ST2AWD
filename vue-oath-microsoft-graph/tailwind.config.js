/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{vue,js,ts,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require("daisyui"),
  ],
  daisyui: {
    themes: true, // "night" or "garden"
    darkTheme: "night",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
  },
  safelist: [
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'bg-neutral',
    'text-primary',
    'text-secondary',
    'text-accent',
    'text-neutral',
    'btn-primary',
    'btn-secondary',
    'btn-accent',
    'btn-neutral',
      'btn-warning',
        'btn-error',
        'btn-success',
        'btn-info',
      ],
}

