import reduxify from 'reduxify';
import React, { Component } from 'react';
import * as actions from '../actions/index';
import Hero from '../containers/Hero';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const Main = (props) => (
  <div>
    I am okay with this.
    <Hero />
  </div>
);

export default reduxify(actions, ['isLoading', 'images'], Main);
