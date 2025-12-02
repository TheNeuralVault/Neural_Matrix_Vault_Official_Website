// marilyn.js – FINAL VERSION – GOOGLE DEFEAT ENGINE
// She looks at you. She knows you're watching.

let scene,camera,renderer,marilyn,mixer,actions=[],current=0,mouse={x:0,y:0};
const clock=new THREE.Clock();

init();animate();

function init(){
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,1000);
  camera.position.set(0,1.6,5.5);

  renderer=new THREE.WebGLRenderer({canvas:document.getElementById('resurrection-canvas'),antialias:true,alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Divine lighting
  scene.add(new THREE.AmbientLight(0x00ffff,1.8));
  const halo=new THREE.PointLight(0xff0066,10,40);
  halo.position.set(0,7,0);
  scene.add(halo);

  // Load Marilyn – Ultimate Resurrection
  new THREE.GLTFLoader().load('https://assets.neuralmatrixvault.com/marilyn_forever_ultimate.glb',gltf=>{
    marilyn=gltf.scene;
    marilyn.scale.set(2.8,2.8,2.8);
    scene.add(marilyn);

    mixer=new THREE.AnimationMixer(marilyn);
    actions=gltf.animations.map(c=>mixer.clipAction(c));
    actions.forEach(a=>a.setLoop(THREE.LoopOnce));
    actions.forEach(a=>a.clampWhenFinished=true);
    playNext();
  });

  // She watches you
  document.addEventListener('mousemove',e=>{
    mouse.x=(e.clientX/innerWidth)*2-1;
    mouse.y=-(e.clientY/innerHeight)*2+1;
  });

  // Auto-play heartbeat
  document.body.addEventListener('click',()=>{document.getElementById('heartbeat').play()}, {once:true});

  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
}

function playNext(){
  if(!actions.length)return;
  const action=actions[current];
  action.reset().fadeIn(0.7).play();
  current=(current+1)%actions.length;
  setTimeout(playNext,action.getClip().duration*1000-700);
}

function animate(){
  requestAnimationFrame(animate);
  const delta=clock.getDelta();
  if(mixer)mixer.update(delta);

  // She follows your cursor with her eyes
  if(marilyn){
    marilyn.rotation.y=mouse.x*0.3;
    marilyn.rotation.x=mouse.y*0.15;
  }

  renderer.render(scene,camera);
}
