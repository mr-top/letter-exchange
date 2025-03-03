const query = require('./query');
const bcrypt = require('bcrypt');

async function hashPassword (password) {
  const hashedPassword = await bcrypt.hash(password, 2);
  return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function login (username, password) {
  const selectQuery = await query('SELECT * FROM users WHERE username = $1', username);

  if (selectQuery.success) {
    const result = selectQuery.result;
    
    if (result.rowCount > 0) {

      if (await checkPassword(password, result.rows[0].password)) {
        const {id, username, email, description, country} = result.rows[0];
      return {success: true, msg: 'User successfully found', id, username, email, description, country}
      };
      return {success: false, msg: 'User successfully found but password not correct'}
    } else {
      return {success: false, msg: 'Could not find account with these records'}
    }

  } else {
    return {success: false, msg: 'Fatal error trying to access records'}
  }
}

async function register (username, email, password, country) {
  const hashedPassword = await hashPassword(password);
  const insertQuery = await query('INSERT INTO users (username, email, password, country) VALUES ($1, $2, $3, $4)', username, email, hashedPassword, country);

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

async function getOpenletters (id) {
  const selectQuery = await query('SELECT * FROM letters WHERE recipient_id IS NULL');

  if (selectQuery.success) {
    const result = selectQuery.result;
    return {success: true, letters: result.rows}
  } else {
    return {success: false}
  }
}

async function getLetters (sourceId, targetId) {
  const selectQuery = await query('SELECT * FROM letters WHERE sender_id = $2 AND recipient_id = $1 OR sender_id = $1 AND recipient_id = $2', sourceId, targetId);

  if (selectQuery.success) {
    const result = selectQuery.result;
    return {success: true, letters: result.rows}
  } else {
    return {success: false}
  }
}

async function getFriends (id) {
  const selectQuery = await query('SELECT * FROM users AS u JOIN relations AS r ON u.id = r.friend_id WHERE r.user_id = $1 AND r.confirmed = true', id)

  if (selectQuery.success) {
    const result = selectQuery.result;
    return {success: true, friends: result.rows}
  } else {
    return {success: false}
  }
}

async function getProfile (id) {
  const selectQuery = await query('SELECT * FROM users WHERE id = $1', id);

  if (selectQuery.success && selectQuery.result.rowCount > 0) {
    const result = selectQuery.result;
    return {success: true, profile: result.rows[0]}
  } else {
    return {success: false}
  }
}

module.exports = { login, register, getOpenletters, getLetters, getFriends, getProfile}