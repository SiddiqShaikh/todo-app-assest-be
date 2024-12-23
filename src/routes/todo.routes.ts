import { RequestHandler, Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { validateData } from "../middlewares/validation.middleware";
import { todoSchema } from "../utils/schemaValidation";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

// Register route
router.post(
  "/",
  validateData(todoSchema),
  verifyJWT,
  createTodo as RequestHandler
);
router.get("/", verifyJWT, getTodos as RequestHandler);
router.delete("/:todoId", verifyJWT, deleteTodo as RequestHandler);
router.put("/:todoId", verifyJWT, updateTodo as RequestHandler);

// Login route

export default router;
