import React, { useState } from 'react';
import './App.css';

import NavBar from './NavBar';
import StaticRoutes from './StaticRoutes';
import ProxyRoutes from './ProxyRoutes';
import DynamicRoutes from './DynamicRoutes';
import RabbitmqBrokers from './RabbitmqBrokers';
import KafkaBrokers from './KafkaBrokers';
import EsbBrokers from './EsbBrokers';
import { InitManagers } from './managers/base_manager';

const AppMode = {
  StaticMocks: 'Static Mocks',
  DynamicMocks: 'Dynamic Mocks',
  ProxyRoutes: 'Proxy Mocks',
  RabbitmqBrokers: 'Rabbitmq mocks',
  KafkaBrokers: 'Kafka mocks',
  EsbBrokers: 'ESB mocks'
};

function ShowAppService({appMode, className}) {
  switch (appMode) {
    case AppMode.StaticMocks:
      return <StaticRoutes className={className} />;
    case AppMode.ProxyRoutes:
      return <ProxyRoutes className={className} />;
    case AppMode.DynamicMocks:
      return <DynamicRoutes className={className} />;
    case AppMode.RabbitmqBrokers:
      return <RabbitmqBrokers className={className} />;
    case AppMode.KafkaBrokers:
      return <KafkaBrokers className={className} />;
    case AppMode.EsbBrokers:
      return <EsbBrokers className={className} />;
    default:
      console.error("Invalid app mode");
  }
}

function App() {
  InitManagers();

  const [appMode, setAppMode] = useState(AppMode.EsbBrokers);

  return (
    <div className='row'>
      <NavBar
        appModes={AppMode}
        appMode={appMode}
        setAppMode={setAppMode}
        className='col'
      />
      <ShowAppService
        appMode={appMode}
        className='col'
      />
    </div>
  );
}

export default App;
