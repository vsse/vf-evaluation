import Goal from '../models/goal';
import * as goalPermission from '../permissions/goal';

/**
 * Load goal and append to req.
 */
function fetch(req, res, next, id) {
  Goal.get(id).then((goal) => {
    req.goal = goal;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get goal
 * @returns {Goal}
 */
function get(req, res, next) {
  goalPermission.canGet(req)
    .then(() => res.json(req.goal))
    .error((e) => next(e));
}

/**
 * Create new goal
 * @property {string} req.body.name - The name of goal.
 * @property {ObjectId} req.body.type - The type of goal.
 * @returns {Goal}
 */
function create(req, res, next) {
  const goal = new Goal({
    name: req.body.name,
    type: req.body.type
  });

  goalPermission.canCreate(req)
    .then(() => goal.saveAsync())
    .then((savedGoal) => res.json(savedGoal))
    .error((e) => next(e));
}

/**
 * Update existing goal
 * @property {string} req.body.name - The name of goal.
 * @property {ObjectId} req.body.type - The type of goal.
 * @returns {Goal}
 */
function update(req, res, next) {
  const goal = req.goal;
  goal.name = req.body.name;
  goal.type = req.body.type;

  goalPermission.canUpdate(req)
    .then(() => goal.saveAsync())
    .then((savedGoal) => res.json(savedGoal))
    .error((e) => next(e));
}

/**
 * Get goal list.
 * @property {number} req.query.skip - Number of goals to be skipped.
 * @property {number} req.query.limit - Limit number of goals to be returned.
 * @property {number} req.query.typeId - The type attached to the goals.
 * @returns {Goal[]}
 */
function list(req, res, next) {
  const { limit, skip, typeId } = req.query;
  goalPermission.canList(req)
    .then(() => Goal.list({ limit, skip, typeId }))
    .then((goals) =>	res.json(goals))
    .error((e) => next(e));
}

/**
 * Delete goal.
 * @returns {Goal}
 */
function remove(req, res, next) {
  const goal = req.goal;
  goalPermission.canRemove(req)
    .then(() => goal.removeAsync())
    .then((deletedGoal) => res.json(deletedGoal))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
