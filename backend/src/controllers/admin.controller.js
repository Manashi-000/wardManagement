import { prisma } from "../utils/validation/prismaClient.js";
import { createPostSchema } from "../utils/validation/admin.validation.js";
export const createPost = async (req, res) => {
  try {
    const parsedData = createPostSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    const { postname, postDescription } = parsedData.data;

    const postExist = await prisma.wardPost.findFirst({
      where: { postname, postDescription },
    });
    if (postExist) {
      return res.status(400).json({ message: "Post already exists" });
    }

    const imagePaths = req.files ? req.files.map(file => file.path) : [];
    const newPost = await prisma.wardPost.create({
      data: {
        postname,
        postDescription,
        image: imagePaths, 
      },
    });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { postID } = req.params;
  if (!postID) return res.status(400).json({ message: "Post ID missing" });

  try {
    const postExist = await prisma.wardPost.findUnique({ where: { id: postID } });
    if (!postExist) return res.status(404).json({ message: "Post not found" });

    const partialSchema = createPostSchema.partial();
    const parsedData = partialSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    const { postname, postDescription } = parsedData.data;
    const newImages = req.files ? req.files.map(file => file.path) : [];
    const allImages = newImages.length > 0 ? newImages : postExist.image;

    const updatedPost = await prisma.wardPost.update({
      where: { id: postID },
      data: {
        postname: postname || postExist.postname,
        postDescription: postDescription || postExist.postDescription,
        image: allImages,
      },
    });

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { postID } = req.params;
  if (!postID) return res.status(400).json({ message: "Post ID missing" });

  try {
    const postExist = await prisma.wardPost.findUnique({ where: { id: postID } });
    if (!postExist) return res.status(404).json({ message: "Post not found" });

    await prisma.wardPost.delete({ where: { id: postID } });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getPost = async (req, res) => {
  const { postID } = req.params;
  if (!postID) return res.status(400).json({ message: "Post ID required" });

  try {
    const postExist = await prisma.wardPost.findUnique({ where: { id: postID } });
    if (!postExist) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post found", data: postExist });
  } catch (error) {
    console.error("Get Post Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.wardPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found", posts: [] });
    }

    res.status(200).json({
      message: "Posts retrieved successfully",
      posts, 
    });
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
