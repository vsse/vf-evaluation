import Setting from '../models/setting';
import * as settingPermission from '../permissions/setting';

/**
 *
 * Load setting and append to req.
 */
function fetch(req, res, next, id) {
  Setting.get(id).then((setting) => {
    req.setting = setting;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get setting
 * @returns {Setting}
 */
function get(req, res, next) {
  settingPermission.canGet(req)
    .then(() => res.json(req.setting))
    .error((e) => next(e));
}

/**
 * Create new setting
 * @property {Object} req.body.seniorityWeights - The seniorityWeights of setting.
 * @returns {Setting}
 */
function create(req, res, next) {
  const setting = new Setting({
    seniorityWeights: req.body.seniorityWeights
  });

  settingPermission.canCreate(req)
    .then(() => setting.saveAsync())
    .then((savedSetting) => res.json(savedSetting))
    .error((e) => next(e));
}

/**
 * Update existing setting
 * @property {Object} req.body.seniorityWeights - The seniorityWeights of setting.
 * @returns {Setting}
 */
function update(req, res, next) {
  const setting = req.setting;
  setting.seniorityWeights = req.body.seniorityWeights;

  settingPermission.canUpdate(req)
    .then(() => setting.saveAsync())
    .then((savedSetting) => res.json(savedSetting))
    .error((e) => next(e));
}

/**
 * Get setting list.
 * @property {number} req.query.skip - Number of settings to be skipped.
 * @property {number} req.query.limit - Limit number of settings to be returned.
 * @returns {Setting[]}
 */
function list(req, res, next) {
  const { limit, skip } = req.query;

  settingPermission.canList(req)
    .then(() => Setting.list({ limit, skip }))
    .then((settings) =>	res.json(settings))
    .error((e) => next(e));
}

/**
 * Delete setting.
 * @returns {Setting}
 */
function remove(req, res, next) {
  const setting = req.setting;

  settingPermission.canRemove(req)
    .then(() => setting.removeAsync())
    .then((deletedSetting) => res.json(deletedSetting))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
