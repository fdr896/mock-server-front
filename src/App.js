import React, { useState } from 'react';
import './App.css';

import NavBar from './NavBar';
import StaticRoutes from './StaticRoutes';
import DynamicRoutes from './DynamicRoutes';
import { InitManagers } from './managers/base_manager';

const AppMode = {
  StaticMocks: 'Static Mocks',
  DynamicMocks: 'Dynamic Mocks',
  MessageQueues: 'Message queue mocks',
};

function ShowAppService({appMode, className}) {
  switch (appMode) {
    case AppMode.StaticMocks:
      return <StaticRoutes className={className} />;
    case AppMode.DynamicMocks:
      return <DynamicRoutes className={className} />;
    case AppMode.MessageQueues:
      return <h1 className={className}>Not implemented, GO AWAY!</h1>;
    default:
      console.error("Invalid app mode");
  }
}

function App() {
  InitManagers();

  const [appMode, setAppMode] = useState(AppMode.DynamicMocks);

  return (
    <div className='same-row'>
      <NavBar
        appModes={AppMode}
        setAppMode={setAppMode}
        className='same-row'
      />
      <ShowAppService
        appMode={appMode}
        className='same-row'
      />
    </div>
  );
}

export default App;
