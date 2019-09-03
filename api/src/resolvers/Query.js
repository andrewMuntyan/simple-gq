const { forwardTo } = require('prisma-binding');

const Query = {
  categories: forwardTo('db'),
};

module.exports = Query;
