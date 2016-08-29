import Role from '../models/role';
import * as rolePermission from '../permissions/role';

/**
 *
 * Load role and append to req.
 */
function fetch(req, res, next, id) {
  Role.get(id).then((role) => {
    req.role = role;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get role
 * @returns {Role}
 */
function get(req, res, next) {
  rolePermission.canGet(req)
    .then(() => res.json(req.role))
    .error((e) => next(e));
}

/**
 * Create new role
 * @property {string} req.body.name - The name of role.
 * @returns {Role}
 */
function create(req, res, next) {
  const role = new Role({
    name: req.body.name
  });

  rolePermission.canCreate(req)
    .then(() => role.saveAsync())
    .then((savedRole) => res.json(savedRole))
    .error((e) => next(e));
}

/**
 * Update existing role
 * @property {string} req.body.name - The name of role.
 * @returns {Role}
 */
function update(req, res, next) {
  const role = req.role;
  role.name = req.body.name;

  rolePermission.canUpdate(req)
    .then(() => role.saveAsync())
    .then((savedRole) => res.json(savedRole))
    .error((e) => next(e));
}

/**
 * Get role list.
 * @property {number} req.query.skip - Number of roles to be skipped.
 * @property {number} req.query.limit - Limit number of roles to be returned.
 * @returns {Role[]}
 */
function list(req, res, next) {
  const { limit, skip } = req.query;

  rolePermission.canList(req)
    .then(() => Role.list({ limit, skip }))
    .then((roles) =>	res.json(roles))
    .error((e) => next(e));
}

/**
 * Delete role.
 * @returns {Role}
 */
function remove(req, res, next) {
  const role = req.role;

  rolePermission.canRemove(req)
    .then(() => role.removeAsync())
    .then((deletedRole) => res.json(deletedRole))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
