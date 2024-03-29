var express = require("express");
var mysql = require("mysql");
var joi = require("joi");
var router = express();
var config = require("config");

var connection = mysql.createConnection ({
    host : config.get("host"),
    database : config.get("database"),
    user : config.get("user"),
    password: config.get("password")
});

connection.connect();
router.use(express.json());

router.get("/", (request, response)=>{
    var queryT = "select * from Emp";

    connection.query(queryT, (err, result)=>{
        if ( err == null )
        {
            response.send(JSON.stringify(result));
        }
        else
        {
            response.send(JSON.stringify(err));
        }
    });
});

router.get("/:No", (request, response)=>{
    var No = request.params.No;

    var queryT = `select * from Emp where No=${No}`;
    connection.query(queryT, (err, result)=>{
        if ( err == null )
        {
            response.send(JSON.stringify(result));
        }
        else
        {
            {
                response.send(JSON.stringify(err));
            }
        }
    });
});
function Validate(request)
{
    var validationSchema =
    {
        No: joi.number().required(),
        Name: joi.string().required(),
        Age: joi.number().min(18).max(60).required()
    };
    return joi.validate(request.body, validationSchema);
}

router.post("/", (request, response)=>{
    var validationResult = Validate(request);
    if ( validationResult.error == null )
    {
    var No = request.body.No;
    var Name = request.body.Name;
    var Age = request.body.Age;

    var queryT = `insert into Emp values(${No}, '${Name}', ${Age})`;

    connection.query(queryT, (err, result)=>{
        if ( err == null )
        {
            response.send(JSON.stringify(result));
        }
        else
        {
            response.send(JSON.stringify(err));
        }
    });
    }
    else
    {
        response.send(JSON.stringify(validationResult.error));
    }
});

router.put("/:No", (request, response)=>{
    var No = request.params.No;
    var Name = request.body.Name;
    var Age = request.body.Age;

    var queryT = `update Emp set Name='${Name}', Age=${Age} where No=${No}`;

    connection.query(queryT, (err, result)=>{
        if ( err == null )
        {
            response.send(JSON.stringify(result));
        }
        else
        {
            response.send(JSON.stringify(err));
        }
    })
});

module.exports = router;