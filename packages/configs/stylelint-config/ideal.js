module.exports = {
  ignoreFiles: [
    'nebula-css/tools/*',
    'nebula-css/resets/_normalize.scss',
    'demo/dist/main.css',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss',
    'stylelint-declaration-use-variable',
    'stylelint-declaration-strict-value',
  ],
  rules: {
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'font-size'],
      {
        ignoreKeywords: ['currentColor', 'transparent', 'inherit'],
      },
    ],
    'color-hex-case': 'lower',
    'color-named': [
      'never',
      {
        ignore: ['inside-function'],
      },
    ],
    'color-no-invalid-hex': true,
    'color-no-hex': true,
    'selector-max-id': 0,
    'selector-class-pattern': '',
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute'],
      },
    ],
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/at-extend-no-missing-placeholder': true,
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/at-mixin-argumentless-call-parentheses': 'never',
    'selector-max-class': 2,
    'scss/dollar-variable-pattern': [
      '^(bolt-|_)[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
      {
        ignore: ['local'],
      },
    ],
    'scss/percent-placeholder-pattern': '^(bolt-)[a-z]+([a-z0-9-]+[a-z0-9]+)?$',
    'scss/at-function-pattern': '^(bolt-|_)[a-z0-9\\-]+$',
    'scss/at-mixin-pattern': '^(bolt-|_)[a-z0-9\\-]+$',
    // https://github.com/davidtheclark/stylelint-selector-bem-pattern
    // https://github.com/xi/stylelint-selector-pattern/blob/master/lib/presets.js
    // "xi/selector-pattern": ["^\.(o-|c-|u-|t-|s-|is-|has-|_|js-|qa-)[a-z0-9-_\>\. \%]+$", {
    //   "filter": "^\\."
    // }],

    'at-rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'blockless-after-blockless', 'inside-block'],
      },
    ],
    'no-duplicate-selectors': true,
    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always-single-line',
    'at-rule-semicolon-newline-after': 'always',
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else', 'elseif'],
      },
    ],
    'block-closing-brace-newline-before': 'always-multi-line',
    'block-closing-brace-space-before': 'always-single-line',
    'block-no-empty': true,
    'block-opening-brace-newline-after': 'always-multi-line',
    'block-opening-brace-space-after': 'always-single-line',
    'block-opening-brace-space-before': [
      'always',
      {
        ignoreAtRules: ['if', 'else', 'elseif'],
      },
    ],
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-block-no-shorthand-property-overrides': true,
    'order/properties-order': [
      'all',
      'content',

      // Display
      'display',
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',
      'justify-content',
      'align-content',
      'align-items',
      'align-self',
      'place-content',
      'order',
      'box-sizing',
      'appearance',
      'visibility',
      'opacity',

      // Position
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'float',
      'clear',
      'transform',
      'z-index',

      // Size
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'overflow',

      // Space
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',

      // Font
      'font',
      'font-family',
      'font-style',
      'font-size',
      'font-size-adjust',
      'font-weight',
      'font-feature-settings',
      'font-kerning',
      'font-stretch',
      'font-synthesis',
      'font-optical-sizing',
      'font-language-override',
      'font-variant',
      'font-variant-alternates',
      'font-variant-caps',
      'font-variant-east-asian',
      'font-variant-ligatures',
      'font-variant-numeric',
      'font-variant-position',
      'font-variation-settings',

      // Text
      'list-style',
      'list-style-image',
      'list-style-position',
      'list-style-type',
      'counter-increment',
      'counter-reset',
      'color',
      'line-height',
      'text-align',
      'text-indent',
      'text-decoration',
      'text-transform',
      'text-shadow',
      'letter-spacing',
      'vertical-align',
      'cursor',
      'pointer-events',
      'user-select',

      // Border
      'border',
      'border-top',
      'border-top-color',
      'border-top-style',
      'border-top-width',
      'border-top-right-radius',
      'border-top-left-radius',
      'border-right',
      'border-right-color',
      'border-right-style',
      'border-right-width',
      'border-bottom',
      'border-bottom-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-left',
      'border-left-color',
      'border-left-style',
      'border-left-width',
      'border-radius',
      'border-width',
      'border-style',
      'border-color',
      'border-image',
      'border-image-outset',
      'border-image-repeat',
      'border-image-slice',
      'border-image-source',
      'border-image-width',
      'box-shadow',
      'outline',

      // Background
      'background',
      'background-attachment',
      'background-clip',
      'background-color',
      'background-image',
      'background-origin',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-repeat',
      'background-size',
      'backdrop-filter',

      // Advanced
      'filter',
      'clip',
      'backface-visibility',
      'will-change',
      'transition',
      'animation',
      'animation-delay',
      'animation-direction',
      'animation-duration',
      'animation-fill-mode',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
    ],
    'declaration-block-semicolon-newline-after': 'always-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-single-line-max-declarations': 1,
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-newline-after': 'always-multi-line',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'font-weight-notation': 'numeric',
    'function-calc-no-unspaced-operator': true,
    'function-comma-newline-after': 'always-multi-line',
    'function-comma-space-after': 'always-single-line',
    'function-comma-space-before': 'never',
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-max-empty-lines': 0,
    'function-name-case': 'lower',
    'function-parentheses-newline-inside': 'always-multi-line',
    'function-parentheses-space-inside': 'never-single-line',
    'function-url-quotes': 'always',
    'function-whitespace-after': 'always',
    indentation: [
      2,
      {
        ignore: ['inside-parens', 'param', 'value'],
      },
    ],
    'keyframe-declaration-no-important': true,
    'length-zero-no-unit': true,
    'max-empty-lines': 4,
    'max-nesting-depth': [
      1,
      {
        ignore: ['blockless-at-rules'],
        ignoreAtRules: ['media', 'function', 'if', 'for'],
      },
    ],
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'media-query-list-comma-newline-after': 'always-multi-line',
    'media-query-list-comma-space-after': 'always-single-line',
    'media-query-list-comma-space-before': 'never',

    'no-empty-source': true,
    'no-eol-whitespace': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'no-missing-end-of-source-newline': true,
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    'property-case': 'lower',
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: [
          'grid-rows',
          'grid-columns',
          'grid-column',
          'grid-column-span',
          'grid-row',
          'grid-row-span',
        ],
      },
    ],
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['grid'],
      },
    ],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    'selector-list-comma-newline-after': 'always',
    'selector-list-comma-space-before': 'never',
    'selector-max-empty-lines': 0,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'single',
    'selector-pseudo-element-no-unknown': true,
    'selector-type-case': 'lower',
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'],
      },
    ],
    'shorthand-property-no-redundant-values': true,
    'string-no-newline': null,
    'string-quotes': 'single',
    'unit-case': 'lower',
    'unit-no-unknown': true,
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never',
  },
};
