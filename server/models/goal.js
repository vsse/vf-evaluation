import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Goal Schema
 */
const GoalSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Statics
 */
GoalSchema.statics = {
  /**
   * Get goal
   * @param {ObjectId} id - The objectId of goal.
   * @returns {Promise<Goal, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((goal) => {
        if (goal) {
          return goal;
        }
        const err = new APIError('No such goal exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List goals in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of goals to be skipped.
   * @param {number} limit - Limit number of goals to be returned.
   * @param {ObjectId} typeId - Filter number of goals to be returned by typeId.
   * @returns {Promise<Employee[]>}
   */
  list({ skip = 0, limit = 50, typeId } = {}) {
    const query = this.find();
    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (typeId) {
      query.where('type', typeId);
    }
    return query.execAsync();
  }
};

/**
 * @goaldef Goal
 */
export default mongoose.model('Goal', GoalSchema);
