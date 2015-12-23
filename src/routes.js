import React from 'react';
import {
    Route, IndexRoute
}
from 'react-router';

import Framework from './components/Framework.react';
import Team from './components/Team';

export
default (
    <Route path="/" component={Framework}>
      <IndexRoute component={Team}/>
      
    </Route>
);