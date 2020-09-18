const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../auth/auth-model')
const router = require('express').Router();

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.addUser(credentials)
      .then(user => {
        const token = makeJwt(user);
        res.status(201).json({ data: user, token })
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({
      message: 'Please provide username and password' 
    })
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findUser(username)
      .then(([user]) => {
        if  (user && bcrypt.compareSync(password, user.password)) {
          const token = makeJwt(user);
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credientials' })
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({
      message: 'Please provide username and password'
    })
  }
});

function makeJwt({ id, username }) {
  const payload = {
    username,
    id,
  }
  const config = {
    jwtSecret: process.env.JWT_SECRET || 'is it secret, is it safe?'
  }
  const options = {
    expiresIn: '24 hours'
  }

  return jwt.sign(payload, config.jwtSecret, options)
}

module.exports = router;
