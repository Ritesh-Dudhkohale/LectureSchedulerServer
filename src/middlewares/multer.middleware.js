import multer from "multer";

const storage = multer.diskStorage({
  destination: "./public/temp", // where to store data on server
  // limits: {
  //   fileSize: 1024 * 1024 * 10, // 10 MB (in bytes)
  // },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname); // can change filename for server
  // },
});

const upload = multer({ storage: storage });

export default upload;
