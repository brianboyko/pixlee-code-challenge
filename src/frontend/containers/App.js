import React from 'react';
// I actually wrote this npm module!
import reduxify from 'reduxify';
import * as actions from '../actions/index';

const App = (props) => (
  <div>
    {props.children}
  </div>
);

export default reduxify(actions, [], App);
