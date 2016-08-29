import express from 'express';
import validate from 'express-validation';
import authValidation from '../validators/auth';
import authCtrl from '../controllers/auth';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/login')
  /** POST /api/authentication - Login */
  .post(validate(authValidation.login), authCtrl.login);

router.route('/verify')
  /** GET /api/auths - Get list of auths */
  .get(authCtrl.verify);

export default router;
