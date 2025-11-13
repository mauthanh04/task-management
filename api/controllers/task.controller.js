const Task = require('../models/task.model');

exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });
    res.json(tasks);
};

exports.getTaskById = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
};