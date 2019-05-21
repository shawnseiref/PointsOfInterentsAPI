// call the packages we need
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// const Joi = require('joi');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Authentication = require('./routes/Authentication');
const Analysis = require('./routes/Analysis');
const Else = require('./routes/else');
const Creation = require('./routes/Creation');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//START
app.use('/Authentication', Authentication);

//middleware
app.use('/Analysis', (req, res, next)=>{
    const bearerHeader = req.headers['x-auth-token'];
    if(typeof bearerHeader !== 'undefined'){
        req.token = bearerHeader.split(' ')[0];
        jwt.verify(req.token,'WeAreAllIronMen',(err, authData)=>{
            if(err){
                res.status(403).json({location: "TokenVerify", message: err.message});
            }
            else{
                req.userName = authData['username'];
            }
        });
        next();
    }
    else{
        res.status(403).send( "Analysis: Un Authorized Token.");
        next();
    }
});

app.use('/Analysis', Analysis);
app.use('/else', Else);
app.use('/Creation', Creation);

let port = 3000;
// START THE SERVER
// =============================================================================
app.listen(port, function () {
    console.log(`Server listening on ${port}...`);
});
//-------------------------------------------------------------------------------------------------------------------


