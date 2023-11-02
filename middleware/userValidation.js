module.exports = function userValidation(req, res, next) {
  const users = req.users;
  const email = req.body.email;
  const user = users.find((user) => user.email === email);

  if (user) {
    return res.status(409).json({
      status: "fail",
      message: "Email already existed",
    });
  }

  next();
};
