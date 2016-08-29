import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;
/**
 * Role Schema
 */
const RoleSchema = new Schema({
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
RoleSchema.statics = {
  /**
   * Get role
   * @param {ObjectId} id - The objectId of role.
   * @returns {Promise<Role, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((role) => {
        if (role) {
          return role;
        }
        const err = new APIError('No such role exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List roles in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of roles to be skipped.
   * @param {number} limit - Limit number of roles to be returned.
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
 * @roledef Role
 */
export default mongoose.model('Role', RoleSchema);
