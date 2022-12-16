const connectTomongo = require('./db');

const path = require('path');
// document model is imported here .

const Document = require('./models/Document')
connectTomongo();

const express = require('express');
const app = express();
var cors = require('cors')
const port = 1983;

app.use(cors());
app.use(express.json());


const io = require("socket.io")(3002, {
    cors: {
        //! this is the port where frontend is working
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const defaultValue = ""


io.on("connection", socket => {


    socket.on('get-document', async (documentId, userID) => {
        const document = await findorCreateDocument(documentId, userID)
        socket.join(documentId)

        console.log('document.data = ', document.data)

        socket.emit("load-document", document.data)

        // will show when our client would have connected with our server
        socket.on('send-changes', delta => {

            // this will print all the changes we are doing in our editor page like adding text, bolding text , breaking a new line others...

            // console.log(delta)
            // asking all others to receive changes that we have made .
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        console.log("connected")

        // updating and saving the data here
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

// Finding the document using id
async function findorCreateDocument(id, userid) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document

    // !this is the point where we would be sharing the userid 

    return await Document.create({ _id: id, data: defaultValue, userID: userid });

}


// our apps routes are going to be here.

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/blog', require('./routes/blog'))

// static files will be connected here
app.use(express.static(path.join(__dirname, './client/build')));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



