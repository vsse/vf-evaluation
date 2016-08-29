import Joi from 'joi';

export default {
  // POST /types
  createLookup: {
    body: {
      name: Joi.string().required()
    }
  },

  // UPDATE /types/:typeId
  updateType: {
    body: {
      name: Joi.string()
    },
    params: {
      typeId: Joi.string().hex().required()
    }
  },
};
