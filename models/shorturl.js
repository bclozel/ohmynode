
module.exports.shorturl = function (mongoose) {
    // Standard Mongoose stuff here...
    var Schema = mongoose.Schema;
    var objectId = Schema.ObjectId;

    mongoose.model('ShortURL', new Schema({
        _id: objectId,
        url: String,
        shortkey: { type: String, unique: true },
        creationDate: Date
    }));

    return mongoose.model('ShortURL');
};