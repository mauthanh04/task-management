const Task = require('../models/task.model');
const paginationHelper = require('../../helpers/pagination');

// [GET] /api/tasks
exports.index = async (req, res) => {

    //Find lọc dữ liệu
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }
    //end Find

    //Pagination phân trang
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 2
        },
        req.query,
        countTasks
    );
    //end phân trang

    //sort sắp xếp theo yêu cầu
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // end sort

    const tasks = await Task
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems).skip(objectPagination.skip);
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