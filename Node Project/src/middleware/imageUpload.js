import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dec6sfy4i",
    api_key: "936994176136521",
    api_secret: "B8vM0GoPoQg1emY5XaQOMTiEmMc",
});

export const imageUpload = async (url) => {
    try {
        const data = await cloudinary.uploader.upload("/public/profile.jpeg")
        console.log("---data--->", data);
        return data.secure_url;


    } catch (error) {
        console.log("----->", error);
    }
};