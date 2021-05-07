import { render, stopServer, renderWC } from '../../../testing/testing-helpers';
const componentSelector = 'bolt-breadcrumb';
let page, fixtures;

beforeEach(async () => {
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
  await page.setViewport({ width: 600, height: 200 });
});

beforeAll(async () => {
  page = await global.__BROWSER__.newPage();
  await page.goto('http://127.0.0.1:4444/', {
    timeout: 0,
  });

  const linkOne = await render('@bolt-components-link/link.twig', {
    text: 'Home',
    url: '#!',
  });

  const linkTwo = await render('@bolt-components-link/link.twig', {
    text: 'Other Page',
    url: '#!',
  });

  const linkThree = await render('@bolt-components-link/link.twig', {
    text: 'Sub Page',
    url: '#!',
  });

  fixtures = {
    linkOne,
    linkTwo,
    linkThree,
  };
});

afterAll(async () => {
  await stopServer();
  await page.close();
});

describe('Bolt Breadcrumb', () => {
  test('default', async () => {
    const results = await render(
      '@bolt-components-breadcrumb/breadcrumb.twig',
      {
        contentItems: [
          fixtures.linkOne.html,
          fixtures.linkTwo.html,
          fixtures.linkThree.html,
        ],
      },
    );

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
  });

  test('basic usage with contentItems including rendered components and strings', async () => {
    const linkFour = await render('@bolt-components-link/link.twig', {
      text: 'Sub Page',
      url: '#!',
      attributes: {
        'aria-current': true,
      },
    });
    const results = await render(
      '@bolt-components-breadcrumb/breadcrumb.twig',
      {
        contentItems: [
          fixtures.linkOne.html,
          fixtures.linkTwo.html,
          fixtures.linkThree.html,
          linkFour,
        ],
      },
    );

    await expect(results.ok).toBe(true);
    await expect(results.html).toMatchSnapshot();
  });
});
