const modelUser = require("../model/user");

exports.getAll = (req, res) => {
    return modelUser.insert_data(req, res);
}

exports.getOne = (req, res) => {
    return modelUser.getOne(req, res);
}

exports.post = (req, res) => {
    return modelUser.post(req, res);
}


exports.edit = (req, res) => {
    return modelUser.edit(req, res);
}

exports.delete = (req, res) => {
    return modelUser.delete(req, res);
}