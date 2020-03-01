module.exports = table => async (event) => {
  const { uuid } = event.pathParameters;

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    await table.deleteByKey('uuid', uuid);

    return {
      statusCode: 200,
      body: JSON.stringify({ uuid }),
    };
  }

  return {
    statusCode: 404,
  };
};
