import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: 'standalone', // Outputs a Single-Page Application (SPA).
    distDir: './dist', // Changes the build output directory to `./dist/`.
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    eslint: {
        ignoreDuringBuilds: !!process.env.NO_LINT,
    },
    typescript: {
        ignoreBuildErrors: !!process.env.NO_TYPECHECK,
    },
    webpack(config: any) {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));
        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        /* Note: warning in webpack does not introduce bugs the ProductJourney.tsx
        ./node_modules/web-worker/node.js
        Critical dependency: the request of a dependency is an expression

        Import trace for requested module:
        ./node_modules/web-worker/node.js
        ./node_modules/geotiff/dist-module/worker/decoder.js
        ./node_modules/geotiff/dist-module/pool.js
        ./node_modules/geotiff/dist-module/geotiff.js
        ./node_modules/ol/source/GeoTIFF.js
        ./node_modules/ol/source.js
        ./src/app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/ProductJourney.tsx
        */

        return config;
    },
};

export default withNextIntl(nextConfig);
