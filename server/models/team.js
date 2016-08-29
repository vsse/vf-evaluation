import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Team Schema
 */
const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

TeamSchema.statics = {
  /**
   * Get team
   * @param  {ObjectId} id - The objectId of team
   * @return {Promise<Employee, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((team) => {
        if (team) {
          return team;
        }
        const err = new APIError('No such team exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * List teams in descending order of 'createdAt' timestamp
   * @param  {number} skip - Number of teams to be skipped
   * @param  {number} limit - Limit number of teams to be returned
   * @return {Promise<Team[]>}
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
 * @typedef {Team}
 */
export default mongoose.model('Team', TeamSchema);
