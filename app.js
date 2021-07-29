const express = require('express');
const mysql = require('mysql');
const port = 3000;

//express app
const app = express();

//parse application/json
app.use(express.json());

//connecting to mysql db
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "express_first_app"
});

//checking connection
con.connect( (err) => {
    if (err) throw err;
    console.log("Connected to MySQL DB!");
    
  },
  //listen for requests
  app.listen(port, () => console.log( ` Listening on port 3000... http://localhost:${port} `) )
);

//listen for requests
// app.listen(port, () => console.log( ` Listening on port 3000... http://localhost:${port} `) );

app.get('/', (req,res) => {
    res.send('<p>Home page from Node, Express js</p>');
});

//get all users
app.get('/api/users', (req,res) => {
    const query = "SELECT * FROM users";
    con.query(query, (err, results, fields) => {
        if (err) 
          res.status(500).send('{error:"something failed!"}');
        
        res.status(200).send(results);
    })
});

//get single user
app.get('/api/users/:userId', (req, res) => {  
  const userId = req.params.userId;

  const sql = `SELECT * FROM users WHERE id=${userId}`;
  con.query(sql, (err, results, fields) => {
    if(err) 
      res.status(500).send({ error: 'Something failed!' });
      
    res.status(200).send(results);    
  })
});

//create a single user data
app.post('/api/users', (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO users(first_name,last_name,email,password) VALUES("${first_name}","${last_name}","${email}","${password}")`;
  con.query(sql, (err,results,fields) => {
    if(err)
      res.status(500).send({error: 'something failed!'});

    const userId = results.insertId;
    const sql = `SELECT * FROM users WHERE id="${userId}"`;
    con.query(sql, (err, results, fields) => {
      if(err)
        res.status(500).send({error: 'something failed!'});
      
      res.status(200).send(results);
    });
  });
});

//update a single user data
app.put('/api/users/:userId', (req,res) => {
  const userId = req.params.userId;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `UPDATE users SET first_name="${first_name}", last_name="${last_name}", email="${email}", password="${password}" WHERE id=${userId}`;
  con.query(sql,(err,results,fields) => {
    if(err)
      res.status(500).send({error: 'something failed!'});

    const userId = req.params.userId;
    const sql = `SELECT * FROM users WHERE id="${userId}"`;
    con.query(sql, (err, results, fields) => {
      if(err)
        res.status(500).send({error: 'something failed!'});
      
      res.status(200).send(results);
    });
  });
});

//delete a single user data
app.delete('/api/users/:userId',(req,res)=>{
  const id = req.params.userId;

  const sql = `DELETE FROM users WHERE id="${id}"`;
  con.query(sql, (err, results, fields) => {
    if(err)
      res.status(500).send({error: 'something failed'});
    
      res.status(200).send({status: 'success'});
  });
});
