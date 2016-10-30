import request from 'request';
import reduxify from 'reduxify';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import { DateRange } from 'react-date-range';
import { css, StyleSheet } from 'aphrodite';
import * as actions from '../actions/index';


const styles = StyleSheet.create({
  main: {
    backgroundImage: "url(../static/img/dots-background.png)",
    backgroundRepeat: 'repeat-y',
    backgroundAttachement: 'fixed',
    backgroundSize: '100% auto',
    padding: '10px',
    margin: 'auto',
  },
  container: {
    textAlign: 'center',
    margin: 'auto',
  },
  databox: {
    width: '500px',
    textAlign: 'left',
    margin: '40px auto',
    padding: '20px',
  }
})


class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
      email: "",
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

    request({
      method: 'POST',
      url: 'api/createcollection',
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
      if (err) {
        console.log(err);
      }
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
        <div className={css(styles.container)}>
          <Paper>{this.state.status}</Paper>
          <TextField
            hintText="bacon"
            floatingLabelText="Hashtag (required)"
            onChange={this.handleHashtag}
            value={this.state.tagName}

          />
          <TextField
            hintText="brian.boyko@gmail.com"
            floatingLabelText="Email (required)"
            onChange={this.handleEmail}
            value={this.state.email}
          />
          <DateRange onInit={this.handleRange} onChange={this.handleRange}/>
          <Paper zDepth={4} className={css(styles.databox)}>
            <div>Current selections: </div>
            <div>Hashtag: {this.state.tagName}</div>
            <div>From: {this.props.minDate ? this.props.minDate.format("dddd, MMMM Do YYYY, h:mm:ss a") : null}</div>
            <div>To: {this.props.maxDate ? this.props.maxDate.format("dddd, MMMM Do YYYY, h:mm:ss a") : null}</div>
            <div>Email: {this.state.email}</div>
          </Paper>
          <RaisedButton onClick={this.queueSearch} label="Make a request to search for dates" disabled={(!this.state.tagName || !this.props.minDate || !this.props.maxDate || !this.state.email)} />
        </div>
      </div>
    );
  }
}

export default reduxify(actions, ['isLoading', 'minDate', 'maxDate', 'images'], Hero);
