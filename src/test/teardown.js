require('ts-node/register');

const { closeTypeormConn } = require('./closeTypeormConn.ts');

module.exports = async function() {
  await closeTypeormConn();
  return;
};
