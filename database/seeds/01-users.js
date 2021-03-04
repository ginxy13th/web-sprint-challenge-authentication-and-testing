
exports.seed = async function(knex) {
	await knex('users').insert([
		{
      username: 'name',
      password: 'password'
		}
	])
}