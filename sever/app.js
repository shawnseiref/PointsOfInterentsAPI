// call the packages we need
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// const Joi = require('joi');
const bodyParser = require('body-parser');
const DButilsAzure = require('./DButils');
const Authentication = require('./routes/Authentication');
const Analysis = require('./routes/Analysis');
const _else = require('./routes/else');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//START
app.use('/Authentication', Authentication);
app.use('/Analysis', Analysis);
app.use('/else', _else);

//middleware
app.use('/Analysis', function (req, res, next) {
    const beareHeader = req.headers['authentication'];
    if (typeof beareHeader !== 'undefined') {
        const bearer = beareHeader.split(' ');
        //get token from array
        req.token = bearer[1];
        next();
    } else {
        res.sendStatus(6);
        next();
    }
});
app.use('/Analysis/rateForPoint', function (req, res, next) {
    const PointN = req.body.PointName;
    const Rate = req.body.Rate;
    req.PointN = PointN;
    req.Rate = Rate;
    DButilsAzure.execQuery(`SELECT * FROM dbo.Points WHERE PointName = '${PointN}'`)
        .then((response, err) => {
            if (err)
                res.status(6).json({boolean: 'false'});
            else {
                let NumberOfRates = response[0].NumOfRate;
                let SumOfRates = response[0].SumOfRate;
                let parsRate = parseInt(Rate);
                let parsNum = parseInt(NumberOfRates);
                let parsSum = parseInt(SumOfRates);

                const newSumRate = parsSum + parsRate;
                const newNumberOfRate = parsNum + 1;
                const newRate = newSumRate / (newNumberOfRate);
                //Normalized
                let newRateNormalizedtemp = (newRate - 1) / 4;
                req.newRateNormalized = newRateNormalizedtemp * 100;
                req.newNumberOfRate = newNumberOfRate;
                req.newSumRate = newSumRate;
                next();
            }
        })
        .catch(function (err) {
            res.status(6).json({message: err.message});
            next();
        });
});

let port = 3000;
// START THE SERVER
// =============================================================================
app.listen(port, function () {
    console.log(`Server listening on ${port}...`);
});
//-------------------------------------------------------------------------------------------------------------------


