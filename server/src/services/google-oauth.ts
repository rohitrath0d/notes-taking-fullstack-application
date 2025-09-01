import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // callbackURL: "http://localhost:8000/api/googleauth/google/callback",
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // let user = await User.findOne({
        //   $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }]
        // });

        // if (!user) {
        //   user = new User({
        //     name: profile.displayName,
        //     email: profile.emails?.[0]?.value ?? "",
        //     googleId: profile.id,
        //     provider: "google",
        //   });
        //   await user.save();
        // }

        const email = profile.emails?.[0]?.value ?? "";
        let user = await User.findOne({ email });

        if (user) {
          // local account exists - Link Google account if not already linked
          if (email && !user.googleId) {
            user.googleId = profile.id;
            // user.provider = "google";
            user.provider = "both";
            await user.save();
          }
        } else {
          // No local account exists → create new
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            provider: "google",
          });
        }
        
        done(null, user);
      } catch (error: string | any) {
        // done(error, null);
        done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  // done(null, user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false); // not found
    }
    done(null, user);
  } catch (error) {
    // done(error, null);
    done(error as any, undefined);
  }
});