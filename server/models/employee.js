import mongoose from 'mongoose';
import * as _ from 'lodash';
import permissionConstants from '../constants/permissions';

const Schema = mongoose.Schema;
/**
 * Employee Schema
 */
const EmployeeSchema = new Schema({
  staffId: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  isManager: {
    type: Boolean,
    required: true
  },
  kind: {
    type: String,
    enum: [
      permissionConstants.PUBLIC,
      permissionConstants.ADMIN,
      permissionConstants.SUPERADMIN
    ]
  },
  code: {
    value: String,
    expiredAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Update employee's verification code for authentication.
 * @param {string} code - Verification code.
 * @returns {Promise<Employee>} - Updated employee
 */
EmployeeSchema.method('updateCode', function (code) {
  if (code) {
    this.code = code;
  }
  return this.saveAsync();
});

/**
 * Statics
 */
EmployeeSchema.statics = {
  /**
   * Get employee
   * @param {ObjectId} id - The objectId of employee.
   * @returns {Promise<Employee, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync();
  },

  /**
   * List employees in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of employees to be skipped.
   * @returns {Promise<Employee[]>}
   */
  list({
    skip = 0, limit = 50, staffId, name, role, email, team, isManager, manager, kind, populate
  } = {}) {
    const query = this.find();

    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (staffId) {
      query.where('staffId', staffId);
    }

    if (name) {
      query.where('name', name);
    }

    if (role) {
      query.where('role', role);
    }

    if (email) {
      query.where('email', email);
    }

    if (team) {
      query.where('team', team);
    }

    if (typeof isManager !== 'undefined') {
      query.where('isManager', isManager);
    }

    if (manager) {
      query.where('manager', manager);
    }

    if (kind) {
      query.where('kind', kind);
    }

    if (populate) {
      const populates = populate.split(',');
      _.forEach(populates, (p) => {
        query.populate(p);
      });
    }

    return query.execAsync();
  },

  /**
   * Get employee by staffId and email for authentication.
   * @param {number} staffId - Unique number per employee.
   * @param {string} email - Email of the employee.
   * @returns {Promise<Employee[]>}
   */
  checkExistence({ staffId, email } = {}) {
    return this.list({ staffId, email });
  },
  /**
   * Update employee's verification code for authentication.
   * @param {Employee} employee - Employee object.
   * @param {string} code - Verification code.
   * @returns {Promise<Employee>} - Updated employee
   */
  updateCode(employee, code) {
    return employee.updateCode(code);
  },
};

/**
 * @typedef Employee
 */
export default mongoose.model('Employee', EmployeeSchema);
