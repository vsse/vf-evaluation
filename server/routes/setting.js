import express from 'express';
import settingCtrl from '../controllers/setting';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/settings - Get list of settings (All) */
  .get(settingCtrl.list)

  /** POST /api/settings - Create new setting */
  .post(settingCtrl.create);

router.route('/:settingId')
  /** GET /api/settings/:settingId - Get setting */
  .get(settingCtrl.get)

  /** PUT /api/settings/:settingId - Update setting */
  .put(settingCtrl.update)

  /** DELETE /api/settings/:settingId - Delete setting */
  .delete(settingCtrl.remove);

/** Load setting when API with settingId route parameter is hit */
router.param('settingId', settingCtrl.fetch);

export default router;
