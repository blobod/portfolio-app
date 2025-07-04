
export default {
  basePath: 'https://blobod.github.io/portfolio-app',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
