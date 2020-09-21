// Begin

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
//   but else
  res.redirect("/auth/discord");
};

const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const app = require("express")();

const clientID = "CLIENT ID",
      clientSecret = "CLIENT SECRET",
      callbackURL = `https://${process.env.PROJECT_DOMAIN}.glitch.me/auth/discord/callback`;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
  clientID,
  clientSecret,
  callbackURL
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    done(null, profile);
  })
}));

app.use(session({
  secret: "tololtololltolol",
  saveUninitialized: true,
  resave: true
}));

app.get("/login", checkAuth);

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/discord", passport.authenticate("discord", {
  scope: ["identify", "email", "guilds"]
}));

app.get("/logout", checkAuth, (req,res) => {
 req.logout();
 res.redirect("/");
});
app.get("/auth/discord/callback", passport.authenticate("discord", {
  failureRedirect: "/login"
}), (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.json(req.user ? req.user : { "empty": "login first!" });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Listening to ${listener.address().port}`);
});
