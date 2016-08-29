import Joi from 'joi';

export default {
  // POST /employees
  createEmployee: {
    body: {
      staffId: Joi.number().required(),
      name: Joi.string().required(),
      role: Joi.any().required(),
      email: Joi.string().email()
    }
  },

  // UPDATE /employees/:employeeId
  updateEmployee: {
    body: {
      staffId: Joi.number(),
      name: Joi.string(),
      role: Joi.any(),
      email: Joi.string()
    },
    params: {
      employeeId: Joi.string().hex().required()
    }
  },
};
