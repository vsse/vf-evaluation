import Type from '../models/type';
import * as typePermission from '../permissions/type';

/**
 * Load type and append to req.
 */
function fetch(req, res, next, id) {
  Type.get(id).then((type) => {
    req.type = type;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get type
 * @returns {Type}
 */
function get(req, res, next) {
  typePermission.canGet(req)
    .then(() => res.json(req.type))
    .error((e) => next(e));
}

/**
 * Create new type
 * @property {string} req.body.name - The name of type.
 * @returns {Type}
 */
function create(req, res, next) {
  const type = new Type({
    name: req.body.name
  });

  typePermission.canCreate(req)
    .then(() => type.saveAsync())
    .then((savedType) => res.json(savedType))
    .error((e) => next(e));
}

/**
 * Update existing type
 * @property {string} req.body.name - The name of type.
 * @returns {Type}
 */
function update(req, res, next) {
  const type = req.type;
  type.name = req.body.name;

  typePermission.canUpdate(req)
    .then(() => type.saveAsync())
    .then((savedType) => res.json(savedType))
    .error((e) => next(e));
}

/**
 * Get type list.
 * @property {number} req.query.skip - Number of types to be skipped.
 * @property {number} req.query.limit - Limit number of types to be returned.
 * @returns {Type[]}
 */
function list(req, res, next) {
  const { limit, skip } = req.query;

  typePermission.canList(req)
    .then(() => Type.list({ limit, skip }))
    .then((types) =>	res.json(types))
    .error((e) => next(e));
}

/**
 * Delete type.
 * @returns {Type}
 */
function remove(req, res, next) {
  const type = req.type;

  typePermission.canRemove(req)
    .then(() => type.removeAsync())
    .then((deletedType) => res.json(deletedType))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
