var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
var config = require('./configurations/config');
const bodyParser = require('body-parser');

const ProtectedRoutes = express.Router();
ProtectedRoutes.use((req, res, next) =>{
    // check header for the token
    var token = req.headers['access-token'];
    // decode token
    if (token) {
      // verifies secret and checks if the token is expired
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return res.json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      // if there is no token  
      res.send({ 
          message: 'No token provided.' 
      });
    }
  });

app.use('/chat', ProtectedRoutes);

//set secret
app.set('Secret', config.secret);

// use morgan to log requests to the console
app.use(morgan('dev'));

// parse application/json
app.use(bodyParser.json());

app.get('/chat',(req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/authenticate',(req,res)=>{
    if(req.body.username==="james"){
        if(req.body.password===123){
             //if eveything is okey let's create our token 
        const payload = {
            check:  true
          };

          var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours
          });

          res.json({
            message: 'authentication done',
            token: token
          });

        }else{
            res.json({message:"please check your password !"})
        }

    }else{
        res.json({message:"user not found !"})
    }
});


io.on('connection', (socket) => {
    console.log('A User connected.');
    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A User disconnected.');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
  });

