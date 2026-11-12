const bcrypt = require("bcryptjs");
const saltRounds = 10;
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (app, db) => {
  const userModel = require("../models/userModel")(db);

  app.get("/test", async (res) => {
    res.json({ status: 200, msg: "PAGE TEST" });
  });

  // endpoint for to save an user display the register page
  app.get("/register", async (req, res) => {
    res.render("layout", { template: "register", session: req.session });
  });

  // endpoint for saving a user
  app.post(
    "/register",
    check("email", "This email must correspond to a valid email ").isEmail(),
    check(
      "firstname",
      "This firstName to be required and must to be write with aplha character",
    )
      .isAlpha()
      .exists(),
    check(
      "lastname",
      "This lastName to be required and must to be write with aplha character ",
    )
      .isAlpha()
      .exists(),
    check(
      "password",
      "The password must be at least 8 characters long",
    ).isLength({ min: 8 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("layout", {
          template: "register",
          status: 400,
          alert: alert,
          session: req.session,
        });
      }
      let user = await userModel.saveOneUser(req);
      console.log("user", user);
      if (user.code) {
        return res.render("layout", {
          template: "register",
          status: 500,
          msg: "There were a problem !",
          result: user,
          session: req.session,
        });
      }
      res.redirect("/login");
    },
  );

  //endpoint for to get display the login page
  app.get("/login", async (req, res) => {
    res.render("layout", {
      template: "login",
      error: null,
      session: req.session,
    });
  });

  //endpoint for to post the login for connection (with session creation)
  app.post(
    "/login",
    check("email", "This email must correspond to a valid email ").isEmail(),
    check(
      "password",
      "Password must to be min 8 characters and Alpha numeric",
    ).isLength({ min: 8 }),
    async (req, res) => {
      let user = await userModel.getUserByEmail(req.body.email);
      console.log("user", user);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render("layout", {
          template: "login",
          status: 200,
          error: "",
          alert: alert,
          session: req.session,
        });
      }

      if (user.length === 0) {
        res.render("layout", {
          template: "login",
          error: "Unknown email",
          session: req.session,
        });
      } else {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then((same) => {
            if (same) {
              req.session.user = {
                id: user[0].id,
                firstName: user[0].firstName,
                lastName: user[0].lastName,
                email: user[0].email,
                role: user[0].role,
              };

              req.session.isLogged = true;
              res.redirect("/home");
              //req.flash('info', 'Welcome !')
            } else {
              //if else we send the incorrect password error
              res.render("layout", {
                template: "login",
                error: "Incorrect password",
                session: req.session,
              });
            }
          })
          .catch((err) => console.log("Failed password comparison", err));
      }
    },
  );

  //endpoint for logout
  app.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/home");
    });
  });
};
