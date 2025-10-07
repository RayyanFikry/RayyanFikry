// Modal functionality for gallery

class Modal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createModal();
        this.addEventListeners();
    }
    
    createModal() {
        // Create modal HTML structure
        const modalHTML = `
            <div class="modal" id="artworkModal">
                <div class="modal-content">
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                    <img class="modal-image" id="modalImage" src="/placeholder.svg" alt="">
                    <div class="modal-info">
                        <h2 id="modalTitle"></h2>
                        <p class="artist" id="modalArtist"></p>
                        <p class="description" id="modalDescription"></p>
                        <div class="modal-stats">
                            <span><span style="color: #e74c3c;">♥</span> <span id="modalLikes"></span> likes</span>
                            <span><span style="color: #666;">👁</span> <span id="modalViews"></span> views</span>
                            <span><span style="color: #666;">📅</span> <span id="modalDate"></span></span>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                            <button class="btn btn-primary" onclick="likeArtwork()">
                                <span style="margin-right: 0.5rem;">♥</span> Like
                            </button>
                            <button class="btn btn-outline" onclick="shareArtwork()">Share</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('artworkModal');
    }
    
    addEventListeners() {
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Add click listeners to artwork cards
        document.addEventListener('click', (e) => {
            const artworkCard = e.target.closest('.artwork-card');
            if (artworkCard) {
                this.openArtwork(artworkCard);
            }
        });
    }
    
    openArtwork(artworkCard) {
        // Get artwork data from card
        const img = artworkCard.querySelector('img');
        const title = artworkCard.querySelector('h3').textContent;
        const artist = artworkCard.querySelector('.artist').textContent.replace('by ', '');
        const likes = artworkCard.querySelector('.artwork-likes span').textContent;
        
        // Generate additional data
        const views = Math.floor(Math.random() * 2000) + 500;
        const date = this.generateRandomDate();
        const description = this.generateDescription(title, artist);
        
        // Populate modal
        document.getElementById('modalImage').src = img.src;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalArtist').textContent = `by ${artist}`;
        document.getElementById('modalDescription').textContent = description;
        document.getElementById('modalLikes').textContent = likes;
        document.getElementById('modalViews').textContent = views.toLocaleString();
        document.getElementById('modalDate').textContent = date;
        
        this.open();
    }
    
    open() {
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
    
    generateRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toLocaleDateString();
    }
    
    generateDescription(title, artist) {
        const descriptions = [
            `A stunning digital artwork that showcases ${artist}'s incredible talent and unique artistic vision.`,
            `This masterpiece demonstrates exceptional skill in digital art techniques and creative composition.`,
            `An inspiring piece that captures the essence of modern digital artistry with remarkable detail.`,
            `A beautiful creation that reflects the artist's passion for digital art and innovative design.`,
            `This artwork represents hours of dedicated work and artistic excellence in the digital medium.`
        ];
        
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
}

// Global functions for modal actions
function closeModal() {
    const modal = document.getElementById('artworkModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function likeArtwork() {
    const likesElement = document.getElementById('modalLikes');
    let currentLikes = parseInt(likesElement.textContent);
    likesElement.textContent = currentLikes + 1;
    
    // Show feedback
    const likeBtn = event.target.closest('button');
    const originalText = likeBtn.innerHTML;
    likeBtn.innerHTML = '<span style="margin-right: 0.5rem;">♥</span> Liked!';
    likeBtn.style.background = '#e74c3c';
    
    setTimeout(() => {
        likeBtn.innerHTML = originalText;
        likeBtn.style.background = '';
    }, 2000);
}

function shareArtwork() {
    const title = document.getElementById('modalTitle').textContent;
    const artist = document.getElementById('modalArtist').textContent;
    
    // Simple share functionality
    if (navigator.share) {
        navigator.share({
            title: `${title} ${artist} - Picverse`,
            text: `Check out this amazing artwork on Picverse!`,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        const shareText = `Check out "${title}" ${artist} on Picverse! ${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            const shareBtn = event.target;
            const originalText = shareBtn.textContent;
            shareBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                shareBtn.textContent = originalText;
            }, 2000);
        });
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Modal();
});