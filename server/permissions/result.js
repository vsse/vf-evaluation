import Promise from 'bluebird';
import {
  isAdminOrSuperAdmin,
  isManager,
  isManagerToEmployee,
  unauthorizedError
} from '../helpers/authentication';

function canGet(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user) &&
      isManager(req.user) &&
      isManagerToEmployee(req.user, req.result.evaluator)) {
      resolve(null);
    }
    reject(unauthorizedError);
  });
}

function canCreate(req) {
  return new Promise((resolve, reject) => {
    if (req.user) {
      resolve(null);
    } else {
      reject(unauthorizedError);
    }
  });
}

function canList(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    }
    reject(unauthorizedError);
  });
}

function canUpdate(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    }
    reject(unauthorizedError);
  });
}

function canRemove(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    }
    reject(unauthorizedError);
  });
}

export default { canGet, canCreate, canList, canUpdate, canRemove };
