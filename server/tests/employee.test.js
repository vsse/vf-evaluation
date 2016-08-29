import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Employee APIs', () => {
  let employee = {
    staffId: '24224',
    name: 'Basim Hennawi',
    role: '57ae31390cc83508210155e4',
    email: 'basim.hennawi@vodafone.com',
    team: '57acf280a32c9b1017c3e20a',
    manager: '57acf80d246906342aa62bfe',
    isManager: false,
    kind: 'admin'
  };

  describe('# POST /api/employees', () => {
    it('should create a new employee', (done) => {
      request(app)
        .post('/api/employees')
        .send(employee)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.staffId).to.equal(employee.staffId);
          expect(res.body.name).to.equal(employee.name);
          expect(res.body.role).to.equal(employee.role);
          expect(res.body.email).to.equal(employee.email);
          employee = res.body;
          done();
        });
    });
  });

  describe('# GET /api/employees/:employeeId', () => {
    it('should get employee details', (done) => {
      request(app)
        .get(`/api/employees/${employee._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.staffId).to.equal(employee.staffId);
          expect(res.body.name).to.equal(employee.name);
          expect(res.body.role).to.equal(employee.role);
          expect(res.body.email).to.equal(employee.email);
          done();
        });
    });

    it('should report error with message - Not found, when employee does not exists', (done) => {
      request(app)
        .get('/api/employees/57acf7c0246906342aa62bfd')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found');
          done();
        });
    });
  });

  describe('# PUT /api/employees/:employeeId', () => {
    it('should update employee details', (done) => {
      employee.name = 'Basim Amr Hennawi';
      request(app)
        .put(`/api/employees/${employee._id}`)
        .send(employee)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.name).to.equal('Basim Amr Hennawi');
          expect(res.body.name).to.equal(employee.name);
          expect(res.body.role).to.equal(employee.role);
          expect(res.body.email).to.equal(employee.email);
          done();
        });
    });
  });

  describe('# GET /api/employees/', () => {
    it('should get all employees', (done) => {
      request(app)
        .get('/api/employees')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('# DELETE /api/employees/', () => {
    it('should delete employee', (done) => {
      request(app)
        .delete(`/api/employees/${employee._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.name).to.equal('Basim Amr Hennawi');
          expect(res.body.name).to.equal(employee.name);
          expect(res.body.role).to.equal(employee.role);
          expect(res.body.email).to.equal(employee.email);
          done();
        });
    });
  });
});
