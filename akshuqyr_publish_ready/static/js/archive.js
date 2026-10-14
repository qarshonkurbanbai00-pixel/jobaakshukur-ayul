(function(){'use strict';
var chips=document.querySelectorAll('.archive-filter .chip');
var cards=document.querySelectorAll('.archive-card');
var search=document.getElementById('archiveSearch');
var empty=document.getElementById('archiveEmpty');
var currentFilter='all';

function apply(){
  var q=(search&&search.value||'').toLowerCase().trim();
  var visible=0;
  cards.forEach(function(c){
    var okCat=currentFilter==='all'||c.dataset.cat===currentFilter;
    var okQ=!q||(c.dataset.title+' '+c.dataset.note+' '+c.dataset.year).toLowerCase().indexOf(q)>-1;
    var show=okCat&&okQ;c.style.display=show?'':'none';if(show)visible++;
  });
  if(empty)empty.hidden=visible>0;
}

chips.forEach(function(chip){chip.addEventListener('click',function(){chips.forEach(function(c){c.classList.remove('is-active');});chip.classList.add('is-active');currentFilter=chip.dataset.filter;apply();});});
if(search)search.addEventListener('input',apply);

var modal=document.getElementById('archiveModal');
var badgeLabels={written:'ЖАЗБА ДЕРЕК',archive:'АРХИВ ДЕРЕГІ',literary:'ӘДЕБИ ДЕРЕК',oral:'АУЫЗША ДЕРЕК',research:'ЗЕРТТЕУ МАТЕРИАЛЫ',needed:'ДЕРЕК ҚАЖЕТ'};
function open(card){
  document.getElementById('modalTitle').textContent=card.dataset.title;
  document.getElementById('modalYear').textContent=card.dataset.year;
  document.getElementById('modalNote').textContent=card.dataset.note;
  document.getElementById('modalBadge').innerHTML='<span class="badge badge-'+card.dataset.type+'">'+(badgeLabels[card.dataset.type]||'')+'</span>';
  var f=document.getElementById('modalFile');
  f.innerHTML=card.dataset.file?'<a class="btn btn--line" href="'+card.dataset.file+'" target="_blank" rel="noopener">ФАЙЛДЫ АШУ</a>':'<p class="muted">Файл әзірге енгізілмеген — материал жинақталуда.</p>';
  modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
  modal.querySelector('.modal__close').focus();
}
function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');}
cards.forEach(function(c){c.addEventListener('click',function(){open(c);});c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(c);}});});
if(modal)modal.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',close);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();
