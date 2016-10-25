import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store, { routeTo } from './store/configureStore';
import App from './containers/App';
import Hero from './containers/Hero';

const history = syncHistoryWithStore(browserHistory, store);
const MOUNT_NODE = document.getElementById('root');

const Root = (props) => (
  <Provider routeTo={routeTo} store={props.store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Hero} />
      </Route>
    </Router>
  </Provider>);

export default Root;

ReactDOM.render(<Root store={store} />, MOUNT_NODE);
