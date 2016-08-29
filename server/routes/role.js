import express from 'express';
import validate from 'express-validation';
import roleValidation from '../validators/role';
import roleCtrl from '../controllers/role';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/roles - Get list of roles */
  .get(roleCtrl.list)

  /** POST /api/roles - Create new role */
  .post(validate(roleValidation.createLookup), roleCtrl.create);

router.route('/:roleId')
  /** GET /api/roles/:roleId - Get role */
  .get(roleCtrl.get)

  /** PUT /api/roles/:roleId - Update role */
  .put(validate(roleValidation.updateRole), roleCtrl.update)

  /** DELETE /api/roles/:roleId - Delete role */
  .delete(roleCtrl.remove);

/** Load role when API with roleId route parameter is hit */
router.param('roleId', roleCtrl.fetch);

export default router;
