import React from 'react';
import RoutesList from 'components/routes-list';
import routes from 'routes';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className='idcos-app'>
      <ul>
        <li>
          <Link to='/'>home</Link>
        </li>
        <li>
          <Link to='/test'>test</Link>
        </li>
      </ul>
      <RoutesList routes={routes()}/>
    </div>
  );
}

export default App;
