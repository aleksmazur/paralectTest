import { routeUtil } from 'utils';

import list from './actions/list';
import addImage from './actions/add-image';
import update from './actions/update-raiting';

const publicRoutes = routeUtil.getRoutes([
  list,
  update,
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
