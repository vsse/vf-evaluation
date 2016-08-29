import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import * as _ from 'lodash';

const Schema = mongoose.Schema;
/**
 * Survey Schema
 */
const SurveySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }],
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
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
SurveySchema.statics = {
  /**
   * Get survey
   * @param {ObjectId} id - The objectId of survey.
   * @returns {Promise<Survey, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((survey) => {
        if (survey) {
          return survey;
        }
        const err = new APIError('No such survey exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List surveys in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of surveys to be skipped.
   * @param {number} limit - Limit number of surveys to be returned.
   * @param {ObjectId} teamId - Filter surveys to be returned by teamId.
   * @returns {Promise<Survey[]>}
   */
  list({ skip = 0, limit = 50, teamId, populate } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (teamId) {
      query.where('teams', teamId);
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
 * @typedef Survey
 */
export default mongoose.model('Survey', SurveySchema);
