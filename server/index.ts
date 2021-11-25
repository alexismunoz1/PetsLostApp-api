import * as express from "express";
import * as path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDirPath = path.resolve(__dirname, "../public");

app.use(
   express.json({
      limit: "50mb",
   })
);

app.get("/test", (req, res) => {
   res.send({
      message: true,
   });
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   res.sendFile(staticDirPath + "./index.html");
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
