document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.time-machine__step');
  const panels = document.querySelectorAll('.time-machine__content');
  const lightbox = document.getElementById('timeMachineLightbox');
  const lightboxImage = document.getElementById('tmLightboxImage');
  const lightboxCaption = document.getElementById('tmLightboxCaption');
  const closeBtn = document.getElementById('tmLightboxClose');

  function activateStep(stepId) {
    steps.forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.step === stepId);
    });

    panels.forEach(function (panel) {
      const active = panel.dataset.step === stepId;
      panel.classList.toggle('is-visible', active);
      panel.hidden = !active;
    });
  }

  steps.forEach(function (button) {
    button.addEventListener('click', function () {
      activateStep(button.dataset.step);
    });
  });

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.time-machine__photo').forEach(function (button) {
    button.addEventListener('click', function () {
      openLightbox(button.dataset.image, button.dataset.title || 'Фотосурет');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
});
