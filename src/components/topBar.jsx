import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { createBuildUrl } from '../utils';

import Loading from '../assets/loading.svg';
import platforms from '../assets/platforms.json';

function TopBar({ platform, modules, platformHandler }) {
  const [downloading, setDownloading] = useState(false);
  const buildUrl = createBuildUrl(platform, modules);
  const aRef = useRef();

  const handleBuildClick = e => {
    e.preventDefault();
    setDownloading(true);
  };

  useEffect(() => {
    const prepareAndFetchBuild = async () => {
      let res;

      try {
        res = await fetch(buildUrl);
      } catch (err) {
        alert('Something went wrong, try again later.');
        setDownloading(false);
      }

      if (res.status > 199 && res.status < 300) {
        const filename = res.headers.get('content-disposition').match(/"(?<filename>.*?)"/)
          .groups.filename;
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        aRef.current.href = url;
        aRef.current.download = filename;
        aRef.current.click();
      } else {
        alert('Something went wrong, try again later.');
        setDownloading(false);
      }

      setDownloading(false);
    };

    if (downloading) {
      prepareAndFetchBuild();
    }
  }, [downloading]);

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
      <a className={!downloading ? '' : 'downloading'} href={buildUrl} onClick={handleBuildClick}>
        {!downloading ? 'Build' : <Loading />}
      </a>
      <a className="displaynone" tabIndex="-1" ref={aRef}></a>
    </nav>
  );
}

export default TopBar;
