import express from 'express';
import validate from 'express-validation';
import goalValidation from '../validators/goal';
import goalCtrl from '../controllers/goal';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** POST /api/goals - Create new goal */
  .post(validate(goalValidation.createGoal), goalCtrl.create)

  /** GET /api/goals - List all goals */
  .get(goalCtrl.list);

router.route('/:goalId')
  /** GET /api/goals/:goalId - Get goal */
  .get(goalCtrl.get)

  /** PUT /api/goals/:goalId - Update goal */
  .put(validate(goalValidation.updateGoal), goalCtrl.update)

  /** DELETE /api/goals/:goalId - Delete goal */
  .delete(goalCtrl.remove);

/** Load goal when API with goalId route parameter is hit */
router.param('goalId', goalCtrl.fetch);

export default router;
