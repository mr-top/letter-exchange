const query = require('./query');
const haversine = require('./haversine');
const bcrypt = require('bcrypt');

async function ping(id) {
  const selectQuery = await query('SELECT id FROM users WHERE id = $1', id);

  if (selectQuery.success) {
    const result = selectQuery.result;

    if (result.rowCount > 0) {
      return { success: true }
    } else {
      return { success: true, forceLogout: true }
    }
  } else {
    return { success: false }
  }
}

async function hashPassword(password) {
  // const hashedPassword = await bcrypt.hash(password, 2);
  // return hashedPassword;
  return password;
}

async function checkPassword(password, hashedPassword) {
  // return await bcrypt.compare(password, hashedPassword);
  return password === hashedPassword;
}

async function login(username, password) {
  const selectQuery = await query('SELECT * FROM users WHERE username = $1', username);

  if (selectQuery.success) {
    const result = selectQuery.result;

    if (result.rowCount > 0) {

      if (await checkPassword(password, result.rows[0].password)) {
        const { id, username, email, description, country } = result.rows[0];
        return { success: true, msg: 'User successfully found', id, username, email, description, country }
      };
      return { success: false, msg: 'User successfully found but password not correct' }
    } else {
      return { success: false, msg: 'Could not find account with these records' }
    }

  } else {
    return { success: false, msg: 'Fatal error trying to access records' }
  }
}

async function register(username, email, password, geo) {
  const hashedPassword = await hashPassword(password);
  const insertQuery = await query('INSERT INTO users (username, email, password, country, city, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7)', username, email, hashedPassword, geo.countryCode, geo.city, geo.lat, geo.lon);

  if (insertQuery.success) {
    const result = insertQuery.result;

    if (result.rowCount > 0) {
      return { success: true, msg: 'User successfully inserted' }
    } else {
      return { success: false, msg: 'Could not insert with details' }
    }

  } else {
    return { success: false, msg: 'Fatal error trying to access records' }
  }
}

async function getOpenletters(id) {
  const selectQuery = await query('SELECT u1.username AS sender_username, letters.* FROM letters JOIN users AS u1 ON u1.id = letters.sender_id WHERE recipient_id IS NULL');

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, letters: result.rows }
  } else {
    return { success: false }
  }
}

async function getLetters(sourceId, targetId) {
  const selectQuery = await query('SELECT u1.username AS sender_username, u2.username AS recipient_username, l.* FROM letters AS l JOIN users AS u1 ON u1.id = l.sender_id JOIN users AS u2 ON u2.id = l.recipient_id WHERE l.sender_id = $2 AND l.recipient_id = $1 OR l.sender_id = $1 AND l.recipient_id = $2', sourceId, targetId);

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, letters: result.rows }
  } else {
    return { success: false }
  }
}

async function getFriends(id) {
  const selectQuery = await query('SELECT * FROM users AS u JOIN relations AS r ON u.id = r.friend_id WHERE r.user_id = $1 AND r.confirmed = true', id)

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, friends: result.rows }
  } else {
    return { success: false }
  }
}

async function getProfile(id) {
  const selectQuery = await query('SELECT * FROM users WHERE id = $1', id);

  if (selectQuery.success && selectQuery.result.rowCount > 0) {
    const result = selectQuery.result;
    return { success: true, profile: result.rows[0] }
  } else {
    return { success: false }
  }
}

async function getDistance(sourceId, targetId) {
  const selectQuerySource = await query('SELECT latitude, longitude FROM users WHERE id = $1', sourceId);
  const selectQueryTarget = await query('SELECT latitude, longitude FROM users WHERE id = $1', targetId);

  if (selectQuerySource.success && selectQueryTarget.success) {
    const resultSource = selectQuerySource.result.rows[0] || {};
    const resultTarget = selectQueryTarget.result.rows[0] || {};

    if (resultSource.latitude && resultSource.longitude) {
      if (resultTarget.latitude && resultTarget.longitude) {
        const distanceKm = haversine(resultSource.latitude, resultSource.longitude, resultTarget.latitude, resultTarget.longitude);
        return { success: true, distanceKm }
      } else {
        return { success: false, msg: 'They have not set up their location' }
      }
    } else {
      return { success: false, msg: 'You have not set up your location' }
    }
  } else {
    return { success: false, msg: 'Users could not be compared as one of them was not found' }
  }
}

async function createLetter(sourceId, targetId, letterContent, letterLength, distanceKm) {
  const estimateMseconds = distanceKm * 60 * 1000;
  const estimateTimestamp = new Date(Date.now() + estimateMseconds).toJSON();

  const insertQuery = await query('INSERT INTO letters (sender_id, recipient_id, content, length, arrival_date) VALUES ($1, $2, $3, $4, $5)', sourceId, targetId, letterContent, letterLength, estimateTimestamp);

  if (insertQuery.success) {
    const result = insertQuery.result;
    if (result.rowCount > 0) {
      return { success: true }
    } else {
      return { success: false }
    }
  } else {
    return insertQuery;
  }
}

module.exports = { ping, login, register, getOpenletters, getLetters, getFriends, getProfile, getDistance, createLetter }