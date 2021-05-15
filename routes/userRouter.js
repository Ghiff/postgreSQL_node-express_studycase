const { response } = require("express");
var express = require("express");
var userRouter = express.Router();

var { Client } = require("pg");
var connectionString = "postgres://gunawan:200121@localhost:5432/dvdRental";


const client = new Client({
    connectionString: connectionString,
});
client.connect()

userRouter.route('/actor')
    .get((req, res, next)=>{
        client.query('SELECT * FROM actor ORDER by actor_id')
            .then((results)=>{
                res.statusCode = 200;
                res.json(results.rows);
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error')
                console.log(err);
            })
    })

    .delete((req, res, next)=>{
        client.query('DELETE FROM actor')
            .then((response)=>{
                res.statusCode = 200;
                res.end('All actors has been deleted');
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error');
            })
    });

userRouter.route('/actor/:id')
    .post((req, res, next)=>{

        const id=parseInt(req.params.id)
        const { fname, lname } = req.body
        const now = new Date()

        client.query('INSERT INTO actor (actor_id, first_name, last_name, last_update) VALUES ($1, $2, $3, $4)', [id, fname, lname, now])
            .then((result)=>{
                res.statusCode = 201;
                res.send(`User added withID:${id}\nFirst Name:${fname}\nLast Name:${lname}`);
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error');
                console.log(err)
            })
    })

    .get((req, res, next)=>{

        const id=parseInt(req.params.id)
        client.query('SELECT * FROM actor WHERE actor_id=$1', [id])
            .then((result)=>{
                res.statusCode = 200;
                res.json(result.rows);
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error');
            })
    })

    .delete((req, res, next)=>{

        const id=parseInt(req.params.id)
        client.query('DELETE FROM actor WHERE actor_id=$1', [id])
            .then((response)=>{
                res.statusCode = 200;
                res.end(`User deleted withID:${id}`);
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error');
            })
    })
    
    .put(async(req, res, next)=>{

        const id=parseInt(req.params.id)
        var { fname, lname } = req.body
        // console.log(fname+'-'+lname);

        if(fname === undefined || lname === undefined){

            await client.query('SELECT * FROM actor WHERE actor_id=$1', [id])
            .then((queryResult)=>{
                
                if(fname === undefined){
                    fname = queryResult.rows[0].first_name;
                    
                }
                if(lname === undefined){
                    lname = queryResult.rows[0].last_name;
                }

                // console.log(fname+'-'+lname);
            })
            .catch((err)=>{
                res.statusCode = 500;
                console.log(err)
                res.end('Internal Server Error');
            })
        }

        console.log(fname+'-'+lname);

        await client.query('UPDATE actor SET first_name=$2,last_name=$3 WHERE actor_id=$1',[id,fname,lname])
            .then((result)=>{
                res.statusCode = 200;
                res.end(`id ${id} has been updated`);
                
            })
            .catch((err)=>{
                res.statusCode = 500;
                res.end('Internal Server Error');
                console.log(err);
            })
    })

module.exports = userRouter;