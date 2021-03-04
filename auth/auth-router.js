const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const Users = require('../auth/auth-model')
const router = require('express').Router();

router.post('/register',async (req, res) => {
  // implement registration
  const credentials = req.body;

  const user = await Users.findUser(credentials.username)

  if (user.length == 0) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(credentials.password, rounds);

    credentials.password = hash;
    
    Users.addUser(credentials)
      .then(user => {
        const token = makeJwt(user);
        res.status(201).json({ data: user, token })
      })
      .catch(error => {
        res.status(401).json({ message: error.message })
      })
  } else {
    // res.status(400).json({
    //   message: 'Please provide username and password' 
    // })
    res.status(409).json({
      message: 'Please provide username and password' 
    })
  }
});

router.post('/login', async (req, res) => {
  // implement login
  const { username, password } = req.body;
  const user = await Users.findUser(username)
  if (!user) {res.status(400).json({
      message: 'Please provide username and password'
    })
  } else {
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
