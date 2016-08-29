import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Type Schema
 */
const TypeSchema = new Schema({
  name: {
    type: String,
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
TypeSchema.statics = {
  /**
   * Get type
   * @param {ObjectId} id - The objectId of type.
   * @returns {Promise<Type, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((type) => {
        if (type) {
          return type;
        }
        const err = new APIError('No such type exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List types in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of types to be skipped.
   * @param {number} limit - Limit number of types to be returned.
   * @returns {Promise<Employee[]>}
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
 * @typedef Type
 */
export default mongoose.model('Type', TypeSchema);
