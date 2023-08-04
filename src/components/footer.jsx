import { h } from 'preact';

import CernLogo from '../assets/cern-logo.svg';

function Footer() {
  return (
    <footer>
      <CernLogo />
      <div>
        <p>
          Reva is used every day at CERN to power CERNBox's backend. CERNBox is CERN's cloud sync &
          storage solution and collaborative platform, which counts with more than 32,000 users and
          10 PB of data.
        </p>
        <p>
          <small>© 2023 The Reva Authors All Rights Reserved</small>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
