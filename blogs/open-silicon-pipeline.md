---
title: Building an Open Silicon Pipeline at Northwestern
slug: open-silicon-pipeline
date: 2026-05-19
description: A practical project log for making the path from first RTL example to reviewed layout easier for students to follow.
tags: [rtl, physical-design, project-log]
---

The first goal for NUSi is not to tape out the most complicated chip possible. It is to make the path from idea to layout understandable enough that a new student can walk into a meeting, learn the vocabulary, and find one useful thing to try.

## Why start with a pipeline?

Silicon projects can feel mysterious because the work is split across many tools and phases: RTL, simulation, verification, synthesis, physical design, design-rule checks, and testing.

A shared pipeline gives the club a common map. People can join at different points without needing to understand every layer on day one.

## What students can work on

- Write glossary entries
- Run tiny examples
- Document tool errors
- Own a small block
- Review pull requests
- Help explain timing and layout reports

The useful work is not only code. It is also making the confusing parts less confusing.

```
# Example project shape
designs/
  counter/
    rtl/
    tests/
    reports/
docs/
  getting-started.md
  tool-setup.md
```

## Next steps

The next sprint is to choose one tiny design, document every command needed to run it, and write a project page that explains what each artifact means.

That gives NUSi a repeatable pattern for future RTL, verification, physical design, and fabrication notes.
