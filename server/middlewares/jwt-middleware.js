import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
}

export default function (req, res, next) {
  const token = req.get('Authorization');

  verify(token)
    .then((decode) => Employee.get(decode.employeeId))
    .then((employee) => {
      if (employee) {
        req.user = employee;  // eslint-disable-line no-param-reassign
        return next();
      }
      throw new APIError('User is not authorized!', httpStatus.UNAUTHORIZED);
    })
    .catch((e) => next(e));
}
