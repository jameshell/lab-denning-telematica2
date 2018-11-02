var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhh');

// sign with RSA SHA256
// var cert = fs.readFileSync('private.key');
// var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

console.log(token);
