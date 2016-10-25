import { push } from 'react-router-redux';
import appStatus from './appStatus';
import images from './images'

export default Object.assign({}, appStatus, images, { push });
