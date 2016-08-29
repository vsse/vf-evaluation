import Joi from 'joi';

export default {
  // POST /roles
  createLookup: {
    body: {
      name: Joi.string().required()
    }
  },

  // UPDATE /roles/:roleId
  updateRole: {
    body: {
      name: Joi.string()
    },
    params: {
      roleId: Joi.string().hex().required()
    }
  },
};
