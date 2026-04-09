## Usage

`yarn install`

`yarn dev`

## File-based routing

### Index routes

- src/pages/index.tsx -> /
- src/pages/posts/index.tsx -> /posts

### Nested routes

- src/pages/posts/topic.tsx -> /posts/topic
- src/pages/settings/profile.tsx -> /settings/profile

### Dynamic routes

- src/pages/posts/[slug].tsx -> /posts/:slug
- src/pages/[user]/settings.tsx -> /:user/settings
- src/pages/posts/[...all].tsx -> /posts/\*
