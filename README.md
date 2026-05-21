# NUSi Website

Modern static website for **NUSi - Northwestern University Silicon Initiative**.

## View It

Open `index.html` directly in a browser for the simplest preview.

For a local server:

```bash
npm run dev
```

Then visit:

```text
http://localhost:4173
```

Run the build and blog generator:

```bash
npm run build
```

## Content Structure

- `index.html`: home, hero, division previews, projects, and docs/blog previews
- `about.html`: mission, what NUSi does, divisions, leadership, and why it exists
- `contribute.html`: low-pressure ways to attend, learn, write notes, help with lab docs, or join projects
- `blogs/`: Markdown source files for blog posts
- `blog.html`: generated blog index
- `posts/`: generated blog post pages
- Docs: external GitBook link for the living technical documentation

## Add A Blog Post

Create a new Markdown file in `blogs/`, then run `npm run build`.

Example:

````markdown
---
title: What is Physical Design?
slug: physical-design-intro
date: 2026-05-19
description: A beginner-friendly explanation of placement, routing, and timing.
tags: [physical-design, tutorials]
---

Write the post here using normal Markdown.

## Section Heading

- Bullets work
- Code blocks work

```verilog
module example;
endmodule
```
````

The build script regenerates `blog.html` and the matching page in `posts/`.

## Contact

The email links currently point to:

```text
gauthamanne2027@u.northwestern.edu
```

The Discord links currently point to:

```text
https://discord.gg/kQm5Gr5Q
```

## GitBook Link

The site currently uses this placeholder:

```text
https://nusi.gitbook.io/docs
```

Replace it in `index.html` and `build.js` once the final NUSi GitBook URL is available.

## Ways To Grow It

- **Current setup:** static HTML/CSS/JS with generated blog pages.
- **Astro:** a good next step if the site eventually needs reusable layouts and richer Markdown handling.
- **GitHub Pages / Netlify / Vercel:** easy static hosting options for the current files.
