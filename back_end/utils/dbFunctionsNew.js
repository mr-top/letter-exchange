const query = require('./query');
const haversine = require('./haversine');
const bcrypt = require('bcrypt');

class DbFunctions {
  constructor(logged, userId) {
    this.logged = Boolean(logged);
    this.id = Number(userId);
  }

  async signout(id) {
    const logged = this.logged;
    const serverUserId = this.id;
    const clientUserId = Number(id);

    if (logged) {
      return serverUserId === clientUserId;
    }
  }

  async signin(inputUsername, inputPassword) {
    const selectQuery = await query('SELECT * FROM users WHERE username = $1', inputUsername);

    if (selectQuery.success) {
      const userFound = selectQuery.result.rowCount > 0;

      if (userFound) {
        const foundUser = selectQuery.result.rows[0];

        // bcrypt not turned on!!
        if (foundUser.password === inputPassword) {
          return { success: true, msg: 'Signed in successfully', details: { username: foundUser.username, id: foundUser.id, avatar: foundUser.avatar } }
        } else {
          return { msg: 'Username found but password not correct' }
        }
      } else {
        return { msg: 'Username not found' }
      }
    } else {
      return { msg: 'Database error' }
    }
  }

  async signup(inputUsername, inputEmail, inputPassword, geo) {
    const usernameSelectQuery = await query('SELECT * FROM users WHERE username = $1', inputUsername);
    let usernameExists = false;
    const emailSelectQuery = await query('SELECT * FROM users WHERE email = $1', inputEmail);
    let emailExists = false;

    if (usernameSelectQuery.success && emailSelectQuery.success) {
      usernameExists = usernameSelectQuery.result.rowCount > 0;
      emailExists = emailSelectQuery.result.rowCount > 0;
    } else {
      return { msg: 'Database error' }
    }

    if (usernameExists || emailExists) {
      return { msg: 'Field already exists', usernameExists, emailExists }
    }

    const insertQuery = await query('INSERT INTO users (username, email, password, country, city, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7)', inputUsername, inputEmail, inputPassword, geo.countryCode, geo.city, geo.lat, geo.lon);

    if (insertQuery.success) {
      const result = insertQuery.result;

      if (result.rowCount > 0) {
        return { success: true, msg: 'User successfully inserted' }
      } else {
        return { msg: 'Could not insert with details' }
      }

    } else {
      return { msg: 'Database error' }
    }
  }

  async getOpenLetters() {
    if (this.logged) {
      const selectQuery = await query('SELECT u1.username AS sender_username, u1.country AS sender_country, l.* FROM letters AS l JOIN users AS u1 ON l.sender_id = u1.id WHERE l.recipient_id is NULL');

      const sourceBlockListQuery = await query('SELECT friend_id AS id FROM relations WHERE restrict = true AND user_id = $1', this.id);

      if (selectQuery.success && sourceBlockListQuery.success) {
        const result = selectQuery.result;

        const blockList = sourceBlockListQuery.result.rows.map(friend => friend.id);
        result.rows = result.rows.filter(letter => !blockList.includes(letter.sender_id));

        return { success: true, msg: 'Letters returned', letters: result.rows }
      } else {
        return { msg: 'Database error' }
      }
    } else {
      return { msg: 'Permission denied' }
    }
  }

  async getLetters(targetId) {
    const selectQuery = await query('SELECT l.*, u1.username AS sender_username, u1.country AS sender_country, u2.username AS recipient_username, u2.country AS recipient_country, u2.city AS recipient_city FROM letters AS l JOIN users AS u1 ON l.sender_id = u1.id JOIN users AS u2 ON l.recipient_id = u2.id WHERE (l.sender_id = $1 AND l.recipient_id = $2) OR (l.sender_id = $2 AND l.recipient_id = $1)', this.id, targetId);

    if (selectQuery.success) {
      const result = selectQuery.result;
      return { success: true, msg: 'Letters returned', letters: result.rows }
    } else {
      return { msg: 'Database error' }
    }
  }

  async getFriends() {
    const selectQuery = await query('SELECT r.*, u1.username FROM relations AS r JOIN users AS u1 ON r.friend_id = u1.id WHERE r.user_id = $1 AND r.restrict = false', this.id);

    const sourceBlockedListQuery = await query('SELECT user_id AS id FROM relations WHERE restrict = true AND friend_id = $1', this.id);

    if (selectQuery.success && sourceBlockedListQuery.success) {
      const result = selectQuery.result;

      const blockedList = sourceBlockedListQuery.result.rows.map(user => user.id);
      result.rows = result.rows.map(user => { return { ...user, blocked: blockedList.includes(user.friend_id) } });

      return { success: true, friends: result.rows }
    } else {
      return { msg: 'Database error' }
    }
  }

  async getProfile(targetId) {
    const selectQuery = await query('SELECT users.id, users.username, users.country, users.city, users.description, users.joined_date, users.dob, users.accepting_letters, users.accepting_friends FROM users WHERE id = $1', targetId);

    if (selectQuery.success) {
      const result = selectQuery.result;

      return { success: true, msg: 'Profile returned', profile: result.rows[0] }
    } else {
      return { msg: 'Database error' }
    }
  }

  async getDistance(targetId) {
    const selectQuerySource = await query('SELECT latitude, longitude FROM users WHERE id = $1', this.id);
    const selectQueryTarget = await query('SELECT latitude, longitude FROM users WHERE id = $1', targetId);

    if (selectQuerySource.success && selectQueryTarget.success) {
      const resultSource = selectQuerySource.result.rows[0] || {};
      const resultTarget = selectQueryTarget.result.rows[0] || {};

      if (resultSource.latitude && resultSource.longitude) {
        if (resultTarget.latitude && resultTarget.longitude) {
          const distanceKm = haversine(resultSource.latitude, resultSource.longitude, resultTarget.latitude, resultTarget.longitude);
          return { success: true, distanceKm }
        } else {
          return { msg: 'They have not set up their location' }
        }
      } else {
        return { msg: 'You have not set up your location' }
      }
    } else {
      return { msg: 'Database error' }
    }
  }

  async createLetter(targetId, letterContent, letterLength, distanceKm) {
    const estimateMseconds = distanceKm * 60 * 1000;
    const estimateTimestamp = new Date(Date.now() + estimateMseconds).toJSON();

    const sourceBlockedListQuery = await query('SELECT user_id AS id FROM relations WHERE restrict = true AND friend_id = $1', this.id);

    if (sourceBlockedListQuery.success) {
      const blockedList = sourceBlockedListQuery.result.rows.map(user => user.id);

      if (!blockedList.includes(Number(targetId))) {
        const relationQuery = await query('SELECT * FROM relations WHERE user_id = $1 AND friend_id = $2', this.id, targetId);

        if (relationQuery.success) {
          const relationResult = relationQuery.result;

          if (!(relationResult.rowCount > 0)) {
            // create relationship
            const insertQuery = await query('INSERT INTO relations (user_id, friend_id, confirmed) VALUES ($1, $2, true)', this.id, targetId);

            if (!insertQuery.success) return { msg: 'Database error' }
          }

          const insertQuery = await query('INSERT INTO letters (sender_id, recipient_id, content, arrival_date, length) VALUES ($1, $2, $3, $4, $5)', this.id, targetId, letterContent, estimateTimestamp, letterLength);

          if (insertQuery.success) {
            return { success: true, msg: 'Letter inserted' }
          } else {
            return { msg: 'Database error' }
          }
        } else {
          return { msg: 'Database error' }
        }
      } else {
        return { msg: 'Blocked by user' }
      }
    } else {
      return { msg: 'Database error' }
    }
  }

  async rejectUser(targetId) {
    const selectQuery = await query('SELECT * FROM relations WHERE user_id = $1 AND friend_id = $2 AND confirmed = false', this.id, targetId);

    if (selectQuery.success) {
      const selectResult = selectQuery.result;

      if (selectResult.rowCount > 0) {
        const selectQuery = await query('SELECT FROM relations WHERE user_id = $2 AND friend_id = $1', this.id, targetId);
        const deleteQuery = await query('DELETE FROM relations WHERE user_id = $1 AND friend_id = $2 AND confirmed = false', this.id, targetId);

        if (deleteQuery.success && selectQuery.success) {
          const selectResult = selectQuery.result;

          if (selectResult.rowCount > 0) {
            const updateQuery = await query('UPDATE relations SET confirmed = false WHERE user_id = $2 AND friend_id = $1', this.id, targetId);

            if (updateQuery.success) {
              // relation not updated
            }
          }

          return { success: true, msg: 'User deleted' }
        } else {
          return { msg: 'Database error' }
        }

      } else {
        return { msg: 'Relationship does not exist' }
      }
    } else {
      return { msg: 'Database error' }
    }
  }

  async saveChanges(statusChanges, profile) {
    const statusArray = Object.entries(statusChanges).filter(status => status[1]);
    const somethingChanged = statusArray;
    const errorList = [];

    if (somethingChanged) {
      for (let idx = 0; idx < statusArray.length; idx++) {
        const currentStatus = statusArray[idx];
        let success;
        switch (currentStatus[0]) {
          case 'quoteChanged':
            success = await this.saveQuote(this.id, profile.description);
            if (!success) errorList.push(['quote', 'Failed to save quote']);
            break;
          case 'locationChanged':
            success = await this.saveLocation(this.id, profile.country, profile.city, profile.latitude, profile.longitude);
            if (!success) errorList.push(['location', 'Failed to save location']);
            break;
        }
      }

      const allSaved = errorList.length <= 0;

      return { success: true, msg: allSaved ? 'All changes saved' : 'One or more errors occured', errorList }
    } else {
      return { msg: 'Nothing has changed as nothing to change' }
    }
  }

  async saveQuote(id, quote) {
    const updateQuery = await query('UPDATE users SET description = $2 WHERE id = $1', id, quote);

    return updateQuery.result?.rowCount > 0;
  }

  async saveLocation(id, country, city, lat, lon) {
    const updateQuery = await query('UPDATE users SET country = $2, city = $3, latitude = $4, longitude = $5 WHERE id = $1', id, country, city, lat, lon);

    return updateQuery.result?.rowCount > 0;
  }

  async saveChangesPrivacy(statusChanges, acceptingFriends, acceptingLetters, usersToRemove) {
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
            success = await this.lettersToggle(this.id, acceptingLetters);
            if (!success) errorList.push(['toggleLetters', 'Failed to save letters toggle']);
            break;
          case 'friendsAcceptChanged':
            success = await this.friendsToggle(this.id, acceptingFriends);
            if (!success) errorList.push(['toggleFriends', 'Failed to save friends toggle']);
            break;
          case 'blockedListChanged':
            const result = await this.modifyBlockList(this.id, usersToRemove);
            modifySuccess = result.modifySuccess;
            allModified = result.allModified;
            if (!modifySuccess) errorList.push(['blockList', 'Failed to save block list mod']);
            break;
        }
      }

      const allSaved = errorList.length <= 0;

      return { success: true, msg: allSaved ? 'All changes saved' : 'One or more errors occured', errorList, usersRemoved: modifySuccess && (allModified ? 'all' : 'some') }
    } else {
      return { msg: 'Nothing has changed as nothing to change' }
    }
  }

  async lettersToggle(id, value) {
    const updateQuery = await query('UPDATE users SET accepting_letters = $2 WHERE id = $1', id, value);

    return updateQuery.result?.rowCount > 0;
  }

  async friendsToggle(id, value) {
    const updateQuery = await query('UPDATE users SET accepting_friends = $2 WHERE id = $1', id, value);

    return updateQuery.result?.rowCount > 0;
  }

  async modifyBlockList(id, blocksToRemove) {
    const blockedUsersResult = await this.getBlockedUsers();

    if (blockedUsersResult.success) {
      const blockedUsersId = blockedUsersResult.list.map(user => user.id);

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

    return { modifySuccess: true, allModified: blocksToRemove.every(value => value) };
  }

  async getBlockedUsers() {
    const selectQuery = await query('SELECT u1.id, u1.username FROM relations AS r JOIN users AS u1 ON u1.id = r.friend_id WHERE r.user_id = $1 AND r.restrict = true', this.id);

    if (selectQuery.success) {
      const result = selectQuery.result;

      return { success: true, list: result.rows }
    } else {
      return { msg: 'Database error' }
    }
  }

  async block(targetId) {
    const selectQuery = await query('SELECT * FROM relations WHERE user_id = $1 AND friend_id = $2', this.id, targetId);

    if (selectQuery.success) {
      let result;

      if (selectQuery.result.rowCount > 0) {
        const updateQuery = await query('UPDATE relations SET confirmed = false, restrict = true WHERE user_id = $1 AND friend_id = $2', this.id, targetId);
        result = updateQuery;
      } else {
        const insertQuery = await query('INSERT INTO relations (user_id, friend_id, confirmed, restrict) VALUES ($1, $2, false, true)', this.id, targetId);
        result = insertQuery;
      }

      if (result.success) {
        if (result.result.rowCount > 0) {
          return {success: true, msg: 'Blocked'}
        } else {
          return {msg: 'Failed'}
        }
      } else {
        return { msg: 'Database error'}
      }
    } else {
      return { msg: 'Database error' }
    }
  }

  async report(targetId, reportDetails) {
    const insertQuery = await query ('INSERT INTO reports (source_id, target_id, report) VALUES ($1, $2, $3)', this.id, targetId, reportDetails);

  if (insertQuery.success) {
    const result = insertQuery.result;

    if (result.rowCount > 0) return {success: true, msg: 'Report filed'};
  }

  return { msg: 'Database error' }
  }
}

module.exports = DbFunctions;