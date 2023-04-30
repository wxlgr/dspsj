const { Router } = require("express");
const router = new Router();
const usersRouter = require("./users.router");
const videosRouter = require("./videos.router");
const uploadsRouter = require("./uploads.router");
const bgmsRouter = require("./bgms.router");
const reportsRouter = require("./reports.router");

router.use("/users", usersRouter);
router.use("/videos", videosRouter);
router.use("/upload", uploadsRouter);
router.use("/bgms", bgmsRouter);
router.use("/reports", reportsRouter);

module.exports = router;
