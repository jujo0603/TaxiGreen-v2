(function() {
  "use strict";

  const body = document.body;
  const header = document.querySelector('#header');
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('#navmenu');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const indicatorsSection = document.querySelector('#indicadores');
  const navLinks = document.querySelectorAll('.navmenu a');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroIndicators = document.querySelectorAll('.hero-indicators .indicator');
  const fadeElements = document.querySelectorAll(".fade-on-scroll");
  const preloader = document.querySelector('#preloader');

  // ===============================
  // Utilities
  // ===============================
  const inView = (el, offset = 0) => el.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight) - offset;

  // ===============================
  // Scroll handler optimizado
  // ===============================
  let numbersCounted = false;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header scrolled
    if (header && (header.classList.contains('scroll-up-sticky') || header.classList.contains('sticky-top') || header.classList.contains('fixed-top'))) {
      body.classList.toggle('scrolled', scrollY > 100);
    }

    // Scroll-top button
    if (scrollTopBtn) scrollTopBtn.classList.toggle('active', scrollY > 100);

    // Fade-on-scroll
    fadeElements.forEach(el => { if (inView(el, 100)) el.classList.add("scrolled"); });

    // Indicators numbers animation
    if (indicatorsSection && !numbersCounted && inView(indicatorsSection, 100)) {
      indicatorsSection.querySelectorAll('.numero').forEach(num => {
        const target = +num.dataset.target;
        let current = 0;
        const step = Math.ceil(target / 200);
        const animate = () => {
          current += step;
          if (current >= target) num.innerText = target.toLocaleString();
          else {
            num.innerText = current.toLocaleString();
            requestAnimationFrame(animate);
          }
        };
        animate();
      });
      numbersCounted = true;
    }

    // Navmenu Scrollspy
    const pos = scrollY + 200;
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const active = pos >= section.offsetTop && pos <= section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', active);
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  document.addEventListener('scroll', onScroll);
  window.addEventListener('load', onScroll);

  // ===============================
  // Mobile nav toggle
  // ===============================
  mobileNavToggleBtn?.addEventListener('click', () => body.classList.toggle('mobile-nav-active'));
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => body.classList.remove('mobile-nav-active')));
  document.addEventListener('click', e => {
    if (body.classList.contains('mobile-nav-active') && !navMenu.contains(e.target) && !mobileNavToggleBtn.contains(e.target)) {
      body.classList.remove('mobile-nav-active');
    }
  });

  // ===============================
  // Mobile dropdowns
  // ===============================
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(drop => {
    drop.addEventListener('click', e => {
      e.preventDefault();
      drop.parentNode.classList.toggle('active');
      drop.parentNode.nextElementSibling?.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // ===============================
  // Preloader
  // ===============================
  if (preloader) document.addEventListener('DOMContentLoaded', () => preloader.remove());

  // ===============================
  // Scroll-top click
  // ===============================
  scrollTopBtn?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===============================
  // Smooth scroll for hash links
  // ===============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop) || 70;
        window.scrollTo({ top: target.offsetTop - scrollMarginTop, behavior: 'smooth' });
      }
    });
  });

  // ===============================
  // Hero slider
  // ===============================
  (function(){
    let current = 0;
    const intervalTime = 5000;
    function showSlide(index){
      heroSlides.forEach((s,i)=>s.classList.toggle('active',i===index));
      heroIndicators.forEach((i,j)=>i.classList.toggle('active',j===index));
      current=index;
    }
    function nextSlide(){ showSlide((current+1)%heroSlides.length); }
    heroIndicators.forEach(ind=>ind.addEventListener('click',()=>showSlide(+ind.dataset.slide)));
    showSlide(0);
    setInterval(nextSlide, intervalTime);
  })();

})();

