import Survey from '../models/survey';
import * as surveyPermission from '../permissions/survey';

/**
 * Load survey and append to req.
 */
function fetch(req, res, next, id) {
  Survey.get(id).then((survey) => {
    req.survey = survey;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get survey
 * @returns {Survey}
 */
function get(req, res, next) {
  surveyPermission.canGet(req)
    .then(() => res.json(req.survey))
    .error((e) => next(e));
}

/**
 * Create new survey
 * @property {string} req.body.name - The name of survey.
 * @property {ObjectId[]} req.body.teams - The teams of survey.
 * @property {ObjectId[]} req.body.questions - The questions of survey.
 * @returns {Survey}
 */
function create(req, res, next) {
  const survey = new Survey({
    name: req.body.name,
    teams: req.body.teams,
    questions: req.body.questions
  });

  surveyPermission.canCreate(req)
    .then(() => survey.saveAsync())
    .then((savedSurvey) => res.json(savedSurvey))
    .error((e) => next(e));
}

/**
 * Update existing survey
 * @property {string} req.body.name - The name of survey.
 * @property {ObjectId[]} req.body.teams - The teams of survey.
 * @property {ObjectId[]} req.body.questions - The questions of survey.
 * @returns {Survey}
 */
function update(req, res, next) {
  const survey = req.survey;
  survey.name = req.body.name;
  survey.teams = req.body.teams;
  survey.questions = req.body.questions;

  surveyPermission.canUpdate(req)
    .then(() => survey.saveAsync())
    .then((savedSurvey) => res.json(savedSurvey))
    .error((e) => next(e));
}

/**
 * Get survey list.
 * @property {number} req.query.skip - Number of surveys to be skipped.
 * @property {number} req.query.limit - Limit number of surveys to be returned.
 * @property {ObjectId} req.query.teamId - Filter surveys to be returned by teamId.
 * @returns {Survey[]}
 */
function list(req, res, next) {
  const { limit, skip, teamId, populate } = req.query;

  surveyPermission.canList(req)
    .then(() => Survey.list({ limit, skip, teamId, populate }))
    .then((surveys) =>	res.json(surveys))
    .error((e) => next(e));
}

/**
 * Delete survey.
 * @returns {Survey}
 */
function remove(req, res, next) {
  const survey = req.survey;

  surveyPermission.canRemove(req)
    .then(() => survey.removeAsync())
    .then((deletedSurvey) => res.json(deletedSurvey))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
