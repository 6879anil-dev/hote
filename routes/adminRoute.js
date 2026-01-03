const router = require("express").Router();
const adminController = require("../controllers/adminController");
const auth_middleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validationMiddleware");

router.get("/", adminController.ShowPage);
router.post("/addroom", adminController.AddRoom);
router.get("/delete/:odano", adminController.DeleteRoom);

module.exports = router;