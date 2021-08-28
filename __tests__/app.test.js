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
    }, 1000000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('POSTS todos', async() => {

      // const expectation = [
       
      // ];

      const newToDo = {
        id:4,
        to_do: 'Feed fish',
        completed: false,
        user_id: 2
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(newToDo)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.completed).toEqual(newToDo.completed);
      expect(data.body.to_do).toEqual(newToDo.to_do);
      expect(data.body.user_id).toEqual(newToDo.user_id);
    });

    test('GET to-do list', async () => {
      
      const expectation = {
        id:4,
        to_do: 'Feed fish',
        completed: false,
        user_id: 2
      };

      const data = fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type, /json/')
        .expect(200);

      expect (data.to_do).toEqual(expectation);
      // expect (data.completed).toEqual(arr.completed);
    });


    test ('PUT /api/todos updates object', async ()=> {
      const newData = {
        id: 1,
        to_do: 'Walk the Dog',
        completed: false,
        user_id: 2
      };
      const data = await fakeRequest(app)
        .put('/api/todos/1')
        .send(newData)
        .set('Authorization', token);
        // .expect(200)
        // .expect('Content-Type', /json/);

      expect(data.body.to_do).toEqual(newData.to_do);
      expect(data.body.completed).toEqual(newData.completed);
      expect(data.body.user_id).toEqual(newData.user_id);
    });
  });
});
