require("dotenv").config();
const fs = require("fs");

const express = require("express");
const app = express();

const port = process.env.PORT || 9000;
app.use(express.json());
const readUsersFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      "./dev-data/data/users.json",
      "utf-8"
    );
    const users = JSON.parse(data);
    req.users = users;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while reading the file",
    });
  }
};

app.get("/api/v1/users/:id", readUsersFile, (req, res) => {
  const id = req.params.id;
  const users = req.users;
  const user = users.find((user) => String(user.id) === id);
  if (user) {
    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No user found with the ID",
    });
  }
});

app.get("/api/v1/users", readUsersFile, (req, res) => {
  const users = req.users;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: users,
    },
  });
});

app.post("/api/v1/users", readUsersFile, async (req, res, next) => {
  const users = req.users;
  const newUser = {
    id: users[users.length - 1].id + 1,
    name: req.body?.name,
    username: req.body?.username,
    email: req.body?.email,
    address: req.body?.address,
    phone: req.body?.phone,
    website: req.body?.website,
    company: req.body?.company,
  };

  const user = users.find((user) => user.email === newUser.email);
  console.log(user);

  if (!user) {
    users.push(newUser);

    try {
      await fs.promises.writeFile(
        "./dev-data/data/users.json",
        JSON.stringify(users)
      );
      res.status(200).json({
        status: "success",
        data: newUser,
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(409).json({
      status: "fail",
      message: "Email already existed",
    });
  }
});

app.put("/api/v1/users/:id", readUsersFile, (req, res) => {
  const id = req.params.id;
  const users = req.users;
  const user = users.find((user) => String(user.id) === id);
  if (user) {
    const updatedUser = {
      ...user,
      name: req.body?.name || user.name,
      username: req.body?.username || user.username,
      email: req.body?.email || user.email,
      address: req.body?.address || user.address,
      phone: req.body?.phone || user.phone,
      website: req.body?.website || user.website,
      company: req.body?.company || user.company,
    };

    const updatedUsers = users.map((user) =>
      String(user.id) === id ? updatedUser : user
    );
    res.status(200).json({
      status: "success",
      results: updatedUsers.length,
      data: {
        users: updatedUsers,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No user found with the ID",
    });
  }
});

app.delete("/api/v1/users/:id", readUsersFile, async (req, res) => {
  const id = req.params.id;
  const users = req.users;
  const updatedUsers = users.filter((user) => String(user.id) !== id);
  try {
    await fs.promises.writeFile(
      "./dev-data/data/users.json",
      JSON.stringify(updatedUsers)
    );
    res.status(200).json({
      status: "success",
      results: updatedUsers.length,
      data: {
        users: updatedUsers,
      },
    });
  } catch (err) {
    next(err);
  }
});

const readPostsFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      "./dev-data/data/posts.json",
      "utf-8"
    );
    const posts = JSON.parse(data);
    req.posts = posts;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while reading the file",
    });
  }
};

app.get("/api/v1/users/:userId/posts/:id", readPostsFile, (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  const post = posts.find((post) => String(post.id) === id);
  if (post) {
    res.status(200).json({
      status: "success",
      data: {
        post: post,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No post found with the ID",
    });
  }
});

app.get("/api/v1/users/:userId/posts", readPostsFile, (req, res) => {
  const userId = req.params.userId;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts: posts,
    },
  });
});

app.post(
  "/api/v1/users/:userId/posts",
  readPostsFile,
  async (req, res, next) => {
    const userId = req.params.userId;
    const posts = req.posts.filter((post) => String(post.userId) === userId);
    const newPost = {
      id: posts[posts.length - 1].id + 1,
      userId: req.body?.userId,
      title: req.body?.title,
      body: req.body?.body,
    };

    posts.push(newPost);

    try {
      await fs.promises.writeFile(
        "./dev-data/data/posts.json",
        JSON.stringify(posts)
      );
      res.status(200).json({
        status: "success",
        data: newPost,
      });
    } catch (err) {
      next(err);
    }
  }
);

app.put("/api/v1/users/:userId/posts/:id", readPostsFile, (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;
  const posts = req.posts.filter((post) => String(post.userId) === userId);
  const post = posts.find((post) => String(post.id) === id);

  if (post) {
    const updatedPost = {
      ...post,
      userId: req.body?.userId || post.userId,
      title: req.body?.title || post.title,
      body: req.body?.body || post.body,
    };

    const updatedPosts = posts.map((post) =>
      String(post.id) === id ? updatedPost : post
    );

    res.status(200).json({
      status: "success",
      results: updatedPosts.length,
      data: {
        posts: updatedPosts,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No Post found with the ID",
    });
  }
});

app.delete(
  "/api/v1/users/:userId/posts/:id",
  readPostsFile,
  async (req, res) => {
    const userId = req.params.userId;
    const id = req.params.id;
    const posts = req.posts.filter((post) => String(post.userId) === userId);
    const updatedPosts = posts.filter((post) => String(post.id) !== id);

    try {
      await fs.promises.writeFile(
        "./dev-data/data/users.json",
        JSON.stringify(updatedPosts)
      );
      res.status(200).json({
        status: "success",
        results: updatedPosts.length,
        data: {
          users: updatedPosts,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
