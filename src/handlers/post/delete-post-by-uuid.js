module.exports = table => async (event) => {
  const { uuid } = event.pathParameters;

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    await table.deleteByKey('uuid', uuid);
  }

  return {
    statusCode: item ? 200 : 404,
    body: item ? JSON.stringify(item) : undefined,
  };
};
