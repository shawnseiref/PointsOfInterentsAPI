const express = require('express');
const router = express.Router();
var DButilsAzure = require('../DButils');
const jwt = require('jsonwebtoken');
var dateTime = require('node-datetime');

// test route to make sure everything is working (accessed at POST http://localhost:3000/auth/getTopRecPointsToUser) good

router.post('/getTopRecPointsToUser', (req, res) => {

    var userName;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    DButilsAzure.execQuery(`SELECT TOP 2 * FROM dbo.Users_Categories INNER JOIN dbo.Points ON dbo.Users_Categories.Category = dbo.Points.CategoryName  WHERE Username = '${userName}' ORDER BY Rate DESC`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                pNameA =  response[0].PointName;
                ImageA = response[0].Image;
                pNameB =  response[1].PointName;
                ImageB = response[1].Image;

                res.status(200).json(
                    {firstName: pNameA, firstImage: ImageA, secondName: pNameB, secondImage: ImageB}
                );
            }
        })
        .catch(function(err) {
            res.status(400).json({message: err.message});
        });

});


// test route to make sure everything is working (accessed at POST http://localhost:3000/auth/getLastFavoritsPointsToUser) good
router.post('/getLastFavoritsPointsToUser', (req, res) => {
    var userName;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });


    DButilsAzure.execQuery(`SELECT TOP 2 * FROM dbo.Users_Favorits INNER JOIN dbo.Points ON dbo.Users_Favorits.PointName = dbo.Points.PointName  WHERE Username = '${userName}'  ORDER BY FavoritID DESC`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                pNameA =  response[0].PointName;
                ImageA = response[0].Image;
                pNameB =  response[1].PointName;
                ImageB = response[1].Image;

                res.status(200).json(
                    {firstName: pNameA, firstImage: ImageA, secondName: pNameB, secondImage: ImageB}
                );

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'NULL'});
        });
});

// test route to make sure everything is working (accessed at POST http://localhost:3000/auth/insertToFavorits) good
router.post('/insertToFavorits', (req, res) => {

    let PointN = req.body.PointName;

    var userName;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });
    // maybe need to put ';' in the end of ths SQL
    //after we change the tables we need to send the ordet too
    DButilsAzure.execQuery(`INSERT INTO dbo.Users_Favorits (Username,PointName) VALUES ('${userName}','${PointN}')`)
        .then((response, err) => {
            if(err)
                res.status(400).json({boolean: 'false'});
            else{
                res.status(200).json({ boolean :'true' });

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });
});

// test route to make sure everything is working (accessed at delete http://localhost:3000/analy/deleteFromFavorits) good
router.delete('/deleteFromFavorits', (req, res) => {

    let PointN = req.body.PointName;
    var userName;
    var bool = false;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });
    //check if have point
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits WHERE Username = '${userName}' AND PointName = '${PointN}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: 'false - check if have point'});
            else{
                if(response.length>0){
                    bool = true;
                }
            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });
    //delete the point
    DButilsAzure.execQuery(`DELETE FROM dbo.Users_Favorits WHERE Username = '${userName}' AND PointName = '${PointN}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: 'false - in delete the point'});
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });
    //check if deleted
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits WHERE Username = '${userName}' AND PointName = '${PointN}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: 'false - in check if deleted'});
            else{
                if(response.length===0 && bool===true){
                    res.status(200).json({message: 'true'});
                }
                else{
                    res.status(400).json({message: 'the point not finded in Users_Favorits'});
                }
            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });
});


// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/getFavoritePoints) good
router.post('/getFavoritePoints', (req, res) => {
    var userName;
    var answer = [];

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits WHERE username = '${userName}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                var answer="";
                for (i in response){
                    answer =answer+ response[i].PointName +","+ response[i].FavoritID +","+ response[i].OrderID + ";" ;
                }
                res.status(200).json({Points: answer});

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'NULL'});
        });
});

// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/counterOfFavoritePoints) good
router.post('/counterOfFavoritePoints', (req, res) => {
    var userName;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits WHERE username = '${userName}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                sumOfFavorite = response.length;
                res.status(200).json({Sum_Of_Favorite_Points: sumOfFavorite});

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'NULL'});
        });
});


// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/rateForPoint) good
router.post('/rateForPoint', (req, res) => {
    //var PointN = req.body.PointName;
    //var Rate = req.body.Rate;
    var userName;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    //insert to rate table
    DButilsAzure.execQuery(`INSERT INTO dbo.Rates VALUES ('${req.PointN}','${userName}','${req.Rate}')`)
        .then((response, err) => {
            if(err)
                res.status(400).json({boolean: 'false'});
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });

    //update data in points table
    DButilsAzure.execQuery(`UPDATE dbo.Points SET Rate = '${req.newRateNormalized}', NumOfRate = '${req.newNumberOfRate}',SumOfRate = '${req.newSumRate}' WHERE PointName = '${req.PointN}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({boolean: 'false'});
            else{
                res.status(200).json({ boolean :'true' });
            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });

});


// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/reviewForPoint) good
router.post('/reviewForPoint', (req, res) => {

    var PointN = req.body.PointName;
    var review = req.body.Review;
    var userName;
    var Daterev = dateTime.create();
    var formatted = Daterev.format('d-m-Y H:M:S');
    var strDate = formatted.toString();

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    //insert to Reviews table
    DButilsAzure.execQuery(`INSERT INTO dbo.Reviews (PointName, Username, Review, DateReview) VALUES ('${PointN}','${userName}','${review}','${strDate}')`)
        .then((response, err) => {
            if(err)
                res.status(400).json({boolean: 'false'});
            else{
                res.status(200).json({ boolean :'true' });
            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'false'});
        });

});

// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/getFavoritePointSorted) good
router.post('/getFavoritePointSorted', (req, res) => {

    var userName;
    var answer = [];
    var sortedBy = req.body.SortedBy;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits INNER JOIN dbo.Points ON dbo.Users_Favorits.PointName = dbo.Points.PointName  WHERE Username = '${userName}' ORDER BY '${sortedBy}'`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                for (i in response){
                    answer[i]= response[i].PointName;
                }
                res.status(200).json({PointsOrder: answer});

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'NULL'});
        });

});


// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/UpdateUserFavoritList) good
router.put('/updateUserFavoritList', (req, res) => {

    var userName;
    var answer = [];
    var orderUser = req.body.Orders;
    var arrayUser = [];
    arrayUser = orderUser.split(',');

    let bool = true;

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    for(x in arrayUser){
        point = arrayUser[x];
        pointsplit = point.split(':');
        pointName = pointsplit[0];
        orderID = pointsplit[1];

        DButilsAzure.execQuery(`UPDATE dbo.Users_Favorits SET OrderID = '${orderID}' WHERE PointName = '${pointName}' AND username = '${userName}'`)
            .then((response, err) => {
                if(err)
                    bool= false;
            })
            .catch(function(err) {
                bool = false;
            });
    }
    if(bool === true){
        res.status(200).json({ans: bool});
    }
    else{
        res.status(400).json({ans: bool});
    }



});

// test route to make sure everything is working (accessed at POST http://localhost:3000/analy/getUserOrderFavoritList) good
router.post('/getUserOrderFavoritList', (req, res) => {
    var userName;
    var answer = [];

    jwt.verify(req.token,'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            var strUser = authData;
            result = strUser.user["Username"];
            userName = result;
        }
    });

    DButilsAzure.execQuery(`SELECT * FROM dbo.Users_Favorits WHERE Username = '${userName}' ORDER BY OrderID`)
        .then((response, err) => {
            if(err)
                res.status(400).json({message: err.message});
            else{
                for (i in response){
                    answer[i]=response[i].PointName;
                }
                res.status(200).json(
                    {sortFavoritByUser: answer}
                );

            }
        })
        .catch(function(err) {
            res.status(400).json({message: 'NULL'});
        });
});

module.exports = router;