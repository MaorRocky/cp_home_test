# Check Point assignment - Maor Rocky

## MongoDB schemas:

- LikeSchema:

    ```jsx
    const LikesSchema = mongoose.Schema({
      likersArray: {
        type: [String],
      },
      likesCount: {
        type: Number,
      },
    });
    ```

    1. likersArray: [String] - string array which represents the user who liked this post.
    a user can like a post only once.
    2. likesCounts: Number - the number represents the amount of like the post has.

- PostSchema:

    ```jsx
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
          maxLength: [500, 'minLength of title is 30'],
        },
        name: {
          type: String,
          required: true,
          
        },
        likes: LikesSchema,
      },

      { timestamps: true }

    ```

    1. title: String
    2. text: String
    3. name: String
    4. timeStamp: Date

# Routes:

The app has 3 routers:

- postsRouter - handles everything related to CRUD operations of the posts
- likesRouter - handles the liking or unliking of a specific post.
- helloRouter - send a small text to the browser at the root route.

### postsRouter:

- /posts - GET, get all posts.
- /posts/trendings - GET, get the trending posts, i.e. feed.
- /posts/:id - GET, get a post by id
- /posts - POST, create a new post

    the new post requires:

    1. title: String, length more than 2, less than 31.
    2. text: String, length less than 501.
    3. name: String, non-empty.
- /posts/:id - DELETE, delete a post by id.
- /posts/:id - PATCH, update a post by id, can only update text, or title of the post.

```jsx
router.get('/posts', getAllPosts);
router.get('/posts/trendings', getTrendingPosts);
router.get('/posts/:id', getPostByID);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePostByID);
router.patch('/posts/:id', updatePostByID);
```

### getTrendingPosts - eplxained:

A post contains a likes Object with a number representing the number of likes, as well as a mock array of users.

The most liked posts will appear first, followed by the newer ones.

Rather than using the length property of the likersArrays to sort posts, I created the likesCount property which facilitates fast comparison between posts in O(nlogn) runtime.

### likesRouter

- /posts/like/:id - PATCH - like a post by an id.
- /posts/unlike/:id - PATCH - unlike a post by an id.

**important!**

In order to prevent a user from liking a post an infinite number of times, since I don't have cookies or JWT, and since user registration is not required, I decided that the body of the patch request should contain the field "user."

This will allow me to find out if the user has already liked this post, as well as unlike it.

Rather than simply increasing or decreasing the counter to represent the number of likes, the object of a counter and array was chosen because it is closer to a real-life system like Facebook, where a user can only like a post once

```jsx
router.patch('/posts/like/:id', likeAPost);
router.patch('/posts/unlike/:id', unlikeAPost);
```

# Custome middleware

Instead of using try/catch clauses in each controller, I used "asyncHandler" which enables me to use my own middlewares which assist me in returning errors, such as invalid routes.

# What made me choose Node.js?

I deiced to choose node as the programming language since this assignment is very suited for a single-threaded async language.  Every request from the client needs data to be fetched from the DB, and there isn't some complicated algorithm to be made on the data retrieved. For this kind of system, most of the time better performance will be achieved using node instead of some concurrent language. 

# Docker and docker-compose

The docker file creates a simple image for the node app.

The docker-compose creates an image from the context of the dockerfile, along with a container for the mongoDB connection. MongoDB is a dependency of the Node API.