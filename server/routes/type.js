import express from 'express';
import validate from 'express-validation';
import typeValidation from '../validators/type';
import typeCtrl from '../controllers/type';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/types - Get list of types */
  .get(typeCtrl.list)

  /** POST /api/types - Create new type */
  .post(validate(typeValidation.createLookup), typeCtrl.create);

router.route('/:typeId')
  /** GET /api/types/:typeId - Get type */
  .get(typeCtrl.get)

  /** PUT /api/types/:typeId - Update type */
  .put(validate(typeValidation.updateType), typeCtrl.update)

  /** DELETE /api/types/:typeId - Delete type */
  .delete(typeCtrl.remove);

/** Load type when API with typeId route parameter is hit */
router.param('typeId', typeCtrl.fetch);

export default router;
