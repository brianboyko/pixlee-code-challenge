import reduxify from 'reduxify';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import * as actions from '../actions/index';
import PhotoGrid from '../components/PhotoGrid';
import PhotoCard from '../components/PhotoCard';

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
    };
    this.getSearch = this.getSearch.bind(this);
    this.handleHashtag = this.handleHashtag.bind(this);
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
        <div style={{float:'left'}}>
          <TextField
            hintText="bacon"
            floatingLabelText="Search for Hashtag"
            onChange={this.handleHashtag}
          />
          <RaisedButton onClick={this.getSearch} label="Search" />
          {this.props.isLoading ? <CircularProgress /> : null}
        </div>
        <div style={{width: '610px', padding:"10px 5px 10px 5px", backgroundColor: "#AAAAAA", float:'right'}}>
          {this.props.images ? null: ' '}
          {this.props.images.map((img, index) => <PhotoCard key={"card" + index} data={img} />)}
        </div>
      </div>
    );
  }
}

export default reduxify(actions, ['isLoading', 'images'], Hero);
