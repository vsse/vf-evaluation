import Joi from 'joi';

export default {
  // POST /goals
  createGoal: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().hex().required()
    }
  },

  // UPDATE /goals/:goalId
  updateGoal: {
    body: {
      name: Joi.string(),
      type: Joi.string().hex().required()
    },
    params: {
      goalId: Joi.string().hex().required()
    }
  },
};
