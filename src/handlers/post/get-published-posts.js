module.exports = table => async () => {
  const items = await table.findBy('status', 'published');

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
