import { routeUtil } from 'utils';

import list from './actions/list';
import addImage from './actions/add-image';

const publicRoutes = routeUtil.getRoutes([

]);

const privateRoutes = routeUtil.getRoutes([
  list,
  addImage,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
  addImage,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
