import { polyfillLoader } from '@bolt/core';

polyfillLoader.then((res) => {
  import(/* webpackMode: 'eager', webpackChunkName: 'bolt-button' */ './button.standalone.js');
});