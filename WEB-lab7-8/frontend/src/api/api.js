// Base URL of the API. Lab 7: paste your Postman mock server URL here.
// Lab 8: use the local Express server (backend/server.js).
const MOCK_SERVER_URL = "http://localhost:3000";

// Small helper used by every function below.
// fetch() only rejects on network failure. A 404/500 still "succeeds",
// so we must check response.ok ourselves and throw.
const checkOk = (response, what) => {
  if (!response.ok) {
    throw new Error(`${what} failed: ${response.status} ${response.statusText}`);
  }
};

export const getAllPosts = async () => {
  try {
    const response = await fetch(`${MOCK_SERVER_URL}/posts`);
    checkOk(response, "Fetching posts");
    return await response.json();
  } catch (err) {
    console.error("getAllPosts error:", err);
    throw err; // App.jsx has its own try/catch and logs it
  }
};

export const getPostDetails = async (postId) => {
  try {
    // Fetch 1: the post itself
    const postResponse = await fetch(`${MOCK_SERVER_URL}/posts/${postId}`);
    checkOk(postResponse, `Fetching post ${postId}`);
    const postData = await postResponse.json();

    // Fetch 2: its comments
    const commentsResponse = await fetch(`${MOCK_SERVER_URL}/posts/${postId}/comments`);
    checkOk(commentsResponse, `Fetching comments of post ${postId}`);
    const commentsData = await commentsResponse.json();

    return { post: postData, comments: commentsData };
  } catch (err) {
    console.error("getPostDetails error:", err);
    throw err;
  }
};

// newPostData = { name: '...', content: '...' }
export const createNewPost = async (newPostData) => {
  try {
    const response = await fetch(`${MOCK_SERVER_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPostData),
    });
    checkOk(response, "Creating post");
  } catch (err) {
    console.error("createNewPost error:", err);
    throw err;
  }
};

// newCommentData = { comment: '...' }
export const createNewComment = async (postId, newCommentData) => {
  try {
    const response = await fetch(`${MOCK_SERVER_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCommentData),
    });
    checkOk(response, `Creating comment on post ${postId}`);
  } catch (err) {
    console.error("createNewComment error:", err);
    throw err;
  }
};
