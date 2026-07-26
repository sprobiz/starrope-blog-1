import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

function generateCardHtml(post) {
  return `         <!-- Post: ${post.filename} -->
         <article class="post-card">
           <div class="post-card-thumb" style="background-image: url('${post.image_url}');">
             <span class="post-tag">${post.tag}</span>
           </div>
           <div class="post-card-content">
             <div class="post-meta">
               <span>작성자: Starrope</span>
               <span>•</span>
               <span>${post.date_display}</span>
             </div>
             <h3 class="post-card-title"><a href="posts/${post.filename}">${post.title}</a></h3>
             <p class="post-card-desc">${post.description}</p>
             <div class="post-card-footer">
               <a href="posts/${post.filename}" class="read-more-btn">
                 읽어보기 
                 <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                 </svg>
               </a>
             </div>
           </div>
         </article>`;
}

function isAlreadyPublished(filename, indexContent) {
  const marker = '<!-- SCHEDULED_POSTS_START -->';
  const sidebarMarker = '<!-- RIGHT: SIDEBAR -->';
  if (!indexContent.includes(marker)) return false;
  const startIdx = indexContent.indexOf(marker);
  const endIdx = indexContent.indexOf(sidebarMarker, startIdx);
  const gridContent = endIdx === -1 ? indexContent.slice(startIdx) : indexContent.slice(startIdx, endIdx);
  return gridContent.includes(`posts/${filename}`);
}

function main() {
  const schedulePath = path.join(projectRoot, 'schedule.json');
  const indexPath = path.join(projectRoot, 'index.html');
  const sitemapPath = path.join(projectRoot, 'sitemap.xml');

  const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
  let indexContent = fs.readFileSync(indexPath, 'utf-8');
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

  // KST Date calculation (UTC+9)
  const now = new Date();
  const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const todayStr = kstNow.toISOString().slice(0, 10);

  let publishedCount = 0;

  for (const post of schedule.posts) {
    if (isAlreadyPublished(post.filename, indexContent)) {
      continue;
    }

    if (post.publish_date <= todayStr) {
      console.log(`Publishing: ${post.filename} (${post.publish_date} ${post.publish_time})`);
      const cardHtml = generateCardHtml(post);
      const marker = '<!-- SCHEDULED_POSTS_START -->';
      if (indexContent.includes(marker)) {
        indexContent = indexContent.replace(marker, marker + '\n' + cardHtml);
      }

      const newUrl = `  <url>\n    <loc>https://blog1.starrope2023.com/posts/${post.filename}</loc>\n    <lastmod>${post.publish_date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      sitemapContent = sitemapContent.replace('</urlset>', newUrl + '</urlset>');

      publishedCount++;
    }
  }

  if (publishedCount > 0) {
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log(`Successfully published ${publishedCount} posts!`);
  } else {
    console.log('No new posts to publish.');
  }
}

main();
