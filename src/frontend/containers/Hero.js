import reduxify from 'reduxify';
import React from 'react';
import * as actions from '../actions/index';

const Hero = (props) => (
  <div>
    {"Hello World"}
  </div>
);

export default reduxify(actions, [], Hero);
