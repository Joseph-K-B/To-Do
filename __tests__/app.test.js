require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('GET to-do list', async () => {
      const arr = 
      [{
        id: 1,
        todo: 'wash the dishes',
        completed: false,
        user_id: 2
      },
      {
        id: 2,
        todo: 'mow lawn',
        completed: false,
        user_id: 2
      },
      {
        id: 3,
        todo: 'fold laundry',
        completed: false,
        user_id: 2
      }
      ];
    });

    test('POSTS animals', async() => {

      // const expectation = [
       
      // ];

      const newAnimal = {
        name: 'Latte',
        cool_factor: 1000
      };

      const data = await fakeRequest(app)
        .post('/api/animals')
        .send(newAnimal)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.cool_factor).toEqual(newAnimal.cool_factor);
      expect(data.body.name).toEqual(newAnimal.name);
    });
  });
});
