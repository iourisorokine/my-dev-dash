const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

const GithubStrategy = require('passport-github').Strategy;

passport.use(
  new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // find a user with profile.id as githubId or create one
      User.findOne({
          githubId: profile.id
        })
        .then(found => {
          if (found !== null) {
            // user with that githubId already exists
            done(null, found);
          } else {
            // no user with that githubId
            return User.create({
              githubId: profile.id,
              name: profile.displayName,
              email: profile.login,
              city: profile._json.location.toLowerCase(),
              level: 'beginner',
              githubUrl: profile.profileUrl,
              imagePath: profile._json.avatar_url,
              interests: ['javascript']
            }).then(dbUser => {
              done(null, dbUser);
            });
          }
        })
        .catch(err => {
          done(err);
        });
    }
  )
);