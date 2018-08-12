require('ts-node/register');

const { teardown } = require('./global');

module.exports = async function() {
  await teardown();

  return;
};
