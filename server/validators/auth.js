import Joi from 'joi';

export default {
  // POST /authentication/login
  login: {
    body: {
      staffId: Joi.number().required(),
      email: Joi.string().email()
    }
  },
};
