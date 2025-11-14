const Task = require('../models/task.model');

exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    
    if(req.query.status) {
        find.status = req.query.status;
    }

    const tasks = await Task.find(find);
    res.json(tasks);
};

exports.detail = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
};