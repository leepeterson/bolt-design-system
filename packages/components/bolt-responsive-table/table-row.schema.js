module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Table Row',
  type: 'object',
  properties: {
    attributes: {
      type: 'object',
      description:
        'A Drupal attributes object. Applies extra HTML attributes to the &lt;bolt-responsive-table&gt; tag.',
    },
    content: {
      type: 'object',
      description:
        'Generates single table row &lt;tr&gt; tag with table cells.',
    },
  },
};
