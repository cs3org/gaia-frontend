import platforms from './assets/platforms.json';
import settings from './settings.js';

const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return new Uint32Array([hash])[0].toString(36);
};

function createInvariant(platform, modules) {
  const sortedModules = modules.sort();
  const invariantString = `${platform}-${sortedModules.join('+')}`;

  return simpleHash(invariantString);
}

export function createBuildUrl(platform, modules) {
  const p = platforms.find(p => p.id === platform);
  const request = {
    os: p.os,
    arch: p.arch,
    plugin: modules.map(m => `${m}@latest`),
    version: settings.revaVersion,
  };

  const searchParams = new URLSearchParams(request);
  const buildUrl = new URL(`${window.location.origin}/download`);
  searchParams.forEach((v, k) => buildUrl.searchParams.append(k, v));
  buildUrl.searchParams.append('invariant', createInvariant(platform, modules));

  return buildUrl;
}
