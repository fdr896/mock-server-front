import React from 'react';

import { Button } from '@mui/material';

function NavBar({appModes, setAppMode, className}) {
  return (
  <div className={className}>
    <h2>Server modes:</h2>
      {Object.keys(appModes).map((modeName, index) => {
        return (
          <div
            key={`div_for_${modeName}_${index}`}
            style={{marginBottom: '2em'}}>
            <Button
              key={modeName}
              variant='contained'
              onClick={() => setAppMode(appModes[modeName])}
            >
              {appModes[modeName]}
            </Button>
          </div>
        );
      })}
  </div>
  );
}

export default NavBar;
