import express, { Request, Response } from "express";
import { Database } from "./database";
import redis from "./utils/redis";
import { routers } from './routes';
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/config";
import { User } from "./database/models/Users";
import { Role } from "./database/models/Roles";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import cors from "cors";
import { wholesalerRouter } from "./routes/wholesalerRoutes";

import { retailerRouter } from "./routes/retailerRoutes";
config();
const app = express();

// JSON parsing
app.use(express.json());
app.use(cors());

// Session & Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value || "";
        const name = profile.displayName;

        // Check if user exists in DB
        let user = await User.findOne({ where: { email } });

        if (!user) {
          // Get default role
          let defaultRole = await Role.findOne({ where: { name: "User" } });

       if (!defaultRole) {
       defaultRole = await Role.create({
       name: "User",
      description: "Default role for Google login",
  });
}

          // Create new user without password
          user = await User.create({
            name,
            email,
            password: "", // Google login doesn't require password
            roleId: defaultRole.id,
            status: "pending", // Set default status for Google login users
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(routers);

app.get("/", (req: Request, res: Response) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

app.use("/api/wholesalers", wholesalerRouter);
app.use('/api/retailers', retailerRouter);

// Routers
app.use(routers);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home page
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to SokoLink API</h1>
    <p><a href="/auth/google">Login with Google</a></p>
    <p>View <a href="/api-docs">API Docs</a></p>
  `);
});

// Google OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.roleId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.send(`
      <h1>Welcome ${user.name}</h1>
      <p>Email: ${user.email}</p>
      <p>Your JWT Token: ${token}</p>
    `);
  }
);

app.get("/profile", (req: Request, res: Response) => {
  if (!req.user) return res.redirect("/");
  const user = req.user as any;
  res.send(`
    <h1>Welcome ${user.profile.displayName}</h1>
    <p>Email: ${user.profile.emails?.[0].value}</p>
    <p>Access Token: ${user.accessToken}</p>
  `);
});

app.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

// Redis
redis.connect().catch(console.error);

// Health check
app.get("/health", (req, res) => res.send("API is running"));

// Start server
const port = parseInt(process.env.PORT as string) || 5000;

Database.database
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      console.log(`Swagger docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
  app.use("/api/wholesalers", wholesalerRouter);
  app.use('/api/retailers', retailerRouter);

export { app };
