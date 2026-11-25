// Mini-Twitter REST API (Lab 8): Express + in-memory arrays.
// Field names match the React template: post {name, content}, comment {comment}.
const express = require("express");
const app = express();

// Middleware: parses JSON bodies into req.body
app.use(express.json());

// Middleware: CORS. The React app runs on another port (Vite: 5173), so the
// browser blocks its requests unless the server says "that origin is allowed".
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end(); // preflight check
  next();
});

// ---- "Database": plain arrays that live in RAM ----
const posts = [];     // { id, name, content }
const comments = [];  // { id, postId, comment }
let nextPostId = 1;
let nextCommentId = 1;

// Helper: find a post by id (O(n) linear scan)
const findPost = (id) => posts.find((p) => p.id === id);

// 1) READ ALL POSTS            GET /posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// 1b) READ ONE POST            GET /posts/:id   (used by the frontend's detail view)
app.get("/posts/:id", (req, res) => {
  const post = findPost(Number(req.params.id));
  if (!post) return res.status(404).json({ error: "post not found" });
  res.json(post);
});

// 2) UPLOAD A POST             POST /posts   body: {name, content}
app.post("/posts", (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: "name and content are required" });
  }
  const post = { id: nextPostId++, name, content };
  posts.push(post);
  res.status(201).json(post);
});

// 3) EDIT A POST               PUT /posts/:id   body: {name, content}
app.put("/posts/:id", (req, res) => {
  const post = findPost(Number(req.params.id));   // path params are strings!
  if (!post) return res.status(404).json({ error: "post not found" });

  const { name, content } = req.body;
  if (name !== undefined) post.name = name;
  if (content !== undefined) post.content = content;
  res.json(post);
});

// 4) DELETE A POST             DELETE /posts/:id
app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "post not found" });

  posts.splice(index, 1);
  // also remove that post's comments so nothing is orphaned
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].postId === id) comments.splice(i, 1);
  }
  res.status(204).end();
});

// 5) ADD A COMMENT TO A POST   POST /posts/:id/comments   body: {comment}
app.post("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  if (!findPost(postId)) return res.status(404).json({ error: "post not found" });

  const { comment } = req.body;
  if (!comment) return res.status(400).json({ error: "comment is required" });

  const newComment = { id: nextCommentId++, postId, comment };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// 6) READ A POST'S COMMENTS    GET /posts/:id/comments
app.get("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  if (!findPost(postId)) return res.status(404).json({ error: "post not found" });

  res.json(comments.filter((c) => c.postId === postId));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
