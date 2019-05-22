const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const jwt = require('jsonwebtoken');


// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/login) 
router.post('/login', (req, res) => {
    let username = req.body['username'];
    let password = req.body['password'];
    DButilsAzure.execQuery(`SELECT * FROM Users WHERE username = '${username}'`)
        .then((response) => {
            if (response.length === 0) return res.status(404).json({message: "ERROR: User Not Found"});
            let passFromTable = response[0].password;
            if (password === passFromTable) {
                jwt.sign({username: username}, 'WeAreAllIronMen', (err, token) => {
                    res.status(200).json({token});
                });
                // console.log(`logged in to '${username}' with password: '${password}'`)
            } else {
                res.status(500).json({
                    message: "ERROR: Incorrect password"
                });
            }
        }, function () {
            console.log("Something went wrong");
            alert("The username or password is incorrect !! ");
        }).catch(function (err) {
        res.status(400).json({message: err.message});
    });
});


// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/passwordRetrival) 
router.post('/passwordRetrieval', (req, res) => {
    const username = req.body['username'];
    const ans1 = req.body['answer1'];
    const ans2 = req.body['answer2'];
    DButilsAzure.execQuery(`SELECT * FROM user_qa WHERE username = '${username}'`)
        .then((response, err) => {
            if (err) {
                res.status(400).json({message: err.message});
            } else {
                if(ans1==response['answer1'] && ans2==response['answer2']){
                    res.status(200).json({ThePass: response[0].password});
                } else{
                    res.status(403).json({message: "Your answer is incorrect"})
                }
            }
        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});


function strigifyObjectList(objList, arg1) {
    let res = [];
    for (let i = 0; i < objList.length; i++) {
        const categoryName = objList[i]['categoryName'];
        res.push(`,('${categoryName}','${arg1}')`);
    }
    return res;
}

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/register) 
router.post('/register', function (req, res) {
    console.log("adding a new user");
    const username = req.body['username'];
    const password = req.body['password'];
    const firstName = req.body['firstName'];
    const lastName = req.body['lastName'];
    const city = req.body['city'];
    const country = req.body['country'];
    const email = req.body['email'];
    const question1 = req.body['question1'];
    const question2 = req.body['question2'];
    const answer1 = req.body['answer1'];
    const answer2 = req.body['answer2'];
    const categories = req.body['categories'];

    let categoryStrArr = strigifyObjectList(categories, username);
    if (categoryStrArr.length < 2) {
        res.status(400).json({message: "Please insert at least 2 categories"});
    } else {
        let categoryStr = categoryStrArr[0].substring(1);
        for (let i = 1; i < categoryStrArr.length; i++) {
            categoryStr = categoryStr + categoryStrArr[i];
        }
        DButilsAzure.execQuery(`INSERT INTO users VALUES ('${username}', '${password}','${firstName}','${lastName}','${city}','${country}','${email}')`)
            .then((response, err) => {
                if (err) {
                    res.status(400).json({
                        message: err.message
                    });
                } else {
                    DButilsAzure.execQuery(`INSERT INTO user_categories (categoryName, username) VALUES ${categoryStr}`)
                        .then((response, err) => {
                            if (err) {
                                DButilsAzure.execQuery(`DELETE FROM users WHERE username = '${username}'`);
                                res.status(400).json({location: "user_categories/then", message: err.message});
                            } else {
                                DButilsAzure.execQuery(`INSERT INTO user_qa (username,questionID1,answer1,questionID2,answer2) VALUES ('${username}','${question1}','${answer1}','${question2}','${answer2}')`)
                                    .then((response, err) => {
                                        if (err) {
                                            DButilsAzure.execQuery(`DELETE FROM user_catagories WHERE username = '${username}'`);
                                            res.status(400).json({location: "user_qa/then", message: err.message});
                                        } else {
                                            res.status(201).json({message: "New User Added"})
                                        }
                                    })
                                    .catch(function (err) {
                                        res.status(400).json({location: "user_qa/catch", message: err.message});
                                    });
                            }
                        })
                        .catch(function (err) {
                            res.status(400).json({location: "user_categories/catch", message: err.message});
                        });
                }
            })

            .catch(function (err) {
                res.status(400).json({message: err.message});
            });
        console.log("user successfully added!");
    }
});


// TODO - test route to make sure everything is working (accessed at GET http://localhost:3000/Authentications/getCategories) 
router.get('/ParametersForRegistration', function (req, res) {

    DButilsAzure.execQuery(`SELECT * FROM categories`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "categories/then1", message: err.message});
            else {
                //let jsonObject = JSON.parse(response);
                let oldestResponse = response;
                DButilsAzure.execQuery(`SELECT * FROM countries`)
                    .then((response, err) => {
                        if (err)
                            res.status(400).json({location: "countries/then1", message: err.message});
                        else {
                            let oldResponse = response;
                            DButilsAzure.execQuery(`SELECT * FROM questions`)
                                .then((response, err) => {
                                    if (err)
                                        res.status(400).json({location: "questions/then1", message: err.message});
                                    else {
                                        res.status(200).json({
                                            categories: oldestResponse,
                                            countries: oldResponse,
                                            questions: response
                                        });
                                    }
                                })
                                .catch(function (err) {
                                    res.status(400).json({location: "questions/catch", message: err.message});
                                });
                        }
                    })
                    .catch(function (err) {
                        res.status(400).json({location: "countries/catch", message: err.message});
                    });
            }

        })
        .catch(function (err) {
            res.status(400).json({location: "categories/catch", message: err.message});
        });

});

// TODO - test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/getUserQuestions) 
router.post('/getUserQuestions', ((req, res) => {

    DButilsAzure.execQuery(`SELECT * FROM user_qa WHERE username = '${req.body['username']}'`)
        .then((response, err) => {
            if (err)
                res.status(400).json({location: "user_qa/then1", message: err.message});
            else {
                if (response.length < 1) {
                    res.status(404).json({location: "user_qa/then2", message: "username not found"});
                } else {
                    res.status(200).json({questions: response});
                }
            }

        })
        .catch(function (err) {
            res.status(400).json({location: "user_qa/catch", message: err.message});
        });
}));

module.exports = router;

