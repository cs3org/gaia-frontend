import { h } from 'preact';

import RevaLogo from '../assets/reva-logo.svg';

function Header() {
  return (
    <header>
      <div>
        <RevaLogo />
        <h1>Gaia</h1>
      </div>
      <div>
        <a href="https://reva.link/">Reva</a>
        <a href="https://reva.link/docs/">Documentation</a>
        <a href="https://reva.link/community/">Community</a>
        <a href="https://github.com/cs3org/reva">GitHub</a>
      </div>
    </header>
  );
}

export default Header;
