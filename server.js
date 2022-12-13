const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;
const dbDetails = {
    host: "lms-db.cvajxk38j7jy.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password123",
    database: "lms"
};
let conn = null;

app.use("/scripts", express.static(path.join(__dirname, './scripts')));
app.use("/styles", express.static(path.join(__dirname, './styles')));

app.use(cors({
    origin: (origin, callback) => {
        console.log('Origin:', origin);
        callback(null, true);
    },
    methods: [ 'GET', 'POST', 'DELETE', 'UPDATE', 'PUT' ]
}));
app.use(bodyParser.json());

// frontend requests
app.get("/", (req, res) => {
    if (req.headers.referer) {
        const referrerArray = req.headers.referer.split("/");
        
        if (referrerArray[referrerArray.length - 1] === "login")
            res.sendFile(path.join(__dirname, './index.html'));
        else
            res.redirect("/login");
    } else {
        res.redirect("/login");
    }
})
.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, './register.html'));
}).get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

// backend requests
app.post("/login", (req, res) => {
    conn.connect(err => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            conn.query("select count(*) as user_exists from users where email=? and password=?", 
            [ req.body.email, req.body.password ], (err, result) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    if (result[0].user_exists === 1) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(404);
                    }
                }
            });
        }
    });
})
.post("/register", (req, res) => {
    conn.connect(err => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            conn.query("select count(*) as user_exists from users where email=?", [ req.body.email ], (err, result) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    if (err) {
                        console.error(err);
                        res.sendStatus(500);
                    } else if (result[0].user_exists > 0) {
                        res.sendStatus(400);
                    } else {
                        conn.query("insert into users values (default, ?, ?)", [ req.body.email, req.body.password ], (err, result) => {
                            if (err) {
                                console.error(err);
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    }
                }
            });
        }
    });
})
.get("/get-books", (req, res) => {
    conn.connect(err => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            conn.query("select * from books", (err, result) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    res.send(result).status(200);
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
    conn = mysql.createConnection(dbDetails);
    conn.connect(err => {
        if (err)
            console.error(err);
        else
            console.log('Connection established!');
    });
});