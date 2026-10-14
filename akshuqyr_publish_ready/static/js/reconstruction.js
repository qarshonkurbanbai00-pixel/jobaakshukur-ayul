/* Three.js — mosque, tree, Caspian, well, camel + OrbitControls */
(function(){'use strict';
if(typeof THREE==='undefined')return;
var canvas=document.getElementById('scene3d');if(!canvas)return;
var loader=document.getElementById('sceneLoader');
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var renderer,scene,camera,controls,sea,seaPos,seaBase,leaves,camel,head,sun,baseLight,autoRotate=!reduced,clock,rafId;

try{
  renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
  renderer.setClearColor(0x0a1424);

  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x0a1424,0.012);

  camera=new THREE.PerspectiveCamera(55,canvas.clientWidth/canvas.clientHeight,0.1,500);
  camera.position.set(14,8,20);

  if(typeof THREE.OrbitControls==='function'){
    controls=new THREE.OrbitControls(camera,canvas);
    controls.enableDamping=true;controls.dampingFactor=0.08;
    controls.minDistance=8;controls.maxDistance=60;
    controls.maxPolarAngle=Math.PI*0.48;
    controls.target.set(0,2,0);
  }

  scene.add(new THREE.HemisphereLight(0xd9c38c,0x0a111c,0.6));
  sun=new THREE.DirectionalLight(0xffd79a,1.1);sun.position.set(-20,25,15);scene.add(sun);
  baseLight=sun.intensity;
  var fill=new THREE.PointLight(0x6fa8c7,0.25,60);fill.position.set(10,6,-10);scene.add(fill);

  var sandMat=new THREE.MeshStandardMaterial({color:0xb8975a,roughness:1});
  var ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120,40,40),sandMat);
  var gpos=ground.geometry.attributes.position;
  for(var i=0;i<gpos.count;i++){var x=gpos.getX(i),y=gpos.getY(i);gpos.setZ(i,Math.sin(x*0.15)*0.3+Math.cos(y*0.18)*0.25);}
  gpos.needsUpdate=true;ground.geometry.computeVertexNormals();ground.rotation.x=-Math.PI/2;scene.add(ground);

  var seaGeo=new THREE.PlaneGeometry(100,60,60,30);
  sea=new THREE.Mesh(seaGeo,new THREE.MeshStandardMaterial({color:0x244a63,roughness:0.4,metalness:0.1,transparent:true,opacity:0.95}));
  sea.rotation.x=-Math.PI/2;sea.position.set(0,0.05,-30);scene.add(sea);
  seaPos=seaGeo.attributes.position;seaBase=new Float32Array(seaPos.count);
  for(var j=0;j<seaPos.count;j++)seaBase[j]=seaPos.getZ(j);

  var shore=new THREE.Mesh(new THREE.PlaneGeometry(100,3),new THREE.MeshStandardMaterial({color:0xd9c38c,roughness:1}));
  shore.rotation.x=-Math.PI/2;shore.position.set(0,0.06,-14);scene.add(shore);

  // Mosque
  var mosque=new THREE.Group();
  var baseMat=new THREE.MeshStandardMaterial({color:0xe6d4a8,roughness:0.9});
  var trimMat=new THREE.MeshStandardMaterial({color:0xc9a35c,roughness:0.6,metalness:0.2});
  var body=new THREE.Mesh(new THREE.BoxGeometry(6,3.6,6),baseMat);body.position.y=1.8;mosque.add(body);
  var dome=new THREE.Mesh(new THREE.SphereGeometry(2.4,32,24,0,Math.PI*2,0,Math.PI/2),baseMat);dome.position.y=3.6;mosque.add(dome);
  mosque.add(Object.assign(new THREE.Mesh(new THREE.ConeGeometry(0.18,0.9,12),trimMat),{position:new THREE.Vector3(0,6.1,0)}));
  var minaret=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.4,5.5,16),baseMat);minaret.position.set(3.6,2.75,2.6);mosque.add(minaret);
  mosque.add(Object.assign(new THREE.Mesh(new THREE.ConeGeometry(0.55,0.9,16),trimMat),{position:new THREE.Vector3(3.6,5.95,2.6)}));
  mosque.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(1.2,2,0.1),new THREE.MeshStandardMaterial({color:0x3a2a18,roughness:1})),{position:new THREE.Vector3(0,1,3.05)}));
  mosque.position.set(-2,0,2);scene.add(mosque);

  // Tree
  var tree=new THREE.Group();
  tree.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.35,2.6,10),new THREE.MeshStandardMaterial({color:0x4a3524,roughness:1})),{position:new THREE.Vector3(0,1.3,0)}));
  leaves=new THREE.Mesh(new THREE.SphereGeometry(1.2,20,16),new THREE.MeshStandardMaterial({color:0x6a7a3a,roughness:1}));leaves.position.y=2.8;tree.add(leaves);
  tree.position.set(6,0,4);scene.add(tree);

  // Well
  var well=new THREE.Group();
  well.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,1,20),new THREE.MeshStandardMaterial({color:0x7a6a4a,roughness:1})),{position:new THREE.Vector3(0,0.5,0)}));
  var post=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,2.4,8),new THREE.MeshStandardMaterial({color:0x3a2a18}));post.position.set(-0.7,1.7,0);well.add(post);
  var post2=post.clone();post2.position.x=0.7;well.add(post2);
  well.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(1.6,0.1,0.1),new THREE.MeshStandardMaterial({color:0x3a2a18})),{position:new THREE.Vector3(0,2.85,0)}));
  well.position.set(-7,0,5);scene.add(well);

  // Camel
  camel=new THREE.Group();
  var bodyGeo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.6,1.6,6,10):new THREE.CylinderGeometry(0.6,0.6,1.6,10);
  var cbody=new THREE.Mesh(bodyGeo,new THREE.MeshStandardMaterial({color:0xb08a5a,roughness:1}));cbody.rotation.z=Math.PI/2;cbody.position.y=1.6;camel.add(cbody);
  camel.add(Object.assign(new THREE.Mesh(new THREE.SphereGeometry(0.55,14,10),new THREE.MeshStandardMaterial({color:0xa07a4a,roughness:1})),{position:new THREE.Vector3(0,2.1,0)}));
  var neck=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.25,1.2,10),new THREE.MeshStandardMaterial({color:0xb08a5a,roughness:1}));neck.position.set(1.2,2.1,0);neck.rotation.z=-Math.PI/4;camel.add(neck);
  head=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10),new THREE.MeshStandardMaterial({color:0xb08a5a,roughness:1}));head.position.set(1.9,2.6,0);camel.add(head);
  for(var k=0;k<4;k++){var leg=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,1.4,8),new THREE.MeshStandardMaterial({color:0x8a6a3a,roughness:1}));leg.position.set((k<2?-0.7:0.7),0.7,(k%2===0?-0.35:0.35));camel.add(leg);}
  camel.position.set(4,0,8);camel.rotation.y=-0.5;scene.add(camel);

  function resize(){var w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  window.addEventListener('resize',resize);resize();

  // Controls
  var btnToggle=document.getElementById('sceneToggle');
  var btnReset=document.getElementById('sceneReset');
  var btnFs=document.getElementById('sceneFs');
  var initial={pos:camera.position.clone(),target:controls?controls.target.clone():new THREE.Vector3(0,2,0)};
  if(btnToggle){btnToggle.textContent=autoRotate?'⏸ Авто-айналу':'▶ Авто-айналу';btnToggle.addEventListener('click',function(){autoRotate=!autoRotate;btnToggle.textContent=autoRotate?'⏸ Авто-айналу':'▶ Авто-айналу';btnToggle.setAttribute('aria-pressed',autoRotate?'true':'false');});}
  if(btnReset)btnReset.addEventListener('click',function(){camera.position.copy(initial.pos);if(controls){controls.target.copy(initial.target);controls.update();}});
  if(btnFs)btnFs.addEventListener('click',function(){var w=canvas.parentElement;if(!document.fullscreenElement){(w.requestFullscreen||function(){}).call(w);}else{document.exitFullscreen();}setTimeout(resize,200);});

  clock=new THREE.Clock();
  function tick(){
    rafId=requestAnimationFrame(tick);
    var t=clock.getElapsedTime();
    if(autoRotate && controls){
      var r=22;controls.target.set(0,2.2,0);
      camera.position.x=Math.cos(t*0.07)*r;camera.position.z=Math.sin(t*0.07)*r;camera.position.y=7+Math.sin(t*0.1)*0.6;
      camera.lookAt(controls.target);
    }
    if(controls)controls.update();
    for(var i=0;i<seaPos.count;i++){var x=seaPos.getX(i),y=seaPos.getY(i);seaPos.setZ(i,seaBase[i]+Math.sin(t*0.9+x*0.3+y*0.2)*0.12);}
    seaPos.needsUpdate=true;
    leaves.rotation.z=Math.sin(t*0.7)*0.03;leaves.position.x=Math.sin(t*0.5)*0.05;
    camel.position.y=Math.sin(t*0.9)*0.04;head.rotation.z=Math.sin(t*0.6)*0.05;
    sun.intensity=baseLight+Math.sin(t*0.08)*0.08;
    renderer.render(scene,camera);
  }
  tick();
  if(loader)setTimeout(function(){loader.classList.add('is-hidden');},400);
}catch(err){
  if(loader){loader.innerHTML='<p style="color:#d99a9a;text-align:center;padding:30px">3D сахнаны жүктеу мүмкін болмады.<br><small>'+(err&&err.message||'')+'</small></p>';}
}
})();
