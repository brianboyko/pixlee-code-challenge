import request from 'request';
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
      tagName: "bacon",
      email: "brian.boyko@gmail.com",
      status: "",
    };
    this.getSearch = this.getSearch.bind(this);
    this.handleHashtag = this.handleHashtag.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleRange = this.handleRange.bind(this);
    this.queueSearch = this.queueSearch.bind(this);
  }
  queueSearch () {
    this.props.actions.addQuery({
      tagName: this.state.tagName,
      startDate: this.props.minDate,
      endDate: this.props.maxDate,
      email: this.state.email,
      complete: false,
    });
    const ROOT = process.env.ROOT_URL || 'http://localhost:'
    const PORT = process.env.PORT || 3000;

    request({
      method: 'POST',
      url: ROOT + PORT + '/api/createcollection',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body: {
        tagName: this.state.tagName,
        startDate: this.props.minDate.valueOf(),
        endDate: this.props.maxDate.valueOf(),
        userEmail: this.state.email,
      },
      json: true,
    }, (err, response, body) => {
      console.log("err", err);
      console.log("response", response);
      console.log("body", body);
      this.setState({status: `Thank you. Your placement is ${body.placement}. We will send an e-mail to ${body.email} when the application is finished processing. Reference Code ${body.id}`})
    });

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
  handleEmail (event, value) {
    this.setState({ email: value });
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
            value={this.state.tagName}

          />
          <Divider />

          {this.props.isLoading ? <CircularProgress /> : null}
        </div>


        <RaisedButton onClick={this.getSearch} label="Search for Most Recent Images" />
          <DateRange onInit={this.handleRange} onChange={this.handleRange}/>
          <TextField
            hintText="Email"
            floatingLabelText="Type your e-mail for notification (required)"
            onChange={this.handleEmail}
            value={this.state.email}
          />
        <RaisedButton onClick={this.queueSearch} label="Make a request to search for dates" />
        {this.state.status}
        <Divider/>
        <Display />
      </div>
    );
  }
}

export default reduxify(actions, ['isLoading', 'minDate', 'maxDate', 'images'], Hero);
