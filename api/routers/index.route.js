const taskRouter = require('./task.route');

module.exports = (app) => {
    app.use('/api/tasks', taskRouter);
};