const User = require('../models/user.model');
const generateHelper = require('../../helpers/generate');
const ForgotPassword = require('../models/forgot-password.model');
const sendMailHelper = require('../../helpers/sendMail');
const md5 = require('md5');

// [POST] /api/users/register
exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        return res.json({
            code: 400,
            message: "Email đã tồn tại"
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();

        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Đăng ký thành công",
            token: token
        });
    }
};

// [POST] /api/users/login
exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        });
    }
    if (md5(password) !== user.password) {
        return res.json({
            code: 400,
            message: "Mật khẩu không chính xác"
        });
    }
    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    });
};

// [POST] /api/users/password/forgot
exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        });
    }

    const otp = generateHelper.generateRandomNumber(8);

    const timeExpire = 5;

    // lưu data vào database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // gửi OTP qua email user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã này với bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi OTP về email của bạn", 
    });

};    

// [POST] /api/users/password/otp
exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        return res.json({
            code: 400,
            message: "OTP không chính xác"
        });
    }

    const user = await User.findOne({
        email: email
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xác thực OTP thành công",
        token: token
    });
};

// [POST] /api/users/password/reset
exports.resetPassword = async (req, res) => {
    const token = req.cookies.token;
    const password = req.body.password;

    const user = await User.findOne({
        token: token,
    });

    if(md5(password) === user.password) {
        return res.json({
            code: 400,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ"
        });
    }

    await User.updateOne(
        { token: token },
        { password: md5(password) }
    );

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công"
    });
};