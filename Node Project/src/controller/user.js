import { modals } from "../model";
import { config } from "../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { sendMail, sendOtp } from "../functions/emailHandler"

const createToken = (user) => {

    return jwt.sign({ email: user.email, id: user._id }, config.secret_key)

};


export const signUP = async (req, res) => {
    let input = req?.body;
    // console.log("---body--", req.body);
    try {
        const match = await modals?.User.findOne({
            $or: [
                { email: input.email }, { contactno: input.contactno }],
        });
        // console.log("---match---", match);
        if (match)
            throw new Error("email and  password are used");
        let user = await modals?.User.create(input);
        res.status(200).send({ success: true, data: user, token: "", message: "user created successfully" })
    } catch (error) {
        res.status(400).send({ success: false, data: null, message: error.message });

    }
};

export const signin = async (req, res) => {
    let { email, password } = req.body;
    // console.log("------=>", req.body);
    try {
        const matchUser = await modals.User.findOne({
            $or: [
                { email: email }, { contactNo: email }]
        })
        // console.log("--matchuser---", matchUser)
        if (!matchUser) throw new Error("user not found with this credential")
        let match = await matchUser.validatePassword(password);
        // console.log("----match---", match);
        if (!match) throw new Error("email and password does not match");
        res.status(200).send({
            success: true,
            data: matchUser,
            token: createToken(matchUser),
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, token: "", data: null, message: error.mesage });
    }
};

export const forgetPassword = async (req, res) => {
    let { code, newPassword } = req?.body;
    console.log("code", code);
    try {
        const user = await modals?.User.findOne({ code });
        if (!user) {
            return res.status(400).send("invalid code");
        }
        user.password = newPassword;
        user.code = "";
        await user.save();
        return res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
        res.status(400).send({ success: false, data: null, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    let { newPassword, oldPassword } = req.body;
    try {
        let validate = await bcrypt.compare(oldPassword, req?.me?.password);
        if (!validate) throw new Error("Old password does not match");
        req.me.password = newPassword;
        req.me.save();
        res.status(200).send({ success: true, data: null, message: "Password changed successfully" });
    } catch (error) {
        res.status(400).send({ success: false, data: null, message: error.message })
    }
};


export const sendOTP = async (req, res) => {
    try {
        const matchUser = await modals?.User.findOne({ email: req?.body?.email })
        if (!matchUser) res.status(400).send("email not found for this user")
        let otp = sendOtp(matchUser.email);
        matchUser.code = otp;
        console.log("------", matchUser);
        // console.log("otp",otp);
        await matchUser.save()
        res.status(200).send("otp send to your mail")
    } catch (error) {
        res.status(400).send(error.message);
    }
};