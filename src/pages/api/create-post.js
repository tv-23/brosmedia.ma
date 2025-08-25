import fs from 'fs';
import path from 'path';
import he from 'he';  // استيراد مكتبة he

export async function POST() {
  return await cbd();
}

async function cbd() {
  try {
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

    // حذف الملفات القديمة
    const oldFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    for (const file of oldFiles) {
      fs.unlinkSync(path.join(postsDir, file));
    }

    // جلب المقالات من WordPress
    const res = await fetch('https://brosmedia.ma/wp-json/wp/v2/posts?_embed');
    if (!res.ok) {
      throw new Error(`Erreur lors du fetch: ${res.status}`);
    }
    const posts = await res.json();

    // إنشاء ملفات Markdown
    for (const post of posts) {
      const title = he.decode(post.title.rendered.replace(/"/g, '\\"'));          // فك الترميز هنا
      const date = post.date;
      const description = he.decode(
        (post.excerpt?.rendered || '')
          .replace(/(<([^>]+)>)/gi, '')
          .trim()
          .replace(/"/g, '\\"')
      );
      const author = he.decode(post._embedded?.author?.[0]?.name || 'Auteur inconnu');
      const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      const content = post.content.rendered.trim(); // لا نحذف الوسوم HTML

      // فك الترميز للتصنيفات
      const categoriesRaw = post._embedded?.["wp:term"]?.[0]?.map(cat => he.decode(cat.name)) || [];

      const frontmatter = `---\n` +
        `title: "${title}"\n` +
        `pubDate: "${date}"\n` +
        `description: "${description}"\n` +
        `author: "${author}"\n` +
        `image:\n  url: "${image}"\n  alt: ""\n` +
        `excerpt: "${description}"\n` +
        `featured_media: "${image}"\n` +
        `categories: [${categoriesRaw.map(cat => `"${cat}"`).join(', ')}]\n` +
        `---\n\n` +
        `${content}`;

      const fileName = `${post.slug}.md`;
      const filePath = path.join(postsDir, fileName);
      fs.writeFileSync(filePath, frontmatter, 'utf-8');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur de création:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// جدولة التحديث كل ساعة
setInterval(() => {
  cbd();
}, 3600 * 1000);
