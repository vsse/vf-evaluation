import Joi from 'joi';

export default {
  // POST /questions
  createQuestion: {
    body: {
      type: Joi.string().hex().required(),
      goal: Joi.string().hex().required(),
      category: Joi.string().hex().required(),
      content: Joi.string().required(),
      weight: Joi.number().required(),
      availabilities: Joi.array().unique(),
      evaluators: Joi.array().unique()
    }
  },

  // UPDATE /questions/:questionId
  updateQuestion: {
    body: {
      type: Joi.string().hex().required(),
      goal: Joi.string().hex().required(),
      category: Joi.string().hex().required(),
      content: Joi.string().required(),
      weight: Joi.number().required(),
      availabilities: Joi.array().unique(),
      evaluators: Joi.array().unique()
    },
    params: {
      questionId: Joi.string().hex().required()
    }
  },
};
