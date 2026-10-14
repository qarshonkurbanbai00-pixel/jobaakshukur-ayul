(function(){'use strict';
var line=document.querySelector('.timeline__line'),progress=document.getElementById('timelineProgress'),timeline=document.getElementById('timeline');
if(!line||!progress||!timeline)return;
function update(){
  var rect=timeline.getBoundingClientRect(),vh=window.innerHeight;
  var start=rect.top-vh*.5,end=rect.bottom-vh*.5,total=end-start,passed=-start;
  progress.style.height=(Math.max(0,Math.min(1,passed/total))*100)+'%';
}
update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
})();
