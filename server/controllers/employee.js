import Promise from 'bluebird';
import Employee from '../models/employee';
import * as employeePermission from '../permissions/employee';
import permissionConstants from '../constants/permissions';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 *
 * Load employee and append to req.
 */
function fetch(req, res, next, id) {
  Employee.get(id)
    .then((employee) => {
      if (employee) {
        req.employee = employee;    // eslint-disable-line no-param-reassign
        return next();
      }
      const err = new APIError('No such employee exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
    .error((e) => next(e));
}

/**
 * Get employee
 * @returns {Employee}
 */
function get(req, res, next) {
  employeePermission.canGet(req)
    .then(() => res.json(req.employee))
    .error((e) => next(e));
}

/**
 * Create new employee
 * @property {number} req.body.staffId - The staffId of employee.
 * @property {string} req.body.name - The name of employee.
 * @property {ObjectId} req.body.role - The role of employee.
 * @property {string} req.body.email - The email of employee.
 * @property {ObjectId} req.body.team - The team of employee.
 * @property {string} req.body.manager - The manager of employee.
 * @property {boolean} req.body.isManager - If the employee has manager.
 * @property {string} req.body.kind - Then kind of employee.
 * @returns {Employee}
 */
function create(req, res, next) {
  const employee = new Employee({
    staffId: req.body.staffId,
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    team: req.body.team,
    manager: req.body.manager,
    isManager: req.body.isManager,
    kind: req.body.kind || permissionConstants.PUBLIC,
  });

  employeePermission.canCreate(req)
    .then(() => employee.saveAsync())
    .then((savedEmployee) => res.json(savedEmployee))
    .error((e) => next(e));
}

/**
 * Update existing employee
 * @property {number} req.body.staffId - The staffId of employee.
 * @property {string} req.body.name - The name of employee.
 * @property {ObjectId} req.body.role - The role of employee.
 * @property {string} req.body.email - The email of employee.
 * @property {ObjectId} req.body.team - The team of employee.
 * @property {string} req.body.manager - The manager of employee.
 * @property {boolean} req.body.isManager - If the employee has manager.
 * @property {string} req.body.kind - Then kind of employee.
 * @returns {Employee}
 */
function update(req, res, next) {
  const employee = req.employee;

  employee.staffId = req.body.staffId;
  employee.name = req.body.name;
  employee.role = req.body.role;
  employee.email = req.body.email;
  employee.team = req.body.team;
  employee.manager = req.body.manager;
  employee.isManager = req.body.isManager;
  employee.kind = req.body.kind;

  employeePermission.canUpdate(req)
    .then(() => employee.saveAsync())
    .then((updatedEmployee) => res.json(updatedEmployee))
    .error((e) => next(e));
}

/**
 * Get employee list.
 * @property {number} req.query.skip - Number of employees to be skipped.
 * @property {number} req.query.limit - Limit number of employees to be returned.
 * @returns {Employee[]}
 */
function list(req, res, next) {
  const { limit, skip, staffId, name, role, email, team, isManager, manager, kind, populate }
   = req.query;

  employeePermission.canList(req)
    .then(() => Employee.list({
      limit, skip, staffId, name, role, email, team, isManager, manager, kind, populate }))
    .then((employees) =>	res.json(employees))
    .error((e) => next(e));
}

/**
 * Delete employee.
 * @returns {Employee}
 */
function remove(req, res, next) {
  const employee = req.employee;

  employeePermission.canRemove(req)
    .then(() => employee.removeAsync())
    .then((deletedEmployee) => res.json(deletedEmployee))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
