document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('blogSearch');
    const tagFilter = document.getElementById('tagFilter');
    const blogPosts = document.getElementById('blogPosts');
    const posts = blogPosts.querySelectorAll('.blog-post');

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'blog-pagination';
    blogPosts.after(paginationContainer);

    const POSTS_PER_PAGE = 5;
    let currentPage = 1;
    let filteredPosts = Array.from(posts);

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage();
            }
        });
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                showPage();
            });
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    function showPage() {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
        // Hide all posts first
        posts.forEach(post => post.style.display = 'none');
        // Show only filtered posts for the current page
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        filteredPosts.slice(start, end).forEach(post => {
            post.style.display = 'block';
        });
        renderPagination(totalPages);
    }

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeTag = tagFilter.querySelector('button.active').dataset.tag;

        filteredPosts = Array.from(posts).filter(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const description = post.querySelector('p').textContent.toLowerCase();
            const postTags = post.dataset.tags.split(' ');
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesTag = activeTag === 'all' || postTags.includes(activeTag);
            return matchesSearch && matchesTag;
        });
        currentPage = 1;
        showPage();
    }

    searchInput.addEventListener('input', filterPosts);

    tagFilter.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            tagFilter.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterPosts();
        }
    });

    // Initial render
    filterPosts();
});