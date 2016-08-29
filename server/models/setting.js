import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Setting Schema
 */
const SettingSchema = new Schema({
  seniorityWeights: [{
    evaluatorRole: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    candidateRole: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    weight: {
      type: Number,
      required: true
    }
  }]
});

/**
 * Statics
 */
SettingSchema.statics = {
  /**
   * Get setting
   * @param {ObjectId} id - The objectId of setting.
   * @returns {Promise<Setting, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((setting) => {
        if (setting) {
          return setting;
        }
        const err = new APIError('No such setting exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Settings in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of Settings to be skipped.
   * @param {number} limit - Limit number of Settings to be returned.
   * @returns {Promise<Setting[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return query.execAsync();
  }
};

/**
 * @typedef Setting
 */
export default mongoose.model('Setting', SettingSchema);
