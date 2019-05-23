const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');


router.post('/createDB', (req, res) => {
    let okSoFar = false;
    DButilsAzure.execQuery(`CREATE TABLE countries(countryID int PRIMARY KEY, countryName VARCHAR(30))`)
        .then((response, err) => {
            if (err) {
                okSoFar = false;
                res.status(400).json({location: "counties/then", message: err.message});
            } else {
                okSoFar = true;
            }
        })
        .catch(function (err) {
            okSoFar = false;
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
            } else {
                res.status(400).json({location: "counties/catch/else", message: err.message});
            }
        });
    for (let i = 0, countries = req.body['countries']; i < countries.length; i++) {
        DButilsAzure.execQuery(`INSERT INTO countries VALUES ('${countries[i][0]}','${countries[i][1]}')`)
            .then((response, err) => {
                if (err) {
                    okSoFar = false;
                    res.status(400).json({location: "counties/then", message: err.message});
                } else {
                    if (okSoFar === true && i === countries.length - 1) {
                        res.status(200).json({message: "ALL GOOD :) "})
                    }
                }
            })
            .catch(function (err) {
                okSoFar = false;
                if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                    res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
                } else {
                    res.status(400).json({location: "counties/catch/else", message: err.message});
                }
            });
    }
    if (okSoFar === true) {
        res.status(200).json({message: "ALL GOOD :) "})
    }

});


router.post('/WriteReviews', (req, res) => {
    DButilsAzure.execQuery(`SELECT poiID FROM poi`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "counties/then", message: err.message});
            else {
                const comments = [[1, 'didnt like it'], [1, 'it was bad'], [2, 'could have been better'], [2, 'nah'], [3, 'i dont know..'], [3, 'i have had better'], [4, 'was very nice'], [4, 'i liked it'], [5, 'Was Awesome!'], [5, 'LOVED IT!']]
                const users = ['a', 'b', 'p'];
                for (let i = 0; i < response.length; i++) {
                    let randComment = Math.floor(Math.random() * Math.floor(comments.length));
                    let randUser = Math.floor(Math.random() * Math.floor(users.length));

                    DButilsAzure.execQuery(`INSERT INTO reviews(poiID, username, description, ranking, date)VALUES(${response[i]['poiID']},'${users[randUser]}','${comments[randComment][1]}', ${comments[randComment][0]}, GETDATE())`)
                        .then((response, err) => {
                            if (err)
                                res.status(400).json({location: "Review/then", message: err.message});
                            else {
                                res.status(201).json({message: "Review was added!"});
                            }
                        })
                        .catch(function (err) {
                            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                                res.status(400).json({location: "Review/catch/if", message: "Review Name exists"});
                            } else {
                                res.status(400).json({location: "Review/catch/else", message: err.message});
                            }
                        });
                }
                res.status(201).json({message: "Review was created!"});
            }
        })
        .catch(function (err) {
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "Review/catch/if", message: "Review Name exists"});
            } else {
                res.status(400).json({location: "Review/catch/else", message: err.message});
            }
        });
});


router.post('/printToCsv', (req, res) => {
    let okSoFar = false;
    DButilsAzure.execQuery(`SELECT * FROM ${req.body['name']}`)
        .then((response, err) => {
            if (err) {
                okSoFar = false;
                res.status(400).json({location: "counties/then", message: err.message});
            } else {
                okSoFar = true;
                const csvjson = require('csvjson');
                const readFile = require('fs').readFile;
                const writeFile = require('fs').writeFile;

                const csvData = csvjson.toCSV(response, {
                    headers: 'key'
                });
                writeFile('./resources/csvs/' + req.body['name'] + '.csv', csvData, (err) => {
                    if (err) {
                        console.log(err); // Do something to handle the error or just throw it
                        throw new Error(err);
                    }
                    console.log('Success!');
                });
                console.log('The CSV file was written successfully');
                res.sendStatus(200);


                //
                // const createCsvWriter = require('csv-writer').createObjectCsvWriter;
                // const csvWriter = createObjectCsvWriter({
                //     //resources/csvs/poi.csv
                //     path: './resources/csvs/'+req.body['name']+'.csv',
                // });
                // let answer = response;
                // csvWriter
                //     .writeRecords(answer.array)
                //     .then(()=> {console.log('The CSV file was written successfully');res.sendStatus(200)})
                //     .catch((err)=>res.status(500).json({message: err.message}));
            }
        })
        .catch(function (err) {
            okSoFar = false;
            if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
            } else {
                res.status(400).json({location: "counties/catch/else", message: err.message});
            }
        });
});

module.exports = router;