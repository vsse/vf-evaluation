import Promise from 'bluebird';
import Random from 'random-js';
import sendgrid from 'sendgrid';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

/**
 * Encode staffId
 */
function generateRandomCode() {
  const prefix = 'vf-';
  const random = new Random();
  const randomValue = random.integer(1000, 9999);
  console.log('code:', `${prefix}${randomValue}`);
  const value = `${prefix}${randomValue}`;
  const expiredAt = new Date();
  expiredAt.setHours(expiredAt.getHours() + 1);

  return { value, expiredAt };
}

/**
 * Check the validity of the expiry date
 */
function isExpiryDateValid(expiryDate) {
  return expiryDate > new Date();
}

/**
 * Send email with verification code
 */
function sendEmailwithVerificationCode(employee) {
  try {
    const sg = sendgrid(process.env.SENDGRID_API_KEY);
    const sendMailRequest = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [{ email: `${employee.name} <${employee.email}>` }],
            subject: 'Login verification code - Vodafone evaluation!'
          }
        ],
        from: { email: 'Vodafone Evaluation tool <VF.Evaluation@vodafone.com>' },
        content: [
          {
            type: 'text/html',
            value: `Dear ${employee.name},
              <br/><br/>Thanks for your signing in to Vodafone Evaluation.<br/><br/>
              You now can log in within <b>an hour</b> using this verification code:
              <b>${employee.code.value}</b><br/><br/>Thank you for your time in advance
              taking our surveys.<br/><br/>---<em><br/>Please don't reply to this email,
              and if you don't try to sign in, ignore this email.</em><br/>---<br/><br/>
              Vodafone evaluation.`
          }
        ]
      }
    });
    return sg.API(sendMailRequest); // eslint-disable-line new-cap
  } catch (e) {
    return Promise.reject(new APIError(e)); // eslint-disable-line new-cap
  }
}

/**
 * Load employee and append to req.
 */
function login(req, res, next) {
  const { staffId, email } = req.body;

  Employee.checkExistence({ staffId, email })
    .then((employees) => {
      if (!(employees.length > 0)) {
        throw new APIError('No such employee exists with both staffId and email you entered!',
          httpStatus.NOT_FOUND);
      }
      return Employee.updateCode(employees[0], generateRandomCode());
    })
    .then((updatedEmployee) => sendEmailwithVerificationCode(updatedEmployee))
    .then((response) => res.json(response))
    .catch((e) => next(e));
}

/**
 * Verify the code against the staffId
 */
function verify(req, res, next) {
  const { staffId, code } = req.query;

  Employee.findOne({ staffId })
    .then((employee) => {
      if (!employee) {
        throw new APIError('StaffId is invalid!');
      }
      if (employee.code.value !== code) {
        throw new APIError('Code is invalid!');
      }
      if (!isExpiryDateValid(employee.code.expiredAt)) {
        throw new APIError('Code is expired!');
      }
      // Generate token for this employee
      const token = jwt.sign({ employeeId: employee._id }, process.env.SECRET_KEY);
      res.send(token);
    })
    .catch((e) => next(e));
}

export default { login, verify };
