const responsiveTables = document.querySelectorAll('.c-bolt-table');

if (responsiveTables.length) {
  import(/* webpackChunkName: 'bolt-responsive-table' */ './src/table').then(
    ({ BoltResponsiveTable }) => {
      responsiveTables.forEach(el => {
        const responsiveTableComponent = new BoltResponsiveTable(el);
      });
    },
  );
}
