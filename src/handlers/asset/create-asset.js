const uuid = require('uuid/v4');

module.exports = table => async (event) => {
  const body = JSON.parse(event.body);

  body.uuid = uuid();
  body.created_at = (new Date()).toISOString();
  body.updated_at = (new Date()).toISOString();
  body.status = 'created';

  await table.put(body);

  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};
