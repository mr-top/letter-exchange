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
  const selectQuery = await query('SELECT u1.username AS sender_username, u1.country AS sender_country, letters.* FROM letters JOIN users AS u1 ON u1.id = letters.sender_id WHERE recipient_id IS NULL');

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, letters: result.rows }
  } else {
    return { success: false }
  }
}

async function getLetters(sourceId, targetId) {
  const selectQuery = await query('SELECT u1.username AS sender_username, u1.country AS sender_country, u2.username AS recipient_username, u2.country AS recipient_country, u2.city AS recipient_city, l.* FROM letters AS l JOIN users AS u1 ON u1.id = l.sender_id JOIN users AS u2 ON u2.id = l.recipient_id WHERE l.sender_id = $2 AND l.recipient_id = $1 OR l.sender_id = $1 AND l.recipient_id = $2', sourceId, targetId);

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, letters: result.rows }
  } else {
    return { success: false }
  }
}

async function getFriends(id) {
  const selectQuery = await query('SELECT u.*, r.*, r2.restrict AS blocked FROM users AS u JOIN relations AS r ON u.id = r.friend_id LEFT JOIN relations AS r2 ON r.user_id = r2.friend_id AND r.friend_id = r2.user_id WHERE r.user_id = $1 AND r.restrict = false', id);

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

async function rejectUser(sourceId, targetId) {
  const selectQuery = await query('SELECT * FROM relations WHERE user_id = $1 AND friend_id = $2 AND confirmed = false', sourceId, targetId);

  if (selectQuery.success) {
    const selectResult = selectQuery.result;
    if (selectResult.rowCount > 0) {
      const deleteQuery = await query('DELETE FROM relations WHERE user_id = $1 AND friend_id = $2 AND confirmed = false', sourceId, targetId);

      if (deleteQuery.success) {
        const updateQuery = await query('UPDATE relations SET confirmed = false, restrict = true WHERE user_id = $2 AND friend_id = $1 AND confirmed = true', sourceId, targetId);

        if (updateQuery.success && updateQuery.result.rowCount > 0) {
          return { success: true, msg: 'Relation deleted and target user restricted' }
        }

        // this update doesn't always have to run correct
        // job queue to remove restrict column from relations row after few days. no idea
      }

      return { success: true, msg: 'Relation deleted' }
    }
  }

  return { success: false, msg: 'Relation not found or some other error happened' }
}

async function saveChanges(statusChanges, profile) {
  const statusArray = Object.entries(statusChanges).filter(status => status[1]);
  const somethingChanged = statusArray;
  const errorList = [];

  if (somethingChanged) {
    for (let idx = 0; idx < statusArray.length; idx++) {
      const currentStatus = statusArray[idx];
      let success;
      switch (currentStatus[0]) {
        case 'quoteChanged':
          success = await saveQuote(profile.id, profile.description);
          if (!success) errorList.push(['quote', 'Failed to save quote']);
          break;
        case 'locationChanged':
          success = await saveLocation(profile.id, profile.country, profile.city, profile.latitude, profile.longitude);
          if (!success) errorList.push(['location', 'Failed to save location']);
          break;
      }
    }

    const allSaved = errorList.length <= 0;

    return { success: true, msg: allSaved ? 'All changes saved' : 'One or more errors occured', errorList }
  } else {
    return { success: false, msg: 'Nothing has changed as nothing to change' }
  }
}

async function saveQuote(id, quote) {
  const updateQuery = await query('UPDATE users SET description = $2 WHERE id = $1', id, quote);

  return updateQuery.result?.rowCount > 0;
}

async function saveLocation(id, country, city, lat, lon) {
  const updateQuery = await query('UPDATE users SET country = $2, city = $3, latitude = $4, longitude = $5 WHERE id = $1', id, country, city, lat, lon);

  return updateQuery.result?.rowCount > 0;
}

async function saveChangesPrivacy(id, statusChanges, acceptingFriends, acceptingLetters, usersToRemove) {
  const statusArray = Object.entries(statusChanges).filter(status => status[1]);
  const somethingChanged = statusArray;
  const errorList = [];

  let modifySuccess;
  let allModified;

  if (somethingChanged) {
    for (let idx = 0; idx < statusArray.length; idx++) {
      const currentStatus = statusArray[idx];
      let success;
      switch (currentStatus[0]) {
        case 'lettersAcceptChanged':
          success = await lettersToggle(id, acceptingLetters);
          if (!success) errorList.push(['toggleLetters', 'Failed to save letters toggle']);
          break;
        case 'friendsAcceptChanged':
          success = await friendsToggle(id, acceptingFriends);
          if (!success) errorList.push(['toggleFriends', 'Failed to save friends toggle']);
          break;
        case 'blockedListChanged':
          const result = await modifyBlockList(id, usersToRemove);
          modifySuccess = result.modifySuccess;
          allModified = result.allModified;
          if (!modifySuccess) errorList.push(['blockList', 'Failed to save block list mod']);
          break;
      }
    }

    const allSaved = errorList.length <= 0;

    return { success: true, msg: allSaved ? 'All changes saved' : 'One or more errors occured', errorList, usersRemoved: modifySuccess && (allModified ? 'all' : 'some')}
  } else {
    return { success: false, msg: 'Nothing has changed as nothing to change' }
  }
}

async function lettersToggle(id, value) {
  const updateQuery = await query('UPDATE users SET accepting_letters = $2 WHERE id = $1', id, value);

  return updateQuery.result?.rowCount > 0;
}

async function friendsToggle(id, value) {
  const updateQuery = await query('UPDATE users SET accepting_friends = $2 WHERE id = $1', id, value);

  return updateQuery.result?.rowCount > 0;
}

async function modifyBlockList(id, blocksToRemove) {
  const blockedUsersResult = await getBlockedUsers(id);

  if (blockedUsersResult.success) {
    const blockedUsersId = blockedUsersResult.list.map(user => user.friend_id);

    blocksToRemove.map(async personId => {
      let result;
      if (blockedUsersId.includes(personId)) {
        result = await query('UPDATE relations SET restrict = false WHERE user_id = $1 AND friend_id = $2', id, personId);
      } else {
        result = await query('INSERT INTO relations (user_id, friend_id, confirmed, restrict) VALUES ($1, $2, false, true)', id, personId);
      }

      return result.result?.rowCount > 0;
    })


  }

  return {modifySuccess: true, allModified: blocksToRemove.every(value => value)};
}

async function getBlockedUsers(id) {
  const selectQuery = await query('SELECT * FROM users AS u JOIN relations AS r ON u.id = r.friend_id WHERE r.user_id = $1 AND r.restrict = true', id)

  if (selectQuery.success) {
    const result = selectQuery.result;
    return { success: true, list: result.rows }
  } else {
    return { success: false }
  }
}

async function block(sourceId, targetId) {
  const selectQuery = await query('SELECT * FROM relations WHERE user_id = $1 AND friend_id = $2', sourceId, targetId);
  
  let result;
  if (selectQuery.success) {
    if (selectQuery.result.rowCount > 0) {
      const updateQuery = await query('UPDATE relations SET confirmed = false, restrict = true WHERE user_id = $1 AND friend_id = $2', sourceId, targetId);
      result = updateQuery;
    } else {
      const insertQuery = await query('INSERT INTO relations (user_id, friend_id, confirmed, restrict) VALUES ($1, $2, false, true)', sourceId, targetId);
      result = insertQuery;
    }
  }

  if (result.success) {
    if (result.result.rowCount > 0) {
      return {success: true, msg: 'Blocked'}
    } else {
      return {success: false, msg: 'Failed'}
    }
  }
}

async function report(sourceId, targetId, reportDetails) {
  const insertQuery = await query ('INSERT INTO reports (source_id, target_id, report) VALUES ($1, $2, $3)', sourceId, targetId, reportDetails);

  if (insertQuery.success) {
    const result = insertQuery.result;

    if (result.rowCount > 0) return {success: true, msg: 'Report filed'};
  }

  return {success: false, msg: 'Report could not be filed'}
}



module.exports = { ping, login, register, getOpenletters, getLetters, getFriends, getProfile, getDistance, createLetter, rejectUser, saveChanges, getBlockedUsers, saveChangesPrivacy, block, report }