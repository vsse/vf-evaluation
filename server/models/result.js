import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Employee from '../models/employee';
import Setting from '../models/setting';
import * as _ from 'lodash';

const Schema = mongoose.Schema;
/**
 * Result Schema
 */
const ResultSchema = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  evaluator: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  answers: [{
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    value: Number,
    comments: String
  }],
  seniorityWeight: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Methods
 */
ResultSchema.pre('save', function (next) {
  const evaluatorPromise = Employee.findById(this.evaluator).execAsync();
  const candidatePromise = Employee.findById(this.candidate).execAsync();
  const settingsPromise = Setting.list();

  return Promise.all([evaluatorPromise, candidatePromise, settingsPromise])
    .then(([evaluator, candidate, settings]) => {
      const weightObj = _.find(settings[0].seniorityWeights, {
        evaluatorRole: evaluator.role,
        candidateRole: candidate.role
      });
      const seniorityWeight = weightObj.weight; // eslint-disable-line no-param-reassign
      // Muliply the answer value by the seniority weight
      _.forEach(this.answers, (a) => {
        a.value *= seniorityWeight; // eslint-disable-line no-param-reassign
      });
      next();
    })
    .error((e) => next(e));
});

/**
 * Statics
 */
ResultSchema.statics = {
  /**
   * Get result
   * @param {ObjectId} id - The objectId of result.
   * @returns {Promise<Result, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('evaluator')
      .execAsync().then((result) => {
        if (result) {
          return result;
        }
        const err = new APIError('No such result exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List results in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of results to be skipped.
   * @param {number} limit - Limit number of results to be returned.
   * @param {ObjectId} surveyId - Limit number of results to be returned by survey.
   * @param {ObjectId} teamId - Limit number of results to be returned by team.
   * @param {ObjectId} evaluatorId - Limit number of results to be returned by evaluator.
   * @param {ObjectId} candidateId - Limit number of results to be returned by candidate.
   * @returns {Promise<Result[]>}
   */
  list({ skip = 0, limit = 50, surveyId, teamId, evaluatorId, candidateId, populate } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (surveyId) {
      query.where('surevy', surveyId);
    }
    if (teamId) {
      query.where('team', teamId);
    }
    if (evaluatorId) {
      query.where('evaluator', evaluatorId);
    }
    if (candidateId) {
      query.where('candidate', candidateId);
    }

    if (populate) {
      const populates = populate.split(',');
      _.forEach(populates, (p) => {
        query.populate(p);
      });
    }

    return query.execAsync();
  }
};

/**
 * @typedef Result
 */
export default mongoose.model('Result', ResultSchema);
