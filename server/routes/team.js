import express from 'express';
import validate from 'express-validation';
import teamValidation from '../validators/team';
import teamCtrl from '../controllers/team';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/teams - Get list of teams */
  .get(teamCtrl.list)

  /** POST /api/teams - Create new team */
  .post(validate(teamValidation.createTeam), teamCtrl.create);

router.route('/:teamId')
  /** GET /api/teams/:teamId - Get team */
  .get(teamCtrl.get)

  /** PUT /api/teams/:teamId */
  .put(validate(teamValidation.updateTeam), teamCtrl.update)

  /** DELETE /api/teams/:teamId - Delete team */
  .delete(teamCtrl.remove);

router.param('teamId', teamCtrl.fetch);

export default router;
