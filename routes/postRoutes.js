module.exports = (app, db) => {
  const postModel = require("../models/postModel")(db);

  app.get("/home", async (req, res) => {
    // request for to get all articles
    let postsBDD = await postModel.getAllPosts();
    //console.log("home page", postsBDD)
    // if there is an error we send a json with the error
    if (postsBDD.code) {
      res.json({ status: 500, error: postsBDD });
    }
    //res render return to template datas
    res.render("layout", {
      template: "home",
      posts: postsBDD,
      session: req.session,
    });
  });

  app.get("/post/:id", async (req, res) => {
    let id = req.params.id;

    let postId = await postModel.getOnePost(id);

    if (postId.code) {
      return res.json({
        status: 500,
        msg: "There was a problem with the post",
        error: postId,
      });
    }

    let comment = await postModel.showComments(id);

    if (comment.code) {
      return res.json({
        status: 500,
        msg: "There was a problem with the comments",
        result: comment,
      });
    }

    if (!Array.isArray(comment)) {
      comment = [];
    }

    res.render("layout", {
      template: "post",
      postId: postId[0],
      comment: comment,
      session: req.session,
    });
  });
};
