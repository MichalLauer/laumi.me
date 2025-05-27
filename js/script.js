// Add floating tooltip behavior for title-underline elements
const titleUnderlines = document.querySelectorAll('abbr');
titleUnderlines.forEach(el => {
    const html = el.getAttribute('title');
    if (!html) return;
    let tooltip;
    el.addEventListener('mouseenter', e => {
        el.setAttribute('title', '')
        tooltip = document.createElement('div');
        tooltip.className = 'floating-tooltip';
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);
        positionTooltip(el, tooltip);
    });
    el.addEventListener('mousemove', () => {
        if (tooltip) positionTooltip(el, tooltip);
    });
    el.addEventListener('mouseleave', () => {
        el.setAttribute('title', html)
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    });
});

// Helper to position tooltip above the element centered
function positionTooltip(el, tooltip) {
    const rect = el.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const top = window.scrollY + rect.top - ttRect.height + 70;
    let left = window.scrollX + rect.left + (rect.width - ttRect.width) / 2;
    left = Math.max(0, Math.min(left, window.innerWidth - ttRect.width));
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

// New hover-based submenu open/close
window.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.sidebar ul li');
    const sidebar = document.querySelector('.sidebar');

    // Open submenu on hover
    menuItems.forEach(li => {
        li.addEventListener('mouseenter', () => li.classList.add('open'));
    });

    // Close all submenus when leaving sidebar
    sidebar.addEventListener('mouseleave', () => {
        menuItems.forEach(li => li.classList.remove('open'));
    });

    // Lightbox functionality for gallery images
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const thumbContainer = lightbox.querySelector('.lightbox-thumbnails');
    const captionLink = lightbox.querySelector('.lightbox-caption a');
    let currentIndex = 0;

    // Build thumbnails strip and open handler
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

    // Thumbnail click navigation
    thumbContainer.addEventListener('click', e => {
        if (e.target.tagName !== 'IMG') return;
        currentIndex = Number(e.target.dataset.index);
        updateLightbox();
    });

    // Arrow navigation
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
        updateLightbox();
    });
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryLinks.length;
        updateLightbox();
    });

    // Helper to update lightbox image and active thumbnail
    function updateLightbox() {
        // Use thumbnail src as the full image source
        const linkEl = galleryLinks[currentIndex];
        const imgEl = linkEl.querySelector('img');
        lightboxImg.src = imgEl.src;
        // Set source URL from the thumbnail img's data-source attribute
        captionLink.href = imgEl.dataset.source || imgEl.src;
        thumbContainer.querySelectorAll('img').forEach(img => img.classList.remove('active'));
        thumbContainer.querySelector(`img[data-index="${currentIndex}"]`).classList.add('active');
    }

    // Close lightbox on close button or background click
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

    // Close on Escape key
    window.addEventListener('keyup', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            lightbox.classList.remove('show');
        }
    });

    // Testimonial carousel logic
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
            text: 'Díky panu Lauerovi se mi podařilo úspěšně spočítat řadu příkladů a uspět u zkoušky na první pokus, což považuji za zázrak:) ',
            source: 'Andrea D.',
            url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
        },
        {
            text: 'Pana Michala na 100 % doporučuji. Velká pomoc při DP. Je vidět, že statistice opravdu rozumí a hlavně ji dokáže vysvětlit.',
            source: 'Mgr. I.',
            url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
        },
        {
            text: 'Spolupráce s Michalem při zpracování statistické části mé diplomové práce byla velmi příjemná a přínosná',
            source: 'Nela O.',
            url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
        },
        {
            text: 'Byla jsem opravdu začátečník v jazyce R a díky pár hodinám doučování jsem úspěšně složila zápočet.',
            source: 'Dora L.',
            url: 'https://www.doucuji.eu/381550-doucovani-srozumitelne-a-lidske-doucovani-statistiky-a-datove-analyzy'
        },
        {
            text: 'Michal byl moc super školitel. Vysvětlil srozumitelně, co bylo třeba. Doplňoval praktickými informacemi, byl nám k dispozici.',
            source: 'Anonymous',
            url: 'http://coderslab.cz/'
        },
        {
            text: 'Vse bylo super a cenim si tvou trpelivost a odpovidani na veskere dotazy. Vysvetleni i prakticke ukazky jsou vzdy srozumitelne.',
            source: 'Anonymous',
            url: 'http://coderslab.cz/'
        },
        {
            text: 'Za mě doposud ok. Tempo i vyklad jsou v poradku. Je poznat, ze mas v excelu od "odklikano" a muzes toho hodne predat.',
            source: 'Anonymous',
            url: 'http://coderslab.cz/'
        },
        {
            text: 'Michal má příjemný hlas. To je opravdu u vyučujícího důležité. Aby nekokrhal, nehuhlal, nehýkal ale prostě normálně mluvil.',
            source: 'Anonymous',
            url: 'http://coderslab.cz/'
        },
        {
            text: 'Spolupráce s Michalem při zpracování statistické části mé diplomové práce byla velmi příjemná a přínosná',
            source: 'Nela O.',
            url: 'xxx'
        },
        {
            text: 'Spolupráce s Michalem při zpracování statistické části mé diplomové práce byla velmi příjemná a přínosná',
            source: 'Nela O.',
            url: 'xxx'
        },
    ];

    // Testimonial carousel implementation
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    const cardsContainer = carousel.querySelector('.testimonial-cards');
    const leftArrow = carousel.querySelector('.testimonial-arrow-left');
    const rightArrow = carousel.querySelector('.testimonial-arrow-right');
    const counter = document.querySelector('.testimonial-counter');

    // Carousel state
    let currentPosition = 0;
    const totalCards = testimonials.length;
    let isAnimating = false;
    let lastDirection = 'next'; // Track navigation direction

    // Dynamically render cards for visible testimonials
    function renderCarouselCards() {
        cardsContainer.innerHTML = '';
        const visibleCards = 3;
        for (let i = 0; i < visibleCards; i++) {
            let cardIndex = (currentPosition + i) % totalCards;
            cardIndex = ((cardIndex % totalCards) + totalCards) % totalCards;
            const testimonial = testimonials[cardIndex];
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.dataset.index = cardIndex;

            const textDiv = document.createElement('div');
            textDiv.className = 'testimonial-text';
            textDiv.textContent = testimonial.text;

            const sourceDiv = document.createElement('div');
            sourceDiv.className = 'testimonial-source';
            sourceDiv.textContent = testimonial.source + ' ';

            const sourceLink = document.createElement('a');
            sourceLink.href = testimonial.url;
            sourceLink.target = '_blank';
            sourceLink.rel = 'noopener';
            sourceLink.className = 'testimonial-link';
            sourceLink.title = 'Source';
            sourceLink.setAttribute('aria-label', 'Source');
            sourceLink.textContent = '🔗';

            sourceDiv.appendChild(sourceLink);
            card.appendChild(textDiv);
            card.appendChild(sourceDiv);
            cardsContainer.appendChild(card);
        }
    }

    // Update carousel display (no effects, always show 3 reviews)
    function updateCarousel() {
        renderCarouselCards();
    }

    // Initial carousel update
    updateCarousel();

    // Arrow click navigation with carousel update
    leftArrow.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        lastDirection = 'prev';
        currentPosition = (currentPosition - 1 + totalCards) % totalCards;
        updateCarousel();
        setTimeout(() => isAnimating = false, 600);
    });

    rightArrow.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        lastDirection = 'next';
        currentPosition = (currentPosition + 1) % totalCards;
        updateCarousel();
        setTimeout(() => isAnimating = false, 600);
    });

    // Resize observer to adjust carousel on container resize
    const resizeObserver = new ResizeObserver(() => {
        updateCarousel();
    });
    resizeObserver.observe(carousel);
});