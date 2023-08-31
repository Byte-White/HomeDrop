import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from './NotFound';
import HomeDrop from './HomeDrop';
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Welcome/>
            </Route>
            <Route path="/homedrop">
              <HomeDrop/>
            </Route>
            <Route path="*">
              <NotFound/>
            </Route>
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
