// shrink tall images a bit, kind of a hack but whatever
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.article img').forEach(function(img) {
    function process() {
      if (img.naturalHeight / img.naturalWidth >= 1.25) {
        img.style.width = '50%';
        img.style.maxWidth = 'none'; // override any max-width
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
      }
    }
    if (img.complete) {
      process();
    } else {
      img.addEventListener('load', process);
    }
  });
});
