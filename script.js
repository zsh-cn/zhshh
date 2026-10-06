(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var heroImageContainer = document.querySelector('.hero-image-container');
  var decoCircles = document.querySelectorAll('.hero-deco-circle');
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-links a, .mobile-menu a');

  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;
        var scrolled = scrollY > 50;

        if (scrolled) {
          navbar.classList.add('scrolled');
          backToTop.classList.add('visible');
        } else {
          navbar.classList.remove('scrolled');
          backToTop.classList.remove('visible');
        }

        if (decoCircles.length) {
          var factor1 = 0.03;
          var factor2 = 0.05;
          var factor3 = 0.04;
          decoCircles[0].style.transform = 'translateY(' + (scrollY * factor1) + 'px)';
          if (decoCircles[1]) decoCircles[1].style.transform = 'translateY(' + (-scrollY * factor2) + 'px)';
          if (decoCircles[2]) decoCircles[2].style.transform = 'translateY(' + (scrollY * factor3) + 'px)';
        }

        if (sections.length) {
          var currentId = '';
          for (var i = 0; i < sections.length; i++) {
            var sectionTop = sections[i].offsetTop - 120;
            if (scrollY >= sectionTop) {
              currentId = sections[i].getAttribute('id');
            }
          }

          for (var j = 0; j < navLinksAll.length; j++) {
            navLinksAll[j].classList.remove('active');
            if (navLinksAll[j].getAttribute('href') === '#' + currentId) {
              navLinksAll[j].classList.add('active');
            }
          }
        }

        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  menuToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  var mobileLinks = mobileMenu.querySelectorAll('a');
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '&#9776;';
    });
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (heroImageContainer) {
    heroImageContainer.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
  }

  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  var allNavTriggers = document.querySelectorAll('.nav-links a, .mobile-menu a, .navbar-brand, a[href^="#"]');
  allNavTriggers.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          var navHeight = navbar.offsetHeight;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  var cards = document.querySelectorAll('.feature-card, .contact-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '&#9776;';
    }
  });

  onScroll();

})();