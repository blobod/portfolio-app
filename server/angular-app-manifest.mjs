
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://blobod.github.io/portfolio-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/portfolio-app"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 665, hash: '4e80c1f3ee6e26665e2980a7e3517df3f7a699936f3200c6195cf4dfd1b38e4f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1178, hash: 'cb7dc40432809734549c1afcaab0e84478b2e0b73e3ea6d77cb0ea93bf407b98', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 12147, hash: 'ea79230653c41205f4432560ff8c1259718827a3fb79c2f0de04c45dbbe22cfa', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
