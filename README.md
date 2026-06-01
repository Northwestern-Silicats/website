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
- `about.html`: mission, teams, advisors, and leadership
- `contribute.html`: simple start-here form and contact path
- `blogs/`: Markdown source files for blog posts, organized by author folder
- `blog.html`: generated blog index
- `posts/`: generated blog post pages
- Docs: external GitBook link for the living technical documentation

## Blog Folder Structure

Blog posts are grouped by author/person:

```text
blogs/admin/hello-world.md
blogs/gautham-anne-2027/my-post.md
```

Use `admin` for official/general posts. Use a student folder like `gautham-anne-2027` for posts by Gautham Anne, class of 2027.

## Add A Blog Post

Create a new Markdown file inside an author folder in `blogs/`, then run `npm run build`.

Example:

````markdown
---
title: What is Physical Design?
slug: physical-design-intro
author: Gautham Anne
authorSlug: gautham-anne-2027
studentEmail: gauthamanne2027@u.northwestern.edu
date: 2026-05-31
time: 3:30 PM
description: A beginner-friendly explanation of placement, routing, and timing.
tags: [physical-design, tutorials]
---

Write the post here using normal Markdown.

## Section Heading

- Bullets work
- Code blocks work
- Links work: [NUSi docs](https://www.notion.so/NU-Silicats-Home-Page-36e5a0f25039809ca74ffc2a3d6578ed?pvs=13)

```verilog
module example;
endmodule
```
````

The build script regenerates `blog.html` and the matching page in `posts/`.

## Request Form

The Blog page includes a Google Form embed placeholder for people to petition/request blog posts.

Replace `FORM_ID` in `build.js` with the real Google Form ID:

```js
const blogRequestFormUrl = "https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true";
```

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
https://www.notion.so/NU-Silicats-Home-Page-36e5a0f25039809ca74ffc2a3d6578ed?pvs=13
```

Replace it in `index.html` and `build.js` once the final NUSi GitBook URL is available.

## Ways To Grow It

- **Current setup:** static HTML/CSS/JS with generated blog pages.
- **Astro:** a good next step if the site eventually needs reusable layouts and richer Markdown handling.
- **GitHub Pages / Netlify / Vercel:** easy static hosting options for the current files.
