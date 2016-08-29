import permissionConstants from '../constants/permissions';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

function isAdmin(user) {
  return user.kind === permissionConstants.ADMIN;
}

function isSuperAdmin(user) {
  return user.kind === permissionConstants.SUPERADMIN;
}

function isAdminOrSuperAdmin(user) {
  return isAdmin(user) || isSuperAdmin(user);
}

function isManager(user) {
  return user.isManager;
}

function isManagerToEmployee(user, employee) {
  return user._id.toString() === employee.manager.toString();
}

const unauthorizedError = new APIError('This user is not authorized!', httpStatus.UNAUTHORIZED);

export default {
  isAdmin,
  isSuperAdmin,
  isAdminOrSuperAdmin,
  isManager,
  isManagerToEmployee,
  unauthorizedError,
};
