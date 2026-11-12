const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const parseurl = require("parseurl");
require("dotenv").config();

const { Pool } = require("pg");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const csrf = require("csurf");

const app = express();
app.set("trust proxy", 1);
// ==================================================
// 1. CONFIGURATION DE LA SECURITE HTTP
// ==================================================

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://stackpath.bootstrapcdn.com",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://stackpath.bootstrapcdn.com",
        ],
      },
    },
  }),
);

// ==================================================
// 2. PROTECTION XSS
// ==================================================

app.use(xssClean());

// ==================================================
// 3. FICHIERS STATIQUES
// ==================================================

app.use(express.static(__dirname + "/public"));

// ==================================================
// 4. CONFIGURATION EJS
// ==================================================

app.set("views", "./views");
app.set("view engine", "ejs");

// ==================================================
// 5. PARSING DES REQUETES HTTP
// ==================================================

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ==================================================
// 6. CONFIGURATION DES SESSIONS
// ==================================================

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

app.use(sessionMiddleware);

// ==================================================
// 7. FLASH MESSAGES
// ==================================================

app.use(flash());

// ==================================================
// 8. PROTECTION CSRF
// ==================================================

const csrfProtection = csrf({ cookie: false });

app.use(csrfProtection);

// Token accessible dans tous les templates EJS
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ==================================================
// 9. INITIALISATION DE LA SESSION UTILISATEUR
// ==================================================

app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = null;
    req.session.isLogged = false;
  }

  next();
});

// ==================================================
// 10. MIDDLEWARE DE PROTECTION DES ROUTES
// ==================================================

app.use((req, res, next) => {
  const pathname = parseurl(req).pathname;

  const protectedPath = ["/admin", "/add_post", "/edit_post"];

  const onlyAdmin = ["/admin"];

  if (protectedPath.includes(pathname) && !req.session.isLogged) {
    return res.redirect("/login");
  }

  if (onlyAdmin.includes(pathname) && req.session.user?.role !== "admin") {
    return res.redirect("/home");
  }

  next();
});

// ==================================================
// 11. CONNEXION POSTGRESQL
// ==================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
});

// ==================================================
// 12. IMPORT DES ROUTES
// ==================================================

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==================================================
// 13. INITIALISATION DE L'APPLICATION
// ==================================================

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Connected successfully to PostgreSQL");

    userRoutes(app, pool);
    postRoutes(app, pool);
    adminRoutes(app, pool);

    app.get("/", (req, res) => {
      res.json({
        status: 200,
        results: "welcome to api",
      });
    });

    // ==================================================
    // 14. GESTION DES ERREURS CSRF ET AUTRES ERREURS
    // ==================================================

    app.use((err, req, res, next) => {
      if (err.code === "EBADCSRFTOKEN") {
        return res
          .status(403)
          .send("Votre formulaire a expiré ou votre token CSRF est invalide.");
      }

      console.error(err);

      res.status(500).send("Erreur interne du serveur");
    });

    // ==================================================
    // 15. DEMARRAGE DU SERVEUR
    // ==================================================

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Connection error to PostgreSQL:", err);
    process.exit(1);
  }
}

startServer();
