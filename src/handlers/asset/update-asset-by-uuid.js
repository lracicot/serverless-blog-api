module.exports = table => async (event) => {
  const { uuid } = event.pathParameters;
  const body = JSON.parse(event.body);

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    body.uuid = uuid;
    body.updated_at = body.updated_at || (new Date()).toISOString();
    body.created_at = body.created_at || item.created_at;
    body.status = body.status || item.status;

    await table.put(body);
  }

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(body) : undefined,
  };
};
