import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";

import fs from "fs";
import path, {dirname, join} from "path";

import {fileURLToPath} from "url";

import {validationResult} from "express-validator";
import {postValidation} from "./validation.js";

// const __fileName = fileURLToPath(import.meta.url);
const __fileName = fileURLToPath(import.meta.url);

const __dirName = dirname(__fileName);

const blogPostPath = join(__dirName, "blogPosts.json");

const blogRouter = express.Router();

// function to get the file

function getPost() {
  const fileAsBuffer = fs.readFileSync(blogPostPath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJson = JSON.parse(fileAsString);
  return fileAsJson;
}

// function to put the file back

function putPost(fileName) {
  fs.writeFileSync(blogPostPath, JSON.stringify(fileName));
}

// get all the posts

blogRouter.get("/", (req, res, next) => {
  try {
    const file = getPost();

    res.send(file);
  } catch (error) {
    next(error);
  }
});

// get single post

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.find((p) => p._id === req.params.id);
    if (new_file) {
      res.send(new_file);
    } else {
      next(
        createError(404, `User with the id ${req.params.id} doesn't exists`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//post somthing
blogRouter.post("/", postValidation, async (req, res, next) => {
  try {
    // const errors = validationResult(req);
    // validation result gives back a list of errors coming from the userValidation Middleware
    if (errors.isEmpty()) {
      const file = getPost();
      console.log(req.body, ": this is the body of the request");
      const new_file = {...req.body, _id: uniqid(), created_at: new Date()};
      file.push(new_file);
      console.log(file);
      putPost(file);
      res.status(201).send(new_file);
    } else {
      next(createError(400, {errorList: errors}));
      // I had validation errors
    }
  } catch (error) {
    next(error);
  }
});

// update post
blogRouter.put("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const post = file.find((p) => p._id === req.params.id);
    const new_file = {...post, ...req.body};
    file.push(new_file);
    putPost(file);
    res.send(new_file);
  } catch (error) {
    next(error);
  }
});

// delete post
blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.filter((p) => p._id !== req.params.id);
    putPost(new_file);
    res.send("DELETED");
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
