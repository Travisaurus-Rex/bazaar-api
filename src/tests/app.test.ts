/* eslint-env jest */

//import request from 'supertest';
import app from '../app';

describe('GET /', () => {
    it('Should return 200 success', async () => {
        const res = await app.get('/');
        console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('success!');
    })
})