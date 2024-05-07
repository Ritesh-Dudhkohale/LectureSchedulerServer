import app from "./app.js";
import connectDB from "./db/dbConnection.js";
import config from "./constant.js";

const PORT = config.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
