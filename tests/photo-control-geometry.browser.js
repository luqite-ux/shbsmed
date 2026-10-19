// Run in the inspected manufacturing page through the approved browser CDP API.
// Regression: an absolutely positioned zoom label must not obscure photography.
(() => {
  const rows = [...document.querySelectorAll('.photo-grid .zoom-image')].map(el => {
    const image = el.querySelector('img');
    const label = el.querySelector('.zoom-label');
    const a = image.getBoundingClientRect();
    const b = label.getBoundingClientRect();
    return {
      alt: image.alt,
      labelOverlapsImage: b.top < a.bottom && b.bottom > a.top && b.left < a.right && b.right > a.left,
      imageWidth: a.width,
      fit: getComputedStyle(image).objectFit,
    };
  });
  return { pass: rows.length > 0 && rows.every(row => !row.labelOverlapsImage && row.fit === 'contain'), rows };
})();
