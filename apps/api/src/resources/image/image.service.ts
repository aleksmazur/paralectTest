import _ from 'lodash';
import { securityUtil } from 'utils';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './image.schema';
import { Image } from './image.types';

const service = db.createService<Image>(DATABASE_DOCUMENTS.IMAGES, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});
  
const getPublic = (image: Image | null) => _.omit(image);
  
export default Object.assign(service, {
  getPublic,
});
