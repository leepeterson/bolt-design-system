import * as grapesjs from 'grapesjs';
import { html, render } from '@bolt/core';
import { query } from '@bolt/core/utils';
import { setupPanels } from './panels';
import { setupBlocks } from './blocks';
import { setupComponents } from './components';
import { setupBolt } from './setup-bolt';
import { addThemeContextClasses } from './utils';

/**
 * @param {Object} opt
 * @param {HTMLElement} opt.space
 * @param {HTMLElement} opt.uiWrapper
 * @param {grapesjs.BoltEditorConfig} opt.config
 * @return {grapesjs.Editor}
 */
export function enableEditor({ space, uiWrapper, config }) {
  /** @type {{ [key: string]: HTMLElement }} */
  const editorSlots = {
    buttons: uiWrapper.querySelector('.pega-editor-ui__buttons'),
    layers: uiWrapper.querySelector('.pega-editor-ui__slot--layers'),
    traits: uiWrapper.querySelector('.pega-editor-ui__traits'),
    componentMeta: uiWrapper.querySelector('.pega-editor-ui__component-meta'),
    slotControls: uiWrapper.querySelector('.pega-editor-ui__slot-controls'),
    blocks: uiWrapper.querySelector('.pega-editor-ui__slot--blocks'),
  };

  const stylePrefix = 'pega-editor-';

  /** @type {grapesjs.EditorConfig} */
  const editorConfig = {
    container: space,
    fromElement: true,
    autorender: false,
    // height: '100vh',
    // width: 'auto',
    plugins: [setupBolt, setupComponents, setupPanels, setupBlocks],
    noticeOnUnload: false,
    panels: {
      stylePrefix: `${stylePrefix}panels-`,
      defaults: [
        {
          id: 'uiWrapper',
          el: uiWrapper,
          resizable: {
            tc: true,
            cr: false,
            cl: false,
            bc: false,
          },
        },
        {
          id: 'buttons',
          el: editorSlots.buttons,
          resizable: {
            tc: false,
            cr: false,
            cl: false,
            bc: false,
          },
          buttons: [
            {
              command: 'core:undo',
              id: 'undo',
              label: 'Undo',
              // className: 'fa fa-undo',
              // attributes: { title: 'Undo' },
            },
            {
              command: 'core:redo',
              id: 'redo',
              label: 'Redo',
              // className: 'fa fa-repeat',
              // attributes: { title: 'Redo' },
            },
            {
              id: 'fullscreen',
              label: 'Full Screen',
              command: 'core:fullscreen',
              attributes: { title: 'Full Screen' },
            },
            {
              id: 'visibility',
              active: false,
              label: 'Toggle Borders',
              command: 'sw-visibility', // Built-in command
            },
            {
              id: 'export',
              className: 'btn-open-export',
              label: 'Export Template',
              command: 'export-template',
            },
            {
              command: 'core:canvas-clear',
              id: 'canvas-clear',
              label: 'Clear Canvas',
            },
            {
              command: 'core:component-delete',
              id: 'component-delete',
              label: 'Delete',
            },
            // @todo why no work?
            // {
            //   command: 'core:component-prev',
            //   id: 'component-prev',
            //   label: 'Prev',
            // },

            {
              id: 'device-mobile',
              label: 'Mobile',
              togglable: true,
              command: {
                run: editor => editor.setDevice('Mobile'),
                stop: editor => editor.setDevice('Full'),
              },
            },
            {
              id: 'device-tablet',
              label: 'Tablet',
              togglable: true,
              command: {
                run: editor => editor.setDevice('Tablet'),
                stop: editor => editor.setDevice('Full'),
              },
            },
            {
              id: 'device-desktop',
              label: 'Desktop',
              togglable: true,
              command: {
                run: editor => editor.setDevice('Desktop'),
                stop: editor => editor.setDevice('Full'),
              },
            },
            {
              id: 'trigger-anim-in',
              label: 'Trigger Anim In',
              command: {
                run: editor => {
                  const component = editor.getSelected();
                  if (component.is('bolt-animate')) {
                    const el = component.getEl();
                    el.triggerAnimIn();
                  }
                },
              },
            },
            {
              id: 'show-json',
              className: 'btn-show-json',
              label: 'Show JSON',
              // attributes: { title: 'Show JSON' },
              command(editor) {
                editor.Modal.setTitle('Components JSON')
                  .setContent(
                    `<textarea style="width:100%; height: 250px;">
                      ${JSON.stringify(editor.getComponents(), null, '  ')}
                    </textarea>`,
                  )
                  .open();
              },
            },
          ],
        },
        {
          id: 'blocks',
          el: editorSlots.blocks,
          resizable: {
            tc: false,
            cr: false,
            cl: false,
            bc: false,
          },
        },
      ],
    },
    storageManager: { type: null },
    layerManager: {
      appendTo: editorSlots.layers,
    },
    traitManager: {
      appendTo: editorSlots.traits,
    },
    blockManager: {
      appendTo: editorSlots.blocks,
      blocks: [],
    },
    deviceManager: {
      devices: [
        { name: 'Mobile', width: '400px' },
        { name: 'Tablet', width: '700px' },
        { name: 'Desktop', width: '1100px' },
        { name: 'Full', width: '100%' },
      ],
    },
    styleManager: { type: null },
    assetManager: {
      assets: [
        'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
        // Pass an object with your properties
        {
          type: 'image',
          src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
          height: 350,
          width: 250,
        },
        {
          // As the 'image' is the base type of assets, omitting it will
          // be set as `image` by default
          src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
          height: 350,
          width: 250,
        },
      ],
    },
    canvas: {
      // assigning this overrides the default of `cv-` which prevents the layout styles from hitting it
      stylePrefix: `${stylePrefix}canvas-`,
      styles: config.styles,
    },
    // rte: {
    //   actions: false,
    // },
  };

  const editor = grapesjs.init(editorConfig);

  editor.TraitManager.addType('drupal-media-manager', {
    createInput({ trait }) {
      const el = document.createElement('div');
      el.innerHTML = `
<button>Upload to Drupal Media Manager</button>
    `;

      return el;
    },
  });

  /**
   * @param {Object} opt
   * @param {string} opt.slotName
   * @param {grapesjs.ComponentObject} opt.data
   * @param {boolean} [opt.shouldCreateAnimatableSlotIfNotPresent=true]
   * @return {grapesjs.Component}
   */
  function addComponentToSelectedComponentsSlot({
    slotName,
    data,
    shouldCreateAnimatableSlotIfNotPresent = true,
  }) {
    const selected = editor.getSelected();
    const components = selected.components();
    const slots = selected.find('[slot]');
    const [slot] = selected.find(`[slot="${slotName}"]`);
    if (slot) {
      const slotComponents = slot.components();
      return slotComponents.add(data);
    } else {
      const [newSlot] = selected.append(
        shouldCreateAnimatableSlotIfNotPresent
          ? `<bolt-animate slot="${slotName}"></bolt-animate>`
          : `<div slot="${slotName}"></div>`,
      );
      const slotComponents = newSlot.components();
      return slotComponents.add(data);
    }
  }

  /**
   * @param {Object} opt
   * @param {grapesjs.SlotControl[]} opt.slotControls
   */
  function renderSlotControls({ slotControls }) {
    if (!slotControls) {
      render(html``, editorSlots.slotControls);
      return;
    }

    const slotControlMarkup = slotControls.map(({ slotName, components }) => {
      return html`
        <h4>${slotName}</h4>
        <select
          @change=${event => {
            const { value } = event.target;
            if (value === 'none') return;
            const component = components.find(c => c.id === value);
            const newComponent = addComponentToSelectedComponentsSlot({
              slotName,
              data: component.data,
            });
            event.target.value = 'none';
          }}
        >
          <option value="none">(Add component to slot)</option>
          ${components.map(
            component => html`
              <option value="${component.id}">${component.title}</option>
            `,
          )}
        </select>
      `;
    });

    const content = html`
      <h2>Slots</h2>
      ${slotControlMarkup}
    `;
    render(content, editorSlots.slotControls);
  }

  editor.on('component:selected', (/** @type {grapesjs.Component} */ model) => {
    const name = model.getName().toLowerCase();
    const slotControls = model.getSlotControls && model.getSlotControls();
    window.x = model;
    renderSlotControls({ slotControls });
  });

  editor.on('component:deselected', model => {
    render(html``, editorSlots.slotControls);
  });

  editor.render();
  const canvasDoc = editor.Canvas.getDocument();
  const canvasWindow = editor.Canvas.getWindow();
  const canvasWrapper = editor.Canvas.getWrapperEl();

  addThemeContextClasses({ space, canvasWrapper });

  canvasDoc.body.classList.add('in-editor');

  config.scripts.forEach(script => {
    const scriptEl = canvasDoc.createElement('script');
    scriptEl.src = script;
    scriptEl.async = true;
    canvasDoc.body.appendChild(scriptEl);
  });

  // helpful to access current editor instance in console with `editor`
  window['editor'] = editor; // eslint-disable-line dot-notation

  let dropzoneSelector = '';

  function addDropzoneHighlights() {
    const dropzones = query(dropzoneSelector, canvasDoc);
    if (!dropzones) return;
    dropzones.forEach(el => {
      const isEmpty = el.children.length === 0;
      el.style.outline = 'dotted green 1px';
    });
  }

  function removeDropzoneHighlights() {
    const dropzones = query(dropzoneSelector, canvasDoc);
    if (!dropzones) return;
    dropzones.forEach(el => {
      el.style.outline = '';
    });
    dropzoneSelector = '';
  }

  editor.on('block:drag:start', block => {
    const { id } = block;
    const component = editor.DomComponents.getType(id);
    const { droppable, draggable } = component.model.prototype.defaults;
    if (typeof droppable === 'string') {
      dropzoneSelector = droppable;
      addDropzoneHighlights();
    }
  });

  editor.on('block:drag:stop', (componentModel, blockModel) => {
    if (dropzoneSelector) {
      removeDropzoneHighlights();
    }
  });

  // Global hooks
  // editor.on(`component:create`, model =>
  //   console.log('Global hook: component:create', model.get('type')),
  // );
  // editor.on(`component:mount`, model =>
  //   console.log('Global hook: component:mount', model.get('type')),
  // );
  // how to have an event for just a specific prop: `testprop`
  // editor.on(`component:update:testprop`, model =>
  //   console.log('Global hook: component:update:testprop', model.get('type')),
  // );
  // editor.on(`component:remove`, model =>
  //   console.log('Global hook: component:remove', model.get('type')),
  // );
  return editor;
}