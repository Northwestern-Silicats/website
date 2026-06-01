const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const blogSourceDir = path.join(root, "blogs");
const postOutputDir = path.join(root, "posts");
const email = "gauthamanne2027@u.northwestern.edu";
const gitbookUrl = "https://www.notion.so/NU-Silicats-Home-Page-36e5a0f25039809ca74ffc2a3d6578ed?pvs=13";
const discordUrl = "https://discord.gg/kQm5Gr5Q";
const blogRequestFormUrl = "https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true";

const basePages = ["index.html", "about.html", "contribute.html"];
const requiredFiles = [...basePages, "styles.css", "script.js"];
const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

fs.mkdirSync(blogSourceDir, { recursive: true });
fs.mkdirSync(postOutputDir, { recursive: true });

fs.readdirSync(postOutputDir)
  .filter((file) => file.endsWith(".html"))
  .forEach((file) => fs.unlinkSync(path.join(postOutputDir, file)));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatInline = (value) =>
  escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseFrontmatter = (raw) => {
  if (!raw.startsWith("---")) return [{}, raw.trim()];
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return [{}, raw.trim()];

  const meta = {};
  const yaml = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();

  yaml.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) return;
    const key = match[1].trim();
    let value = match[2].trim();
    value = value.replace(/^["']|["']$/g, "");
    if (key === "tags") {
      meta[key] = value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[key] = value;
    }
  });

  return [meta, body];
};

const readMarkdownFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return readMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
};

const markdownToHtml = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = [];
  let code = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    html.push(`<ul>${list.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      code.push(line);
      return;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${formatInline(line.slice(3).trim())}</h2>`);
      return;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      html.push(`<h1>${formatInline(line.slice(2).trim())}</h1>`);
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2).trim());
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();

  return html.join("\n");
};

const readBlogs = () =>
  readMarkdownFiles(blogSourceDir)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const [meta, body] = parseFrontmatter(raw);
      const file = path.relative(blogSourceDir, filePath);
      const authorFolder = file.split(path.sep)[0] || "admin";
      const title = meta.title || path.basename(file, ".md");
      const slug = meta.slug || slugify(title);
      const authorSlug = meta.authorSlug || authorFolder;
      return {
        author: meta.author || authorSlug,
        authorSlug,
        body,
        date: meta.date || "",
        description: meta.description || body.split(/\r?\n/).find((line) => line.trim()) || "",
        file,
        studentEmail: meta.studentEmail || "",
        slug,
        tags: meta.tags || [],
        time: meta.time || "",
        title
      };
    })
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

const nav = (prefix = "") => `
    <header class="site-header">
      <nav class="navbar" aria-label="Primary navigation">
        <a class="brand" href="${prefix}index.html" aria-label="NUSi home">
          <span class="brand-mark" aria-hidden="true">N</span>
          <span><strong>NUSi</strong><small>Northwestern Silicon</small></span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
          <span></span><span></span><span></span><span class="sr-only">Menu</span>
        </button>
        <div class="nav-links" id="primary-nav">
          <a data-nav="home" href="${prefix}index.html">Home</a>
          <a data-nav="about" href="${prefix}about.html">About Us</a>
          <a data-nav="blog" href="${prefix}blog.html">Blog</a>
          <a data-nav="contribute" href="${prefix}contribute.html">Contribute</a>
          <a href="${gitbookUrl}" target="_blank" rel="noreferrer">Docs</a>
        </div>
      </nav>
    </header>`;

const footer = (prefix = "") => `
    <footer class="site-footer">
      <div><strong>NUSi</strong><p>Northwestern University Silicon Initiative</p></div>
      <nav aria-label="Footer links">
        <a class="icon-link" href="https://github.com/" rel="noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
          GitHub
        </a>
        <a class="icon-link" href="mailto:${email}" aria-label="Email">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 8.15L4.72 7H4v.52l8 6.77 8-6.77V7h-.72L12 13.15Z"/></svg>
          Email
        </a>
        <a class="icon-link" href="${discordUrl}" rel="noreferrer" aria-label="Discord">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.54 5.34A16.9 16.9 0 0 0 15.36 4l-.2.4c1.55.38 2.27.94 2.27.94a13.22 13.22 0 0 0-6.86-.26 11.35 11.35 0 0 0-2 .59c-.32.12-.5.2-.5.2s.75-.6 2.39-.98L10.3 4c-1.48.25-2.9.72-4.2 1.38C3.45 9.31 2.73 13.15 3.09 16.94A16.8 16.8 0 0 0 8.2 19.5l.62-.83a10.75 10.75 0 0 1-1.63-.78l.39-.3c3.14 1.47 6.55 1.47 9.65 0l.4.3c-.52.31-1.06.58-1.64.78l.62.83a16.72 16.72 0 0 0 5.12-2.56c.42-4.39-.7-8.19-2.19-11.6ZM8.88 14.62c-1 0-1.82-.9-1.82-2s.8-2 1.82-2c1.01 0 1.84.9 1.82 2 0 1.1-.81 2-1.82 2Zm6.55 0c-1 0-1.82-.9-1.82-2s.8-2 1.82-2c1.01 0 1.84.9 1.82 2 0 1.1-.8 2-1.82 2Z"/></svg>
          Discord
        </a>
      </nav>
    </footer>`;

const shell = ({ title, description, page = "blog", prefix = "", main }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
      rel="stylesheet"
    >
    <link rel="stylesheet" href="${prefix}styles.css">
  </head>
  <body data-page="${page}">
${nav(prefix)}
${main}
${footer(prefix)}
    <script src="${prefix}script.js"></script>
  </body>
</html>
`;

const blogs = readBlogs();

blogs.forEach((post) => {
  const postHtml = shell({
    title: `${post.title} | NUSi`,
    description: post.description,
    prefix: "../",
    main: `
    <main>
      <article class="section blog-post">
        <a class="text-link" href="../blog.html">Back to Blog</a>
        <div class="tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="post-meta">${[
          post.author ? `By ${escapeHtml(post.author)}` : "",
          post.studentEmail ? escapeHtml(post.studentEmail) : "",
          post.date ? `Posted ${escapeHtml(post.date)}` : "",
          post.time ? `at ${escapeHtml(post.time)}` : ""
        ].filter(Boolean).join(" · ")}</p>
${markdownToHtml(post.body)}
      </article>
    </main>`
  });

  fs.writeFileSync(path.join(postOutputDir, `${post.slug}.html`), postHtml);
});

const blogCards =
  blogs.length > 0
    ? blogs
        .map(
          (post) => `
          <article class="blog-card">
            <div class="tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            <h3>${escapeHtml(post.title)}</h3>
            <p class="post-meta">${[
              post.author ? `By ${escapeHtml(post.author)}` : "",
              post.date ? escapeHtml(post.date) : "",
              post.time ? escapeHtml(post.time) : ""
            ].filter(Boolean).join(" · ")}</p>
            <p>${escapeHtml(post.description)}</p>
            <a class="text-link" href="posts/${post.slug}.html">Read post</a>
          </article>`
        )
        .join("")
    : `<article class="blog-card"><h3>No posts yet</h3><p>Add Markdown files to the blogs folder, then run npm run build.</p></article>`;

fs.writeFileSync(
  path.join(root, "blog.html"),
  shell({
    title: "Blog | NUSi",
    description: "NUSi updates, tutorials, industry event recaps, and project logs.",
    main: `
    <main>
      <section class="section page-hero">
        <p class="eyebrow">Blog</p>
        <h1>Updates, tutorials, and project logs</h1>
        <p>Short, useful writing from the team as projects move from idea to implementation.</p>
      </section>

      <section class="section">
        <div class="blog-grid">${blogCards}
        </div>
      </section>

      <section class="section blog-request">
        <div class="section-heading">
          <p class="eyebrow">Request a post</p>
          <h2>Petition for a blog topic</h2>
          <p>Use this embedded Google Form area for topic requests, tutorial ideas, or questions students want answered.</p>
        </div>
        <div class="form-embed">
          <iframe
            src="${blogRequestFormUrl}"
            title="NUSi blog post request form"
            loading="lazy"
          >Loading...</iframe>
        </div>
      </section>
    </main>`
  })
);

const pages = [...basePages, "blog.html", ...blogs.map((post) => `posts/${post.slug}.html`)];

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const isNested = page.includes("/");
  const prefix = isNested ? "../" : "";
  const links = [
    `${prefix}index.html`,
    `${prefix}about.html`,
    `${prefix}blog.html`,
    `${prefix}contribute.html`,
    gitbookUrl
  ];
  const missingLinks = links.filter((link) => !html.includes(link));

  if (missingLinks.length > 0) {
    console.error(`${page} is missing nav links: ${missingLinks.join(", ")}`);
    process.exit(1);
  }
}

console.log(`Build check passed. Generated ${blogs.length} blog post(s).`);
