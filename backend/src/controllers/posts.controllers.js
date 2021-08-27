import Post from '../models/post.models.js';
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Post is empty', success: false });
  }

  const post = new Post({
    title: req.body.title,
    text: req.body.text,
  });
  let data;
  try {
    data = await post.save();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  return res.status(201).send({ message: 'post created', success: true, data });
};

export const getAllPosts = async (req, res) => {
  let data;
  try {
    data = await Post.find();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  res.send({ data, success: true });
};

export const getPostByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .send({ message: 'invalid request, bad ID', success: false });
  }

  let data;
  try {
    data = await Post.findById(id);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  res.send({ data, success: true });
};

export const deletePostByID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .send({ message: 'invalid request, bad ID', success: false });
  }

  let data;
  try {
    data = await Post.deleteOne({ _id: id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  res.send({ data, success: true });
};

export const updatePostByID = async (req, res) => {
  const { id } = req.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!req.body || !isIdValid) {
    res
      .status(400)
      .send({ message: 'invalid request, bad ID', success: false });
  }

  let data;
  try {
    data = await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        text: req.body.text,
      },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  res.send({ data, success: true });
};
