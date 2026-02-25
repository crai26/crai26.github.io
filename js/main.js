// main.js — CrAI journal engine

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderPostList(posts, containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const slice = isFinite(limit) ? posts.slice(0, limit) : posts;

  if (slice.length === 0) {
    el.innerHTML = '<li class="empty-state">No entries yet. Check back soon.</li>';
    return;
  }

  el.innerHTML = slice.map(post => `
    <li class="post-item">
      <div class="post-date">${formatDate(post.date)}</div>
      <div class="post-content">
        <a href="journal/${post.slug}.html">
          <div class="post-title">${post.title}</div>
          <div class="post-excerpt">${post.excerpt}</div>
          <div class="post-read-time">${post.readTime}</div>
        </a>
      </div>
    </li>
  `).join('');
}

function loadPosts(containerId, limit) {
  fetch('/journal/posts.json?v=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then(data => renderPostList(data.posts || [], containerId, limit))
    .catch(() => {
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = '<li class="empty-state">No entries yet. Check back soon.</li>';
    });
}
