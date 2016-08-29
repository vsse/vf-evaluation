import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Category Schema
 */
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  goal: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
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
CategorySchema.statics = {
  /**
   * Get category
   * @param {ObjectId} id - The objectId of category.
   * @returns {Promise<Category, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((category) => {
        if (category) {
          return category;
        }
        const err = new APIError('No such category exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List categorys in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of categorys to be skipped.
   * @param {number} limit - Limit number of categorys to be returned.
   * @param {ObjectId} goalId - Filter number of categories to be returned by goalId.
   * @returns {Promise<Employee[]>}
   */
  list({ skip = 0, limit = 50, goalId } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (goalId) {
      query.where('goal', goalId);
    }
    return query.execAsync();
  }
};

/**
 * @categorydef Category
 */
export default mongoose.model('Category', CategorySchema);
