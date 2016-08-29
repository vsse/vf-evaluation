import express from 'express';
import validate from 'express-validation';
import questionValidation from '../validators/question';
import questionCtrl from '../controllers/question';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/questions - Get list of questions (All) */
  .get(questionCtrl.list)

  /** POST /api/questions - Create new question */
  .post(validate(questionValidation.createQuestion), questionCtrl.create);

router.route('/bySurvey')
  /** GET /api/questions - Get list of questions by survey */
  .get(questionCtrl.listBySurvey);

router.route('/:questionId')
  /** GET /api/questions/:questionId - Get question */
  .get(questionCtrl.get)

  /** PUT /api/questions/:questionId - Update question */
  .put(validate(questionValidation.updateQuestion), questionCtrl.update)

  /** DELETE /api/questions/:questionId - Delete question */
  .delete(questionCtrl.remove);

/** Load question when API with questionId route parameter is hit */
router.param('questionId', questionCtrl.fetch);

export default router;
