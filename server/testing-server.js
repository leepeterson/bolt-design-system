const { handleRequest } = require('@bolt/api');
const express = require('express');
const { join } = require('path');
const globby = require('globby');
const app = express();
const path = require('path');

const port = process.env.PORT || 4444;

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const { buildPrep } = require('../packages/build-tools/tasks/task-collections');

const allComponentsWithTests = globby
  .sync(path.join(__dirname, '../', '/packages/components/**/__tests__'), {
    onlyDirectories: true,
  })
  .map(testsDirPath =>
    require(path.join(path.resolve(testsDirPath, '..'), 'package.json')),
  )
  .map(pkg => pkg.name);

// const webpackTasks = require('../packages/build-tools/tasks/webpack-tasks');
const createWebpackConfig = require('../packages/build-tools/create-webpack-config');
// const { buildPrep } = require('../packages/build-tools/tasks/task-collections');
// const imageTasks = require('../packages/build-tools/tasks/image-tasks');
const { getConfig } = require('../packages/build-tools/utils/config-store');
const imageTasks = require('../packages/build-tools/tasks/image-tasks');

getConfig().then(async boltConfig => {
  let config = boltConfig;
  await buildPrep(); // Generate folders, manifest data, etc needed for Twig renderer
  await imageTasks.processImages(); // process image fixtures used by any tests


  // don't compile anything in Webpack except for the exported JSON data from Bolt's Design Tokens + all packages with tests
  config.components.global = [
    './packages/core/styles/index.scss',
    '@bolt/global',
    // '@bolt/global/styles/06-themes/_themes.all.scss',
    ...allComponentsWithTests,
  ];

  config.components.individual = [];
  config.prod = true;
  config.sourceMaps = false;

  const webpackConfig = await createWebpackConfig(config);
  const compiler = webpack(webpackConfig);

  // This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
  function normalizeAssets(assets) {
    return Array.isArray(assets) ? assets : [assets];
  }

  // console.log(
  //   Object.assign(webpackConfig[0].devServer.stats, {
  //     serverSideRender: true,
  //   }),
  // );

  app.use(
    middleware(compiler, {
      serverSideRender: true,
      stats: webpackConfig[0].devServer.stats,
    }),
  );

  // The following middleware would not be invoked until the latest build is finished.
  app.use((req, res) => {
    const assetsByChunkName = res.locals.webpackStats.toJson().children[0]
      .assetsByChunkName;

    // then use `assetsByChunkName` for server-sider rendering
    // For example, if you have only one main chunk:
    res.send(
      `<html class="js-fonts-loaded">
        <head>
          <title>Test</title>
          ${normalizeAssets(assetsByChunkName['bolt-global'])
            .filter(path => path.endsWith('.css'))
            .map(path => `<link rel="stylesheet" href="${path}"/>`)
            .join('\n')}
        </head>
        <body>
          Hello world!
          <div id="root"></div>
          ${normalizeAssets(assetsByChunkName['bolt-global'])
            .filter(path => path.endsWith('.js'))
            .map(path => `<script src="${path}"></script>`)
            .join('\n')}
        </body>
      </html>`,
    );
  });

  // let port = 4444
  // const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
  // if (index !== -1) {
  //   port = +process.argv[index + 1] || port
  // }

  app.get(['/docs', '/docs/', '/docs/index.html'], (req, res) => {
    res.redirect('/docs/getting-started/index.html');
  });

  app.get('/pattern-lab/splash-screen', (req, res) => {
    res.redirect('/pattern-lab');
  });

  app.get('/favicon.ico', (req, res) => {
    res.redirect('/pattern-lab/favicons/favicon.ico');
  });

  app.use('/api', handleRequest);

  app.use(express.static(join(__dirname, '../www')));

  app.listen(port, () => {
    console.log(`Express listening on http://localhost:${port}`);
  });

  app.redirect;
});
