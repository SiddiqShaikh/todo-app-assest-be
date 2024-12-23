import { Router, RequestHandler } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { validateData } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../utils/schemaValidation";

const router: Router = Router();

// Register route
router.post(
  "/register",
  validateData(registerSchema),
  registerUser as RequestHandler
);

// Login route
router.post("/login", validateData(loginSchema), loginUser);

export default router;
