---
title: Hello World
slug: hello-world
author: Admin
authorSlug: admin
studentEmail: gauthamanne2027@u.northwestern.edu
date: 2026-05-31
time: 12:00 PM
description: A first NUSi blog post showing the basic blog structure, metadata, links, code, embeds, and what future posts can cover.
tags: [hello-world, tutorials, blog]
---

Welcome to the NUSi blog.

This post is a small example of what a blog post can look like. Posts can be project updates, fabrication notes, workshop recaps, RTL tutorials, physical design explanations, event summaries, or informal logs from students learning something new.

## Basic structure

Every blog post lives in the `blogs/` folder and starts with metadata at the top. That metadata tells the website how to display the post card and post header.

```markdown
---
title: Hello World
slug: hello-world
author: Admin
authorSlug: admin
studentEmail: gauthamanne2027@u.northwestern.edu
date: 2026-05-31
time: 12:00 PM
description: A short summary for the blog card.
tags: [hello-world, tutorials, blog]
---
```

## Links

You can add links using normal Markdown:

[Visit the NUSi docs](https://www.notion.so/NU-Silicats-Home-Page-36e5a0f25039809ca74ffc2a3d6578ed?pvs=13)

## Code blocks

Use fenced code blocks for snippets, commands, RTL, or setup instructions.

```verilog
module hello_world;
  initial begin
    $display("hello world");
  end
endmodule
```

## Embedded files and media

For images, put the file somewhere the site can serve, then reference it in Markdown:

```markdown
![A chip layout diagram](../assets/example-layout.png)
```

For downloadable files, link to them directly:

```markdown
[Download the lab notes](../assets/lab-notes.pdf)
```

## What blogs can be about

- Project logs from design, verification, physical design, or fabrication
- Tutorials for tools, concepts, or workflows
- ChipChat recaps and speaker notes
- Fabrication process notes and equipment updates
- Student reflections on learning silicon
- Calls for help on open tasks

## Request a post

Use the form on the Blog page to suggest a topic or petition for a post. Good requests include what you want explained, what level you want it at, and whether you want a tutorial, recap, or project log.
