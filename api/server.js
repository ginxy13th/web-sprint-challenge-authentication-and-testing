const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors({
    origin: "*",
    creditentials: true
}));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);
server.use((err, req, res, next) => {
	console.dir(err)
	res.status(500).json({ errorMessage: 'Something went wrong' })
})
module.exports = server;
