const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if(window.scrollY > 10) {  // لو المستخدم بدأ النزول
    header.classList.add('scrolled');
  } else {                   // رجع لفوق الصفحة
    header.classList.remove('scrolled');
  }
});