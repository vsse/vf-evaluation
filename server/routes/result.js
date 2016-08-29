import express from 'express';
import validate from 'express-validation';
import resultValidation from '../validators/result';
import resultCtrl from '../controllers/result';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/results - Get list of results (All) */
  .get(resultCtrl.list)

  /** POST /api/results - Create new result */
  .post(validate(resultValidation.createResult), resultCtrl.create);

router.route('/:resultId')
  /** GET /api/results/:resultId - Get result */
  .get(resultCtrl.get)

  /** PUT /api/results/:resultId - Update result */
  .put(validate(resultValidation.updateResult), resultCtrl.update)

  /** DELETE /api/results/:resultId - Delete result */
  .delete(resultCtrl.remove);

/** Load result when API with resultId route parameter is hit */
router.param('resultId', resultCtrl.fetch);

export default router;
