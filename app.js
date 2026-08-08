
const COURSES=window.COURSES, META=window.COURSE_META;
const app=document.getElementById('app');
const STORE='wpa-v4-state';

// Migrate V3 progress once, so visual redesign does not wipe existing local progress.
let state=JSON.parse(localStorage.getItem(STORE)||'null');
if(!state){
  const v3=JSON.parse(localStorage.getItem('wpa-v3-state')||'null');
  state=v3||{completed:{},tasks:{},reflections:{},photos:{}};
  localStorage.setItem(STORE,JSON.stringify(state));
}

const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const all=()=>COURSES.flatMap(c=>c.missions.map(m=>({...m,cid:c.id,ct:c.title,cz:c.title_zh})));
const complete=id=>!!state.completed[id];
const cdone=i=>COURSES[i].missions.every(m=>complete(m.id));
const unlocked=i=>i===0||cdone(i-1);
const bossok=(c,m)=>!m.boss||c.missions.filter(x=>!x.boss).every(x=>complete(x.id));
const xp=()=>all().filter(m=>complete(m.id)).reduce((n,m)=>n+m.xp,0);
function esc(s=''){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1450)}
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>location.hash='#/'+b.dataset.nav);
addEventListener('hashchange',route);

function home(){
  document.body.classList.add('v5-home');
  const done=all().filter(m=>complete(m.id)).length;
  const total=all().length;
  const pct=Math.round(done/total*100);
  const cleared=COURSES.filter((_,i)=>cdone(i)).length;

  app.innerHTML=`
    <section class="v5-hero">
      <div class="v5-hero-copy">
        <div class="v5-kicker"><span></span>PERSONAL TRAINING CAMPAIGN</div>
        <h1>PAINT AT YOUR OWN PACE.</h1>
        <div class="v5-hero-cn v6-home-message">
          <p>给牙牙小猫开设的专属战锤涂装小课堂！请选择当前战役里的任意 Mission，慢慢完成。只有完成整个战役，下一个战役才会解锁。</p>
          <p>由于制作者 zzm 并没有丰富的战锤经验，此课堂的所有内容都仅供参考，小猫可以按照自己的想法随意更改自己的学习内容，此课堂仅起到为小猫减少决策疲劳、提供学习建议的作用。</p>
        </div>
      </div>
    </section>

    <section class="v5-dashboard">
      ${v5Metric('target','OVERALL PROGRESS','总体进度',pct+'%',`<div class="v5-progress"><div style="width:${pct}%"></div></div>`)}
      ${v5Metric('scroll','MISSIONS','任务',done+' / '+total)}
      ${v5Metric('xp','XP EARNED','经验值',xp())}
      ${v5Metric('crest','CAMPAIGNS CLEARED','通关战役',cleared+' / '+COURSES.length)}
    </section>

    <section class="v5-campaigns">
      ${COURSES.map((c,i)=>campaignBanner(c,i)).join('')}
    </section>
  `;

  document.querySelectorAll('.v5-campaign:not(.locked)').forEach(el=>{
    el.onclick=()=>location.hash='#/campaign/'+COURSES[+el.dataset.i].id;
  });
}

function v5Metric(icon,en,zh,val,extra=''){
  const icons={
    target:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="5"/><path d="M32 2v14M32 48v14M2 32h14M48 32h14"/></svg>`,
    scroll:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 10h35v40H21a9 9 0 0 1-9-9V10z"/><path d="M21 18h21M21 27h21M21 36h15M21 50c-5 0-9-4-9-9"/></svg>`,
    xp:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5 51 14v26L32 58 13 40V14z"/><text x="32" y="38" text-anchor="middle">XP</text></svg>`,
    crest:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M31 31 9 17l11 20-12 2 20 8 4 11 4-11 20-8-12-2 11-20-22 14z"/><circle cx="32" cy="28" r="6"/></svg>`
  };
  return `<article class="v5-metric">
    <div class="v5-metric-icon">${icons[icon]}</div>
    <div class="v5-metric-body">
      <div class="v5-metric-label">${en}</div>
      <div class="v5-metric-zh">${zh}</div>
      <div class="v5-metric-value">${val}</div>
      ${extra}
    </div>
  </article>`;
}


function campaignBanner(c,i){
  const u=unlocked(i);
  const d=c.missions.filter(m=>complete(m.id)).length;
  const art=i===0?'recruit':i===1?'battle':i===2?'veteran':i===3?'sergeant':i===4?'commission':'master';
  const cleared=cdone(i);

  return `<article class="v5-campaign ${art} ${u?'':'locked'} ${cleared?'cleared':''}" data-i="${i}">
    <div class="v5-standard ${i%2===0?'blue':'red'}">
      <div class="v5-skull">☠</div>
      <div class="v5-standard-num">${c.roman}</div>
    </div>

    <div class="v5-campaign-copy">
      <div class="v5-campaign-label">CAMPAIGN ${c.roman}</div>
      <h2>${c.title} <span>· ${c.title_zh}</span></h2>
      <p>${c.subtitle_en}</p>
      <p>${c.subtitle_zh}</p>
    </div>

    <div class="v5-campaign-state">
      ${u
        ? `<strong>${d} / ${c.missions.length}</strong><span>MISSIONS</span><b>›</b>`
        : `<strong>LOCKED</strong><span>未解锁</span><small>Complete Campaign ${i} to unlock<br>完成上一战役以解锁</small>`
      }
    </div>
  </article>`;
}

function campaign(id){
  document.body.classList.remove('v5-home');
  const ci=COURSES.findIndex(c=>c.id===id);
  if(ci<0||!unlocked(ci))return home();
  const c=COURSES[ci], done=c.missions.filter(m=>complete(m.id)).length, pct=Math.round(done/c.missions.length*100);

  app.innerHTML=`<div class="page-pad">
    <button class="back" onclick="location.hash='#/campaigns'">← Campaign Map / 战役地图</button>
    <section class="campaign-head">
      <div>
        <div class="eyebrow">CAMPAIGN ${c.roman}</div>
        <h1>${c.title} · ${c.title_zh}</h1>
        <p>${c.subtitle_zh}<br>${c.subtitle_en}</p>
      </div>
      <div class="campaign-progress">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
          <span>Progress / 进度</span><b>${done}/${c.missions.length}</b>
        </div>
        <div class="progress"><div style="width:${pct}%"></div></div>
      </div>
    </section>

    <section class="mission-path">
      ${c.missions.map((m,i)=>{
        const lock=!bossok(c,m), done=complete(m.id);
        return `<div class="path-row ${m.boss?'boss':''} ${done?'complete':''}">
          <div class="path-orb">${done?'✓':m.boss?'★':String(i+1).padStart(2,'0')}</div>
          <article class="path-card card ${lock?'locked':''}" data-mid="${m.id}">
            <span class="tag">${done?'COMPLETE / 完成':lock?'LOCKED / 未解锁':m.boss?'BOSS':'OPEN'}</span>
            <div class="eyebrow">${m.boss?'FINAL CHALLENGE':'MISSION'}</div>
            <h3>${m.title_en}</h3>
            <div class="zh">${m.title_zh}</div>
            <p>${m.goal_zh}</p>
          </article>
        </div>`;
      }).join('')}
    </section>
  </div>`;

  document.querySelectorAll('.path-card:not(.locked)').forEach(x=>x.onclick=()=>location.hash='#/mission/'+x.dataset.mid);
}

function mission(id){
  document.body.classList.remove('v5-home');
  const m=all().find(x=>x.id===id);
  if(!m)return home();
  const ci=COURSES.findIndex(c=>c.id===m.cid), c=COURSES[ci];
  if(!unlocked(ci)||!bossok(c,m))return campaign(c.id);

  const t=state.tasks[id]||{};
  const td=m.practice_en.filter((_,i)=>t[i]).length;
  const ready=td===m.practice_en.length;
  const photo=state.photos[id]||'';
  const refl=state.reflections[id]||'';

  app.innerHTML=`<div class="page-pad">
    <button class="back" onclick="location.hash='#/campaign/${c.id}'">← ${c.title} / 返回战役</button>
    <div class="mission-layout">
      <article class="mission-main card">
        <div class="eyebrow">${m.boss?'BOSS MISSION':'MISSION'} · +${m.xp} XP</div>
        <h1>${m.title_en}</h1>
        <div class="zh-title">${m.title_zh}</div>

        ${bi('Why / 为什么学',m.why_en,m.why_zh)}
        ${bi('Learning Goal / 学习目标',m.goal_en,m.goal_zh)}

        <section class="section">
          <h2>Recommended Tutorials / 推荐教程</h2>
          <p style="color:var(--muted);font-size:10px">不用全部看。先选一个；如果老师的讲法不适合你，再换另一个。 / You do not need to watch them all.</p>
          <div class="tutorial-grid">
            ${m.tutorials.map((v,i)=>`<a class="tutorial" href="${v[2]}" target="_blank" rel="noopener">
              <div><strong>Option ${String.fromCharCode(65+i)} · ${v[0]}</strong><small>${v[1]}</small></div><b>OPEN ↗</b>
            </a>`).join('')}
          </div>
          <div class="search-hint">
            🔎 <b>自己找其他攻略 / Find another tutorial:</b><br>
            ${m.search_hint.site_zh}<br>
            <code>${m.search_hint.keywords_en}</code>
          </div>
        </section>

        <section class="section">
          <h2>Practice / 实际练习</h2>
          <div class="steps">
            ${m.practice_en.map((x,i)=>`<label class="step">
              <input type="checkbox" data-task="${i}" ${t[i]?'checked':''}>
              <div><strong>${i+1}. ${m.practice_zh[i]}</strong><span>${x}</span></div>
            </label>`).join('')}
          </div>
        </section>

        <section class="section">
          <h2>Pass Criteria / 通关标准</h2>
          <div class="criteria">${m.pass_en.map((x,i)=>`<div class="criterion good">✓ ${m.pass_zh[i]}<br><span>${x}</span></div>`).join('')}</div>
        </section>

        <section class="section">
          <h2>Common Mistakes / 常见错误</h2>
          <div class="criteria">${m.mistakes_en.map((x,i)=>`<div class="criterion bad">✕ ${m.mistakes_zh[i]}<br><span>${x}</span></div>`).join('')}</div>
        </section>

        <section class="section">
          <h2>Reflection / 自我反馈</h2>
          <textarea id="refl" placeholder="不用写很多：今天哪里最顺？下一次只想改善哪一件事？ / What worked? One thing to improve next time.">${esc(refl)}</textarea>
        </section>

        <section class="section">
          <h2>Upload Result / 上传作品</h2>
          <div class="upload">
            <label>＋ Choose Photo / 选择照片<input id="pic" type="file" accept="image/*" hidden></label>
            <div class="preview">${photo?`<img src="${photo}" alt="Mission result">`:''}</div>
          </div>
        </section>

        <button id="done" class="complete-btn ${complete(id)?'done':ready?'ready':''}">
          ${complete(id)?'✓ MISSION COMPLETE / 已完成':ready?'COMPLETE MISSION / 完成 Mission':'Finish Practice First / 先完成 Practice'}
        </button>
      </article>

      <aside class="side card">
        <div class="eyebrow">MISSION LOADOUT</div>
        <h3>Resources / 所需物品</h3>
        ${m.resources.map(r=>`<div class="resource">${r}</div>`).join('')}
        <div class="side-note">
          不用为了 Mission 买齐所有品牌。已有功能相同的工具或颜料就可以替代。<br><br>
          There is no deadline. Repeat a mission whenever you want.
        </div>
      </aside>
    </div>
  </div>`;

  document.querySelectorAll('[data-task]').forEach(x=>x.onchange=()=>{
    state.tasks[id]=state.tasks[id]||{};
    state.tasks[id][x.dataset.task]=x.checked;
    save();
    mission(id);
  });
  document.getElementById('refl').oninput=e=>{state.reflections[id]=e.target.value;save()};
  document.getElementById('pic').onchange=e=>photoSave(id,e.target.files[0]);
  document.getElementById('done').onclick=()=>{
    if(!ready||complete(id))return;
    state.completed[id]=true;
    save();
    toast(`MISSION COMPLETE +${m.xp} XP`);
    setTimeout(()=>mission(id),250);
  };
}

function bi(title,en,zh){
  return `<section class="section"><h2>${title}</h2>
    <div class="bilingual v6-bilingual">
      <div class="lang v6-lang">
        <p>${en}</p>
        <p class="v6-zhline">${zh}</p>
      </div>
    </div>
  </section>`;
}

function photoSave(id,f){
  if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    const im=new Image();
    im.onload=()=>{
      const max=900,s=Math.min(1,max/Math.max(im.width,im.height));
      const c=document.createElement('canvas');
      c.width=im.width*s;c.height=im.height*s;
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      state.photos[id]=c.toDataURL('image/jpeg',.76);
      try{save();toast('PHOTO SAVED / 照片已保存');mission(id)}
      catch(err){alert('浏览器本地空间不足，请换一张更小的图片。')}
    };
    im.src=e.target.result;
  };
  r.readAsDataURL(f);
}

function gallery(){
  document.body.classList.remove('v5-home');
  const items=all().filter(m=>state.photos[m.id]);
  app.innerHTML=`<div class="page-pad">
    <section class="home-hero" style="min-height:270px;background:linear-gradient(90deg,#090a0b,rgba(9,10,11,.82)),url('assets/hero-marine.webp') right 38%/auto 120% no-repeat">
      <div class="hero-copy"><div class="kicker">GALLERY / 画廊</div><h1 style="font-size:70px">YOUR PAINTING JOURNEY</h1><p>战锤棋子大师牙牙的成长记录！未测试功能，如有bug还请小猫及时联系监工猫zzm修理之。以上！</p></div>
    </section>
    ${items.length?`<section class="gallery-grid" style="margin-top:22px">${items.map(m=>`<article class="gallery-item card">
      <img src="${state.photos[m.id]}" alt="${m.title_en}">
      <h3>${m.title_en}</h3><p>${m.title_zh} · ${m.ct}</p>
      ${state.reflections[m.id]?`<p style="margin-top:8px">${esc(state.reflections[m.id]).slice(0,140)}</p>`:''}
    </article>`).join('')}</section>`:`<div class="empty card" style="margin-top:22px">还没有照片。完成任意 Mission 后上传作品，它会自动出现在这里。</div>`}
  </div>`;
}

function badges(){
  document.body.classList.remove('v5-home');
  const ds=[
    ['✦','First Mission','完成第一个 Mission',()=>all().some(m=>complete(m.id))],
    ['⚔','The Recruit','通关 Campaign I',()=>cdone(0)],
    ['◈','Battle Brother','通关 Campaign II',()=>cdone(1)],
    ['▰','Veteran','通关 Campaign III',()=>cdone(2)],
    ['△','Sergeant','通关 Campaign IV',()=>cdone(3)],
    ['✎','Commission Painter','通关 Campaign V',()=>cdone(4)],
    ['♛','Master Painter','通关 Campaign VI',()=>cdone(5)],
    ['▣','Gallery Started','上传至少 3 张作品',()=>Object.keys(state.photos).length>=3],
    ['◎','Reflective Painter','至少 5 个 Mission 写了复盘',()=>Object.values(state.reflections).filter(x=>x.trim()).length>=5]
  ];
  app.innerHTML=`<div class="page-pad">
    <section class="home-hero" style="min-height:270px;background:linear-gradient(90deg,#090a0b,rgba(9,10,11,.82)),url('assets/hero-marine.webp') right 38%/auto 120% no-repeat">
      <div class="hero-copy"><div class="kicker">ACHIEVEMENTS / 成就</div><h1 style="font-size:70px">NO STREAKS. JUST PROGRESS.</h1><p>居然已经走了这么多路啦，好厉害！</p></div>
    </section>
    <section class="badges" style="margin-top:22px">${ds.map(d=>`<article class="badge card ${d[3]()?'':'locked'}"><div class="icon">${d[0]}</div><h3>${d[1]}</h3><p>${d[2]}</p></article>`).join('')}</section>
  </div>`;
}

function route(){
  const p=(location.hash||'#/campaigns').replace('#/','').split('/');
  if(p[0]==='campaigns'||!p[0])home();
  else if(p[0]==='campaign')campaign(p[1]);
  else if(p[0]==='mission')mission(p[1]);
  else if(p[0]==='gallery')gallery();
  else if(p[0]==='achievements')badges();
  else home();
}
route();
