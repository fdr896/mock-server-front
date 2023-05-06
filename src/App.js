import React from 'react';
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material';

import NavBar from './NavBar';
import StaticRoutes from './StaticRoutes';
import { InitManagers } from './managers/base_manager';

function App() {
  InitManagers();

  return (
    <div>
      <NavBar className='same-row' />
      <StaticRoutes className='same-row' />
    </div>
  );
}

export default App;
