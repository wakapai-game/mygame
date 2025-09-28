// helpers
const $ = (s, c=document)=>c.querySelector(s);
const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));

// year
$("#year") && ($("#year").textContent = new Date().getFullYear());

// smooth scroll
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    if(id && id.length>1){
      const el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:"smooth", block:"start"}); }
    }
  });
});

// mobile nav
const navToggle = $(".nav-toggle");
const nav = $("#nav");
if (navToggle && nav){
  navToggle.addEventListener("click", ()=>{
    const expanded = nav.getAttribute("aria-expanded")==="true";
    nav.setAttribute("aria-expanded", String(!expanded));
    navToggle.setAttribute("aria-expanded", String(!expanded));
  });
  // close on link tap (mobile)
  $$('#nav a').forEach(a=>a.addEventListener("click", ()=>{
    nav.setAttribute("aria-expanded","false");
    navToggle.setAttribute("aria-expanded","false");
  }));
}

// starfield bg (lightweight)
(function starfield(){
  const cvs = document.getElementById("stars");
  if(!cvs) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const ctx = cvs.getContext("2d");
  let w,h,stars;

  function init(){
    w = cvs.width = innerWidth * dpr;
    h = cvs.height = innerHeight * dpr;
    cvs.style.width = innerWidth + "px";
    cvs.style.height = innerHeight + "px";
    stars = Array.from({length: 180}, ()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*1+0.2,
      a: Math.random()
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    for (const s of stars){
      s.y += .08 * s.z * dpr;
      if (s.y > h) { s.y = 0; s.x = Math.random()*w; }
      ctx.globalAlpha = .3 + s.a*.7;
      ctx.fillStyle = "#cfe3ff";
      ctx.fillRect(s.x, s.y, 1.2*s.z, 1.2*s.z);
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", init);
  init(); tick();
})();

// demo helpers (demo.html 用)
const demoFrame = $("#demoFrame");
const openDemo = $("#openDemo");
if (openDemo && demoFrame){
  openDemo.addEventListener("click", ()=>{
    const src = openDemo.getAttribute("data-demo-src");
    demoFrame.removeAttribute("srcdoc");
    demoFrame.src = src;
    openDemo.style.display = "none";
  });
}
const toggleFull = $("#toggleFull");
if(toggleFull && demoFrame){
  toggleFull.addEventListener("click", async ()=>{
    if (!document.fullscreenElement){ await demoFrame.requestFullscreen?.(); }
    else { await document.exitFullscreen?.(); }
  });
}
