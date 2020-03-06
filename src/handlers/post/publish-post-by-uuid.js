module.exports = table => async (event) => {
  const { uuid } = event.pathParameters;

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    item.status = 'published';
    await table.put(item);
  }

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };
};
