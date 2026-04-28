// ── Role cycling animation ──
(function(){
  const roles = ['UI/UX Designer', 'BSIT Student', 'Creative Thinker', 'Problem Solver'];
  const wrapper = document.getElementById('hero-role-text');
  // Use inner text span + cursor span so cursor isn't wiped
  const textSpan = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'role-cursor';
  wrapper.appendChild(textSpan);
  wrapper.appendChild(cursor);

  let idx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type(){
    const current = roles[idx];
    if(!isDeleting){
      charIdx++;
      textSpan.textContent = current.slice(0, charIdx);
      if(charIdx === current.length){
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      charIdx--;
      textSpan.textContent = current.slice(0, charIdx);
      if(charIdx === 0){
        isDeleting = false;
        idx = (idx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 48);
    }
  }

  setTimeout(type, 600);
})();

function go(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('show'));
  document.querySelectorAll('.nav-links button').forEach(b=>b.classList.remove('act'));
  document.querySelectorAll('.mobile-nav button').forEach(b=>b.classList.remove('act'));
  document.getElementById('p-'+id).classList.add('show');
  document.getElementById('nb-'+id).classList.add('act');
  if(document.getElementById('mnb-'+id)) document.getElementById('mnb-'+id).classList.add('act');
  window.scrollTo({top:0,behavior:'smooth'});
}
function toggleMenu(){
  const h=document.getElementById('hamburger');
  const m=document.getElementById('mobile-nav');
  h.classList.toggle('open');
  m.classList.toggle('open');
}
function toggleTheme(){
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
(function(){
  if(localStorage.getItem('theme')==='light') document.body.classList.add('light');
})();

// ── DUAL-MODE BACKGROUND ANIMATION ──
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function isLight(){ return document.body.classList.contains('light'); }

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ─────────────────────────────────────────────
  // DARK MODE: Galaxy — Stars, Nebulas, Shooters
  // ─────────────────────────────────────────────
  const STAR_COUNT = 320;
  const stars = [];
  for(let i = 0; i < STAR_COUNT; i++){
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.012,
      color: Math.random() < 0.15 ? `rgba(155,204,98,`
           : Math.random() < 0.2  ? `rgba(200,230,255,`
                                   : `rgba(255,255,255,`
    });
  }

  const nebulas = [
    { x:0.18, y:0.22, rx:0.38, ry:0.28, r:[120,200,80],  a:0.07, drift:{ x:0.000008, y:0.000005 } },
    { x:0.72, y:0.65, rx:0.32, ry:0.24, r:[80,180,255],  a:0.055, drift:{ x:-0.000006, y:0.000007 } },
    { x:0.48, y:0.82, rx:0.28, ry:0.18, r:[155,204,98],  a:0.06, drift:{ x:0.000005, y:-0.000004 } },
    { x:0.85, y:0.15, rx:0.25, ry:0.20, r:[200,130,255], a:0.045, drift:{ x:-0.000007, y:0.000006 } },
    { x:0.1,  y:0.75, rx:0.22, ry:0.18, r:[255,160,80],  a:0.04, drift:{ x:0.000009, y:-0.000005 } },
  ];

  const shooters = [];
  function spawnShooter(){
    if(isLight()) return;
    const angle = (Math.random() * 40 + 20) * Math.PI / 180;
    const speed = 8 + Math.random() * 10;
    shooters.push({
      x: Math.random() * W, y: Math.random() * H * 0.5,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      len: 120 + Math.random() * 200, speed,
      life: 1, decay: 0.022 + Math.random() * 0.018,
      width: 1.5 + Math.random(), trail: []
    });
  }
  setInterval(spawnShooter, 2200);
  setInterval(spawnShooter, 4100);

  let dustAngle = 0;
  function drawDust(){
    dustAngle += 0.00008;
    const cx = W * 0.5, cy = H * 0.5;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(dustAngle);
    for(let i = 0; i < 3; i++){
      const g = ctx.createLinearGradient(-W*0.6, i*80-80, W*0.6, i*80-80);
      g.addColorStop(0,   'rgba(155,204,98,0)');
      g.addColorStop(0.3, 'rgba(155,204,98,0.018)');
      g.addColorStop(0.5, 'rgba(155,204,98,0.03)');
      g.addColorStop(0.7, 'rgba(155,204,98,0.018)');
      g.addColorStop(1,   'rgba(155,204,98,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-W*0.6, i*80-90, W*1.2, 30);
    }
    ctx.restore();
  }

  function drawNebulas(){
    nebulas.forEach(n => {
      n.x += n.drift.x; n.y += n.drift.y;
      if(n.x < -0.3) n.x = 1.3; if(n.x > 1.3) n.x = -0.3;
      if(n.y < -0.3) n.y = 1.3; if(n.y > 1.3) n.y = -0.3;
      const alpha = n.a;
      const px = n.x * W, py = n.y * H;
      const ox = (mx - W/2) * 0.012 * n.rx;
      const oy = (my - H/2) * 0.012 * n.ry;
      const gx = px + ox, gy = py + oy;
      const rx = n.rx * W, ry = n.ry * H;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(rx, ry));
      const [r,gr,b] = n.r;
      g.addColorStop(0,   `rgba(${r},${gr},${b},${alpha})`);
      g.addColorStop(0.4, `rgba(${r},${gr},${b},${alpha*0.5})`);
      g.addColorStop(1,   `rgba(${r},${gr},${b},0)`);
      ctx.save(); ctx.scale(1, ry/rx);
      ctx.beginPath(); ctx.arc(gx, gy*(rx/ry), rx, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
    });
  }

  function drawStars(t){
    stars.forEach(s => {
      const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
      const px = s.x * W + (mx - W/2) * 0.004 * s.r;
      const py = s.y * H + (my - H/2) * 0.004 * s.r;
      ctx.save();
      if(s.r > 1.0){ ctx.shadowBlur = 6; ctx.shadowColor = s.color + '0.8)'; }
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.color + alpha + ')'; ctx.fill(); ctx.restore();
      if(s.r > 1.2){
        const sparkA = alpha * 0.4, len = s.r * 5;
        ctx.save(); ctx.strokeStyle = s.color + sparkA + ')'; ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px-len,py); ctx.lineTo(px+len,py);
        ctx.moveTo(px,py-len); ctx.lineTo(px,py+len);
        ctx.stroke(); ctx.restore();
      }
    });
  }

  function drawShooters(){
    for(let i = shooters.length - 1; i >= 0; i--){
      const s = shooters[i];
      s.trail.push({ x: s.x, y: s.y });
      if(s.trail.length > 18) s.trail.shift();
      s.x += s.vx; s.y += s.vy; s.life -= s.decay;
      if(s.life <= 0 || s.x > W+100 || s.y > H+100){ shooters.splice(i,1); continue; }
      for(let j = 1; j < s.trail.length; j++){
        const frac = j / s.trail.length;
        const alpha = frac * s.life * 0.9;
        ctx.save(); ctx.strokeStyle = `rgba(220,255,200,${alpha})`;
        ctx.lineWidth = s.width * frac; ctx.lineCap = 'round';
        ctx.shadowBlur = 8; ctx.shadowColor = `rgba(155,204,98,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(s.trail[j-1].x, s.trail[j-1].y);
        ctx.lineTo(s.trail[j].x, s.trail[j].y);
        ctx.stroke(); ctx.restore();
      }
      ctx.save(); ctx.beginPath();
      ctx.arc(s.x, s.y, s.width*1.2, 0, Math.PI*2);
      ctx.fillStyle = `rgba(240,255,220,${s.life*0.95})`;
      ctx.shadowBlur = 14; ctx.shadowColor = `rgba(155,204,98,${s.life})`;
      ctx.fill(); ctx.restore();
    }
  }

  // ─────────────────────────────────────────────
  // LIGHT MODE: Garden — Bokeh orbs, Petals, Sun rays, Fireflies
  // ─────────────────────────────────────────────

  // Soft bokeh circles (like light through leaves)
  const BOKEH_COUNT = 55;
  const bokeh = [];
  for(let i = 0; i < BOKEH_COUNT; i++){
    bokeh.push({
      x: Math.random(), y: Math.random(),
      r: 18 + Math.random() * 55,
      baseAlpha: 0.04 + Math.random() * 0.09,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.008,
      vy: -(0.00005 + Math.random() * 0.0001), // very slowly drift upward
      // green / golden / white palette
      color: Math.random() < 0.4
        ? [90, 158, 30]       // green
        : Math.random() < 0.5
          ? [180, 210, 80]    // yellow-green
          : [255, 220, 100],  // golden
    });
  }

  // Floating petals / leaf shapes
  const PETAL_COUNT = 28;
  const petals = [];
  function makePetal(){
    return {
      x: Math.random() * W,
      y: -20 - Math.random() * 200,
      size: 5 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.3 + Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.025,
      alpha: 0.25 + Math.random() * 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
      // greens and cream
      color: Math.random() < 0.55
        ? `rgba(90,158,30,`
        : Math.random() < 0.5
          ? `rgba(155,204,98,`
          : `rgba(220,200,140,`
    };
  }
  for(let i = 0; i < PETAL_COUNT; i++){
    const p = makePetal();
    p.y = Math.random() * H; // start spread across screen
    petals.push(p);
  }

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.beginPath();
    // Leaf shape using bezier
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo( p.size*0.8, -p.size*0.4,  p.size*0.8,  p.size*0.4,  0,  p.size);
    ctx.bezierCurveTo(-p.size*0.8,  p.size*0.4, -p.size*0.8, -p.size*0.4,  0, -p.size);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();
    ctx.restore();
  }

  // Light rays from top-right (sun effect)
  const RAY_COUNT = 6;
  const rays = [];
  for(let i = 0; i < RAY_COUNT; i++){
    rays.push({
      angle: 0.18 + i * 0.13 + (Math.random()-0.5)*0.04,
      width: 0.03 + Math.random() * 0.06,
      alpha: 0.018 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.005,
    });
  }

  function drawLightRays(t){
    // Origin: upper-right corner
    const ox = W * 0.92, oy = 0;
    const len = Math.sqrt(W*W + H*H) * 1.2;
    rays.forEach(r => {
      const pulse = r.alpha * (0.6 + 0.4 * Math.sin(r.phase + t * r.speed));
      const a1 = r.angle - r.width/2;
      const a2 = r.angle + r.width/2;
      const x1 = ox + Math.cos(a1) * len, y1 = oy + Math.sin(a1) * len;
      const x2 = ox + Math.cos(a2) * len, y2 = oy + Math.sin(a2) * len;

      const g = ctx.createLinearGradient(ox, oy, (x1+x2)/2, (y1+y2)/2);
      g.addColorStop(0,   `rgba(255,240,160,${pulse * 2})`);
      g.addColorStop(0.3, `rgba(255,240,160,${pulse})`);
      g.addColorStop(1,   `rgba(255,240,160,0)`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBokeh(t){
    bokeh.forEach(b => {
      b.y += b.vy;
      if(b.y < -0.2) b.y = 1.1;
      const alpha = b.baseAlpha * (0.6 + 0.4 * Math.sin(b.phase + t * b.speed));
      const px = b.x * W + (mx - W/2) * 0.006;
      const py = b.y * H + (my - H/2) * 0.006;
      const [r,gr,bl] = b.color;
      const g = ctx.createRadialGradient(px, py, 0, px, py, b.r);
      g.addColorStop(0,   `rgba(${r},${gr},${bl},${alpha})`);
      g.addColorStop(0.5, `rgba(${r},${gr},${bl},${alpha*0.4})`);
      g.addColorStop(1,   `rgba(${r},${gr},${bl},0)`);
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, b.r, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
    });
  }

  function drawPetals(){
    petals.forEach((p,i) => {
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.35;
      p.y += p.vy;
      p.rot += p.vrot;
      if(p.y > H + 30){
        // recycle from top
        const np = makePetal();
        petals[i] = np;
        return;
      }
      if(p.x < -40 || p.x > W + 40){ p.x = Math.random() * W; }
      drawPetal(p);
    });
  }

  // ── Parallax mouse ──
  let mx = W/2, my = H/2;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // ── Main loop ──
  let t = 0;
  function loop(){
    t++;
    ctx.clearRect(0, 0, W, H);

    if(isLight()){
      // ── LIGHT MODE ──
      drawLightRays(t);
      drawBokeh(t);
      drawPetals();
    } else {
      // ── DARK MODE ──
      drawDust();
      drawNebulas();
      drawStars(t);
      drawShooters();
    }

    requestAnimationFrame(loop);
  }

  loop();
  spawnShooter();
})();

// ── CASE STUDY DRAWER ──
function openCS(id){
  document.getElementById('csp-'+id).classList.add('open');
  document.body.style.overflow='hidden';
}
function cspClose(e){
  if(e.target === e.currentTarget){
    e.currentTarget.classList.remove('open');
    document.body.style.overflow='';
  }
}
function cspCloseById(id){
  document.getElementById('csp-'+id).classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    document.querySelectorAll('.csp-backdrop.open').forEach(el=>{
      el.classList.remove('open');
      document.body.style.overflow='';
    });
  }
});

// Add in <head>
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

emailjs.init("YOUR_PUBLIC_KEY");