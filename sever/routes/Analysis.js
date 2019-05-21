const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/getFavoritePOIs) 
router.post('/getFavoritePOIs', (req, res) => {
    DButilsAzure.execQuery(`SELECT * FROM favorites WHERE username = '${req['userName']}' ORDER BY position`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "favorites/then", message: err.message});
            else {
                if (response.length < 1)
                    res.status(404).json({location: "favorites/else", message: "No Favorites Found"});
                res.status(200).json({response});
            }
        })
        .catch(function (err) {
            res.status(400).json({location: "favorites/catch", message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/addFavoritePOI) 
router.post('/addFavoritePOI', (req, res) => {
    DButilsAzure.execQuery(`SELECT MAX(position) FROM favorites WHERE username = '${req['userName']}'GROUP BY username`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "favorites/then", message: err.message});
            else {
                const position = response[0][''] + 1;
                DButilsAzure.execQuery(`INSERT INTO favorites VALUES ('${req['userName']}','${req.body['poiID']}','${position}',GETDATE())`)
                    .then((response, err) => {
                        if (err)
                            res.status(400).json({location: "favorites/insert/then", message: err.message});
                        else {
                            res.status(201).json({message: "User Favorite POI added!"});
                        }
                    })
                    .catch(function (err) {
                        if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                            res.status(400).json({
                                location: "favorites/insert/catch/if",
                                message: "Favorite POI already exists"
                            });
                        } else if (err.message.startsWith("The INSERT statement conflicted with the FOREIGN KEY constraint")) {
                            res.status(400).json({
                                location: "favorites/insert/catch/else if",
                                message: "Illegal POI ID"
                            });
                        } else {
                            res.status(400).json({location: "favorites/insert/catch/else", message: err.message});
                        }
                    });
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "favorites/catch/if", message: "Favorite POI already exists"});
            } else {
                res.status(400).json({location: "favorites/catch/else", message: err.message});
            }
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/deleteFavoritePOI)
router.post('/deleteFavoritePOI', (req, res) => {
    DButilsAzure.execQuery(`DELETE FROM favorites WHERE username = '${req['userName']}' AND poiID = ${req.body['poiID']}`)
        .then((response, err) => {
            if (err)
                res.status(404).json({location: "favorites/then", message: err.message});
            else {
                if (res)
                    res.status(200).json({message: "User Favorite POI Removed!"});
            }
        })
        .catch(function (err) {
            res.status(400).json({location: "favorites/catch", message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/countFavorites)
router.post('/countFavorites', (req, res) => {
    DButilsAzure.execQuery(`SELECT * FROM favorites WHERE username = '${req['userName']}'`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                res.status(200).json({num_of_favorites: response.length});
            }
        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/getLastUsedPOIs)
router.post('/getLastUsedPOIs', (req, res) => {
    DButilsAzure.execQuery(`SELECT TOP ${req.body['numOfPOIs']} * FROM favorites INNER JOIN poi ON favorites.poiID = poi.poiID  WHERE Username = '${req['userName']}'  ORDER BY date DESC`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "last used POIs/then", message: err.message});
            else {
                res.status(200).json({POIs: response});
            }
        })
        .catch(function (err) {
            res.status(400).json({location: "last used POIs/catch", message: err.message});
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/addReview)
router.post('/addReview', (req, res) => {
    DButilsAzure.execQuery(`INSERT INTO reviews (poiID, username, description, ranking, date) VALUES ('${req.body['poiID']}', '${req['userName']}','${req.body['description']}', '${req.body['ranking']}',GETDATE())`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "reviews/then", message: err.message});
            else {
                res.status(201).json({message: "User Review of POI added!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "reviews/catch/if", message: "Review POI already exists"});
            } else {
                res.status(400).json({location: "reviews/catch/else", message: err.message});
            }
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/addReview)
router.post('/addReview', (req, res) => {
    DButilsAzure.execQuery(`INSERT INTO reviews (poiID, username, description, ranking, date) VALUES ('${req.body['poiID']}', '${req['userName']}','${req.body['description']}', '${req.body['ranking']}',GETDATE())`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "reviews/then", message: err.message});
            else {
                res.status(201).json({message: "User Review of POI added!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "reviews/catch/if", message: "Review POI already exists"});
            } else {
                res.status(400).json({location: "reviews/catch/else", message: err.message});
            }
        });
});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Analysis/updateUserOrder)
router.put('/updateUserOrder', (req, res) => {
    let userOrder = req.body['newOrder'], added = true;
    for (let i = 0; i < userOrder.length; i++) {
        DButilsAzure.execQuery(`UPDATE favorites SET position = ${i} WHERE userName = '${req['userName']}' AND poiID = '${userOrder[i]}'`)
            .then((response, err) => {
                if (err) {
                    added = false;
                    res.status(400).json({location: "favorites/then", message: err.message});
                } else {
                    res.status(201).json({message: "Position Set Successfully"});
                }
            })
            .catch(function (err) {
                added = false;
                res.status(400).json({location: "favorites/catch", message: err.message});
            });
    }
    if (!added) res.status(500).json({message: "Something Went Terribly Wrong..."});
});

module.exports = router;