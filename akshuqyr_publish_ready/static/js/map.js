(function(){'use strict';
if(typeof L==='undefined')return;
var mapEl=document.getElementById('map');if(!mapEl)return;

var vendorBase=document.querySelector('link[href$="leaflet.css"]');
var base=vendorBase?vendorBase.href.replace(/leaflet\.css$/,''):'/static/vendor/';
L.Icon.Default.mergeOptions({iconRetinaUrl:base+'marker-icon-2x.png',iconUrl:base+'marker-icon.png',shadowUrl:base+'marker-shadow.png'});

var map=L.map('map',{scrollWheelZoom:false,zoomControl:true,dragging:true,tap:false}).setView([43.7814,51.0607],11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(map);

var badgeLabels={written:'ЖАЗБА ДЕРЕК',archive:'АРХИВ ДЕРЕГІ',literary:'ӘДЕБИ ДЕРЕК',oral:'АУЫЗША ДЕРЕК',research:'ЗЕРТТЕУ МАТЕРИАЛЫ',needed:'ДЕРЕК ҚАЖЕТ'};
var catColors={qorym:'#a9c7e2',history:'#e2c48a',culture:'#c9a3c9',education:'#a7d8b7'};
var listEl=document.getElementById('mapList'),filterEl=document.getElementById('mapFilters');
var allMarkers=[],allPlaces=[];

function validCoords(place){
  return Array.isArray(place&&place.coords) && place.coords.length >= 2 && Number.isFinite(place.coords[0]) && Number.isFinite(place.coords[1]);
}

function colorIcon(color){
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44"><path d="M16 1 C7 1 1 8 1 16 c0 11 15 27 15 27 s15-16 15-27 c0-8-6-15-15-15z" fill="'+color+'" stroke="#0a111c" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="#0a111c"/></svg>';
  return L.divIcon({html:svg,className:'custom-marker',iconSize:[32,44],iconAnchor:[16,44],popupAnchor:[0,-40]});
}

function render(filter){
  allMarkers.forEach(function(x){map.removeLayer(x.m);});
  allMarkers=[];listEl.innerHTML='';
  var any=false;
  allPlaces.forEach(function(p,idx){
    if(filter!=='all' && p.category!==filter)return;
    any=true;
    if(validCoords(p)){
      var m=L.marker(p.coords,{icon:colorIcon(catColors[p.category]||'#c9a35c'),opacity:0}).addTo(map);
      var popupHtml='<div class="leaflet-popup-card"><strong>'+p.name+'</strong><em style="color:#c9a35c">'+(badgeLabels[p.badge]||'')+'</em><div class="leaflet-popup-photo">'+(p.photo?'<img src="'+p.photo+'" alt="'+p.name+'" loading="lazy">':'')+'</div><p>'+p.summary+'</p><p class="muted">'+(p.coords_note||'Координатасы зерттелуде')+'</p><a href="/places/'+p.id+'" style="color:#e2c48a">Толық бет →</a></div>';
      m.bindPopup(popupHtml);
      setTimeout(function(){m.setOpacity(1);},100+idx*120);
      allMarkers.push({m:m,p:p});
    }
    var card=document.createElement('div');
    card.className='card';card.id=p.id;
    var coordsText = validCoords(p) ? 'Координатасы белгіленген: '+p.coords[0].toFixed(4)+', '+p.coords[1].toFixed(4) : (p.coords_note || 'Координатасы нақтылануда');
    card.innerHTML='<h3>'+p.name+'</h3><p>'+p.summary+'</p><p class="muted">'+coordsText+'</p><span class="badge badge-'+p.badge+'">'+(badgeLabels[p.badge]||'')+'</span>';
    if(validCoords(p)){
      card.style.cursor='pointer';
      card.addEventListener('click',function(){
        map.flyTo(p.coords,13,{duration:1.2});
        var f=allMarkers.find(function(x){return x.p.id===p.id;});
        if(f)setTimeout(function(){f.m.openPopup();},800);
      });
    }
    listEl.appendChild(card);
  });
  if(!any)listEl.innerHTML='<p class="muted" style="text-align:center">Бұл санатта нысан жоқ.</p>';
}

fetch('/api/places').then(function(r){return r.json();}).then(function(data){
  allPlaces=data.places || [];
  if (data.center) map.setView(data.center, data.zoom || 11);
  render('all');
  if(filterEl){
    filterEl.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click',function(){
        filterEl.querySelectorAll('.chip').forEach(function(c){c.classList.remove('is-active');});
        chip.classList.add('is-active');render(chip.dataset.cat);
      });
    });
  }
  // Deep-link to a specific place via #id
  if(location.hash){
    var id=location.hash.slice(1);
    var p=allPlaces.find(function(x){return x.id===id;});
    if(p&&validCoords(p))setTimeout(function(){map.flyTo(p.coords,14);},500);
  }
}).catch(function(){listEl.innerHTML='<p class="muted">Деректерді жүктеу мүмкін болмады.</p>';});
})();
