import Joi from 'joi';

export default {
  // POST /surveys
  createSurvey: {
    body: {
      name: Joi.string().required(),
      teams: Joi.array().unique(),
      questions: Joi.array().unique()
    }
  },

  // UPDATE /surveys/:surveyId
  updateSurvey: {
    body: {
      name: Joi.string().required(),
      teams: Joi.array().unique(),
      questions: Joi.array().unique()
    },
    params: {
      surveyId: Joi.string().hex().required()
    }
  },
};
