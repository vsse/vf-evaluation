import Promise from 'bluebird';
import { isAdminOrSuperAdmin, unauthorizedError } from '../helpers/authentication';

function canGet(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    } else {
      reject(unauthorizedError);
    }
  });
}

function canCreate(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    }
    reject(unauthorizedError);
  });
}

function canList(req) {
  return new Promise((resolve, reject) => {
    if (isAdminOrSuperAdmin(req.user)) {
      resolve(null);
    } else {
      reject(unauthorizedError);
    }
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
