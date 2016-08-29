import Team from '../models/team';
import * as teamPermission from '../permissions/team';

/**
 * Load team and append to req.
 */
function fetch(req, res, next, id) {
  Team.get(id).then((team) => {
    req.team = team; // eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get team
 * @return {Team}
 */
function get(req, res, next) {
  teamPermission.canGet(req)
    .then(() => res.json(req.team))
    .error((e) => next(e));
}

/**
 * Create new team
 * @property {name} req.body.name - The name of team
 * @return {Team}
 */
function create(req, res, next) {
  const team = new Team({
    name: req.body.name,
  });

  teamPermission.canCreate(req)
    .then(() => team.saveAsync())
    .then((savedTeam) => res.json(savedTeam))
    .error((e) => next(e));
}

/**
 * Update existing team
 * @property {name} req.body.name - The name of team
 * @return {Team}
 */
function update(req, res, next) {
  const team = req.team;
  team.name = req.body.name;

  teamPermission.canUpdate(req)
    .then(() => team.saveAsync())
    .then((savedTeam) => res.json(savedTeam))
    .error((e) => next(e));
}

/**
 * Get teams list
 * @property {number} req.query.limit - Limit no. of teams to be returned
 * @property {number} req.query.skip - No. of teams to be skipped
 * @return {Team[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;

  teamPermission.canList(req)
    .then(() => Team.list({ limit, skip }))
    .then((teams) => res.json(teams))
    .error((e) => next(e));
}

/**
 * Delete team
 * @return {Team}
 */
function remove(req, res, next) {
  const team = req.team; // eslint-disable-line no-param-reassign

  teamPermission.canRemove(req)
    .then(() => team.removeAsync())
    .then((deletedTeam) => res.json(deletedTeam))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
