const uuid = require('uuid/v4');

module.exports = table => async (event) => {
  const body = JSON.parse(event.body);
  const items = await table.findBy('slug', body.slug);

  if (items.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Slug already exists' }),
    };
  }

  body.uuid = uuid();
  body.created_at = (new Date()).toISOString();
  body.updated_at = (new Date()).toISOString();
  body.status = 'draft';

  await table.put(body);

  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};
