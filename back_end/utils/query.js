const Client = require('pg').Client;

async function query (statement, ...params) {
  try {
    const dbConnection = new Client({
      database: 'test1'
    });

    await dbConnection.connect()

    const result = await dbConnection.query(statement, params);

    await dbConnection.end();

    return {success: true, result};
  } catch (error) {
    console.log(error);
    return {success: false, error, result: {}};
  }
}

module.exports = query;