const router = require("express").Router();
const roomController = require("../controllers/roomController");
const auth_middleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validationMiddleware");

router.post("/",auth_middleware.sessionOpened, roomController.FindRoom);
router.get("/:id",auth_middleware.sessionOpened, roomController.ShowRoom)
router.get("/book/:id", auth_middleware.sessionOpened, roomController.BookRoom)
router.get("/payment/:id", auth_middleware.sessionOpened, roomController.Payment)
router.get("/profile/user", auth_middleware.sessionOpened, roomController.Profile)
router.get("/profile/edit", auth_middleware.sessionOpened, roomController.ShowProfileEdit)
router.post("/profile/edit", auth_middleware.sessionOpened, roomController.ProfileEdit)

module.exports = router;