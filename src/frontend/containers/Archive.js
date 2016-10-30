import React, { Component } from 'react';
import reduxify from 'reduxify';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

import { css, StyleSheet } from 'aphrodite';
import * as actions from '../actions/index';

const styles = StyleSheet.create({
  displayArea: {
    width: '640px',
    maxWidth: '640px',
    padding: '20px',
    margin: '20px auto',
    backgroundColor: 'rgba(187, 187, 187, 0.5)',
  },
  container: {
    textAlign: 'center',
    margin: 'auto',
  },
  card: {
    marginBottom: '10px',
  }
});

const ArchiveCard = (props) => (
      <Card className={css(styles.card)}>
        <CardHeader
        title={props.user.ig_username}
        subtitle={"Created: " + moment(props.media.created_time).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        avatar={props.user.ig_profilepic}
        />
        <CardMedia
        overlay={<CardTitle subtitle={"Comments: " + props.media.number_comments + ", Likes: " + props.media.number_likes}/>}
        >
          <img src={props.images.standard_url} />
        </CardMedia>
        <CardText>
          <div>{props.media.caption_text}</div>
        </CardText>
        <CardActions>
          <a href={props.media.link_url} target="_blank"><FlatButton label="Go To Instagram Link"/></a>
        </CardActions>
      </Card>
);

class Archive extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 0
    }
    this.handleAdvance = this.handleAdvance.bind(this);
    this.handleRewind = this.handleRewind.bind(this);
  }

  handleAdvance () {
    if(this.props.images.length > (this.state.page + 1) * 100){
      this.setState({page: this.state.page + 1})
    }
  }
  handleRewind () {
    if(this.state.page > 0){
      this.setState({page: this.state.page - 1})
    }
  }


  render () {
    return (
      <div className={css(styles.container)}>
        <div>
          <RaisedButton label="Previous 100" onClick={this.handleRewind} disabled={this.state.page < 1}/>
          <RaisedButton label="Next 100" onClick={this.handleAdvance} disabled={(this.state.page + 1) * 100 >= this.props.images.length} />
        </div>
        <div className={css(styles.displayArea)}>
          {this.props.images ? null : "No data loaded"}
          {this.props.images.slice(this.state.page * 100, (this.state.page + 1) * 100).map((img, index) => <ArchiveCard key={"card" + index} images={img.images[0]} media={img.media} user={img.user[0]} />)}
        </div>
      </div>
    )
  }
}



export default reduxify(actions, ['images'], Archive);
