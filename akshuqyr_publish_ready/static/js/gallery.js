(function(){'use strict';
var chips=document.querySelectorAll('.archive-filter .chip');
var items=Array.from(document.querySelectorAll('.gallery-item'));
chips.forEach(function(chip){chip.addEventListener('click',function(){chips.forEach(function(c){c.classList.remove('is-active');});chip.classList.add('is-active');var f=chip.dataset.filter;items.forEach(function(it){it.style.display=(f==='all'||it.dataset.cat===f)?'':'none';});});});

var lb=document.getElementById('lightbox'),media=document.getElementById('lbMedia'),cap=document.getElementById('lbCaption');
var cur=0,active=[];
function visible(){return items.filter(function(i){return i.style.display!=='none'&&i.dataset.file;});}
function open(idx){
  active=visible();if(!active.length)return;cur=idx;
  var it=active[cur];
  media.innerHTML='<img src="'+it.dataset.file+'" alt="'+it.dataset.title+'">';
  cap.textContent=it.dataset.title+' · '+it.dataset.year;
  lb.classList.add('is-open');lb.setAttribute('aria-hidden','false');
}
function close(){lb.classList.remove('is-open');lb.setAttribute('aria-hidden','true');}
function nav(d){cur=(cur+d+active.length)%active.length;var it=active[cur];media.innerHTML='<img src="'+it.dataset.file+'" alt="'+it.dataset.title+'">';cap.textContent=it.dataset.title+' · '+it.dataset.year;}
items.forEach(function(it,i){
  it.addEventListener('click',function(){if(!it.dataset.file)return;open(visible().indexOf(it));});
  it.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&it.dataset.file){e.preventDefault();open(visible().indexOf(it));}});
});
document.getElementById('lbClose').addEventListener('click',close);
document.getElementById('lbPrev').addEventListener('click',function(){nav(-1);});
document.getElementById('lbNext').addEventListener('click',function(){nav(1);});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')nav(-1);if(e.key==='ArrowRight')nav(1);});
})();
