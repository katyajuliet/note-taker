//global const
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

//app set up
var app = express();
var PORT = process.env.PORT || 3000;

//links to assets inside of the public folder
app.use(express.static('public'));

//express json parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//function run index
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes get app
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})


//get post app routes 
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new notes and join path
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

  
        let highestId = 99;

        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {

                highestId = individualNote.id;
            }
        }
        // New notes id assignment
        newNote.id = highestId + 1;
      
        database.push(newNote)

        // 
        fs.writeFile(jsonFilePath, JSON.stringify(database, null, 4), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Saved Successfully");
        });
        // new note / client response
        res.json(newNote);
    });

//delete note - loop in order to read id and sort to delete only note with id chosen by user

app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
 
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {

            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Deleted Successfully");
        }
    });
    res.json(database);
});

//server set up - active listen
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
