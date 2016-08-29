import Joi from 'joi';

export default {
  // POST /teams
  createTeam: {
    body: {
      name: Joi.string().required()
    }
  },

  // UPDATE /teams/:teamId
  updateTeam: {
    body: {
      name: Joi.string()
    },
    params: {
      teamId: Joi.string().hex().required()
    }
  },
};
