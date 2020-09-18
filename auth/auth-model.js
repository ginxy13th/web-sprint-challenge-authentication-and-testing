const db = require('../database/dbConfig');

function addUser(user) {
    return db('users').insert(user)
}

function findUser(username) {
    return db('users').where('users.username', username)
}

module.exports = {
    addUser,
    findUser
}