/* Shared header/footer, theme, sliders, validation. Edit the data below. */
(function(){
'use strict';
const FORM_ENDPOINT=''; // TODO: set a form service URL (e.g. Formspree) to really deliver messages
const NAV=[['index.html','Home'],['about.html','About'],['portfolio.html','Portfolio'],['services.html','Services'],['contact.html','Contact']];
const SOC=[['facebook','https://www.facebook.com/'],['linkedin','https://www.linkedin.com/'],['github','https://github.com/'],['youtube','https://www.youtube.com/'],['twitter-x','https://x.com/']];
const page=(location.pathname.split('/').pop()||'index.html');
const socials=SOC.map(s=>`<a href="${s[1]}" target="_blank" rel="noopener" aria-label="${s[0]}"><i class="bi bi-${s[0]}"></i></a>`).join('');
const html=document.documentElement;
const NR=window.NRTheme||{setTheme(t){html.dataset.theme=t;html.setAttribute('data-bs-theme',t)},setAccent(a){html.dataset.accent=a}}; /* real implementation lives in theme-init.js */
const hd=document.querySelector('header'),ft=document.querySelector('footer');
if(hd){hd.className='site-header';hd.innerHTML=`<nav class="navbar navbar-expand-lg"><div class="container">
<a class="brand" href="index.html" aria-label="NR home">N<span>R</span></a>
<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Menu"><i class="bi bi-list"></i></button>
<div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav mx-auto">${NAV.map(n=>`<li class="nav-item"><a class="nav-link${n[0]===page?' active':''}" href="${n[0]}">${n[1]}</a></li>`).join('')}</ul>
<div class="nav-tools"><div class="palette-wrap"><button class="icon-btn" id="palBtn" aria-label="Accent colour"><i class="bi bi-palette"></i></button>
<div class="palette" id="pal">${['crimson','blue','green','purple','orange'].map(c=>`<button class="swatch" data-accent="${c}" aria-label="${c}"></button>`).join('')}</div></div>
<button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode"><i class="bi bi-moon-stars"></i></button>
<a class="btn-rgb" href="contact.html">Hire Me <i class="bi bi-arrow-right"></i></a></div></div></div></nav>`;}
if(ft){ft.className='site-footer';ft.innerHTML=`<div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
<a class="brand" href="index.html">N<span>R</span></a><small>&copy; ${new Date().getFullYear()} Md. Nabil Rahman. All Rights Reserved.</small>
<div class="socials">${socials}</div><small id="clock"></small></div>`;}
document.querySelectorAll('.socials[data-fill]').forEach(e=>e.innerHTML=socials);
const clock=document.getElementById('clock');
const tick=()=>{if(clock)clock.innerHTML='<i class="bi bi-clock"></i> '+new Date().toLocaleString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})};
tick();setInterval(tick,1000);
const pal=document.getElementById('pal'),icon=()=>{const b=document.querySelector('#themeBtn i');if(b)b.className='bi bi-'+(html.dataset.theme==='dark'?'sun':'moon-stars')};icon();
document.getElementById('themeBtn')?.addEventListener('click',()=>{NR.setTheme(html.dataset.theme==='dark'?'light':'dark');icon()});
window.addEventListener('storage',()=>setTimeout(icon,0));
const pb=document.getElementById('palBtn');pb?.setAttribute('aria-expanded','false');
pb?.addEventListener('click',e=>{e.stopPropagation();pb.setAttribute('aria-expanded',pal.classList.toggle('open'))});
pal?.addEventListener('click',e=>{const c=e.target.dataset.accent;if(c)NR.setAccent(c)});
const closePal=()=>{if(pal){pal.classList.remove('open');pb?.setAttribute('aria-expanded','false')}};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePal()});
document.addEventListener('click',closePal);window.addEventListener('scroll',closePal,{passive:true});document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',closePal));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.bar i').forEach(b=>b.style.width=b.dataset.w+'%');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
if(window.jQuery&&jQuery.fn.slick){
jQuery('.hero-slider').slick({dots:true,arrows:false,autoplay:true,autoplaySpeed:5000,fade:true,speed:900,pauseOnHover:true});
jQuery('.review-slider').slick({dots:true,arrows:false,autoplay:true,autoplaySpeed:4500,slidesToShow:2,responsive:[{breakpoint:768,settings:{slidesToShow:1}}]});
}else{ /* Fallback if slick.min.js is not installed yet: simple fade rotation */
console.warn('Slick Slider is not installed: run get-libs.ps1 (see README.md). Using the simple fallback.');
const hs=document.querySelector('.hero-slider');
if(hs){hs.classList.add('fb');const sl=[...hs.children];let n=0;sl[0].classList.add('is-active');if(sl.length>1)setInterval(()=>{sl[n].classList.remove('is-active');n=(n+1)%sl.length;sl[n].classList.add('is-active')},5000)}}
const form=document.getElementById('contactForm');
if(form){
const rules={name:v=>v.trim().length>=2||'Enter your full name.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||'Enter a valid email, e.g. name@mail.com.',phone:v=>/^\+?[0-9\s-]{7,15}$/.test(v.trim())||'Enter a valid phone number (7-15 digits).',address:v=>v.trim().length>=5||'Enter your address.',message:v=>v.trim().length>=10||'Message must be at least 10 characters.'};
const check=f=>{const r=rules[f.name](f.value),ok=r===true;f.classList.toggle('bad',!ok);f.nextElementSibling.textContent=ok?'':r;return ok};
form.querySelectorAll('.form-ctl').forEach(f=>f.addEventListener('input',()=>check(f)));
form.addEventListener('submit',async e=>{e.preventDefault();const ok=[...form.querySelectorAll('.form-ctl')].map(check).every(Boolean),box=document.getElementById('formOk');
if(!ok){box.classList.remove('show');return}
let msg='Thanks! Your message is valid. (Demo mode: set FORM_ENDPOINT in app.js to deliver it by email.)';
if(FORM_ENDPOINT){try{await fetch(FORM_ENDPOINT,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});msg='Thanks! Your message has been sent.'}catch(_){msg='Could not send. Please try again later.'}}
box.textContent=msg;box.classList.add('show');form.reset()});}
})();
