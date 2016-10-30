import reduxify from 'reduxify';
import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite';
import * as actions from '../actions/index';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SVGMenuIcon from 'material-ui/svg-icons/navigation/menu';

const Header = (props) => (
  <AppBar
    title="Pixlee Code Challenge"
  />
);

export default reduxify(actions, ['images'], Header);
