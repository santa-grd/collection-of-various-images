
document.addEventListener('DOMContentLoaded', () => {
    displayRandomCategories();
    displayRandomImages(); // Load initial random images when the page loads
});

function showImageDetails(img) {
    const gallery = document.getElementById('gallery');
    const galleryimg = document.getElementById('galleryimg');
    
    // Sembunyikan tampilan gambar acak
    galleryimg.style.display = 'none';    
	gallery.innerHTML = `
        <div class="image-details">
            <div class="image-overlay">
                <img src="${img.src}" >
				<div>
                <button onclick="downloadImage('${img.src}', '${img.category}.jpg')">Download</button>
				</div>
			</div>
        </div>
        <div class="related-images">
            ${getRelatedImages(img.category, img.src)}
        </div>
    `;
	gallery.style.display = 'block';
	hideCategories(); // Sembunyikan kategori setelah dipilih

}

function getRelatedImages(categories, clickedImageSrc) {
    const relatedImages = images
        .filter(img => {
            const imgCategories = Array.isArray(img.category) ? img.category : [img.category];
            const clickedCategories = Array.isArray(categories) ? categories : [categories];
            return imgCategories.some(cat => clickedCategories.includes(cat)) && img.src !== clickedImageSrc;
        })
        .sort(() => 0.5 - Math.random());

    return relatedImages.map(img => `
        <img src="${img.src}" alt="${img.name}" onclick='showImageDetails(${JSON.stringify(img).replace(/'/g, "\\'")})'>
    `).join('');
}

function displayRandomImages() {
    const galleryimg = document.getElementById('galleryimg');
    galleryimg.innerHTML = '';

    const randomImages = images.sort(() => 0.1 - Math.random());

    randomImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = img.name;
        imgElement.classList.add('main-page');
        imgElement.onclick = () => showImageDetails(img);
        galleryimg.appendChild(imgElement);
    });
}

let categoriesVisible = false;

function displayRandomCategories() {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    categoryButtonsContainer.innerHTML = '';

    const randomCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 4);

    randomCategories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = capitalize(category);
        button.onclick = () => {
            galleryimg.style.display = 'block';
            filterImages(category);
            hideCategories(); // Sembunyikan kategori setelah dipilih
        };
        categoryButtonsContainer.appendChild(button);
    });

    categoriesVisible = false;
}
function showAllCategories() {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    categoryButtonsContainer.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = capitalize(category);
        button.onclick = () => {
            galleryimg.style.display = 'block';
            filterImages(category);
            hideCategories(); // Sembunyikan kategori setelah dipilih
        };
        categoryButtonsContainer.appendChild(button);
    });

    categoriesVisible = true;
	
}
function toggleCategories() {
    if (categoriesVisible) {
        displayRandomCategories(); // Kembali ke tampilan kategori acak
    } else {
        showAllCategories(); // Tampilkan semua kategori
    }
}

function hideCategories() {
    displayRandomCategories(); // Tampilkan kembali kategori acak setelah memilih salah satu kategori
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function filterImages(category) {
    const gallery = document.getElementById('gallery');
    const galleryimg = document.getElementById('galleryimg');
    
    gallery.style.display = 'none';
    
    galleryimg.style.display = 'block';
    galleryimg.innerHTML = '';

    if (category === 'all') {
        displayRandomImages();
    } else {
        const filteredImages = images.filter(img => Array.isArray(img.category) ? img.category.includes(category) : img.category === category);

        filteredImages.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.name;
            imgElement.classList.add('main-page');
            imgElement.onclick = () => showImageDetails(img);
            galleryimg.appendChild(imgElement);
        });
    }
}


function downloadImage(url, filename) {
    fetch(url, { mode: 'cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.blob();
        })
        .then(blob => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl); // Clean up
        })
        .catch(error => alert(`Failed to download image: ${error.message}`));
}
function toggleInfoModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Optional: Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
