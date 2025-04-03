import {Router} from "express"
import { healthCheck } from "../controllers/healthcheck.controller.js";
import {registerUser} from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisthrationValidator } from "../validators/index.js";
const router = Router();

router.route("/register").post(userRegisthrationValidator() ,validate,registerUser)

export default router;