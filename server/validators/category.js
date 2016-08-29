import Joi from 'joi';

export default {
  // POST /categories
  createCategory: {
    body: {
      name: Joi.string().required(),
      goal: Joi.string().hex().required()
    }
  },

  // UPDATE /categories/:categoryId
  updateCategory: {
    body: {
      name: Joi.string(),
      goal: Joi.string().hex().required()
    },
    params: {
      categoryId: Joi.string().hex().required()
    }
  },
};
