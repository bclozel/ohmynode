module.exports.shorturl = function (mongoose) {
    // Standard Mongoose stuff here...
    var schema = mongoose.Schema;
    var objectId = schema.ObjectId;

    mongoose.model('ShortURL', new schema({
        _id: objectId,
        url: String,
        shortkey: String,
        creationDate: Date
    }));

    return mongoose.model('ShortURL');
};
