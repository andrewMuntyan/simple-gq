const { forwardTo } = require('prisma-binding');

const Query = {
  categories: forwardTo('db'),
  words: forwardTo('db'),
  wordsConnection: forwardTo('db')
};

module.exports = Query;
