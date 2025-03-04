import bcrypt from "bcrypt";
import mongoose from "mongoose";

const BCRYPT_SALT_ROUNDS = 10;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    methods: {
      comparePassword(password: string) {
        return new Promise((resolve, reject) =>
          bcrypt.compare(password, this.password, (err, isMatch) =>
            err ? reject(err) : resolve(isMatch),
          ),
        );
      },
    },
  },
);

UserSchema.pre("save", function hashPassword(next) {
  if (!this.isModified("password")) return next();
  bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      return next();
    });
  });
});

export default mongoose.model<IUser>("User", UserSchema);
