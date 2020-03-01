module.exports = table => async (event) => {
  const { uuid } = event.pathParameters;

  const item = await table.findOneByKey('uuid', uuid);

  if (item) {
    item.status = 'archived';
    await table.put(item);

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  return {
    statusCode: 404,
  };
};
