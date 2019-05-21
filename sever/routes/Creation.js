const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');


router.post('/createDB', (req, res) => {
    for (let i = 0, countries = req.body['countries']; i < countries.length; i++) {
        DButilsAzure.execQuery(`INSERT INTO countries VALUES ('${countries[i][0]}','${countries[i][1]}')`)
            .then((response, err) => {
                if (err)
                    res.status(400).json({location: "counties/then", message: err.message});
                else {
                    res.status(201).json({message: "Country Added!"});
                }
            })
            .catch(function (err) {
                if (err.message.startsWith("Violation of PRIMARY KEY constrain")) {
                    res.status(400).json({location: "counties/catch/if", message: "Country Name exists"});
                } else {
                    res.status(400).json({location: "counties/catch/else", message: err.message});
                }
            });
    }
});

// {
// 	"countries":[
// 		[1,"Australia"],
// 		[2,"Bolivia"],
// 		[3,"China"],
// 		[4,"Denemark"],
// 		[5,"Israel"],
// 		[6,"Latvia"],
// 		[7,"Monaco"],
// 		[8,"August"],
// 		[9,"Norway"],
// 		[10,"Panama"],
// 		[11,"Switzerland"],
// 		[12,"USA"]]
// }


module.exports = router;