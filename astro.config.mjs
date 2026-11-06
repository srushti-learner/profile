import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://srushti-learner.github.io',
  base: '/profile/',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
