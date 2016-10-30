import React from 'react';
// I actually wrote this npm module!
import reduxify from 'reduxify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Header from './Header';
import * as actions from '../actions/index';

const App = (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <div>
      <Header />
      {props.children}
    </div>
  </MuiThemeProvider>
);

export default reduxify(actions, ['draweropen'], App);
