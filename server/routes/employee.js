import express from 'express';
import validate from 'express-validation';
import employeeValidation from '../validators/employee';
import employeeCtrl from '../controllers/employee';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** POST /api/employees - Create new employee */
  .post(validate(employeeValidation.createEmployee), employeeCtrl.create)

  /** GET /api/employees - Get list of employees */
  .get(employeeCtrl.list);

router.route('/:employeeId')
  /** GET /api/employees/:employeeId - Get employee */
  .get(employeeCtrl.get)

  /** PUT /api/employees/:employeeId - Update employee */
  .put(validate(employeeValidation.updateEmployee), employeeCtrl.update)

  /** DELETE /api/employees/:employeeId - Delete employee */
  .delete(employeeCtrl.remove);

/** Load employee when API with employeeId route parameter is hit */
router.param('employeeId', employeeCtrl.fetch);

export default router;
