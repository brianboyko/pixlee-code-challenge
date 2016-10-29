import reduxify from 'reduxify';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import { DateRange } from 'react-date-range';

import { css, StyleSheet } from 'aphrodite'
import * as actions from '../actions/index';
import Display from './Display';


const styles = StyleSheet.create({
  main: {
    backgroundImage: "url(../static/img/dots-background.png)",
    backgroundRepeat: 'repeat-y',
    backgroundAttachement: 'fixed',
    backgroundSize: '100% auto',
    padding: '10px',
  },
})


class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
    };
    this.getSearch = this.getSearch.bind(this);
    this.handleHashtag = this.handleHashtag.bind(this);
    this.handleRange = this.handleRange.bind(this);

  }
  getSearch () {
    this.props.actions.setLoading(!this.props.isLoading);
    this.props.actions.getImagesByTag(this.state.tagName);
  }
  handleHashtag (event, value) {
    if (event.keycode === 13) {
      this.getSearch();
    } else {
      this.setState({ tagName: value });
    }
  }
  handleRange (range) {
    this.props.actions.setMinDate(range.startDate);
    this.props.actions.setMaxDate(range.endDate);
  }

  render () {
    return (
      <div className={css(styles.main)}>
        <div>
          <TextField
            hintText="bacon"
            floatingLabelText="Search for Hashtag"
            onChange={this.handleHashtag}
          />
          <Divider />

          {this.props.isLoading ? <CircularProgress /> : null}
        </div>


        <RaisedButton onClick={this.getSearch} label="Search for Most Recent Images" />
          <DateRange onInit={this.handleRange} onChange={this.handleRange}/>
        <RaisedButton onClick={this.queueSearch} label="Make a request to search for dates" />
        <Divider/>
        <Display />
      </div>
    );
  }
}

export default reduxify(actions, ['isLoading', 'minDate', 'maxDate', 'images'], Hero);
