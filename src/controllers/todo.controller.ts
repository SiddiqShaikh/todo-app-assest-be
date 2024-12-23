import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Todo } from "../models/todo.model";
import { ITodo } from "../models/todo.model";
import mongoose from "mongoose";

const createTodo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({
      title,
      description,
      owner: req.user._id,
    });
    res.status(StatusCodes.CREATED).json({
      status: true,
      todo,
      message: "Todo created successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, error: "Internal Server Error" });
  }
};
const getTodos: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as { _id: mongoose.Types.ObjectId };
    const todo = await Todo.find({
      owner: _id,
    });
    res.status(StatusCodes.OK).json({
      status: true,
      todo,
      message: "Todo fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, error: "Internal Server Error" });
  }
};
const deleteTodo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const { _id } = req.user as { _id: mongoose.Types.ObjectId };
    const todo = (await Todo.findById(todoId)) as ITodo | null;
    if (!todo?.owner.equals(_id)) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        error: "Unauthorized access",
      });
      return;
    }
    if (!todo) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, error: "Invalid todo id" });
      return;
    }
    const deleteTodo = await Todo.findByIdAndDelete(todo._id);
    res.status(StatusCodes.CREATED).json({
      status: true,
      deleteTodo,
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, error: "Internal Server Error" });
  }
};
const updateTodo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const { title, description, completed } = req.body;
    const { _id } = req.user as { _id: mongoose.Types.ObjectId };

    const todo = await Todo.findById(todoId);

    if (!todo) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        error: "Todo not found",
      });
      return;
    }

    if (!todo.owner.equals(_id)) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        error: "Unauthorized access",
      });
      return;
    }

    const updateFields: Partial<ITodo> = {
      ...(title && { title }),
      ...(description && { description })
    };

    if (completed !== undefined) {
      updateFields.completed = completed;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateFields, {
      new: true,
    });

    res.status(StatusCodes.OK).json({
      status: true,
      todo: updatedTodo,
      message: "Todo updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      error: "Internal Server Error",
    });
  }
};
export { createTodo, deleteTodo, getTodos,updateTodo };
