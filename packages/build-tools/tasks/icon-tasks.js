const resolve = require('resolve');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob-promise');
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const Ora = require('ora');
const chalk = require('chalk');
const { getConfig } = require('@bolt/build-utils/config-store');
const prettier = require('prettier');
const camelcase = require('camelcase');
const { svgo } = require('@bolt/build-utils/svgo-config');
const { parse, stringify } = require('svgson');

const messages = {
  mainTask: 'generating the Bolt Element Icon schema and icon files',
  initIcons: 'preparing Icon tasks',
  generateIcons: 'generating Icons',
  updateSchema: 'updating Icon schema',
};

async function getOptions() {
  const iconModule = await new Promise((accept, reject) => {
    resolve(`@bolt/elements-icon`, (err, res) => {
      err ? reject(err) : accept(res);
    });
  });
  const iconModuleDir = path.parse(iconModule).dir;
  const iconSvgs = await glob(
    path.resolve(iconModuleDir, 'src/icons/svgs/*.svg'),
  );

  const iconData = iconSvgs.reduce((arr, item) => {
    const iconName = path.basename(item, path.extname(item));
    if (item && iconName) {
      return arr.concat({ iconName, iconPath: item });
    } else {
      return arr;
    }
  }, []);

  return {
    iconData,
    iconPrefix: 'icon',
    twigDirPath: path.resolve(iconModuleDir, 'src/icons/twig'),
    jsDirPath: path.resolve(iconModuleDir, 'src/icons/js'),
    jsFilePath: path.resolve(iconModuleDir, 'src/icon.js'),
    schemaFilePath: path.resolve(iconModuleDir, 'icon.schema.json'),
  };
}

function iconJsTemplate(formattedName, iconData) {
  return (
    `// THIS IS AN AUTOGENERATED FILE\nimport { getSvg } from '../../icon-lib';\n` +
    `export function ${formattedName}(props) {\n` +
    `  return getSvg(${JSON.stringify(iconData)}, props);\n` +
    `};\n`
  );
}

// TODO: Save for Webpack 5
// function iconRowTemplate(formattedName, iconData) {
//   return (
//     `export function ${formattedName}(props) {\n` +
//     `  return getSvg(${JSON.stringify(iconData)}, props);\n` +
//     `};\n`
//   );
// }

function iconTwigTemplate(iconData) {
  const modifiedData = {
    ...iconData,
    attributes: {
      ...iconData.attributes,
      'aria-hidden': true,
    },
  };
  const iconString = stringify(modifiedData);
  const twigTokens = `{{ attributes.addClass(classes)|without('aria-hidden') }}`;
  const modifiedIconString = iconString.replace(
    /<svg /i,
    `<svg ${twigTokens} `,
  );
  return `{# THIS IS AN AUTOGENERATED FILE #}\n` + modifiedIconString;
}

async function updateSchema(iconData, schemaFilePath) {
  const config = await getConfig();
  const iconNames = iconData.map(item => item.iconName);
  const schemaFile = await fs.readFile(schemaFilePath);
  const schema = JSON.parse(schemaFile);
  schema.properties.name.enum = iconNames;

  // Write schema file
  await fs.writeFile(
    schemaFilePath,
    prettier.format(JSON.stringify(schema), {
      parser: 'json',
    }),
  );

  // Write Bolt data
  await fs.writeFile(
    path.resolve(config.dataDir, 'element-icons.bolt.json'),
    JSON.stringify(iconNames, null, 4),
  );
}

async function build() {
  const iconSpinner = new Ora(chalk.blue(`Started ${messages.mainTask}`));
  const opts = await getOptions();
  const {
    iconData,
    iconPrefix,
    twigDirPath,
    jsDirPath,
    jsFilePath, // TODO: Save for Webpack 5
    schemaFilePath,
  } = opts;

  iconSpinner.start();

  // Prepare icon tasks
  try {
    // Twig
    await fs.rmdir(twigDirPath, { recursive: true });
    await fs.mkdir(twigDirPath);

    // JS
    await fs.rmdir(jsDirPath, { recursive: true });
    await fs.mkdir(jsDirPath);

    // TODO: Save for Webpack 5
    // await fs.writeFile(
    //   jsFilePath,
    //   "// THIS IS AN AUTOGENERATED FILE\nimport { getSvg } from './icon-lib';\n",
    // );
  } catch (error) {
    iconSpinner.fail(chalk.red(`Error ${messages.initIcons}: ${error}`));
    process.exit(1);
  }

  // Generate icons
  try {
    // Intentionally using await-in-loop so that files are always written in the same order. Otherwise, we get unwanted file changes.
    /* eslint-disable no-await-in-loop */
    for (const icon of iconData) {
      const { iconName, iconPath } = icon;
      const formattedName = camelcase([iconPrefix, iconName]);
      const svgStrRaw = await fs.readFile(iconPath, 'utf8');
      const svgStr = await svgo.optimize(svgStrRaw).then(result => result.data);
      const iconSvgData = await parse(svgStr);

      // JS
      await fs.writeFile(
        path.resolve(jsDirPath, `${iconName}.js`),
        iconJsTemplate(formattedName, iconSvgData),
      );

      // TODO: Save for Webpack 5
      // await fs.appendFile(jsFilePath, iconJsModule, 'utf8');

      // Twig
      await fs.writeFile(
        path.resolve(twigDirPath, `${iconName}.twig`),
        iconTwigTemplate(iconSvgData),
      );
    }
  } catch (error) {
    iconSpinner.fail(chalk.red(`Error ${messages.generateIcons}: ${error}`));
    process.exit(1);
  }

  // Update Icon schema
  try {
    await updateSchema(iconData, schemaFilePath);
  } catch (error) {
    iconSpinner.fail(chalk.red(`Error ${messages.updateSchema}: ${error}`));
    process.exit(1);
  }

  iconSpinner.succeed(chalk.green(`Finished ${messages.mainTask}!`));
}

build.description = 'Minify & convert raw SVG files to browser-friendly icons.';
build.displayName = 'icons:build';

async function watch() {
  try {
    const config = await getConfig();
    const debouncedCompile = debounce(build, config.debounceRate);
    // Note: points to the actual source folder, not the module in node_modules as iconModuleDir does
    const watchedFiles = path.resolve(
      '../packages/elements/bolt-icon/src/icons/svgs',
    );

    // The watch event ~ same engine gulp uses https://www.npmjs.com/package/chokidar
    const watcher = chokidar.watch(watchedFiles, {
      ignoreInitial: true,
      cwd: process.cwd(),
      ignored: ['**/node_modules/**', '**/vendor/**'],
    });
    // list of all events: https://www.npmjs.com/package/chokidar#methods--events
    watcher.on('all', (event, path) => {
      if (config.verbosity > 3) {
        console.log('Re-building Bolt Icon: ', event, path);
      }
      debouncedCompile();
    });
  } catch (error) {
    chalk.red(`Error ${messages.mainTask}: ${error}`);
    process.exit(1);
  }
}

watch.description = 'Watch and rebuild Bolt Element Icons';
watch.displayName = 'icons:watch';

module.exports = {
  build,
  watch,
};
