import Question from '../models/question';
import * as questionPermission from '../permissions/question';

/**
 * Load question and append to req.
 */
function fetch(req, res, next, id) {
  Question.get(id).then((question) => {
    req.question = question;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get question
 * @returns {Question}
 */
function get(req, res, next) {
  questionPermission.canGet(req)
    .then(() => res.json(req.question))
    .error((e) => next(e));
}

/**
 * Create new question
 * @property {ObjectId} req.body.type - The type of question.
 * @property {ObjectId} req.body.goal - The goal of question.
 * @property {ObjectId} req.body.category - The category of question.
 * @property {string} req.body.content - The content of question.
 * @property {number} req.body.weight - The weight of question.
 * @property {Object} req.body.availabilities - The availabilities of question.
 * @property {ObjectId[]} req.body.evaluators - The evaluators of question.
 * @returns {Question}
 */
function create(req, res, next) {
  const question = new Question({
    type: req.body.type,
    goal: req.body.goal,
    category: req.body.category,
    content: req.body.content,
    weight: req.body.weight,
    availabilities: req.body.availabilities,
    evaluators: req.body.evaluators
  });

  questionPermission.canCreate(req)
    .then(() => question.saveAsync())
    .then((savedQuestion) => res.json(savedQuestion))
    .error((e) => next(e));
}

/**
 * Update existing question
 * @property {ObjectId} req.body.type - The type of question.
 * @property {ObjectId} req.body.goal - The goal of question.
 * @property {ObjectId} req.body.category - The category of question.
 * @property {string} req.body.content - The content of question.
 * @property {number} req.body.weight - The weight of question.
 * @property {Object} req.body.availabilities - The availabilities of question.
 * @property {ObjectId[]} req.body.evaluators - The evaluators of question.
 * @returns {Question}
 */
function update(req, res, next) {
  const question = req.question;
  question.type = req.body.type;
  question.goal = req.body.goal;
  question.category = req.body.category;
  question.content = req.body.content;
  question.weight = req.body.weight;
  question.availabilities = req.body.availabilities;
  question.evaluators = req.body.evaluators;

  questionPermission.canUpdate(req)
    .then(() => question.saveAsync())
    .then((savedQuestion) => res.json(savedQuestion))
    .error((e) => next(e));
}

/**
 * Get question list.
 * @property {number} req.query.skip - Number of questions to be skipped.
 * @property {number} req.query.limit - Limit number of questions to be returned.
 * @returns {Question[]}
 */
function list(req, res, next) {
  const { limit, skip, populate } = req.query;

  questionPermission.canList(req)
    .then(() => Question.list({ limit, skip, populate }))
    .then((questions) =>	res.json(questions))
    .error((e) => next(e));
}

/**
 * Get question list by survey.
 * @property {number} req.query.skip - Number of questions to be skipped.
 * @property {number} req.query.limit - Limit number of questions to be returned.
 * @property {ObjectId} req.query.surveyId - Limit by Survey Id.
 * @property {ObjectId} req.query.evaluatorId - Limit by Evaluator Id.
 * @property {ObjectId} req.query.candidateId - Limit by Candidate Id.
 * @returns {Question[]}
 */
function listBySurvey(req, res, next) {
  const { limit, skip, surveyId, evaluatorId, candidateId, populate } = req.query;

  questionPermission.canListBySurvey(req)
    .then(() => Question.listBySurvey({
      limit, skip, surveyId, evaluatorId, candidateId, populate
    }))
    .then((questions) => res.json(questions))
    .error((e) => next(e));
}

/**
 * Delete question.
 * @returns {Question}
 */
function remove(req, res, next) {
  const question = req.question;

  questionPermission.canRemove(req)
    .then(() => question.removeAsync())
    .then((deletedQuestion) => res.json(deletedQuestion))
    .error((e) => next(e));
}

export default { fetch, get, create, update, list, listBySurvey, remove };
