import reduxify from 'reduxify';
import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite';
import * as actions from '../actions/index';

import PhotoCard from '../components/PhotoCard';

const styles = StyleSheet.create({
  displayArea: {
    width: '640px',
    maxWidth: '640px',
    padding: '20px',
    margin: '0px 20px 0px 20px',
    backgroundColor: 'rgba(187, 187, 187, 0.5)',
  }
});

const Display = (props) => (
  <div className={css(styles.displayArea)}>
    {props.images ? null : "No data loaded"}
    {props.images.map((img, index) => <PhotoCard key={"card" + index} data={img} />)}
  </div>
);

export default reduxify(actions, ['images'], Display);
