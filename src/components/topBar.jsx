import { h } from 'preact';

import { createBuildUrl } from '../utils';

import platforms from '../assets/platforms.json';

function TopBar({ platform, modules, platformHandler }) {
  const buildUrl = createBuildUrl(platform, modules);

  return (
    <nav className="topbar">
      <div className="group">
        <label for="platform">Platform</label>
        <select id="platform" onChange={platformHandler}>
          {platforms.map(p => (
            <option value={p.id} selected={p.id === platform}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      Modules selected: {modules.length}
      <a href={buildUrl}>Build</a>
    </nav>
  );
}

export default TopBar;
