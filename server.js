const express = require('express'); // importing a CommonJS module
const morgan = require('morgan');
const helmet = require('helmet'); // helmet is a security feature, should use from now on

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// middleware
server.use(logger);
server.use(helmet());


server.use(morgan('short')); // or server.use(morgan('dev')); 
server.use(express.json());  //built in middleware


// endpoints
server.use('/api/hubs', gatekeeper("mellon"), hubsRouter);

server.use(gatekeeper("hello"));

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use((error, req, res, next) => {
  res.status(400).json({ error: 'something broke'});
});

module.exports = server;



function gatekeeper(password) {
  return function (req, res, next) {
    const { pass } = req.query;
    if(pass === password){
      next(); // calls the next normal mw in the stack
    } else {
      next("failed"); // calls the next error handeling mw in the stack/queue
      //res.status(400).json({ message: 'You shall not pass' });
    };
  } 
};

// localhost:4000/?pass=mellon -> this will pass and allow you to access info
// localhost:4000/?pass=orange -> this WILL NOT allow you to access info


// the three amigas
function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);

  next();
};



// write and use middleware
// - read a "pass" key from req.query
// if he pass is "mellon" let the request continue
// otherwise we responsd with http status code 400 and any message