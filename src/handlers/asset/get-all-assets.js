module.exports = table => async () => ({
  statusCode: 200,
  body: JSON.stringify(await table.findAll()),
});
