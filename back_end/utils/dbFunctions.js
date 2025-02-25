const query = require('./query');

async function login (username, password) {
  const selectQuery = await query('SELECT * FROM users WHERE username = $1 AND password = $2', username, password);

  if (selectQuery.success) {
    const result = selectQuery.result;
    
    if (result.rowCount > 0) {

      const {id, username, email, description, country} = result.rows[0];
      return {success: true, msg: 'User successfully found', id, username, email, description, country}
    } else {
      return {success: false, msg: 'Could not find account with these records'}
    }

  } else {
    return {success: false, msg: 'Fatal error trying to access records'}
  }
}

async function register (username, email, password, country) {
  const insertQuery = await query('INSERT INTO users (username, email, password, country) VALUES ($1, $2, $3, $4)', username, email, password, country);

  if (insertQuery.success) {
    const result = insertQuery.result;

    if (result.rowCount > 0) {
      return {success: true, msg: 'User successfully inserted'}
    } else {
      return {success: false, msg: 'Could not insert with details'}
    }

  } else {
    return {success: false, msg: 'Fatal error trying to access records'}
  }
}

module.exports = { login, register }