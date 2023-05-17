import React from 'react';

import { Button } from '@mui/material';

function NavBar({appModes, appMode, setAppMode, className}) {
  return (
  <div className={className}>
    <div key='modes'><h3>Server modes:</h3></div>
      {Object.keys(appModes).map((modeName, index) => {
        return (
          <>
          {appModes[modeName] === 'Static Mocks' ? <div key='static'> <h4> REST API mocks: </h4></div> : <></>}
          {appModes[modeName] === 'Rabbitmq mocks' ? <div key='rabbit'> <h4> Message queue mocks: </h4></div> : <></>}
          <div
            key={`div_for_${modeName}_${index}`}
            style={{marginBottom: '2em'}}>
            <Button
              key={modeName}
              variant='contained'
              style={{maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px'}}
              color={appModes[modeName] === appMode ? "success" : "primary"}
              onClick={() => setAppMode(appModes[modeName])}
            >
              {appModes[modeName]}
            </Button>
          </div>
          </>
        );
      })}
  </div>
  );
}

export default NavBar;
