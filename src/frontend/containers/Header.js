import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  header: {
    fontFamily: "Catamaran",
    fontSize: '40px',
    textAlign: 'center',
    padding: '20px',
    width: '100%',
    backgroundColor: 'rgb(48, 164, 161)',
    color: "white",
  }
};

const Header = (props) => (
  <Paper style={styles.header}>Pixlee Code Challenge</Paper>
);

export default Header
