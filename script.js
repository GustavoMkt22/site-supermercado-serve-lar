// Atualiza o ano automaticamente no rodapé
document.getElementById('y').textContent = new Date().getFullYear();

/* =========================
   MENU MOBILE (dropdown)
   - abre/fecha com classe .open no <nav> ul
   - bloqueia scroll do fundo quando aberto
   - fecha ao clicar fora / ao clicar em um link / ao voltar p/ desktop
========================= */
function toggleMenu(){
  const nav  = document.querySelector('nav');
  const menu = nav?.querySelector('ul');
  if(!menu) return;
  menu.classList.toggle('open');
  document.body.classList.toggle('no-scroll', menu.classList.contains('open'));
}

// Fecha ao clicar fora
document.addEventListener('click', (e)=>{
  const nav  = document.querySelector('nav');
  const menu = nav?.querySelector('ul');
  if(!nav || !menu) return;
  if(!nav.contains(e.target)){
    menu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
});

// Fecha ao clicar em um link do menu
document.querySelectorAll('nav ul a').forEach(a=>{
  a.addEventListener('click', ()=>{
    const menu = document.querySelector('nav ul');
    menu?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

// Fecha ao redimensionar para desktop
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 720){
    document.querySelector('nav ul')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
});


/* =========================
   Carrossel "Hoje tem"
========================= */
(function initCarousel(){
  const root = document.getElementById('todayCarousel');
  if(!root) return;

  const track   = root.querySelector('.slides');
  const slides  = Array.from(root.querySelectorAll('.slide'));
  const btnPrev = root.querySelector('.prev');
  const btnNext = root.querySelector('.next');
  const dotsWrap= root.querySelector('.dots');

  // quantos slides aparecem por vez (1 no mobile, 2 no desktop)
  const perView = () => window.matchMedia('(min-width:900px)').matches ? 2 : 1;
  let current = 0, auto, pv = perView();

  // criar dots
  const totalPages = () => Math.ceil(slides.length / pv);
  function buildDots(){
    if(!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for(let i=0;i<totalPages();i++){
      const b = document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click', ()=>go(i));
      dotsWrap.appendChild(b);
    }
  }

  function update(){
    pv = perView();
    const page = Math.floor(current / pv);
    const offset = -(page * 100);
    track.style.transform = `translateX(${offset}%)`;
    // atualizar dots
    if(dotsWrap){
      [...dotsWrap.children].forEach((d,i)=>d.classList.toggle('active', i===page));
    }
  }

  function go(page){
    const maxPage = totalPages()-1;
    const p = Math.max(0, Math.min(page, maxPage));
    current = p * pv;
    update();
  }

  function next(){
    const maxIndex = slides.length - pv;
    current = (current + pv > maxIndex) ? 0 : current + pv;
    update();
  }

  function prev(){
    const maxIndex = slides.length - pv;
    current = (current - pv < 0) ? maxIndex : current - pv;
    update();
  }

  // autoplay
  function start(){ stop(); auto = setInterval(next, 4500); }
  function stop(){ if(auto) clearInterval(auto); }

  // gestures (touch)
  let sx=0, dx=0;
  root.addEventListener('touchstart', e=>{ sx = e.touches[0].clientX; stop(); }, {passive:true});
  root.addEventListener('touchmove',  e=>{ dx = e.touches[0].clientX - sx; }, {passive:true});
  root.addEventListener('touchend',   ()=>{ if(Math.abs(dx)>40) (dx<0?next():prev()); start(); sx=dx=0; });

  // mouse hover pausa (desktop)
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // botões (se existirem)
  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);

  // reagir ao resize (1 ou 2 por tela)
  window.addEventListener('resize', ()=>{ buildDots(); update(); });

  // init
  buildDots();
  update();
  start();
})();


/* =========================
   Revela cards ao rolar
========================= */
(function revealCardsOnScroll(){
  const cards = document.querySelectorAll('.cards .card');
  if(!cards.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c=>io.observe(c));
})();
