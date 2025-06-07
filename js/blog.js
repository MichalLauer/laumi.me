/**
 * Blog functionality for Michal Lauer's Research Website
 * Optimized and simplified version
 */

class BlogManager {
  constructor() {
    this.searchInput = document.getElementById('blogSearch');
    this.tagFilter = document.getElementById('tagFilter');
    this.blogPosts = document.getElementById('blogPosts');
    this.paginationContainer = null;
    
    this.POSTS_PER_PAGE = 5;
    this.currentPage = 1;
    this.filteredPosts = [];
    
    this.init();
  }

  init() {
    if (!this.blogPosts) return;
    
    this.createPagination();
    this.bindEvents();
    this.filterPosts();
  }

  createPagination() {
    this.paginationContainer = document.createElement('div');
    this.paginationContainer.className = 'blog-pagination';
    this.paginationContainer.setAttribute('role', 'navigation');
    this.paginationContainer.setAttribute('aria-label', 'Blog pagination');
    this.blogPosts.after(this.paginationContainer);
  }

  getPosts() {
    return Array.from(this.blogPosts.querySelectorAll('.blog-post'));
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce(() => {
        this.filterPosts();
      }, 300));
    }

    // Tag filter buttons
    if (this.tagFilter) {
      this.tagFilter.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          // Remove active class from all buttons
          this.tagFilter.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          
          // Add active class to clicked button
          e.target.classList.add('active');
          e.target.setAttribute('aria-pressed', 'true');
          
          this.filterPosts();
        }
      });
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  filterPosts() {
    const searchTerm = this.searchInput?.value.toLowerCase() || '';
    const activeTag = this.tagFilter?.querySelector('button.active')?.dataset.tag || 'all';
    
    this.filteredPosts = this.getPosts().filter(post => {
      const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = post.querySelector('p')?.textContent.toLowerCase() || '';
      const postTags = post.dataset.tags?.split(' ') || [];
      
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        description.includes(searchTerm);
      
      const matchesTag = activeTag === 'all' || postTags.includes(activeTag);
      
      return matchesSearch && matchesTag;
    });

    this.currentPage = 1;
    this.showPage();
    this.updateResultsInfo();
  }

  showPage() {
    const totalPages = Math.ceil(this.filteredPosts.length / this.POSTS_PER_PAGE) || 1;
    
    // Hide all posts first
    this.getPosts().forEach(post => {
      post.style.display = 'none';
      post.setAttribute('aria-hidden', 'true');
    });
    
    // Show only filtered posts for the current page
    const start = (this.currentPage - 1) * this.POSTS_PER_PAGE;
    const end = start + this.POSTS_PER_PAGE;
    
    this.filteredPosts.slice(start, end).forEach(post => {
      post.style.display = 'block';
      post.setAttribute('aria-hidden', 'false');
    });
    
    this.renderPagination(totalPages);
  }

  renderPagination(totalPages) {
    if (!this.paginationContainer) return;
    
    this.paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = this.createPaginationButton('Previous', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.showPage();
      }
    });
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.setAttribute('aria-label', 'Go to previous page');
    this.paginationContainer.appendChild(prevBtn);

    // Page number buttons
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);

    if (startPage > 1) {
      const firstBtn = this.createPaginationButton('1', () => {
        this.currentPage = 1;
        this.showPage();
      });
      this.paginationContainer.appendChild(firstBtn);
      
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-ellipsis';
        this.paginationContainer.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = this.createPaginationButton(i.toString(), () => {
        this.currentPage = i;
        this.showPage();
      });
      
      if (i === this.currentPage) {
        pageBtn.classList.add('active');
        pageBtn.setAttribute('aria-current', 'page');
      }
      
      pageBtn.setAttribute('aria-label', `Go to page ${i}`);
      this.paginationContainer.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-ellipsis';
        this.paginationContainer.appendChild(ellipsis);
      }
      
      const lastBtn = this.createPaginationButton(totalPages.toString(), () => {
        this.currentPage = totalPages;
        this.showPage();
      });
      this.paginationContainer.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = this.createPaginationButton('Next', () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.showPage();
      }
    });
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.setAttribute('aria-label', 'Go to next page');
    this.paginationContainer.appendChild(nextBtn);
  }

  createPaginationButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  updateResultsInfo() {
    // Remove existing results info
    const existingInfo = document.querySelector('.blog-results-info');
    if (existingInfo) {
      existingInfo.remove();
    }

    // Create new results info
    const resultsInfo = document.createElement('div');
    resultsInfo.className = 'blog-results-info';
    resultsInfo.setAttribute('aria-live', 'polite');
    
    const totalPosts = this.filteredPosts.length;
    const totalAllPosts = this.getPosts().length;
    
    if (totalPosts === totalAllPosts) {
      resultsInfo.textContent = `Showing all ${totalPosts} posts`;
    } else {
      resultsInfo.textContent = `Showing ${totalPosts} of ${totalAllPosts} posts`;
    }
    
    this.blogPosts.before(resultsInfo);
  }
}

// Initialize blog functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BlogManager();
});

// Add CSS for results info and pagination ellipsis
const style = document.createElement('style');
style.textContent = `
  .blog-results-info {
    font-size: 0.9rem;
    color: var(--text-muted, #666);
    margin-bottom: 1rem;
    font-style: italic;
  }
  
  .pagination-ellipsis {
    padding: 0.5rem;
    color: var(--text-muted, #666);
    user-select: none;
  }
  
  @media (max-width: 480px) {
    .blog-pagination button {
      min-width: 40px;
      padding: 0.4rem 0.6rem;
    }
    
    .pagination-ellipsis {
      padding: 0.4rem 0.2rem;
    }
  }
`;
document.head.appendChild(style);