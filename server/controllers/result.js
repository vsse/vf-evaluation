import Result from '../models/result';
import * as resultPermission from '../permissions/result';

/**
 *
 * Load result and append to req.
 */
function fetch(req, res, next, id) {
  Result.get(id)
    .then((result) => {
      req.result = result; // eslint-disable-line no-param-reassign
      return next();
    })
    .error((e) => next(e));
}

/**
 * Get result
 * @returns {Result}
 */
function get(req, res, next) {
  resultPermission.canGet(req)
    .then(() => res.json(req.result))
    .error((e) => next(e));
}

/**
 * Create new result
 * @property {ObjectId} req.body.survey - The survey of result.
 * @property {ObjectId} req.body.team - The team of result.
 * @property {ObjectId} req.body.evaluator - The evaluator of result.
 * @property {ObjectId} req.body.candidate - The candidate of result.
 * @property {Array} req.body.answers - The answer of result.
 * @returns {Result}
 */
function create(req, res, next) {
  const result = new Result({
    survey: req.body.survey,
    team: req.body.team,
    evaluator: req.body.evaluator,
    candidate: req.body.candidate,
    answers: req.body.answers,
  });

  resultPermission.canCreate(req)
    .then(() => result.saveAsync())
    .then((savedResult) => res.json(savedResult))
    .error((e) => next(e));
}

/**
 * Update existing result
 * @property {ObjectId} req.body.survey - The survey of result.
 * @property {ObjectId} req.body.team - The team of result.
 * @property {ObjectId} req.body.evaluator - The evaluator of result.
 * @property {ObjectId} req.body.candidate - The candidate of result.
 * @property {Array} req.body.answers - The answer of result.
 * @returns {Result}
 */
function update(req, res, next) {
  const result = req.result;

  result.survey = req.body.survey;
  result.team = req.body.team;
  result.evaluator = req.body.evaluator;
  result.candidate = req.body.candidate;
  result.answers = req.body.answers;

  resultPermission.canUpdate(req)
    .then(() => result.saveAsync())
    .then((savedResult) => res.json(savedResult))
    .error((e) => next(e));
}

/**
 * Get result list.
 * @property {number} req.query.skip - Number of results to be skipped.
 * @property {number} req.query.limit - Limit number of results to be returned.
 * @property {ObjectId} surevyId - Limit number of results to be returned by survey.
 * @property {ObjectId} teamId - Limit number of results to be returned by team.
 * @property {ObjectId} evaluatorId - Limit number of results to be returned by evaluator.
 * @property {ObjectId} candidateId - Limit number of results to be returned by candidate.
 * @returns {Result[]}
 */
function list(req, res, next) {
  const { limit, skip, surevyId, teamId, evaluatorId, candidateId, populate } = req.query;

  resultPermission.canList(req)
    .then(() => Result.list({ limit, skip, surevyId, teamId, evaluatorId, candidateId, populate }))
    .then((results) =>	res.json(results))
    .error((e) => next(e));
}


/**
 * Delete result.
 * @returns {Result}
 */
function remove(req, res, next) {
  const result = req.result;

  resultPermission.canRemove(req)
    .then(() => result.removeAsync())
    .then((deletedResult) => res.json(deletedResult))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, remove };
