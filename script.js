// script.js

document.addEventListener('DOMContentLoaded', function () {
  const continueButton = document.getElementById('continueButton');
  if (continueButton) {
    continueButton.addEventListener('click', function () {
      alert("Continuing to next step!");
      // Add your logic here for the next steps
    });
  }

  const viewGalleryButton = document.getElementById('viewGalleryButton');
  if (viewGalleryButton) {
    viewGalleryButton.addEventListener('click', function () {
      window.location.href = 'gallery.html';
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item img');
  galleryItems.forEach(function (img) {
    img.addEventListener('click', function () {
      const imageSrc = img.getAttribute('src');
      window.open(imageSrc, '_blank', 'width=600,height=400');
    });
  });
});
