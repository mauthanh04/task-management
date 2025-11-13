const mogoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mogoose.connect(process.env.MONGO_URL);
        console.log('Kết nối thành công với database');
    }
    catch (error) {
        console.log('Kết nối thất bại với database', error);
    }
}
