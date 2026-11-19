import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const routes = ['/', '/portfolio'];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const cleanUrl = (req.url || '/').split('?')[0];
  let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

console.log('🚀 Запуск статического пререндеринга для SEO и AI-поисковиков...');

for (const route of routes) {
  const win = new Window({
    url: `${baseUrl}${route}`,
    width: 1440,
    height: 900,
    settings: {
      disableJavaScriptFileLoading: false,
      disableJavaScriptEvaluation: false,
      disableCSSFileLoading: true,
      handleDisabledFileLoadingAsSuccess: true,
    },
  });

  // Моки браузерных API для GSAP, Lenis, Three.js и Cobe
  if (win.HTMLCanvasElement) {
    win.HTMLCanvasElement.prototype.getContext = () => null;
  }
  win.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  win.cancelAnimationFrame = (id) => clearTimeout(id);
  win.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  win.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  win.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  win.console.error = (...args) => {
    console.error(`[Prerender ${route} error]:`, ...args);
  };

  const htmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  win.document.write(htmlTemplate);

  await win.happyDOM.waitUntilComplete();
  // Ждём завершения прелоадера / асинхронных компонентов Vue (до 2.5 сек)
  await new Promise((r) => setTimeout(r, 2500));

  const renderedApp = win.document.querySelector('#app')?.innerHTML || '';

  if (renderedApp.trim().length > 200) {
    const finalHtml = htmlTemplate.replace(
      '<div id="app"></div>',
      `<div id="app">${renderedApp}</div>`
    );

    const outPath =
      route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.replace(/^\//, ''), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, finalHtml, 'utf-8');
    console.log(`✅ Сгенерирован статический HTML: ${route} (${renderedApp.length} байт контента)`);
  } else {
    console.warn(`⚠️ Контент для ${route} всё ещё пустой (${renderedApp.length} байт).`);
  }

  await win.happyDOM.close();
}

server.close();
console.log('✨ Пререндеринг завершён!');