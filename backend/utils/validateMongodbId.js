const mongoose = require("mongoose");
const { errorhandler } = require("../middlewares/errorHandler");
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) errorhandler(401 , "this id is not valid or not found")
}
module.exports = {validateMongoDbId}