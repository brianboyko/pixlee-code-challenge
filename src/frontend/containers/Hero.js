import reduxify from 'reduxify';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import * as actions from '../actions/index';
import PhotoGrid from '../components/PhotoGrid';

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
    };
    this.getSearch = this.getSearch.bind(this);
    this.handleHashtag = this.handleHashtag.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount () {
    console.log(this.props);
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
  render () {
    return (
      <div>
        <TextField
          hintText="bacon"
          floatingLabelText="Search for Hashtag"
          onChange={this.handleHashtag} />
        <RaisedButton onClick={this.getSearch} label="Search" />
        <br />
        <PhotoGrid photos={this.props.images} />
        {this.state.tagName}
        {this.props.isLoading ? <CircularProgress /> : null}
      </div>
    );
  }
}

export default reduxify(actions, ['isLoading', 'images'], Hero);
