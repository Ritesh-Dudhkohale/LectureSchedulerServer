import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../constant.js";

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
  
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "/Online_Lecture_Scheduling",
    });

    // file has been uploaded successfully
    // console.log("file is uploaded successfully", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); //remove the local file if operation got failed
    return null;
  }
};

const deleteOncloudinary = async (cloudinaryUrl) => {
  try {
    // http://res.cloudinary.com/dturqla7g/image/upload/v1707132727/qiu2bm0pl4hi6lvnlzwf.jpg
    // "qiu2bm0pl4hi6lvnlzwf"  we only need this part so we use below method
    const filename = cloudinaryUrl.split("/").pop().split(".")[0]; // console.log(filename);

    const response = await cloudinary.uploader.destroy(filename, {
      resource_type: "image",
      folder: "/Online_Lecture_Scheduling",
      // filename_override: Date.now() + localFilePath.mime,
    });

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export { uploadOnCloudinary, deleteOncloudinary };
