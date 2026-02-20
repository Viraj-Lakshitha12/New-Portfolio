import { useEffect, useRef } from 'react';

/**
 * Full-screen Three.js intro animation.
 *
 * KEY FIX: import('three') returns the whole ES module namespace object.
 * Three.js has NO default export, so destructuring { default: THREE } fails.
 * Just use: const THREE = (await import('three'))  — i.e. the namespace itself.
 */
export default function ThreeAnimation({ onComplete }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let renderer = null;
    let animId   = null;
    let mounted  = true;

    async function init() {
      /* ── Load all Three.js modules in parallel ── */
      const [
        THREE,                  // ← whole namespace (no { default } destructuring!)
        { OrbitControls },
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
      ] = await Promise.all([
        import('three'),
        import('three/addons/controls/OrbitControls.js'),
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js'),
      ]);

      if (!mounted || !mountRef.current) return;

      /* ── Renderer setup ── */
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      camera.position.set(0, 5, 20);
      controls.update();

      /* ── Nebula background ── */
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vPosition;
          void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
        `,
        fragmentShader: `
          uniform float time;varying vec3 vPosition;
          float noise(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
          void main(){
            vec3 p=normalize(vPosition)*10.;float n=noise(p+vec3(time*.1));
            vec3 color=mix(vec3(.2,.1,.4),vec3(.1,.4,.3),n);
            float glow=pow(1.-length(vPosition)/100.,2.);
            gl_FragColor=vec4(color*glow,.3);}
        `,
        side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 64, 64), nebulaMaterial));

      /* ── Torus ── */
      const torusMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal,vPosition;uniform float time;
          void main(){vNormal=normal;vPosition=position;
            vec3 pos=position;pos*=1.+sin(time*2.+length(position))*.15;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);}
        `,
        fragmentShader: `
          uniform float time;varying vec3 vNormal,vPosition;
          void main(){
            float glow=sin(time*2.5+vPosition.x*1.5)*.5+.5;
            vec3 color=mix(vec3(1.,.2,.8),vec3(.4,.1,1.),glow);
            float edge=smoothstep(.4,.6,abs(vNormal.z));
            gl_FragColor=vec4(color*edge,1.);}
        `,
        side: THREE.DoubleSide,
      });
      const torusCore = new THREE.Mesh(new THREE.TorusGeometry(6, 1.5, 32, 100), torusMaterial);
      scene.add(torusCore);

      /* ── Inner sphere ── */
      const innerSphereMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;varying vec2 vUv;
          void main(){vNormal=normal;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
        `,
        fragmentShader: `
          uniform float time;varying vec3 vNormal;varying vec2 vUv;
          void main(){
            vec2 uv=vUv;float t=time*2.;
            float pattern=sin(uv.x*20.+t)*sin(uv.y*20.-t);
            pattern+=sin(uv.x*15.-t*1.5)*sin(uv.y*15.+t*1.5)*.5;
            float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),2.);
            vec3 finalColor=mix(vec3(.4,.1,1.),vec3(1.,.2,.8),pattern);
            float alpha=(pattern*.5+fresnel*.7)*.8;
            gl_FragColor=vec4(finalColor,alpha);}
        `,
        transparent: true, blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), innerSphereMaterial));

      /* ── Orbiting spheres + trails ── */
      const sphereCount    = 12;
      const spheres        = [];
      const trails         = [];
      const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const sphereMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vPosition;
          void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
        `,
        fragmentShader: `
          uniform float time;varying vec3 vPosition;
          void main(){
            float pulse=sin(time*4.+vPosition.y*2.)*.5+.5;
            vec3 color=vec3(.1,.8,.2)*(pulse*.9+.4);
            float edge=smoothstep(.3,.5,length(vPosition)/.8);
            gl_FragColor=vec4(color*edge,.9);}
        `,
        transparent: true, blending: THREE.AdditiveBlending,
      });

      for (let i = 0; i < sphereCount; i++) {
        const sphere         = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const trailPositions = new Float32Array(100 * 3);
        const trail          = new THREE.Line(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({ color: 0x33ff66, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending }),
        );
        sphere.userData = {
          orbitAngle:    Math.random() * Math.PI * 2,
          orbitSpeed:    0.05 + Math.random() * 0.03,
          orbitRadiusX:  10   + Math.random() * 4,
          orbitRadiusZ:  8    + Math.random() * 3,
          trailPositions,
          trailIndex: 0,
        };
        spheres.push(sphere);
        trails.push(trail);
        scene.add(sphere);
        scene.add(trail);
      }

      /* ── Vortex particle system ── */
      const vortexCount = 600;
      const vPositions  = new Float32Array(vortexCount * 3);
      const vColors     = new Float32Array(vortexCount * 3);
      const vSizes      = new Float32Array(vortexCount);

      for (let i = 0; i < vortexCount; i++) {
        vPositions[i * 3] = vPositions[i * 3 + 1] = vPositions[i * 3 + 2] = 0;
        const c = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
        vColors[i * 3] = c.r; vColors[i * 3 + 1] = c.g; vColors[i * 3 + 2] = c.b;
        vSizes[i] = 0.3 + Math.random() * 0.2;
      }

      const vortexGeo = new THREE.BufferGeometry();
      vortexGeo.setAttribute('position',    new THREE.BufferAttribute(vPositions, 3));
      vortexGeo.setAttribute('customColor', new THREE.BufferAttribute(vColors,    3));
      vortexGeo.setAttribute('size',        new THREE.BufferAttribute(vSizes,     1));

      const vortexMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute vec3 customColor;attribute float size;
          varying vec3 vColor;varying float vAlpha;
          void main(){vColor=customColor;vAlpha=1.-length(position)/20.;
            gl_PointSize=size*(400./-modelViewMatrix[3][2]);
            gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
        `,
        fragmentShader: `
          uniform float time;varying vec3 vColor;varying float vAlpha;
          void main(){
            vec2 uv=gl_PointCoord-.5;float dist=length(uv);
            if(dist>.5)discard;
            float shimmer=sin(time*8.+dist*15.)*.3+.7;
            float glow=exp(-dist*5.);
            gl_FragColor=vec4(vColor*shimmer,glow*vAlpha*.8);}
        `,
        transparent: true, blending: THREE.AdditiveBlending,
      });

      const vortexSystem = new THREE.Points(vortexGeo, vortexMaterial);
      scene.add(vortexSystem);

      const vortexData = Array.from({ length: vortexCount }, () => ({
        angle:       Math.random() * Math.PI * 2,
        speed:       0.06 + Math.random() * 0.04,
        distance:    0,
        maxDistance: 15 + Math.random() * 5,
        twist:       0.4 + Math.random() * 0.3,
      }));

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const pl1 = new THREE.PointLight(0xffe6ff, 2.0, 100); pl1.position.set( 15,  15,  15); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xe6ffec, 1.6, 100); pl2.position.set(-15, -15, -15); scene.add(pl2);
      const pl3 = new THREE.PointLight(0xe6f0ff, 1.2, 100); pl3.position.set(  0,  20, -10); scene.add(pl3);

      /* ── Post-processing / bloom ── */
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.4, 0.6, 0.85,
      );
      bloom.threshold = 0.2;
      bloom.strength  = 1.6;
      bloom.radius    = 0.6;
      composer.addPass(bloom);

      /* ── Window resize ── */
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      /* ── Animation loop ── */
      let time = 0;
      function animate() {
        if (!mounted) return;
        animId = requestAnimationFrame(animate);
        time  += 0.01;

        nebulaMaterial.uniforms.time.value      = time;
        torusCore.rotation.y                   += 0.005;
        torusCore.rotation.z                   += 0.003;
        torusMaterial.uniforms.time.value       = time;
        innerSphereMaterial.uniforms.time.value = time;
        vortexMaterial.uniforms.time.value      = time;

        spheres.forEach((sphere, i) => {
          const d = sphere.userData;
          d.orbitAngle     += d.orbitSpeed;
          sphere.position.x = Math.cos(d.orbitAngle) * d.orbitRadiusX;
          sphere.position.z = Math.sin(d.orbitAngle) * d.orbitRadiusZ;
          sphere.position.y = Math.sin(d.orbitAngle * 1.5 + time) * 3;
          sphere.material.uniforms.time.value = time;

          const pos = d.trailPositions;
          const idx = d.trailIndex * 3;
          pos[idx] = sphere.position.x; pos[idx + 1] = sphere.position.y; pos[idx + 2] = sphere.position.z;
          d.trailIndex = (d.trailIndex + 1) % 100;
          trails[i].geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
          trails[i].geometry.attributes.position.needsUpdate = true;
        });

        const posArr = vortexSystem.geometry.attributes.position.array;
        for (let i = 0; i < vortexCount; i++) {
          const d    = vortexData[i];
          d.distance += d.speed;
          const angle = d.angle + time * d.twist;
          posArr[i * 3]     = Math.cos(angle) * d.distance * (1 + d.twist);
          posArr[i * 3 + 1] = Math.sin(angle) * d.distance * 0.6;
          posArr[i * 3 + 2] = Math.sin(angle + d.twist) * d.distance;
          if (d.distance > d.maxDistance) d.distance = 0;
        }
        vortexSystem.geometry.attributes.position.needsUpdate = true;

        controls.update();
        composer.render();
      }
      animate();

      /* ── Fade out after 3 s then call onComplete ── */
      setTimeout(() => {
        if (!mounted || !mountRef.current) return;
        mountRef.current.style.transition = 'opacity 0.9s ease-out';
        mountRef.current.style.opacity    = '0';
        setTimeout(() => { if (mounted) onComplete?.(); }, 900);
      }, 3000);

      return () => window.removeEventListener('resize', onResize);
    }

    init();

    return () => {
      mounted = false;
      if (animId) cancelAnimationFrame(animId);
      renderer?.dispose();
    };
  }, [onComplete]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 10000, opacity: 1 }}
    />
  );
}