const Task = require('../models/task.model');

// [GET] /api/tasks
exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    
    if(req.query.status) {
        find.status = req.query.status;
    }

    //sort sắp xếp theo yêu cầu
    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // end sort

    const tasks = await Task.find(find).sort(sort);
    res.json(tasks);
};

// [GET] /api/tasks/detail/:id
exports.detail = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
};