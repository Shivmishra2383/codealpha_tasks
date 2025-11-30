const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxMeta = document.getElementById("lightbox-meta");
const closeBtn = document.getElementById("close-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentIndex = 0;
let currentVisibleItems = Array.from(galleryItems); 


filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        currentVisibleItems = [];
        galleryItems.forEach((item, index) => {
            const category = item.getAttribute("data-category");
            if (filter === "all" || category === filter) {
                item.style.display = "";
                currentVisibleItems.push(item);
            } else {
                item.style.display = "none";
            }
        });
    });
});

function openLightbox(item) {
    const img = item.querySelector("img");
    const titleEl = item.querySelector(".gallery-title");
    const categoryEl = item.querySelector(".gallery-category");
    const indexInVisible = currentVisibleItems.indexOf(item);

    currentIndex = indexInVisible !== -1 ? indexInVisible : 0;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxTitle.textContent = titleEl ? titleEl.textContent : img.alt;
    lightboxMeta.textContent = categoryEl
        ? categoryEl.textContent
        : "Image " + (currentIndex + 1);

    lightbox.classList.add("open");
    lightbox.querySelector(".lightbox-content").focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
}

function showImageAt(index) {
    if (currentVisibleItems.length === 0) return;
    if (index < 0) index = currentVisibleItems.length - 1;
    if (index >= currentVisibleItems.length) index = 0;
    currentIndex = index;

    const item = currentVisibleItems[currentIndex];
    const img = item.querySelector("img");
    const titleEl = item.querySelector(".gallery-title");
    const categoryEl = item.querySelector(".gallery-category");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxTitle.textContent = titleEl ? titleEl.textContent : img.alt;
    lightboxMeta.textContent = categoryEl
        ? categoryEl.textContent
        : "Image " + (currentIndex + 1);
}

function showNext() {
    showImageAt(currentIndex + 1);
}

function showPrev() {
    showImageAt(currentIndex - 1);
}

galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
});

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    switch (e.key) {
        case "Escape":
            closeLightbox();
            break;
        case "ArrowRight":
            showNext();
            break;
        case "ArrowLeft":
            showPrev();
            break;
    }
});