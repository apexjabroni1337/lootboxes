import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface PostFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  cover_image?: string;
  type?: "blog" | "guide";
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

/**
 * Get all posts from a content subdirectory (e.g. "blog", "guides").
 */
export function getAllPosts(dir: string = "blog"): Post[] {
  const fullPath = path.join(CONTENT_DIR, dir);

  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as PostFrontmatter,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/**
 * Get a single post by slug.
 */
export function getPost(dir: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}
