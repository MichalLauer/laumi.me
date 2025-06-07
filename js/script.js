/**
 * Main JavaScript for Michal Lauer's Research Website
 * Optimized and simplified version
 */

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Tooltip functionality for abbreviations
function initTooltips() {
  $$('abbr[title]').forEach(el => {
    const tooltipText = el.getAttribute('title');
    if (!tooltipText) return;

    let tooltip = null;

    const createTooltip = () => {
      tooltip = document.createElement('div');
      tooltip.className = 'floating-tooltip';
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);
      return tooltip;
    };

    const positionTooltip = () => {
      if (!tooltip) return;
      
      const rect = el.getBoundingClientRect();
      const ttRect = tooltip.getBoundingClientRect();
      const top = window.scrollY + rect.top - ttRect.height - 10;
      const left = Math.max(10, Math.min(
        window.scrollX + rect.left + (rect.width - ttRect.width) / 2,
        window.innerWidth - ttRect.width - 10
      ));
      
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    };

    el.addEventListener('mouseenter', () => {
      el.setAttribute('title', '');
      tooltip = createTooltip();
      positionTooltip();
    });

    el.addEventListener('mousemove', positionTooltip);

    el.addEventListener('mouseleave', () => {
      el.setAttribute('title', tooltipText);
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  });
}

// Sidebar submenu functionality
function initSidebar() {
  const sidebar = $('.sidebar');
  if (!sidebar) return;

  const menuItems = sidebar.querySelectorAll('li');
  
  menuItems.forEach(li => {
    li.addEventListener('mouseenter', () => li.classList.add('open'));
  });

  sidebar.addEventListener('mouseleave', () => {
    menuItems.forEach(li => li.classList.remove('open'));
  });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, '', `#${targetId}`);
        }
      }
    });
  });
}

// Testimonial data
const testimonials = [
  {
    text: 'Nemůžu si vynachválit Pana Lauera z mnoha důvodů, jako je rychlost, připravenost a neskutečná ochota.',
    source: 'Andy V.',
    url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
  },
  {
    text: 'Obrovská spokojenost s panem Lauerem. Ještě jednou velké DÍKY za pomoc se statistikou a všem moc doporučuji.',
    source: 'Vendula K.',
    url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
  },
  {
    text: 'Pokud potřebujete poradit se statistikou v rámci své vysokoškolské práce určitě se neváhejte obrátit na pana Michala.',
    source: 'Petra M.',
    url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
  },
  {
    text: 'Díky panu Lauerovi se mi podařilo úspěšně spočítat řadu příkladů a uspět u zkoušky na první pokus, což považuji za zázrak:)',
    source: 'Andrea D.',
    url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
  },
  {
    text: 'Pana Michala na 100 % doporučuji. Velká pomoc při DP. Je vidět, že statistice opravdu rozumí a hlavně ji dokáže vysvětlit.',
    source: 'Mgr. I.',
    url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
  }
];

// Testimonial carousel functionality
function initTestimonialCarousel() {
  const carousel = $('.testimonial-carousel');
  if (!carousel) return;

  const cardsContainer = carousel.querySelector('.testimonial-cards');
  const leftArrow = carousel.querySelector('.testimonial-arrow-left');
  const rightArrow = carousel.querySelector('.testimonial-arrow-right');

  if (!cardsContainer || !leftArrow || !rightArrow) return;

  let currentPosition = 0;
  const totalCards = testimonials.length;
  const visibleCards = window.innerWidth <= 768 ? 1 : 3;

  const renderCards = () => {
    cardsContainer.innerHTML = '';
    
    for (let i = 0; i < visibleCards; i++) {
      const cardIndex = (currentPosition + i) % totalCards;
      const testimonial = testimonials[cardIndex];
      
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-text">${testimonial.text}</div>
        <div class="testimonial-bottom-row">
          <div class="testimonial-number">${cardIndex + 1}</div>
          <div class="testimonial-source"> 
            <a href="${testimonial.url}" target="_blank" rel="noopener" 
               title="Source" aria-label="Source">
               ${testimonial.source}
            </a> 🔗
          </div>
        </div>
      `;
      cardsContainer.appendChild(card);
    }
  };

  // Navigation handlers
  leftArrow.addEventListener('click', () => {
    currentPosition = (currentPosition - 1 + totalCards) % totalCards;
    renderCards();
  });

  rightArrow.addEventListener('click', () => {
    currentPosition = (currentPosition + 1) % totalCards;
    renderCards();
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newVisibleCards = window.innerWidth <= 768 ? 1 : 3;
      if (newVisibleCards !== visibleCards) {
        location.reload(); // Simple solution for responsive changes
      }
    }, 250);
  });

  // Initial render
  renderCards();
}

// Lightbox functionality
function initLightbox() {
  const galleryLinks = $$('.gallery-link');
  const lightbox = $('#lightbox');
  
  if (!galleryLinks.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const thumbContainer = lightbox.querySelector('.lightbox-thumbnails');
  const captionLink = lightbox.querySelector('.lightbox-caption a');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;

  const updateLightbox = () => {
    const linkEl = galleryLinks[currentIndex];
    const imgEl = linkEl.querySelector('img');
    
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    captionLink.href = imgEl.dataset.source || imgEl.src;
    
    // Update thumbnails
    thumbContainer.querySelectorAll('img').forEach((img, idx) => {
      img.classList.toggle('active', idx === currentIndex);
    });
  };

  // Build thumbnails
  galleryLinks.forEach((link, idx) => {
    const img = link.querySelector('img');
    const thumb = document.createElement('img');
    thumb.src = img.src;
    thumb.alt = img.alt;
    thumb.dataset.index = idx;
    thumb.addEventListener('click', () => {
      currentIndex = idx;
      updateLightbox();
    });
    thumbContainer.appendChild(thumb);

    // Gallery link click handler
    link.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = idx;
      updateLightbox();
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  // Navigation handlers
  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
    updateLightbox();
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryLinks.length;
    updateLightbox();
  });

  // Close handlers
  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevBtn?.click();
        break;
      case 'ArrowRight':
        nextBtn?.click();
        break;
    }
  });
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    $$('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTooltips();
  initSidebar();
  initSmoothScroll();
  initTestimonialCarousel();
  initLightbox();
  initLazyLoading();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any animations or timers when page is hidden
    $$('.testimonial-arrow').forEach(arrow => {
      arrow.style.pointerEvents = 'none';
    });
  } else {
    // Resume when page becomes visible
    $$('.testimonial-arrow').forEach(arrow => {
      arrow.style.pointerEvents = 'auto';
    });
  }
});