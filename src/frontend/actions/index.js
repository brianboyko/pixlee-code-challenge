import { push } from 'react-router-redux';
import appStatus from './appStatus';
import images from './images'
import queries from './queries'


export default Object.assign({}, appStatus, images, { push });
