import express from 'express';
import validate from 'express-validation';
import categoryValidation from '../validators/category';
import categoryCtrl from '../controllers/category';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** POST /api/categorys - Create new category */
  .post(validate(categoryValidation.createCategory), categoryCtrl.create)

  /** GET /api/categorys - List all categories */
  .get(categoryCtrl.list);

router.route('/:categoryId')
  /** GET /api/categorys/:categoryId - Get category */
  .get(categoryCtrl.get)

  /** PUT /api/categorys/:categoryId - Update category */
  .put(validate(categoryValidation.updateCategory), categoryCtrl.update)

  /** DELETE /api/categorys/:categoryId - Delete category */
  .delete(categoryCtrl.remove);

/** Load category when API with categoryId route parameter is hit */
router.param('categoryId', categoryCtrl.fetch);

export default router;
