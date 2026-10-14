(function(){'use strict';
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function revealHero(){
  document.querySelectorAll('.reveal-hero').forEach(function(el,i){
    setTimeout(function(){el.classList.add('is-in');},reduced?0:(2600+i*180));
  });
}
revealHero();
var revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && !reduced){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(function(el){io.observe(el);});
}else{revealEls.forEach(function(el){el.classList.add('is-in');});}
function animateCounter(el){
  var target=parseInt(el.dataset.target,10)||0;
  if(reduced){el.textContent=target;return;}
  var start=null,duration=1600;
  function step(ts){if(!start)start=ts;var p=Math.min((ts-start)/duration,1);var e=1-Math.pow(1-p,3);el.textContent=Math.round(target*e);if(p<1)requestAnimationFrame(step);else el.textContent=target;}
  requestAnimationFrame(step);
}
var counters=document.querySelectorAll('.counter');
if('IntersectionObserver' in window){
  var io2=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){animateCounter(e.target);io2.unobserve(e.target);}});},{threshold:.4});
  counters.forEach(function(c){io2.observe(c);});
}else{counters.forEach(animateCounter);}
if(!reduced){
  var dunes=document.querySelector('.hero__layer--dunes'),sky=document.querySelector('.hero__layer--sky');
  window.addEventListener('scroll',function(){
    var y=window.scrollY;if(y>window.innerHeight)return;
    if(dunes)dunes.style.transform='translateY('+(y*.15)+'px)';
    if(sky)sky.style.transform='translateY('+(y*.08)+'px)';
  },{passive:true});
}
})();
