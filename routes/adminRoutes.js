const session = require("express-session");
const saltRounds = 10;

module.exports = (app, db) => {
  const postModel = require("../models/postModel")(db);

  //endpoint for to get the admin page (we will need to fetch the posts, authors, and categories)
  app.get("/admin", async (req, res) => {
    let articles = await postModel.getAllPosts();
    if (articles.code) {
      res.json({
        status: 500,
        msg: "There was a problem!",
        result: articles,
      });
    } else {
      res.render("layout", {
        template: "admin",
        posts: articles,
        session: req.session,
      });
    }
  });

  //endpoint for to get the form to add a new post
  app.get("/add_post", async (req, res) => {
    res.render("layout", { template: "add_post", session: req.session });
    console.log(req.session.user);
  });

  //endpoint for to post a new post
  app.post("/add_post", async (req, res) => {
    try {
      let newPost = await postModel.addPost(req);

      if (newPost.code) {
        return res.status(500).json({
          status: 500,
          msg: "There was a problem!",
          result: newPost,
        });
      }

      return res.redirect("/home");
    } catch (error) {
      console.error("Erreur lors de l'ajout du post :", error);
      return res.status(500).send("Erreur serveur");
    }
  });

  //endpoint for to get the edition of a post
  app.get("/edit_post/:id", async (req, res) => {
    let id = req.params.id;
    let oldPost = await postModel.getOnePost(id);

    if (oldPost.code) {
      res.json({
        status: 500,
        msg: "There were a problem !",
        result: oldPost,
      });
    }
    res.render("layout", {
      template: "edit_post",
      post: oldPost[0],
      session: req.session,
    });
    console.log(req.session.user);
  });

  //endpoint for to post the edition of a post
  app.post("/edit_post/:id", async (req, res) => {
    console.log(req.session.user);
    let id = req.params.id;
    let changePost = await postModel.editPost(req, id);
    if (changePost.code) {
      res.json({
        status: 500,
        msg: "There were a problem !",
        result: changePost,
      });
    }
    res.redirect("/admin");
  });

  //endpoint for to get the deletion of a post
  app.get("/delete_post/:id", async (req, res) => {
    let id = req.params.id;
    let post = await postModel.deletePost(id);
    if (post.code) {
      res.json({ status: 500, msg: "There were a problem !", result: post });
    } else {
      res.redirect("/home");
    }
  });

  //endpoint for to  post a comment for a post

  app.post("/add_comment/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const postId = await postModel.getOnePost(id);

      if (postId.code) {
        return res.status(500).json({
          status: 500,
          msg: "There was a problem!",
          result: postId,
        });
      }

      const newCom = await postModel.addComment(req, id);

      console.log("newCom :", newCom);

      if (newCom.code) {
        return res.status(500).json({
          status: 500,
          msg: "There was a problem!",
          result: newCom,
        });
      }

      return res.redirect("/post/" + id);
    } catch (error) {
      console.error("Error adding comment :", error);
      return res.status(500).send("Error server");
    }
  });
};
