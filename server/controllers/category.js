import Category from '../models/category';
import * as categoryPermission from '../permissions/category';

/**
 *
 * Load category and append to req.
 */
function fetch(req, res, next, id) {
  Category.get(id).then((category) => {
    req.category = category;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get category
 * @returns {Category}
 */
function get(req, res, next) {
  categoryPermission.canGet(req)
    .then(() => res.json(req.category))
    .error((e) => next(e));
}

/**
 * Create new category
 * @property {string} req.body.name - The name of category.
 * @property {ObjectId} req.body.goal - The goal of category.
 * @returns {Category}
 */
function create(req, res, next) {
  const category = new Category({
    name: req.body.name,
    goal: req.body.goal
  });

  categoryPermission.canCreate(req)
    .then(() => category.saveAsync())
    .then((savedCategory) => res.json(savedCategory))
    .error((e) => next(e));
}

/**
 * Update existing category
 * @property {string} req.body.name - The name of category.
 * @property {ObjectId} req.body.goal - The goal of category.
 * @returns {Category}
 */
function update(req, res, next) {
  const category = req.category;
  category.name = req.body.name;
  category.goal = req.body.goal;

  categoryPermission.canUpdate(req)
    .then(() => category.saveAsync())
    .then((savedCategory) => res.json(savedCategory))
    .error((e) => next(e));
}

/**
 * Get category list.
 * @property {number} req.query.skip - Number of categorys to be skipped.
 * @property {number} req.query.limit - Limit number of categorys to be returned.
 * @property {number} req.query.goalId - The goal attached to the categories.
 * @returns {Category[]}
 */
function list(req, res, next) {
  const { limit, skip, goalId } = req.query;
  categoryPermission.canList(req)
    .then(() => Category.list({ limit, skip, goalId }))
    .then((categorys) =>	res.json(categorys))
    .error((e) => next(e));
}

/**
 * Delete category.
 * @returns {Category}
 */
function remove(req, res, next) {
  const category = req.category;
  categoryPermission.canRemove(req)
    .then(() => category.removeAsync())
    .then((deletedCategory) => res.json(deletedCategory))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
