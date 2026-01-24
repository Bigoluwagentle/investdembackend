import User from "../models/User";

export const createUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.create({
    email,
    password,
    role: "user",
  });

  res.json(user);
};

export const getAllUsers = async (_: any, res: any) => {
  const users = await User.find({ role: "user" });
  res.json(users);
};
