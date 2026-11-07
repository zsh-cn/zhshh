(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var decoCircles = document.querySelectorAll('.hero-deco-circle');
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-links a, .mobile-menu a');

  var ticking = false;

  var navLockId = '';
  var navLockTop = 0;
  var navLockTimer = 0;

  function setActiveNav(id) {
    for (var i = 0; i < navLinksAll.length; i++) {
      navLinksAll[i].classList.toggle('active', navLinksAll[i].getAttribute('href') === '#' + id);
    }
  }

  var navChromeH = 0;

  function navChromeHeight() {
    if (!navChromeH) {
      navChromeH = navbar.offsetHeight - mobileMenu.offsetHeight;
    }
    return navChromeH;
  }

  window.addEventListener('resize', function () {
    navChromeH = 0;
  });

  function updateSpy(scrollY) {
    if (!sections.length) return;
    var line = scrollY + navChromeHeight() + 8;
    var currentId = '';
    for (var i = 0; i < sections.length; i++) {
      if (line >= sections[i].offsetTop) {
        currentId = sections[i].getAttribute('id');
      }
    }
    setActiveNav(currentId);
  }

  function releaseNav() {
    if (!navLockId) return;
    navLockId = '';
    clearTimeout(navLockTimer);
    updateSpy(window.scrollY);
  }

  function lockNav(id, top) {
    navLockId = id;
    navLockTop = top;
    setActiveNav(id);
    clearTimeout(navLockTimer);
    navLockTimer = setTimeout(releaseNav, 2000);
  }

  function closeMenu() {
    if (!mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '&#9776;';
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.innerHTML = '&#10005;';
  }

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

        if (scrollY > 80) closeMenu();

        if (decoCircles.length) {
          decoCircles[0].style.transform = 'translateY(' + (scrollY * 0.03) + 'px)';
          if (decoCircles[1]) decoCircles[1].style.transform = 'translateY(' + (-scrollY * 0.05) + 'px)';
          if (decoCircles[2]) decoCircles[2].style.transform = 'translateY(' + (scrollY * 0.04) + 'px)';
        }

        if (navLockId) {
          setActiveNav(navLockId);
          if (Math.abs(scrollY - navLockTop) <= 2) releaseNav();
        } else {
          updateSpy(scrollY);
        }

        for (var k = pendingReveal.length - 1; k >= 0; k--) {
          if (pendingReveal[k].getBoundingClientRect().top < window.innerHeight - 60) {
            markRevealed(pendingReveal[k]);
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('wheel', releaseNav, { passive: true });
  window.addEventListener('touchstart', releaseNav, { passive: true });

  menuToggle.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  var mobileLinks = mobileMenu.querySelectorAll('a');
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', closeMenu);
  }

  document.addEventListener('click', function (e) {
    if (!mobileMenu.classList.contains('open')) return;
    if (!navbar.contains(e.target)) closeMenu();
  });

  backToTop.addEventListener('click', function () {
    lockNav('home', 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var revealElements = document.querySelectorAll('.reveal');
  var pendingReveal = Array.prototype.slice.call(revealElements);

  function markRevealed(el) {
    if (el.classList.contains('visible')) return;
    el.classList.add('visible');
    var idx = pendingReveal.indexOf(el);
    if (idx > -1) pendingReveal.splice(idx, 1);
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          markRevealed(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0
    });

    Array.prototype.forEach.call(revealElements, function (el) {
      revealObserver.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealElements, markRevealed);
  }

  var anchorLinks = document.querySelectorAll('.navbar-brand, .nav-links a, .mobile-menu a');
  Array.prototype.forEach.call(anchorLinks, function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href.charAt(0) !== '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      var navHeight = navChromeHeight();
      var targetPosition = Math.max(
        Math.round(target.getBoundingClientRect().top + window.pageYOffset - navHeight),
        0
      );

      lockNav(href.slice(1), targetPosition);

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  var cards = document.querySelectorAll('.feature-card, .contact-card, .project-card');
  Array.prototype.forEach.call(cards, function (card) {
    var raf = 0;
    var mx = 0;
    var my = 0;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        card.style.setProperty('--mouse-x', mx + 'px');
        card.style.setProperty('--mouse-y', my + 'px');
        raf = 0;
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  onScroll();

  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

})();
