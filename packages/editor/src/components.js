import * as grapesjs from 'grapesjs'; // eslint-disable-line no-unused-vars

/* eslint-disable no-unused-vars */

/**
 * @param {grapesjs.Editor} editor
 * @returns {void}
 */
export function setupComponents(editor) {
  /* eslint-enable no-unused-vars */
  const {
    /** @type {grapesjs.DomComponents} */
    DomComponents,
  } = editor;

  // const dType = DomComponents.getType('default');
  // const { model: dModel, view: dView } = dType;

  DomComponents.addType('bolt-list', {
    isComponent: el => el.tagName === 'BOLT-LIST',
    model: {
      defaults: {
        tagName: 'bolt-list',
        traits: [
          {
            name: 'display',
            type: 'select',
            options: [
              'inline',
              'block',
              'flex',
              'inline@xxsmall',
              'inline@xsmall',
              'inline@small',
              'inline@medium',
            ],
          },
        ],
      },
    },
  });

  DomComponents.addType('bolt-list', {
    isComponent: el => el.tagName === 'BOLT-LIST',
    model: {
      defaults: {
        tagName: 'bolt-list',
        traits: [
          {
            name: 'display',
            label: 'Display',
            type: 'select',
            options: [
              'inline',
              'block',
              'flex',
              'inline@xxsmall',
              'inline@xsmall',
              'inline@small',
              'inline@medium',
            ],
          },
        ],
      },
    },
  });

  DomComponents.addType('bolt-action-blocks', {
    isComponent: el => el.tagName === 'BOLT-ACTION-BLOCKS',
    model: {
      defaults: {
        tagName: 'bolt-action-blocks',
      },
    },
  });
}
