const mongoose = require('mongoose')

// model for database
// var connectionstring = "mongodb://localhost:27017/TextEditorDocs";

// const mongouri = "mongodb+srv://Mohitlostandfound:5NbZjpJz6zCjWG9P@cluster0.n1fwaei.mongodb.net/LostandFound?retryWrites=true&w=majority";

var connectionstring = "mongodb+srv://MohitSaini:N1iczxJoXLBn8R3p@cluster0.bbwbnzn.mongodb.net/BlogYou?retryWrites=true&w=majority";

const connectTomongo = () => {
    mongoose.connect(connectionstring, () => {
        console.log("MongoDB connected succesfully");
    })
}
module.exports = connectTomongo;
