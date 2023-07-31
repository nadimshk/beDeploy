const Blog = require('../models/blog');

// get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username'); // populate author
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

// get filtered blogs
exports.getFilteredBlogs = async (req, res) => {
  try {
    const { author, category } = req.query;
    const filter = {};

    if (author) {
      filter.author = author;
    }
    if (category) {
      filter.category = category;
    }

    const blogs = await Blog.find(filter).populate('author', 'username'); // populate author
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

// create a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const userId = req.user.userId; // get userId

    const blog = new Blog({
      title,
      category,
      content,
      image,
      author: userId, // set author
    });

    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

// update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const blogId = req.params.id;
    const userId = req.user.userId; // get userId

    const blog = await Blog.findOne({ _id: blogId, author: userId }); // check blog and author

    blog.title = title;
    blog.category = category;
    blog.content = content;
    blog.image = image;

    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

// delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.userId; // get userId

    const blog = await Blog.findOne({ _id: blogId, author: userId }); // check blog and author

    await blog.remove();

    res.status(200).json({ message: 'blog deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
