import express from 'express';
import validate from 'express-validation';
import surveyValidation from '../validators/survey';
import surveyCtrl from '../controllers/survey';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** POST /api/surveys - Create new survey */
  .post(validate(surveyValidation.createSurvey), surveyCtrl.create)

  /** GET /api/surveys - Get list of surveys (All | By teamId) */
  .get(surveyCtrl.list);

router.route('/:surveyId')
  /** GET /api/surveys/:surveyId - Get survey */
  .get(surveyCtrl.get)

  /** PUT /api/surveys/:surveyId - Update survey */
  .put(validate(surveyValidation.updateSurvey), surveyCtrl.update)

  /** DELETE /api/surveys/:surveyId - Delete survey */
  .delete(surveyCtrl.remove);

/** Load survey when API with surveyId route parameter is hit */
router.param('surveyId', surveyCtrl.fetch);

export default router;
