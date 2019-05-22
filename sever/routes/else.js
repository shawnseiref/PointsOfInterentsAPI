const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/else/getAllPOIs) 
router.get('/getAllPOIs', (req, res) => {
    DButilsAzure.execQuery(`SELECT * FROM poi`)
        .then(async (response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                let answer = response;
                answer.forEach(async (response)=> {
                    let poiID = await parseInt(response['poiID']);
                    let views = await parseInt(response['views']) + 1;
                    response['views'] = views;
                    DButilsAzure.execQuery(`UPDATE poi SET views = '${views}' where poiID = '${poiID}'`)
                        .then((response, err) => {
                            if (err)
                                res.status(400).json({message: `Error in views`});
                            else {
                                res.status(200).json({POI: answer});
                            }
                        });
                });
                res.status(200).json({POIs: answer});
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/else/getPOIbyID) 
router.get('/getPOIbyID/:poiID', (req, res) => {
    let poiID = req.params['poiID'];
    DButilsAzure.execQuery(`SELECT * FROM poi WHERE poiID = '${poiID}'`)
        .then(async (response, err) => {
            if (!err) {
                let answer = response[0];
                let views = await parseInt(response[0]['views']) + 1;
                response[0]['views'] = views;
                DButilsAzure.execQuery(`UPDATE poi SET views = '${views}' where poiID = '${poiID}'`)
                    .then((response, err) => {
                        if (err) {
                            res.status(400).json({message: `Error in views`});
                        }
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

// TODO - test route to make sure everything is working (accessed at GET http://localhost:3000/else/getRandomPOI) 
router.get('/getRandomPOI/:POIsToShow/:minimalRank', (req, res) => {
    let minimalRank = req.params['minimalRank'];
    let pois2show = req.params['POIsToShow'];
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

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/else/getAllReviews) 
router.get('/getAllReviews/:poiID', (req, res) => {
    const poiID = req.params['poiID'];
    DButilsAzure.execQuery(`SELECT * FROM reviews WHERE poiID = '${poiID}'`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {

                res.status(200).json({Reviews: response});
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/else/getReviews) 
router.get('/getReviews/:numOfReviews/:poiID', (req, res) => {
    const numOfReviews = req.params['numOfReviews'];
    const poiID = req.params['poiID'];
    DButilsAzure.execQuery(`SELECT * FROM reviews WHERE poiID = '${poiID}' ORDER BY date DESC`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {

                res.status(200).json({Reviews: response.slice(0,numOfReviews)});
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

module.exports = router;

