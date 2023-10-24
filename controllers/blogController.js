const Blog = require("../models/blogModel");
const APIFeatures = require("../utils/APIFeatures");

exports.getAllBlogs = async (req, res, next) => {
    try {
      const features = new APIFeatures(
        Blog.find({ state: 'published' }),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const blogs = await features.query;
      res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: {
          blogs,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
  }
}
    exports.setAuthorId = async (req, res, next) => {
      req.body.author = req.user.id;
      next();
    };
exports.createBlog = async (req, res, next) => {
    try {
      const newBlogToCreate = {
        title: req.body.title,
        description: req.body.description,
        author: req.user._id,
        state: req.body.state,
        tags: req.body.tags,
        body: req.body.body,
      };
      const newBlog = await Blog.create(newBlogToCreate);
      if (!newBlog) {
        return new Error('Blog not added')
      }
      res.status(201).json({
        status: 'success',
        data: {
          blog: newBlog,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }}
exports.getBlog = async (req, res, next) => {
    try {
      const blog = await Blog.findOne({
        _id: req.params.id,
        state: 'published',
      })
        .select('-__v -state')
        .populate('author', 'name');
      if (!blog) return new Error('Blog not found', 404);
      blog.read_count++;
      await blog.save();
      res.status(200).json({
        status: 'success',
        data: {
          blog,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }};
exports.updateBlog = async (req, res, next) => {
    try {
      let blog = await Blog.findOne({ id: req.params.id });

      if (!blog) return next(new AppError('Blog not found', 404));

      if (req.user.id !== blog.author.id)
        return next(
          new AppError('You are not authorized to update this blog', 401)
        );

      if (req.body.title) {
        blog.title = req.body.title;
      }
      if (req.body.description) {
        blog.description = req.body.description;
      }
      if (req.body.state) {
        blog.state = req.body.state;
      }
      if (req.body.tags) {
        blog.tags = req.body.tags;
      }
      if (req.body.body) {
        blog.body = req.body.body;
      }

      const updatedBlog = await blog.save();

      if (!updatedBlog) return new Error('Blog not updated', 401);
      res.status(200).json({
        status: 'success',
        data: {
          updatedBlog,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }};

exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ id: req.params.id });
        if (!blog) return next(new AppError("Blog not found", 404));
        if (req.user.id !== blog.author.id)
            return next(
                new AppError("You are not authorized to delete this blog", 401)
            );
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return new Error("Blog not deleted", 400);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(401).json({ status: 'Failed', message: err.message });
    }
};
exports.getUserBlogs = async (req, res, next) => {
    try {
        const features = new APIFeatures(
            Blog.find({ author: req.user._id }).select("-__v -author"),
            req.query
        )
            .filter()
            .limitFields()
            .sort()
            .paginate();

        const blogs = await features.query;
        if (!blogs) return new Error("No blogs found");
        res.status(200).json({
            status: "success",
            results: blogs.length,
            data: {
                blogs,
            },
        });
    } catch (err) {
        res.status(401).json({ status: 'Failed', message: err.message });
    }
};
