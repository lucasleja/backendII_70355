import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.middleware.js";
import { usersController } from "../controllers/users.controller.js";

const router = Router();

router.post("/register", passportCall("register"), usersController.register);

router.post("/login", passportCall("login"), usersController.login);

router.get("/profile", usersController.getProfile);

router.get("/logout", usersController.logout);

router.put("/restore-password", usersController.restorePassword);

router.get("/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
  session: false
}));

router.get("/current", passportCall("jwt"), usersController.getProfile);

export default router;