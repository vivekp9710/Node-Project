import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";


let userSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: [true, "please providr first name"],
    },
    lastname: {
        type: String,
        require: [true, "please providr last name"],
    },
    email: {
        type: String,
        require: [true, "please providr email"],
        trim: true,
        lowercase: true,
        validator: {
            validate: (value) => validator.isEmail(value),
            mesage: "email is not valid",
        },
    },
    contactno: {
        type: String,
        require: [true, "please provide contactno"],
        trim: true,
        validator: {
            validate: (value) => validator.isMobilePhone(value),
            mesage: "Phone no  is not valid",
        },
    },
    password: {
        type: String,
        require: [true, "please provide password"],
        validator: {
            validate: (value) => validator.isStrongPassword(value),
            mesage: "Password is not valid",
        },
    },

    DOB: {
        type: Date,
        validator: {
            validate: (value) => {
                let ismatch = validator.isDate(value);
                return ismatch && gap > 18;
            },
        },
    },
    // coordinates: {
    //   type: {
    //     type: ["Point"],
    //     required: true,
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //   },
    // },

    address: {
        line: String,
        city: String,
        state: String,
        country: String,
        pinCode: String,
    },
    followers: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    caption: String,
    profilePic: String,
    code:String

},
    { timestamps: true }

);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);

    }
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("user", userSchema);
