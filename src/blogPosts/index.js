import express from "express";
import uniqid from "uniqid";

import fs from "fs";
import path, {dirname, join} from "path";

import {fileURLToPath} from "url";

// const __fileName = fileURLToPath(import.meta.url);
const __fileName = fileURLToPath(import.meta.url);

const __dirName = dirname(__fileName);

const blogPostPath = join(__dirName, "blogPosts.json");

const router = express.Router();

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

router.get("/", async (req, res, next) => {
  try {
    const file = getPost();
    res.send(file);
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

// get single post

router.get("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.find((p) => p._id === req.params.id);
    res.send(new_file);
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

//post somthing
router.post("/", async (req, res, next) => {
  try {
    const file = getPost();
    console.log(req.body, ": this is the body of the request");
    const new_file = {...req.body, _id: uniqid(), created_at: new Date()};
    file.push(new_file);
    console.log(file);
    putPost(file);
    res.send(new_file);
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

// update post
router.put("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const post = file.find((p) => p._id === req.params.id);
    const new_file = {...post, ...req.body};
    file.push(new_file);
    putPost(file);
    res.send(new_file);
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

// delete post
router.delete("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.filter((p) => p._id !== req.params.id);
    putPost(new_file);
    res.send("DELETED");
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

export default router;
