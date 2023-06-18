export const SITE = {
  title: 'Cannnon-es',
  description: 'Your website description.',
  defaultPage: 'docs',
} as const;

export const OPEN_GRAPH = {
  image: {
    src: 'https://github.com/withastro/astro/blob/main/.github/assets/banner.png?raw=true',
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground',
  },
  twitter: 'astrodotbuild',
};

export const SITE_GRPH = {
  Docs: 'docs',
  Example: 'examples',
} as const;
export const SITE_GRPH_CODES = Object.values(SITE_GRPH);

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
  (typeof SITE_GRPH_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  docs: {
    'Getting Started': [
      { text: 'Introduction', link: 'introduction' },
      { text: 'Page 2', link: 'page-2' },
      { text: 'Page 3', link: 'page-3' },
      { text: 'Home', link: 'home' },
    ],
  },
  examples: {
    'Another Section': [{ text: 'Page 4', link: 'examples/page-4' }],
  },
};
