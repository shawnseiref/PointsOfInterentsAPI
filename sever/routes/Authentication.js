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
                jwt.sign({user}, 'secretkey', (err, token) => {
                    res.status(200).json({
                        token
                    });
                });
                // console.log(`logged in to '${username}' with password: '${password}'`)
            } else {
                res.status(500).json({
                    message: "ERROR: Incorrect Password"
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
                ThePass: response[0].Password
            });
        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });
});


// test route to make sure everything is working (accessed at POST http://localhost:3000/Authentications/register) todo
router.post('/register', function (req, res) {
    console.log("adding a new user");
    const user = {};

    user.Username = req.body.username;
    user.Password = req.body.password;
    user.FirstName = req.body.firstName;
    user.LastName = req.body.lastName;
    user.City = req.body.city;
    user.Country = req.body.country;
    user.Email = req.body.email;
    // user.Ansewer1 = req.body.ansewer1;
    // user.Ansewer2 = req.body.ansewer2;
    // user.Category1 = req.body.category1;
    // user.Category2 = req.body.category2;
    // user.Category3 = req.body.category3;
    // user.Category4 = req.body.category4;

    //users[id]=user;
    // const userStr = JSON.stringify(user);

    DButilsAzure.execQuery(`INSERT INTO dbo.Users VALUES ('${user.Username}', '${user.Password}','${user.FirstName}','${user.LastName}','${user.City}','${user.Country}','${user.Email}')`)
        .then((response, err) => {
            if (err) {
                res.status(400).json({
                    message: err.message
                });

            } else {

                res.status(201).json({message: "New User Added"})
            }
        })
        .catch(function (err) {
            res.status(400).json({message: err.message});
        });

    // DButilsAzure.execQuery(`INSERT INTO dbo.Users_Questions VALUES ('${user.Username}', '${user.Ansewer1}','${user.Ansewer2}')`)
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
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.Username}', '${user.Category1}')`)
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
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.Username}', '${user.Category2}')`)
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
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.Username}', '${user.Category3}')`)
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
    // //     DButilsAzure.execQuery(`INSERT INTO dbo.Users_Categories VALUES ('${user.Username}', '${user.Category4}')`)
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

