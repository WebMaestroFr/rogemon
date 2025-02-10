import bcrypt from "bcrypt";
import mongoose from "mongoose";

const BCRYPT_SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    methods: {
      comparePassword(password: string) {
        return new Promise((resolve, reject) =>
          bcrypt.compare(password, this.password, (err, isMatch) =>
            err ? reject(err) : resolve(isMatch)
          )
        );
      },
    },
  }
);

UserSchema.pre("save", function hashPassword(next) {
  if (!this.isModified("password")) return next();
  bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

export default UserSchema;
