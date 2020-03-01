module.exports = table => async (event) => {
  const { slug } = event.pathParameters;

  const items = await table.findBy('slug', slug);

  return {
    statusCode: items.length ? 200 : 404,
    body: items[0] ? JSON.stringify(items[0]) : undefined,
  };
};
