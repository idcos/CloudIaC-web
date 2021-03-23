import React from 'react';
import RoutesList from 'components/routes-list';
import routes from 'routes';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className='idcos-app'>
      <RoutesList routes={routes()}/>
    </div>
  );
}

export default App;
