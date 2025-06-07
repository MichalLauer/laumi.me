// Simplified tooltip behavior for title-underline elements
document.querySelectorAll('abbr').forEach(el => {
    const tooltipText = el.getAttribute('title');
    if (!tooltipText) return;

    const createTooltip = (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'floating-tooltip';
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);
        positionTooltip(e.target, tooltip);
        return tooltip;
    };

    el.addEventListener('mouseenter', (e) => {
        el.setAttribute('title', '');
        el.tooltip = createTooltip(e);
    });

    el.addEventListener('mousemove', (e) => {
        if (el.tooltip) positionTooltip(e.target, el.tooltip);
    });

    el.addEventListener('mouseleave', () => {
        el.setAttribute('title', tooltipText);
        if (el.tooltip) {
            el.tooltip.remove();
            el.tooltip = null;
        }
    });
});

// Helper to position tooltip above the element centered
function positionTooltip(el, tooltip) {
    const rect = el.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const top = window.scrollY + rect.top - ttRect.height + 70;
    const left = Math.max(0, Math.min(
        window.scrollX + rect.left + (rect.width - ttRect.width) / 2, 
        window.innerWidth - ttRect.width
    ));
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Setup sidebar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insert 
            document.querySelector('nav.sidebar').innerHTML = data;

            // Sidebar submenu hover
            const sidebar = document.querySelector('.sidebar');
            sidebar.querySelectorAll('li').forEach(li => {
                li.addEventListener('mouseenter', () => li.classList.add('open'));
            });
            sidebar.addEventListener('mouseleave', () => {
                sidebar.querySelectorAll('li').forEach(li => li.classList.remove('open'));
            });
            
            // Smooth scroll for internal anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    // Only handle if href is just an id (not a full URL)
                    const targetId = this.getAttribute('href').slice(1);
                    if (!targetId) return;
                    const target = document.getElementById(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                        // Optionally update the URL hash without jumping
                        history.pushState(null, '', `#${targetId}`);
                    }
                });
            });
        });


    // Testimonial data with unique entries
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

    // Lightbox functionality
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const thumbContainer = lightbox.querySelector('.lightbox-thumbnails');
    const captionLink = lightbox.querySelector('.lightbox-caption a');
    let currentIndex = 0;

    const updateLightbox = () => {
        const linkEl = galleryLinks[currentIndex];
        const imgEl = linkEl.querySelector('img');
        lightboxImg.src = imgEl.src;
        captionLink.href = imgEl.dataset.source || imgEl.src;
        
        thumbContainer.querySelectorAll('img').forEach(img => img.classList.remove('active'));
        thumbContainer.querySelector(`img[data-index="${currentIndex}"]`).classList.add('active');
    };

    // Build thumbnails and setup navigation
    galleryLinks.forEach((link, idx) => {
        const thumb = document.createElement('img');
        thumb.src = link.querySelector('img').src;
        thumb.dataset.index = idx;
        if (idx === 0) thumb.classList.add('active');
        thumbContainer.appendChild(thumb);

        link.addEventListener('click', e => {
            e.preventDefault();
            currentIndex = idx;
            updateLightbox();
            lightbox.classList.add('show');
        });
    });

    // Navigation handlers
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
        updateLightbox();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryLinks.length;
        updateLightbox();
    });

    // Close lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.remove('show');
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            lightbox.classList.remove('show');
        }
    });

    // Testimonial carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const cardsContainer = carousel.querySelector('.testimonial-cards');
    const leftArrow = carousel.querySelector('.testimonial-arrow-left');
    const rightArrow = carousel.querySelector('.testimonial-arrow-right');

    let currentPosition = 0;
    const totalCards = testimonials.length;

    const renderCarouselCards = () => {
        cardsContainer.innerHTML = '';
        const visibleCards = 3;
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
                           class="testimonial-link" title="Source" aria-label="Source">
                           ${testimonial.source}
                        </a> 🔗
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        }
    };

    // Navigation
    leftArrow.addEventListener('click', () => {
        currentPosition = (currentPosition - 1 + totalCards) % totalCards;
        renderCarouselCards();
    });

    rightArrow.addEventListener('click', () => {
        currentPosition = (currentPosition + 1) % totalCards;
        renderCarouselCards();
    });

    // Initial render
    renderCarouselCards();
});