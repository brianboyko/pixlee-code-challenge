import reduxify from 'reduxify';
import React, { Component } from 'react';
import * as actions from '../actions/index';
import Hero from '../containers/Hero';

const Main = (props) => (
  <div>
    <Hero />
  </div>
);

export default reduxify(actions, ['isLoading', 'images'], Main);
