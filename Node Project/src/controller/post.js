import { modals } from "../model"


export const getByUser = (req, res) => {

    modals.Post.find({ userId: req?.me?._id }).then((resData) => {
        res.status(200).send({ success: true, data: resData, message: "" });
    }).catch((err) => {
        res.status(400).send({ success: false, data: null, message: err.message })
    });
};

export const getAll = (req, res) => {

    modals.Post.find({}).then((resData) => {
        res.status(200).send({ success: true, data: resData, message: "" });
    }).catch((err) => {
        res.status(400).send({ success: false, data: null, message: err.message })
    });
};

export const create = (req, res) => {
    let input = req?.body
    input.userId = req?.me?._id;
    console.log("------input---", input);
    modals.Post.create(input).then((resData) => {
        res.status(200).send({ success: true, data: resData, message: "created successfully" });
    }).catch((err) => {
        res.status(400).send({ success: false, data: null, message: err.message })
    });
};

export const remove = (req, res) => {
    modals.Post.findByOneAndRemove({ _id: req?.params?.id, userId: req.me._id }).then((resData) => {
        res.status(200).send({ success: true, data: null, message: "deleted successfully" });

    }).catch((err) => {
        res.status(400).send({ success: false, data: null, message: err.message });
    });
};

