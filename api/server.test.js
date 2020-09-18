const supertest = require('supertest')
const server = require('../api/server')

  const db = require('../database/dbConfig')


// beforeAll(async () => {
//     await db.seed.run()
// })
// afterAll(async () => {
//     await db.destroy()
// })

describe('test unauth get', () => {
    it("GET /api/jokes (Unauthorized)", async () => {
        const res = await supertest(server).get("/api/jokes/")
        expect(res.status).toBe(401)
    })
    // it("POST '/login' (Invalid Credentials)", async () => {
    //     const res = await supertest(server).post('/api/auth/login')
    //     expect(res.status).toBe(500)
    // })
    
})

describe('register', () => {
    it("POST /register (new user)", async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({ username: '2345', password: 'password' })
        .then(res => {
            expect(res.status).toBe(201)
        })
    })
    it("POST /register (user exists)", async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({ username: 'ginxy', password: 'password'})
        expect(res.status).toBe(409)
    })
})

describe('login', () => {
    it("POST '/login' (invalid credentials)", async () => {
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({
            username: 'ginxy',
            password: 'wrongpassword'
        })
        token = res.body.token
        expect(res.status).toBe(401)
    })
    it("POST '/login' (valid credentials)", async () => { 
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({
            username: '2345',
            password: 'password'
        })
        token = res.body.token
        expect(res.status).toBe(200)
    })
    it('Get /api/jokes (authorized)', async () => {
        const res = await await supertest(server).get('/api/jokes/')
        .set(token = `${token}`)
        expect(res.status).toBe(200)
    })
})