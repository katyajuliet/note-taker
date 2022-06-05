var express = require("express");
var path = require("path");
var fs = require("fs");
var notes = require("./db/db.json")

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

currentID = notes.length;

// API Routes

app.get("/api/notes", function (req, res) {

    return res.json(notes);
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;

    newNote["id"] = currentID +1;
    currentID++;
    console.log(newNote);

    notes.push(newNote);

    rewriteNotes();

    return res.status(200).end();
});

app.delete("/api/notes/:id", function (req, res) {
    res.send('Got a DELETE request at /api/notes/:id')

    var id = req.params.id;

    var idLess = notes.filter(function (less) {
        return less.id < id;
    });

    var idGreater = notes.filter(function (greater) {
        return greater.id > id;
    });

    notes = idLess.concat(idGreater);

    rewriteNotes();
})

// Access files in "public" folder

app.use(express.static("public"));

// HTML Routes

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Listen

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

// Functions

function rewriteNotes() {
    fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
        if (err) {
            console.log("error")
            return console.log(err);
        }

        console.log("Success!");
    });
}