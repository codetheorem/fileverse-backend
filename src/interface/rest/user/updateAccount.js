async function updateAccount(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = updateAccount;
