const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    }
});

categorySchema.plugin(autoIncrement.plugin, {
    model: 'Category',
    startAt: 1
});

module.exports = mongoose.model('Category', categorySchema);

