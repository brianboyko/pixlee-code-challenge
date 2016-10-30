import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};


const ArchivePhotoCard = (props) => (
      <Card>
        <CardHeader
        title={props.data.user.username}
        subtitle={"Created: " + moment.unix(props.data.created_time).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        avatar={props.data.user.profile_picture}
        />
        <CardMedia
        overlay={<CardTitle subtitle={"Comments: " + props.data.comments.count + ", Likes: " + props.data.likes.count}/>}
        >
          <img src={props.data.images.standard_resolution.url} />
        </CardMedia>
        {props.data.caption ? <CardTitle title={"Caption by " + props.data.caption.from.username} subtitle={"at " + moment.unix(props.data.caption.created_time).format("dddd, MMMM Do YYYY, h:mm:ss a") } /> : null }
        <CardText>
          <div style={styles.wrapper}>{props.data.tags.map((tag, i) => <Chip key={"chip" + i} style={styles.chip}>{tag}</Chip>)}</div>
          <div>{props.data.caption.text}</div>
        </CardText>
        <CardActions>
          <FlatButton label="Action1" />
          <FlatButton label="Action2" />
        </CardActions>
      </Card>
    );

export default ArchivePhotoCard;
