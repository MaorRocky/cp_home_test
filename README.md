# Check Point assignment - Maor Rocky

How to run?

- clone the project from GitHub - [https://github.com/MaorRocky/cp_home_test](https://github.com/MaorRocky/cp_home_test)
- run in the terminal:

> docker-compose up --build

# Tech stack used:

1. Node.js
2. MongoDB using mongoose
3. express
4. pino.js for logging
5. mongoose-paginate-v2 for pagination in MongoDB

---

MongoDB schemas:

- PostSchema:

    ```jsx
    import mongoose from 'mongoose';
    import mongoosePaginate from 'mongoose-paginate-v2';

    const PostSchema = mongoose.Schema(
      {
        title: {
          type: String,
          required: true,
          minLength: [3, 'minLength of title is 3'],
          maxLength: [30, 'minLength of title is 30'],
        },
        text: {
          type: String,
          required: true,
          maxLength: [500, 'max of text is 500'],
        },
        author: {
          type: String,
          required: true,
        },
        likesCount: {
          type: Number,
          default: 0,
        },
        userIdArray: {
          type: [String],
          default: [],
        },
      },

      { timestamps: true }
    );

    PostSchema.index({ likesCount: -1, createdAt: -1 });
    PostSchema.plugin(mongoosePaginate);

    export default mongoose.model('Post', PostSchema);

    ```

    1. title: String
    2. text: String
    3. author: String
    4. timeStamp: Date
    5. likesCount: Number
    6. userIdArray: [String]

    ### Explanation about the Post model

    title - represents the title of the post

    text - represents the text of the blog post

    author - name of the user who wrote the post.

    timeStamp - Date of the creation of the post.

    likesCount - a counter of the post likes

    userIdArray - I aimed to mock a real-life system such as Facebook, where users can only like one post at a time. However, since this API does not allow user registration, I decided that in order to like a post (or unlike it), the HTTP request needs to contain a query parameter named "user" which can be any string to represent the user id.

    Indexing explained:

    Since we need to fetch the most rending posts, I created a compound index from the likesCount, and the date

    ```jsx
    PostSchema.index({ likesCount: -1, createdAt: -1 });
    ```

    this will allow me to do fast queries!.

    mongoosePaginate:

    This package helps me to execute faster queries using the bucket pattern, and to avoid using MongoDB skip() function which can performance issues if the system has a lot of posts. will be explained more in detail later at the relevant controller function.

---

# Routes:

The app has 3 routers:

- postsRouter - handles everything related to CRUD operations of the posts
- likesRouter - handles the liking or unliking of a specific post.
- docksRouter - send a redirect to the GitHub readme page.
- healthChecRouter - sends a ping to check that the database is up and running and can accept traffic.

### postsRouter:

Please pay attention that some routes require query parameters or a request body with specific fields.

- /posts/?page=1&limit=5 - GET, get posts, query params need to be sent for the page number and limit(limit is the number of posts per page)

    example: 

    > [http://localhost:3000/posts/?page=3&limit=1](http://localhost:3000/posts/?page=3&limit=1)

- /posts/trendings/?page=1&limit=5 - GET, get the trending posts. query params need to be sent for the page number and limit(limit is the number of posts per page)

    example:

    > [http://localhost:3000/posts/trendings/?page=0&limit=4](http://localhost:3000/posts/trendings/?page=0&limit=4)

- /posts/:id - GET, get a post by id

    example:

    > [http://localhost:3000/posts/612a008801c5fffa4291eabb](http://localhost:3000/posts/612a008801c5fffa4291eabb)

- /posts - POST, create a new post

    the new post requires:

    1. title: String, length more than 2, less than 31.
    2. text: String, length less than 501.
    3. author: String, non-empty.
- /posts/:id - DELETE, delete a post by id.
- /posts/:id - PATCH, update a post by id, can only update text, or title of the post.

```jsx
router.get('/posts', getPosts);
router.get('/posts/trendings', getTrendingPosts);
router.get('/posts/:id', getPostByID);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePostByID);
router.patch('/posts/:id', updatePostByID);
```

### getTrendingPosts - eplxained:

Posts are ranked on popularity based on how many likes they have and than their posted date

I have limited the number of posts you can get per request to 10, but you can decrease this limit using query parameters.

Let's assume we have 20 posts, after pulling the top 10 trending posts, what if you now want the late 10 remaining posts? Using another query parameter call page, we will skip the first 10 posts (which we already have) and fetch the last 10 posts using the skip method of MongoDB.

Sounds good, doesn't it?

### NO!

It takes O(N) time to run skip(), so if we have N = 10000000 posts, we must traverse 10000000-10 posts in order to get the last 10 posts, which is not ideal.

One of the ways so solve this is using the pagination,

this is an exmaple of bad usage, using skip();

```jsx
export const getTrendingPosts = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 0;
  limit = parseInt(limit) || maxLimit;
  limit = Math.min(limit, maxLimit);

  let posts = await Post.find({})
    .sort({ likesCount: -1, createdAt: -1 })
    .limit(limit)
    .skip(limit * page);
  if (posts) {
    res.send({ posts, success: true });
  } else {
    res.status(500);
    throw new Error('Trending posts were not fetched');
  }
});
```

This is a better way of getting the posts, the posts will condense into a single document using an array of docs to represents the posts

```jsx
export const getTrendingPosts = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 0;
  limit = parseInt(limit) || maxLimit;
  limit = Math.min(limit, maxLimit);

  const options = {
    page,
    limit,
    sort: { likesCount: -1, createdAt: -1 },
  };

  let posts = await Post.paginate({}, options);
  if (posts) {
    res.send({ posts, success: true });
  } else {
    res.status(500);
    throw new Error('Trending posts were not fetched');
  }
});
```

### likesRouter

- /posts/like/:id - PATCH - like a post by an id.

    example

    > [http://localhost:3000/posts/like/612a7f50e0c3c3b9d6a3ff84/?user=3](http://localhost:3000/posts/like/612a7f50e0c3c3b9d6a3ff84/?user=3)

- /posts/unlike/:id - PATCH - unlike a post by an id.

    > [http://localhost:3000/posts/unlike/612a7f50e0c3c3b9d6a3ff84/?user=3](http://localhost:3000/posts/unlike/612a7f50e0c3c3b9d6a3ff84/?user=3)

**important!**

In order to prevent a user from liking a post an infinite number of times, since I don't have cookies or JWT, and since user registration is not required, I decided that the  patch request should contain the query parameter "user."

This will allow me to find out if the user has already liked this post, as well as unlike it.

Rather than simply increasing or decreasing the counter to represent the number of likes, the object of a counter and array was chosen because it is closer to a real-life system like Facebook, where a user can only like a post once

```jsx
router.patch('/posts/like/:id', likeAPost);
router.patch('/posts/unlike/:id', unlikeAPost);
```

# Custome middleware

Instead of using try/catch clauses in each controller, I used "asyncHandler" which enables me to use my own middlewares which assist me in logging errors, such as invalid routes, bad requests, and more.

In addition i used a validIdHandel middleware to check if the id recived in the request is a mongoDB id or not.

# What made me choose Node.js?

I deiced to choose node as the programming language since this assignment is very suited for a single-threaded async language.  Every request from the client needs data to be fetched from the DB, and there isn't some complicated algorithm to be made on the data retrieved. For this kind of system, most of the time better performance will be achieved using node instead of some concurrent language. 

# Docker and docker-compose

The docker file creates a simple image for the node app.

The docker-compose creates an image from the context of the dockerfile, along with a container for the mongoDB connection. MongoDB is a dependency of the Node API.
