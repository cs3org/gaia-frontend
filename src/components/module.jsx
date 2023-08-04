import { h } from 'preact';

function Module({ module, downloads, plugins, selected, moduleHandler }) {
  const nameParts = module.split('/');

  const site = `${nameParts.shift()}/`;
  const name = `${nameParts.join('/')}`;

  const handleModuleClick = () => {
    moduleHandler(module);
  };

  const handleNameClick = e => {
    e.stopPropagation();
  };

  return (
    <button
      id={module}
      className={`module ${selected ? ' selected' : ''}`}
      onClick={handleModuleClick}
    >
      <div className="title">
        <span>📦</span>
        <div className="name">
          <a onClick={handleNameClick} href={`https://${module}`} target="_blank">
            {site}
            <br />
            <h1>{name}</h1>
          </a>
        </div>
        <small>
          <strong>downloads:</strong> {downloads}
        </small>
      </div>
      <ul>
        {plugins.map(plugin => (
          <li>
            <span className="plugin-name">🔌 {plugin.name}</span>
            <span className="plugin-description">{plugin.description}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

export default Module;
