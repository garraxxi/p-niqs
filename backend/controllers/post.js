const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
  post.save()
    .then(postCreated => {
      res.status(201).json({
        message: 'Post added succesfully',
        post: {
          id: postCreated._id,
          title: postCreated.title,
          content: postCreated.content,
          imagePath: postCreated.imagePath,
          creator: postCreated.creator
        }
      });
    }).catch(err => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
  };

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if(result.matchedCount > 0) {
        res.status(200).json({
          message: 'Post updated'
        });
      } else {
        res.status(401).json({
          message: 'not Authorized'
        });
      }
    }).catch(err => {
      res.status(500).json({
        message: 'Couldn\'t update post!'
      });
    });
  };

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(400).json({ message: 'post not found' })
      }
    }).catch(err => {
      res.status(500).json({
        message: 'Fetching post failed!'
      });
    });
  };

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(posts => {
      fetchedPosts = posts
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    }).catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
  };

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if(result.deletedCount > 0){
        res.status(200).json({
          message: 'Post deleted'
        });
      } else {
        message: 'not Authorized'
      }
    }).catch(err => {
      res.status(500).json({
        message: 'Deleting post failed!'
      });
    });
  };
