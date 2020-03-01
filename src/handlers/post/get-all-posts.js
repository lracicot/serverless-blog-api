module.exports = table => async (event) => {
  const { limit } = event.queryStringParameters || { limit: 100 };

  return {
    statusCode: 200,
    body: JSON.stringify(await table.findAll(limit)),
  };
};
