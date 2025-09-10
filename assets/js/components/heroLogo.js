let __heroLogoInstanceId = 0;

export async function initHeroLogo(container, options={}){
  const canvasId = options.canvasId || `hero-canvas-${++__heroLogoInstanceId}`;
  if(container.querySelector(`#${CSS.escape(canvasId)}`)) return;

  const canvas = document.createElement('canvas');
  canvas.id = canvasId;
  container.prepend(canvas);

  const [{ WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, AdditiveBlending, Color, PointLight, Vector3, Clock, sRGBEncoding }, gsap] = await Promise.all([
    import('https://esm.sh/three@0.159.0'),
    import('https://esm.sh/gsap@3.12.5').then(m=>m.gsap || m.default)
  ]);

  const renderer = new WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = sRGBEncoding;

  const scene = new Scene();
  scene.background = null;

  const camera = new PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.01, 100);
  camera.position.set(0, 0, 6);

  const redKey = new PointLight(new Color('#e50914'), 6, 20);
  redKey.position.set(2, 2, 4);
  scene.add(redKey);
  const rim = new PointLight(new Color('#b20610'), 3, 30);
  rim.position.set(-3, -2, -2);
  scene.add(rim);

  const tex = await new Promise((resolve, reject)=>{
    const loader = new TextureLoader();
    loader.load('./IMG/LOGO ND D ANIMATION.png', t=>resolve(t), undefined, reject);
  });

  const geo = new PlaneGeometry(2.2, 2.2);
  const mat = new MeshBasicMaterial({ map: tex, transparent:true, blending: AdditiveBlending });
  const mesh = new Mesh(geo, mat);
  mesh.position.z = 0;
  scene.add(mesh);

  mesh.rotation.set(0, 0, 0);
  camera.lookAt(mesh.position);

  camera.position.z = 16;
  mesh.scale.set(0.3, 0.3, 0.3);
  mesh.rotation.z = Math.PI * 2 * 4; 

  const tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
  tl.to(mesh.rotation, { z: 0, duration: 2.2, ease:'power4.out' }, 0)
    .to(mesh.scale, { x:1.4, y:1.4, z:1.4, duration: 1.8 }, 0)
    .to(camera.position, { z: 4.2, duration: 1.8 }, 0)
    .to(mesh.scale, { x:1.0, y:1.0, z:1.0, duration: .8 }, 1.8)
    .to(camera.position, { z: 3.2, duration: .8 }, 1.8)
    .fromTo(mesh.material, { opacity: .85 }, { opacity: 1, duration: .6 }, 1.8);

  tl.to(mesh.rotation, { z: "+=0.08", duration: 3, ease:'sine.inOut', yoyo:true, repeat:-1 }, 2.6);
  tl.to(mesh.position, { z: "+=0.08", duration: 3, ease:'sine.inOut', yoyo:true, repeat:-1 }, 2.6);

  gsap.to(redKey, { intensity: 8, duration: 1.2, yoyo:true, repeat:-1, ease:'sine.inOut' });

  const clock = new Clock();
  function animate(){
    const t = clock.getElapsedTime();
    if(t < 2){
      const shake = 0.01 * (2 - t) * Math.sin(t * 60);
      camera.position.x = shake;
      camera.position.y = shake * 0.5;
      camera.lookAt(mesh.position);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function onResize(){
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
}
