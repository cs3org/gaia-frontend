import nano from 'cssnano';
import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgr from 'esbuild-plugin-svgr';
import { parseArgs } from 'node:util';
import postcss from 'postcss';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';

const options = {
  host: {
    type: 'string',
    short: 'h',
    default: process.env.host || 'localhost',
  },
  port: {
    type: 'string',
    short: 'p',
    default: process.env.port || '8000',
  },
  keyfile: {
    type: 'string',
    short: 'k',
  },
  certfile: {
    type: 'string',
    short: 'c',
  },
  outdir: {
    type: 'string',
    short: 'o',
    default: process.env.outdir || './dist',
  },
  base: {
    type: 'string',
    short: 'b',
    defaut: process.env.base || '/',
  },
};

let {
  values: { host, port, keyfile, certfile, outdir, base },
  positionals,
} = parseArgs({ args: process.argv, options, allowPositionals: true });
const mode = positionals.length >= 3 ? positionals[2] : null;

if (!['serve', 'build'].includes(mode)) {
  showUsage();
}

function showUsage() {
  console.log('serve -h <host> -p <port> -k <keyfile> -c <certfile> | build -o <outdir> -b <base>');
  process.exit(0);
}

console.clear();

const commonOptions = {
  entryPoints: ['src/app.jsx'],
  loader: {
    '.js': 'jsx',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'file',
    '.gif': 'file',
  },
  jsx: 'automatic',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  bundle: true,
  assetNames: 'assets/[name]',
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.json'],
  plugins: [
    svgr({
      jsxRuntime: 'classic-preact',
      plugins: ['@svgr/plugin-jsx'],
    }),
    sassPlugin({
      type: 'style',
      async transform(source) {
        const { css } = await postcss([nano]).process(source, { from: undefined });
        return css;
      },
    }),
    copy({
      assets: [
        {
          from: ['./src/assets/**/*.{png,woff2,json}'],
          to: ['./assets'],
        },
      ],
      watch: true,
    }),
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/app.jsx'],
          filename: 'index.html',
          htmlTemplate: './src/index.html.template',
          define: {
            base,
          },
        },
      ],
    }),
  ],
};

const serveOptions = {
  outdir: 'serve',
  sourcemap: true,
  banner: {
    js: 'new EventSource("/esbuild").addEventListener("change", () => location.reload());',
  },
};

const buildOptions = {
  outdir,
  minify: true,
  treeShaking: true,
  metafile: true,
};

if (mode === 'serve') {
  process.env.NODE_ENV = 'development';
  let ctx = await esbuild.context({ ...commonOptions, ...serveOptions });
  await ctx.watch();
  await ctx.serve({ servedir: 'serve', host, port: parseInt(port, 10), keyfile, certfile });

  console.log(
    `\x1b[33;1m⚡\x1b[0mWeb is live at \x1b[32;49;1;4m${
      keyfile && certfile ? 'https' : 'http'
    }://${host}:${port}\x1b[0m \x1b[33;1m⚡\x1b[0m`
  );
}

if (mode === 'build') {
  const result = await esbuild.build({ ...commonOptions, ...buildOptions });

  console.log(
    await esbuild.analyzeMetafile(result.metafile, {
      verbose: true,
    })
  );

  console.log(
    `\x1b[33;1m⚡\x1b[0m Build complete in '\x1B[32m${outdir}\x1b[0m' \x1b[33;1m⚡\x1b[0m`
  );
}
