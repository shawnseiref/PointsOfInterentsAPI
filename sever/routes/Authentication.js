const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const jwt = require('jsonwebtoken');


// test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/login) good
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    DButilsAzure.execQuery(`SELECT * FROM Users WHERE username = '${username}'`)
        .then(function (response) {
            if (response.length === 0) return res.status(404).json({message: "ERROR: User Not Found"});
            let passFromTable = response[0].password;
            let user = response[0];
            if (password === passFromTable) {
                jwt.sign({username: username}, 'WeAreAllIronMen', (err, token) => {
                    res.status(200).json({
                        token
                    });
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


// test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/passwordRetrival) todo
router.post('/passwordRetrival', (req, res) => {
    let username = req.params('username');
    // let question1 = req.params('question1');
    // let question2 = req.params('question2');
    // let ansewer1 = req.params('ansewer1');
    // let ansewer2 = req.params('ansewer2');

    DButilsAzure.execQuery(`SELECT Password FROM dbo.Users WHERE username = '${username}'`)
        .then((response, err) => {
            if (err) res.status(400).json({message: err.message});
            else res.status(200).json({
                ThePass: response[0].password
            });
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

// test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/register) todo
router.post('/register', function (req, res) {
    console.log("adding a new user");
    const user = {};

    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const city = req.body.city;
    const country = req.body.country;
    const email = req.body.email;
    const question1 = req.body.question1;
    const question2 = req.body.question2;
    const answer1 = req.body.answer1;
    const answer2 = req.body.answer2;
    const categories = req.body.categories;

    let categoryStrArr = strigifyObjectList(categories, username);
    let categoryStr = categoryStrArr[0].substring(1);
    for (let i = 1; i < categoryStrArr.length; i++) {
        categoryStr = categoryStr + categoryStrArr[i];
    }

    //users[id]=user;
    // const userStr = JSON.stringify(user);

    DButilsAzure.execQuery(`INSERT INTO users VALUES ('${username}', '${password}','${firstName}','${lastName}','${city}','${country}','${email}')`)
        .then((response, err) => {
            if (err) {
                res.status(400).json({
                    message: err.message
                });
                return;
            } else {
                if (err) {
                    res.status(400).json({
                        message: err.message
                    });
                } else {
                    DButilsAzure.execQuery(`INSERT INTO user_categories (categoryName, username) VALUES ${categoryStr}`)
                        .then((response, err) => {
                            if (err) {
                                res.status(400).json({message: err.message});
                            } else {
                                DButilsAzure.execQuery(`INSERT INTO user_qa (username,questionID1,answer1,questionID2,answer2) VALUES ('${username}','${question1}','${answer1}','${question2}','${answer2}')`)
                                .then((response, err) => {
                                    if (err) {
                                        res.status(400).json({message: err.message});
                                    } else {
                                        res.status(201).json({message: "New User Added"})
                                    }
                                })
                                .catch(function (err) {
                                    res.status(400).json({message: err.message});
                                });
                            }
                        })
                        .catch(function (err) {
                            res.status(400).json({message: err.message});
                        });
                }
            }
        })

        .catch(function (err) {
            res.status(400).json({message: err.message});
        });

    // DButilsAzure.execQuery(`INSERT INTO dbo.Users_Questions VALUES ('${user.username}', '${user.ansewer1}','${user.ansewer2}')`)
    //     .then((response, err) => {
    //         if (err) {
    //             res.status(400).json({
    //                 message: 'Something went wrong - Users_Questions Table'
    //             });
    //
    //         }
    //     })
    //     .catch(function (err) {
    //         res.status(400).json({message: 'Something went wrong - users Table'});
    //     });
    //
    // // if (user.Category1 !== undefined) {
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.username}', '${user.Category1}')`)
    // //         .then((response, err) => {
    // //             if (err) {
    // //                 res.status(400).json({
    // //                     message: 'Something went wrong - Users_Categories Table'
    // //                 });
    // //             }
    // //         })
    // //         .catch(function (err) {
    // //             res.status(400).json({message: 'Something went wrong - Users_Categories Table'});
    // //         });
    // // }
    // //
    // // if (user.Category2 !== undefined) {
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.username}', '${user.Category2}')`)
    // //         .then((response, err) => {
    // //             if (err) {
    // //                 res.status(400).json({
    // //                     message: 'Something went wrong - Users_Categories Table'
    // //                 });
    // //             } else {
    // //                 res.status(200).json({
    // //                     message: 'true'
    // //                 });
    // //             }
    // //         })
    // //         .catch(function (err) {
    // //             res.status(400).json({message: 'Something went wrong - Users_Categories Table'});
    // //         });
    // // }
    // //
    // // if (user.Category3 !== undefined) {
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.username}', '${user.Category3}')`)
    // //         .then((response, err) => {
    // //             if (err) {
    // //                 res.status(400).json({
    // //                     message: 'Something went wrong - Users_Categories Table'
    // //                 });
    // //             } else {
    // //                 res.status(200).json({
    // //                     message: 'true'
    // //                 });
    // //             }
    // //         })
    // //         .catch(function (err) {
    // //             res.status(400).json({message: 'Something went wrong - Users_Categories Table'});
    // //         });
    // // }
    // //
    // // if (user.Category4 !== undefined) {
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.username}', '${user.Category4}')`)
    // //         .then((response, err) => {
    // //             if (err) {
    // //                 res.status(400).json({
    // //                     message: 'Something went wrong - Users_Categories Table'
    // //                 });
    // //             } else {
    // //                 res.status(200).json({
    // //                     message: 'true'
    // //                 });
    // //             }
    // //         })
    // //         .catch(function (err) {
    // //             res.status(400).json({message: 'Something went wrong - Users_Categories Table'});
    // //         });
    // // }

    console.log("user successfully added!")
});


// test route to make sure everything is working (accessed at GET http://localhost:3000/Authentications/getCategories) todo
router.get('/ParametersForRegistration', function (req, res) {

    DButilsAzure.execQuery(`SELECT * FROM categories`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                //let jsonObject = JSON.parse(response);
                let oldResponse = response;
                DButilsAzure.execQuery(`SELECT * FROM dbo.Countries`)
                    .then((response, err) => {
                        if (err)
                            res.status(400).json({message: err.message});
                        else {
                            res.status(200).json({categories: oldResponse, countries: response});
                        }
                    })
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });

});

// test route to make sure everything is working (accessed at GET http://localhost:3000/Authentications/getUserQuestions) todo
router.get('/getUserQuestions', ((req, res) => {
    let i;
    DButilsAzure.execQuery(`SELECT * FROM questions`)
        .then((response, err) => {
            if (err)
                res.status(400).json({message: err.message});
            else {
                const answer = JSON.stringify(response);
                res.status(200).json({questions: answer});
            }

        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
}));

module.exports = router;

