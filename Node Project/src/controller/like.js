import { modals } from "../model";



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


export const LikeDislike = async (req, res) => {
    let input = req?.body
    console.log("input", input);
    input.userId = req?.me?.id;
    console.log("userid", input.userId);

    const userExist = await modals.Like.findOne({ userId: input.userId, postId: input.postId })
    console.log("userexist", userExist)
    if (userExist) {
        await modals.Like.findByIdAndDelete(userExist.id)
        await modals.Post.findByIdAndUpdate(input.postId, { $inc: { likeCount: -1 } })
        res.status(200).send({ success: true, data: null, message: "deleted successfully" })
    }
    else {
        modals.Like.create(input)
            .then(async (resData) => {
                await modals.Post.findByIdAndUpdate(resData.postId,
                    { $inc: { likeCount: 1 } });
                res.status(200).send({ success: true, data: resData, message: "created successfully" });
            }).catch((err) => {
                res.status(400).send({ success: false, data: null, message: err.message })
            });
    }

};




