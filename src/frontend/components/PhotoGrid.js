import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto',
  },
};


/**
 * This example demonstrates the horizontal scrollable single-line grid list of images.
 */
const PhotoGrid = (props) => (
  <div style={styles.root}>
    <GridList style={styles.gridList} cols={6}>
      {props.photos.map((pic) => (
        <GridTile
          key={pic.link}
          title={pic.caption.text}
        >
          <img alt={pic.caption.text} src={pic.images.low_resolution.url} />
        </GridTile>
      ))}
    </GridList>
  </div>
);

export default PhotoGrid;
