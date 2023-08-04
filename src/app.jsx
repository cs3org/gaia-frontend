import { Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Footer from './components/footer';
import Header from './components/header';
import ModuleList from './components/moduleList';
import TopBar from './components/topBar';

import settings from './settings.js';
import './styles/main.scss';

const App = () => {
  const searchParams = new URL(window.location).searchParams;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'linux-amd64');
  const [modules, setModules] = useState(searchParams.getAll('module') || []);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(settings.dataUrl);
      const d = await res.json();
      setData(settings.dataTransform(d));
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const handleModuleClick = module => {
    setModules(cm => (cm.includes(module) ? cm.filter(m => m !== module) : [...cm, module]));
  };

  const handlePlatformSelect = e => {
    setPlatform(e.target.value);
  };

  const newParams = new URLSearchParams();
  newParams.append('platform', platform);
  modules.forEach(s => newParams.append('module', s));
  history.pushState(null, '', `?${newParams.toString()}`);

  return (
    <Fragment>
      <Header />
      <main>
        <TopBar platform={platform} modules={modules} platformHandler={handlePlatformSelect} />
        <ModuleList
          loading={loading}
          modules={data}
          filter={filter}
          filterHandler={handleFilterChange}
          selection={modules}
          selectionHandler={handleModuleClick}
        />
      </main>
      <Footer />
    </Fragment>
  );
};

const root = document.querySelector('body');

render(<App />, root);
