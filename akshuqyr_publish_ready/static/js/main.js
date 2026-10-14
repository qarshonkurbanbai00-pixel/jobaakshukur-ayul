(function(){'use strict';
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var pre=document.getElementById('preloader');
if(pre&&!reduced){window.addEventListener('load',function(){setTimeout(function(){pre.classList.add('is-hidden');},2400);});}
else if(pre){pre.classList.add('is-hidden');}
var nav=document.getElementById('siteNav');
function onScroll(){if(nav){if(window.scrollY>20)nav.classList.add('is-scrolled');else nav.classList.remove('is-scrolled');}}
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
var toggle=document.getElementById('navToggle'),menu=document.getElementById('navMenu');
if(toggle&&menu){
  toggle.addEventListener('click',function(){
    var open=menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('is-open');toggle.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');});});
}
var baRange=document.getElementById('baRange'),baAfter=document.getElementById('baAfter'),baHandle=document.getElementById('baHandle');
if(baRange&&baAfter&&baHandle){
  function up(){var v=baRange.value;baAfter.style.clipPath='inset(0 0 0 '+v+'%)';baHandle.style.left=v+'%';}
  baRange.addEventListener('input',up);up();
}
})();
