const Task = require('../models/task.model');
const paginationHelper = require('../../helpers/pagination');
const searchHelper = require('../../helpers/search');

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
            limitItems: 5
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

    //Search tìm kiếm
    const objectSearch = searchHelper(req.query);

    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    //end Search

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

// [PATCH] /api/tasks/change-status/:id
exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const task = await Task.updateOne(
            { _id: id },
            { status: status }
        );
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại"
        });
    }
};

// [PATCH] /api/tasks/change-multi
exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        const task = await Task.updateMany(
            { _id: { $in: ids } },
            { [key]: value }
        );
        res.json({
            code: 200,
            message: "Cập nhật nhiều trạng thái thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật nhiều trạng thái thất bại"
        });
    }
};

// [POST] /api/tasks/create
exports.create = async (req, res) => {
    try {
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
            code: 200,
            message: "Tạo công việc thành công",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo công việc thất bại"
        });
    }
};

// [PUT] /api/tasks/update/:id
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.updateOne(
            { _id: id },
            req.body
        );
        res.json({
            code: 200,
            message: "Cập nhật công việc thành công",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật công việc thất bại"
        });
    }
};