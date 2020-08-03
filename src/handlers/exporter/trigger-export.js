const uuid = require('uuid/v4');

module.exports = table => async () => {
  const exportMeta = {
    uuid: uuid(),
    created_at: (new Date()).toISOString(),
    updated_at: (new Date()).toISOString(),
    status: 'pending',
  };

  await table.put(exportMeta);

  return {
    statusCode: 201,
    body: JSON.stringify(exportMeta),
  };
};
