# CSE343 - Labs 7 & 8: Mini-Twitter

Lab 7: REST design (Postman mock server) + frontend calling it with `async/await fetch`.
Lab 8: the real backend with Node.js + Express (in-memory arrays).

## Structure
```
WEB-lab7-8/
├── frontend/   React (Vite) app  -> src/api/api.js talks to the API
└── backend/    Express server    -> server.js (6+1 REST endpoints)
```

## REST API
| Method | URL                      | Body                  | Result                |
|--------|--------------------------|-----------------------|-----------------------|
| GET    | /posts                   | -                     | all posts             |
| GET    | /posts/:id               | -                     | one post              |
| POST   | /posts                   | { name, content }     | 201 + created post    |
| PUT    | /posts/:id               | { name?, content? }   | updated post          |
| DELETE | /posts/:id               | -                     | 204                   |
| GET    | /posts/:id/comments      | -                     | comments of the post  |
| POST   | /posts/:id/comments      | { comment }           | 201 + created comment |

## Run it
Terminal 1 (backend):
```
cd backend
npm install
npm start            # http://localhost:3000
```
Terminal 2 (frontend):
```
cd frontend
npm install
npm run dev          # http://localhost:5173
```
To use the Postman mock server instead (Lab 7), set `MOCK_SERVER_URL` in `frontend/src/api/api.js`.
