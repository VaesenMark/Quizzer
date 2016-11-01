const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const dbUrl = "mongodb://localhost/Quizzer";

var connection = mongoose.createConnection(dbUrl);
autoIncrement.initialize(connection);
mongoose.connect(dbUrl);








