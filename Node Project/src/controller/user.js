import { modals } from "../model";
import { config } from "../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { sendMail, sendOtp } from "../functions/emailHandler"

const createToken = (user) => {

    return jwt.sign({ email: user.email, id: user._id }, config.secret_key)

};


//---------------SIGN UP--------------//

export const signUp = async (req, res) => {
    try {

        const { email, password } = req.body;

        //validate email and password 
        if (!email || !password) {
            throw new Error("email and password are required");
        }
        //check if user already exists

        const existingUser = await modals.User.findOne({ email });
        if (existingUser) {
            throw new Error("email already used");
        }
        //create new user
        const user = await modals.User.create({ email, password });
        //send success response
        res.status(200).json({ success: true, data: user, message: "user created successfully" });
    } catch (error) {
        //handle errors
        console.log("error in signup", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

// export const signUp = async (req, res) => {
//     let input = req?.body;
//     // console.log("---body--", req.body);
//     try {
//         const match = await modals?.User.findOne({
//             $or: [
//                 { email: input.email }, { contactno: input.contactno }],
//         });
//         // console.log("---match---", match);
//         if (match)
//             throw new Error("email and  password are used");
//         let user = await modals?.User.create(input);

//         await modals.Token.create({ token: createToken(user), userId: user?._id })
//         res.status(200).send({ success: true, data: user, token: "", message: "user created successfully" })
//     } catch (error) {
//         res.status(400).send({ success: false, data: null, message: error.message });

//     }
// };

//------------SIGN IN---------------//

export const signin = async (req, res) => {
    let { email, password } = req.body;
    try {
        const matchUser = await modals.User.findOne({
            $or: [{ email: email }, { contactno: email }]
        })
        if (!matchUser)
            throw new Error("user not found with this credential");

        // Assuming validate password is a method on the user model
        const match = await matchUser.validatePassword(password);
        if (!match) throw new Error("email or password is incorrect");
        //if user and password are validated successfully
        res.status(200).send({
            success: true, data: matchUser,
            token: createToken(matchUser),
            message: "login successful"
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            data: null,
            token: "",
            message: error.message
        });
    }
}

// export const signin = async (req, res) => {
//     let { email, password } = req.body;
//     // console.log("------=>", req.body);
//     try {
//         const matchUser = await modals.User.findOne({
//             $or: [
//                 { email: email }, { contactNo: email }]
//         })
//         // console.log("--matchuser---", matchUser)
//         if (!matchUser) throw new Error("user not found with this credential")
//         let match = await matchUser.validatePassword(password);
//         // console.log("----match---", match);
//         if (!match) throw new Error("email and password does not match");

//         let token = createToken(matchUser);
//         let matchTokenData = await modals.Token.findOne({
//             userId: matchUser?._id
//         })
//         console.log("token data", matchTokenData);

//         if (matchTokenData.token?.length < 2) {
//             matchTokenData.token?.push(token);
//             matchTokenData.save()

//         } else {
//             matchTokenData.token?.shift()
//             matchTokenData.token.push(token)
//             matchTokenData.save()
//         }
//         res.status(200).send({
//             success: true,
//             data: matchUser,
//             token,
//             message: "User created successfully",
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({ success: false, token: "", data: null, message: error.mesage });
//     }
// };

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