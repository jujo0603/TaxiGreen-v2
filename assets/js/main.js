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
  // Scroll handler
  // ===============================
  let numbersCounted = false;
  function onScroll() {
    const scrollY = window.scrollY;

    // Header scrolled
    if (header && (header.classList.contains('scroll-up-sticky') || header.classList.contains('sticky-top') || header.classList.contains('fixed-top'))) {
      scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
    }

    // Scroll-top button
    if (scrollTopBtn) scrollY > 100 ? scrollTopBtn.classList.add('active') : scrollTopBtn.classList.remove('active');

    // Fade-on-scroll
    fadeElements.forEach(el => { if (inView(el, 100)) el.classList.add("scrolled"); });

    // Indicators numbers animation
    if (indicatorsSection && !numbersCounted && inView(indicatorsSection, 100)) {
      indicatorsSection.querySelectorAll('.numero').forEach(num => {
        const target = +num.getAttribute('data-target');
        let current = 0;
        const step = Math.ceil(target / 200);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { num.innerText = target.toLocaleString(); clearInterval(timer); }
          else num.innerText = current.toLocaleString();
        }, 20);
      });
      numbersCounted = true;
    }

    // Navmenu Scrollspy
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const pos = scrollY + 200;
      if (pos >= section.offsetTop && pos <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.navmenu a.active').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      } else link.classList.remove('active');
    });
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
      drop.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // ===============================
  // Preloader (eliminado al DOM listo)
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
    // ===============================
  // Formulario Convenios → Formspark (Fix definitivo)
  // ===============================
  const formConvenios = document.querySelector('#formConvenios');

  if (formConvenios) {
    formConvenios.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(formConvenios));

      try {
        const r = await fetch("https://submit-form.com/9JBveRfvT", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });

        if (r.ok) {
          alert("Gracias, su solicitud fue enviada.");
          formConvenios.reset();
        } else {
          alert("Error al enviar. Intente nuevamente.");
        }
      } catch (err) {
        alert("Error de conexión.");
      }
    });
  }

 // ===============================
// Mostrar solo un botón de reserva por card
// ===============================
const cards = document.querySelectorAll(".card-click");

// Abrir el primer card por defecto
if (cards.length > 0) {
  cards[0].classList.add("active");
}

cards.forEach(card => {
  card.addEventListener("click", () => {

    // Cerrar todos los demás
    cards.forEach(other => {
      if (other !== card) other.classList.remove("active");
    });

    // Abrir/cerrar el card clickeado
    card.classList.toggle("active");
  });
});


  
})();
