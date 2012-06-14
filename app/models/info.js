module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var StatusSchema = new Schema({
        comName: String,
        comPlace: String,
        salary: Number,
        Description: String
    });
    var InfoSchema = new Schema({
        no: ObjectId,
        openId: String,
        name: String,
        idNumber: String,
        gender: String,
        birthDate: Date,
        birthPlace: String,
        photo: String,
        phone: String,
        MSN: String,
        QQ: String,
        email: String,
        residence: String,
        status: [StatusSchema]
    });

    mongoose.model('Info', InfoSchema);
}
