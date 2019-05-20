const express = require('express');
const router = express.Router();
var DButilsAzure = require('../DButils');

// test route to make sure everything is working (accessed at POST http://localhost:3000/else/getAllPOIs) good
router.get('/getAllPOIs', (req, res) => {
    DButilsAzure.execQuery(`SELECT * FROM poi`)
        .then(async (response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                let answer = response;
                for (let i in answer) {
                    let poiID = await parseInt(response[i]['poiID']);
                    let views = await parseInt(response[i]['views']) + 1;
                    response[i]['views'] = views;
                    DButilsAzure.execQuery(`UPDATE poi SET views = '${views}' where poiID = '${poiID}'`)
                        .then((response, err) => {
                            if (err)
                                res.status(400).json({message: `Error in views`});
                            else {
                                res.status(200).json({POI: answer});
                            }
                        });
                }
                res.status(200).json({POIs: answer});
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

// test route to make sure everything is working (accessed at POST http://localhost:3000/else/getPOIbyID) good
router.get('/getPOIbyID/:poiID', (req, res) => {
    let poiID = req.params.poiID;
    DButilsAzure.execQuery(`SELECT * FROM poi WHERE poiID = '${poiID}'`)
        .then(async (response, err) => {
            if (!err) {
                let answer = response[0];
                let views = await parseInt(response[0]['views']) + 1;
                response[0]['views'] = views;
                DButilsAzure.execQuery(`UPDATE poi SET views = '${views}' where poiID = '${poiID}'`)
                    .then((response, err) => {
                        if (err)
                            res.status(400).json({message: `Error in views`});
                        else {
                            res.status(200).json({POI: answer});
                        }
                    });
            }
        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/else/getRandomPOI) good
router.get('/getRandomPOI/:minimalRank/:POIsToShow', (req, res) => {
    let minimalRank = req.params.minimalRank;
    let pois2show = req.params.POIsToShow;
    DButilsAzure.execQuery(`SELECT * FROM poi WHERE ranking >= '${minimalRank}'`)
        .then(async (response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                let numbers = [];
                let poiNums = [];
                let ans = [];
                let size = response.length;
                if (size > pois2show) {
                    for (let i = 0; i < pois2show; i++) {
                        numbers.push(Math.floor(Math.random() * Math.floor(size)));
                    }
                    let index = 0;
                    for (let x in numbers) {
                        while (poiNums.includes(numbers[x])) {
                            numbers[x] = (Math.floor(Math.random() * Math.floor(size)));
                        }
                        if (index < pois2show) {
                            poiNums.push(numbers[x]);
                            index++;
                        }

                    }

                    let answer = response;
                    for (let p in poiNums) {
                        let poiID = await parseInt(answer[poiNums[p]]['poiID']);
                        let views = await parseInt(answer[poiNums[p]]['views']) + 1;
                        DButilsAzure.execQuery(`UPDATE poi SET views = '${views}' WHERE poiID = ${poiID}`)
                            .then((response, err) => {
                                if (err)
                                    return res.status(400).json({message: `Error in views`});
                            });
                        answer[poiNums[p]]['views'] = views;
                        ans.push(answer[poiNums[p]]);
                    }

                    res.status(200).json({POIs: ans});
                } else {
                    res.status(200).json({POIs: response});
                }
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });


});

// test route to make sure everything is working (accessed at POST http://localhost:3000/else/getPoint) good
router.post('/getPoint', (req, res) => {

    PointName = req.body.PointName;
    var i;
    let ID;
    let pName;
    let Imag;
    let Vnum;
    let rate;
    let des;
    let rev1;
    let rev2;
    DButilsAzure.execQuery(`SELECT * FROM dbo.Points WHERE PointName = '${PointName}'`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                ID = response[0].PointID;
                pName = response[0].PointName;
                Imag = response[0].Image;
                Vnum = response[0].ViewNum;
                rate = response[0].Rate;
                des = response[0].Description;
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
    DButilsAzure.execQuery(`SELECT TOP 2 * FROM dbo.Reviews WHERE PointName = '${PointName}' ORDER BY DateReview DESC`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                if (response.length > 1) {
                    onerev = response[0].Review;
                    oneDateReview = response[0].DateReview;
                    secondrev = response[1].Review;
                    secondDateReview = response[1].DateReview;
                    res.status(200).json({
                        PointName: pName,
                        Image: Imag,
                        NumberOfViews: Vnum,
                        Rate: rate,
                        Desrciption: des,
                        Review1: onerev,
                        DateOfReview1: oneDateReview,
                        Review2: secondrev,
                        DateOfReview2: secondDateReview
                    });
                } else if (response.length === 1) {
                    onerev = response[0].Review;
                    oneDateReview = response[0].DateReview;
                    res.status(200).json({
                        PointName: pName,
                        Image: Imag,
                        NumberOfViews: Vnum,
                        Rate: rate,
                        Desrciption: des,
                        Review1: onerev,
                        DateOfReview1: oneDateReview
                    });
                } else if (response.length === 0) {
                    res.status(200).json({
                        PointName: pName,
                        Image: Imag,
                        NumberOfViews: Vnum,
                        Rate: rate,
                        Desrciption: des
                    });
                }

            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});


module.exports = router;

