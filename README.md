# Pure Router

A basic, zero-dependency router built purely in JavaScript

# Features overview

- HTTP requests (GET, POST, etc)
- Middleware handling
- Static file **serving**
- Static file **caching**
- Dynamic data caching, based on hash

# Features explained

# HTTP requests

TODO

## Middleware handling

Middleware are functions which wrap the main request listener (and other middleware) to create a tree that is executed in order of parents -> children:

```js
const listener = (request, response) => {
  // ... main request listener code ...
};

let wrapped_listener = listener;
for (let i = middlewares.length - 1; i >= 0; i--) {
  const current_middleware = middlewares[i];
  wrapped_listener = current_middlware(wrapped_listener);
}

// This results in a calling chain of middlewareOne -> middlewareTwo -> middlewareThree -> listener
http.createServer((request, response) => {
  wrapped_listener(request, response);
  response.end();
});
```

Each middleware function calls the next middleware in the stack, using `next`:

```js
const middlewareOne = (next) => {
  return (request, response) => {
    // ... code to execute before handling the request ...
    next(request, response);
    // ... code to execute after the request was handled ...
  };
};

// ...
```

After all the middleware have executed, the response is finally sent to the client.

# Static file **serving**

TODO

# Static file **caching**

TODO

# Dynamic data caching, based on hash

TODO
