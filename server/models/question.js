import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Survey from './survey';
import Employee from './employee';
import * as _ from 'lodash';

const Schema = mongoose.Schema;
/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
    required: true
  },
  goal: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  availabilities: [{
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  }],
  evaluators: [{
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Statics
 */
QuestionSchema.statics = {
  /**
   * Get question
   * @param {ObjectId} id - The objectId of question.
   * @returns {Promise<Question, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((question) => {
        if (question) {
          return question;
        }
        const err = new APIError('No such question exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List questions in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of questions to be skipped.
   * @param {number} limit - Limit number of questions to be returned.
   * @returns {Promise<Question[]>}
   */
  list({ skip = 0, limit = 50, populate } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (populate) {
      const populates = populate.split(',');
      _.forEach(populates, (p) => {
        query.populate(p);
      });
    }

    return query.execAsync();
  },

  /**
   * List questions in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of questions to be skipped.
   * @param {number} limit - Limit number of questions to be returned.
   * @returns {Promise<Question[]>}
   */
  listBySurvey({ skip = 0, limit = 50, surveyId, evaluatorId, candidateId, populate } = {}) {
    const query = this.find();
    let surveyPromise = Promise.resolve();
    let evaluatorPromise = Promise.resolve();
    let candidatePromise = Promise.resolve();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (surveyId) {
      surveyPromise = Survey.findById(surveyId).execAsync();
    }
    if (evaluatorId) {
      evaluatorPromise = Employee.findById(evaluatorId).execAsync();
    }
    if (candidateId) {
      candidatePromise = Employee.findById(candidateId).execAsync();
    }

    return Promise.all([surveyPromise, evaluatorPromise, candidatePromise])
      .then((res) => {
        const survey = res[0];
        const evaluator = res[1];
        const candidate = res[2];
        if (survey) {
          query.where('_id', { $in: survey.questions });
        }
        if (evaluator) {
          query.where('evaluators', evaluator.role);
        }
        if (candidate) {
          query.where('availabilities.role', candidate.role);
        }

        if (populate) {
          const populates = populate.split(',');
          _.forEach(populates, (p) => {
            query.populate(p);
          });
        }
        return query.execAsync();
      });
  }
};

/**
 * @typedef Question
 */
export default mongoose.model('Question', QuestionSchema);
