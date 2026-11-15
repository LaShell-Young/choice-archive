import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const feeds = [
  ...['en', 'de', 'es', 'fr', 'ja'].map((language) => ({
    file: `sonto-${language}.json`,
    url: `https://${language === 'en' ? 'sonto.tech' : `${language}.sonto.tech`}/data/articles-latest.json`,
  })),
  {
    file: 'healthcare-glossary.json',
    url: 'https://www.healthcare.gov/api/index.json',
    transform: (index) => ({
      glossary: index
        .filter((entry) => entry.categories?.includes('glossary') && entry.bite)
        .slice(0, 100)
        .map(({ title, url, bite }) => ({ title, url, bite })),
    }),
  },
];

const responseData = await Promise.all(
  feeds.map(async ({ file, url, transform }) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not stage ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { file, data: transform ? transform(data) : data };
  }),
);

const outputDirectory = join(process.cwd(), 'public', 'data');
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  responseData.map(({ file, data }) =>
    writeFile(join(outputDirectory, file), `${JSON.stringify(data)}\n`),
  ),
);

console.log(`Staged ${responseData.length} public data feeds in ${outputDirectory}.`);
