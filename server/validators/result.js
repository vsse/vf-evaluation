import Joi from 'joi';

export default {
  // POST /results
  createResult: {
    body: {
      survey: Joi.string().hex().required(),
      team: Joi.string().hex().required(),
      evaluator: Joi.string().hex().required(),
      candidate: Joi.string().hex().required(),
      answers: Joi.array().unique()
    }
  },

  // UPDATE /results/:resultId
  updateResult: {
    body: {
      survey: Joi.string().hex().required(),
      team: Joi.string().hex().required(),
      evaluator: Joi.string().hex().required(),
      candidate: Joi.string().hex().required(),
      answers: Joi.array().unique()
    },
    params: {
      resultId: Joi.string().hex().required()
    }
  },
};
