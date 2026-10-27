// Movimento editorial: Lenis suaviza a rolagem, GSAP conduz entradas e parallax.
// Sem as bibliotecas ou com movimento reduzido, a página permanece estática e completa.
(() => {
  const root = document.documentElement;
  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  if (!root.classList.contains('motion') || !gsap || !ScrollTrigger || !SplitText || !Lenis) {
    root.classList.remove('motion', 'motion-pending');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 1.1 });

  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, prevent: (node) => Boolean(node.closest?.('dialog')) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const syncScroll = () => (document.querySelector('dialog[open]') ? lenis.stop() : lenis.start());
  document.querySelectorAll('dialog').forEach((dialog) => {
    new MutationObserver(syncScroll).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (event.defaultPrevented || !link || link.classList.contains('skip-link')) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    lenis.scrollTo(top < 240 ? 0 : target, { offset: -24, duration: 1.5 });
    history.pushState(null, '', link.hash);
    if (event.detail === 0) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  // Transições CSS de transform brigariam com o GSAP quadro a quadro; ficam pausadas durante a entrada.
  const freeze = (elements) => elements.forEach((element) => { element.style.transition = 'none'; });
  const release = (elements) => elements.forEach((element) => element.style.removeProperty('transition'));
  const onScroll = (trigger, start = 'top 88%') => (trigger === false ? undefined : { trigger, start, once: true });

  function reveal(targets, { trigger, y = 32, start, ...vars } = {}) {
    const elements = gsap.utils.toArray(targets);
    if (!elements.length) return null;
    freeze(elements);
    return gsap.fromTo(elements, { autoAlpha: 0, y }, {
      autoAlpha: 1, y: 0, stagger: 0.09, ...vars,
      clearProps: 'opacity,visibility,transform',
      onComplete: () => release(elements),
      scrollTrigger: onScroll(trigger ?? elements[0], start),
    });
  }

  function splitLines(target, { trigger, start = 'top 86%', by = 'lines', ...vars } = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return null;
    const split = SplitText.create(element, { type: by === 'chars' ? 'chars,lines' : 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.set(element, { autoAlpha: 1 });
    return gsap.fromTo(split[by], { yPercent: 115 }, {
      yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: by === 'chars' ? 0.035 : 0.11, ...vars,
      onComplete: () => split.revert(),
      scrollTrigger: onScroll(trigger ?? element, start),
    });
  }

  function cardEntrance(item, frameSelector) {
    const frame = item.querySelector(frameSelector);
    const image = frame.querySelector('img') || frame;
    const copy = [...item.children].filter((child) => child !== frame);
    freeze([image, ...copy]);
    gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(image, { scale: 1.18 });
    gsap.set(copy, { autoAlpha: 0, y: 22 });
    return (delay = 0) => gsap.timeline({ delay, defaults: { ease: 'expo.out' }, onComplete: () => release([image, ...copy]) })
      .to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, clearProps: 'clipPath' })
      .to(image, { scale: 1, duration: 1.9, clearProps: 'transform' }, 0)
      .to(copy, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, 0.35);
  }

  // Cartões entram em grupo ao rolar e voltam a entrar quando um filtro muda o catálogo.
  function cards(items, frameSelector) {
    const pending = new Map(items.map((item) => [item, cardEntrance(item, frameSelector)]));
    const play = (item, delay) => { pending.get(item)?.(delay); pending.delete(item); };
    ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: (batch) => batch.forEach((item, index) => play(item, index * 0.12)) });
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        ScrollTrigger.refresh();
        items.filter((item) => !item.hidden).forEach((item, index) => {
          if (pending.has(item)) return play(item, index * 0.08);
          freeze([item]);
          gsap.fromTo(item, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: index * 0.07, clearProps: 'opacity,visibility,transform', onComplete: () => release([item]) });
        });
      });
    });
    items.forEach((item) => observer.observe(item, { attributes: true, attributeFilter: ['hidden'] }));
  }

  function intro() {
    // A fotografia do hero vive em .hero::after; o GSAP move suas variáveis de escala e deslocamento.
    const hero = document.querySelector('.hero');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('.botanical-shadow', { opacity: 0 }, { opacity: 0.15, duration: 3, ease: 'power2.out' }, 0)
      .fromTo('.page', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.6, clearProps: 'opacity,visibility,transform' }, 0)
      .fromTo(hero, { '--hero-scale': 1.25 }, { '--hero-scale': 1.08, duration: 3 }, 0)
      .add(reveal('.header > *', { trigger: false, y: -12, stagger: 0.1 }), 0.4)
      .add(splitLines('#hero-title', { trigger: false, by: 'chars', stagger: 0.06, duration: 1.6 }), 0.6)
      .add(reveal(['.tagline', '.hero .pill-button'], { trigger: false, stagger: 0.14 }), 1.15);
    root.classList.remove('motion-pending');

    // A sombra das folhas balança devagar, como numa brisa de janela.
    gsap.to('.botanical-shadow', { rotation: 22, x: 14, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.botanical-shadow', { yPercent: 18, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    const scroll = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.fromTo(hero, { '--hero-y': '0%' }, { '--hero-y': '3.5%', ease: 'none', scrollTrigger: { ...scroll, start: 'top 20%' } });
    gsap.to('.hero-content', { y: -40, opacity: 0.5, ease: 'none', scrollTrigger: { ...scroll, start: 'top 20%' } });
  }

  function scenes() {
    const eyebrowLine = (section) => gsap.fromTo(`${section} .eyebrow i`, { scaleX: 0 }, { scaleX: 1, transformOrigin: '0 50%', duration: 1.4, ease: 'expo.out', delay: 0.2, scrollTrigger: onScroll(`${section} .eyebrow`) });

    reveal('.bouquets .eyebrow');
    eyebrowLine('.bouquets');
    splitLines('#bouquets-title', { delay: 0.1 });
    reveal('.intro-copy', { delay: 0.3 });
    reveal(['.category-filters button', '.collection-count'], { y: 14, stagger: 0.06, trigger: '.collection-toolbar' });
    cards(gsap.utils.toArray('.bouquet-card'), '.product-image');
    reveal('.bouquets .catalog-note', { y: 12 });

    const photo = document.querySelector('.about-photo');
    const image = photo.querySelector('img');
    gsap.timeline({ scrollTrigger: onScroll('.about', 'top 75%'), defaults: { ease: 'expo.inOut' } })
      .fromTo(photo, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, clearProps: 'clipPath' })
      .fromTo(image, { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'expo.out', clearProps: 'transform' }, 0.2);
    reveal('.about .eyebrow', { delay: 0.2 });
    eyebrowLine('.about');
    splitLines('#about-title', { delay: 0.3 });
    reveal(['.about .body-copy', '.story-signature', '.about .text-link'], { delay: 0.45, stagger: 0.12 });

    reveal('.footer-main > *', { stagger: 0.12, trigger: '.footer-main' });
    reveal(['.footer-details', '.footer-bottom'], { y: 0, trigger: '.footer-details', start: 'top 98%', stagger: 0.15 });
  }

  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, 1200))]).then(() => {
    intro();
    scenes();
    ScrollTrigger.refresh();
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
