const router = require("express").Router();
const authController = require("../controllers/authController");
const auth_middleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validationMiddleware");

router.get("/", authController.showHomePage);
router.get("/login", auth_middleware.sessionNotOpened, authController.loginForm);
router.post("/login", auth_middleware.sessionNotOpened, validatorMiddleware.validateLogin(), authController.login);

router.get("/register",auth_middleware.sessionNotOpened, authController.registerForm);
router.post("/register",auth_middleware.sessionNotOpened, validatorMiddleware.validateNewUser(), authController.register);

router.get("/forgotpassword",auth_middleware.sessionNotOpened, authController.forgetPasswordForm);
router.post("/forgotpassword",auth_middleware.sessionNotOpened, validatorMiddleware.validateEmail(), authController.forgetPassword);

router.get("/verify", authController.verifyMail);

router.get("/resetpassword/:id/:token", authController.newPasswordForm);
router.get("/resetpassword", authController.newPasswordForm);
router.post("/resetpassword", validatorMiddleware.validateNewPassword(), authController.saveNewPassword);

router.get("/logout",auth_middleware.sessionOpened, authController.logOut);

module.exports = router;