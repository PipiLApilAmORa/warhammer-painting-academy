
const COURSES = window.COURSES;
const app = document.getElementById('app');
const STORAGE='wpa-v2-state';
let state=JSON.parse(localStorage.getItem(STORAGE)||'null')||{completed:{},tasks:{},reflections:{},photos:{}};
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
const byId=id=>document.getElementById(id);
function allMissions(){return COURSES.flatMap(c=>c.missions.map(m=>({...m,campaignId:c.id,campaignTitle:c.title,campaignZh:c.title_zh})))}
function isComplete(id){return !!state.completed[id]}
function campaignComplete(ci){return COURSES[ci].missions.every(m=>isComplete(m.id))}
function campaignUnlocked(ci){return ci===0 || campaignComplete(ci-1)}
function bossUnlocked(c,m){return !m.boss || c.missions.filter(x=>!x.boss).every(x=>isComplete(x.id))}
function totalXP(){return allMissions().filter(m=>isComplete(m.id)).reduce((a,m)=>a+m.xp,0)}
function overall(){const a=allMissions();return Math.round(a.filter(m=>isComplete(m.id)).length/a.length*100)}
function toast(t){const e=byId('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500)}
function esc(s=''){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function go(hash){location.hash=hash}
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>go('#/'+b.dataset.nav));
window.addEventListener('hashchange',route);

function renderHome(){
 const done=allMissions().filter(m=>isComplete(m.id)).length, total=allMissions().length;
 const cleared=COURSES.filter((_,i)=>campaignComplete(i)).length;
 app.innerHTML=`
 <section class="hero"><div class="eyebrow">PERSONAL TRAINING CAMPAIGN</div><h1>PAINT AT YOUR OWN PACE.</h1>
 <p>没有 Day 1、Day 2，也没有连续打卡压力。选择当前战役里的任意 Mission，慢慢完成。只有完成整个战役，下一章才会解锁。</p></section>
 <section class="dashboard">
  <div class="stat"><small>Overall Progress / 总进度</small><strong>${overall()}%</strong><div class="progress"><div style="width:${overall()}%"></div></div></div>
  <div class="stat"><small>Missions / 任务</small><strong>${done}/${total}</strong></div>
  <div class="stat"><small>XP</small><strong>${totalXP()}</strong></div>
  <div class="stat"><small>Campaigns Cleared / 通关战役</small><strong>${cleared}/${COURSES.length}</strong></div>
 </section>
 <section class="campaign-list">
 ${COURSES.map((c,i)=>{
   const unlocked=campaignUnlocked(i), comp=c.missions.filter(m=>isComplete(m.id)).length;
   const pct=Math.round(comp/c.missions.length*100);
   return `<article class="campaign-card card ${unlocked?'':'locked'}" data-c="${i}">
    <div class="seal">${c.roman}</div>
    <div><div class="eyebrow">CAMPAIGN ${c.roman}</div><h2>${c.title} · ${c.title_zh}</h2>
    <p>${c.subtitle_en}<br>${c.subtitle_zh}</p></div>
    <div class="campaign-meta"><strong>${comp}/${c.missions.length}</strong><span>${unlocked?(pct===100?'CLEARED / 已通关':'MISSIONS / 任务'):'🔒 LOCKED / 未解锁'}</span><div class="progress"><div style="width:${pct}%"></div></div></div>
   </article>`
 }).join('')}</section>`;
 document.querySelectorAll('.campaign-card:not(.locked)').forEach(el=>el.onclick=()=>go('#/campaign/'+COURSES[+el.dataset.c].id));
}
function renderCampaign(id){
 const ci=COURSES.findIndex(c=>c.id===id); if(ci<0||!campaignUnlocked(ci)) return renderHome();
 const c=COURSES[ci], done=c.missions.filter(m=>isComplete(m.id)).length, pct=Math.round(done/c.missions.length*100);
 app.innerHTML=`<button class="back" onclick="location.hash='#/campaigns'">← Campaigns / 返回战役</button>
 <section class="campaign-head"><div><div class="eyebrow">CAMPAIGN ${c.roman}</div><h1>${c.title} · ${c.title_zh}</h1>
 <p>${c.subtitle_en}<br>${c.subtitle_zh}</p></div><div class="campaign-progress"><div class="mini-stat"><span>Progress</span><b>${done}/${c.missions.length}</b></div><div class="progress"><div style="width:${pct}%"></div></div></div></section>
 <section class="mission-grid">${c.missions.map((m,i)=>{
   const locked=!bossUnlocked(c,m), done=isComplete(m.id);
   return `<article class="mission-card card ${m.boss?'boss':''} ${locked?'locked':''} ${done?'complete':''}" data-mid="${m.id}">
    <span class="mission-status">${done?'✓ COMPLETE / 完成':locked?'🔒 LOCKED / 未解锁':m.boss?'⚔ BOSS':'OPEN / 可开始'}</span>
    <div class="mission-number">${m.boss?'FINAL BOSS':'MISSION '+String(i+1).padStart(2,'0')}</div>
    <h3>${m.title_en}</h3><div class="zh">${m.title_zh}</div>
    <div class="desc">${m.goal_zh}</div>
   </article>`}).join('')}</section>`;
 document.querySelectorAll('.mission-card:not(.locked)').forEach(el=>el.onclick=()=>go('#/mission/'+el.dataset.mid));
}
function renderMission(id){
 const all=allMissions(), m=all.find(x=>x.id===id); if(!m)return renderHome();
 const ci=COURSES.findIndex(c=>c.id===m.campaignId), c=COURSES[ci];
 if(!campaignUnlocked(ci)||!bossUnlocked(c,m))return renderCampaign(c.id);
 const tasks=state.tasks[id]||{};
 const refl=state.reflections[id]||'';
 const photo=state.photos[id]||'';
 const taskDone=m.practice_en.filter((_,i)=>tasks[i]).length;
 const allDone=taskDone===m.practice_en.length;
 app.innerHTML=`<button class="back" onclick="location.hash='#/campaign/${c.id}'">← ${c.title} / 返回战役</button>
 <div class="mission-page">
 <article class="mission-main card">
  <div class="eyebrow">${m.boss?'BOSS MISSION':'MISSION'} · +${m.xp} XP</div>
  <h1>${m.title_en}</h1><div class="zh-title">${m.title_zh}</div>
  <section class="section"><h2>Why / 为什么学</h2><div class="bilingual"><div class="langbox"><small>ENGLISH</small><p>${m.why_en}</p></div><div class="langbox"><small>中文</small><p>${m.why_zh}</p></div></div></section>
  <section class="section"><h2>Learning Goal / 学习目标</h2><div class="bilingual"><div class="langbox"><small>ENGLISH</small><p>${m.goal_en}</p></div><div class="langbox"><small>中文</small><p>${m.goal_zh}</p></div></div></section>
  <section class="section"><h2>Tutorials / 教程</h2><p style="color:var(--muted);font-size:12px">Choose one first. If it doesn't click, try the other. / 先任选一个；如果讲法不适合你，再换另一个。</p>
   <div class="tutorials">${m.tutorials.map((t,i)=>`<a class="tutorial" href="${t[2]}" target="_blank" rel="noopener"><div><strong>Option ${String.fromCharCode(65+i)} · ${t[0]}</strong><small>${t[1]}</small></div><b>WATCH ↗</b></a>`).join('')}</div>
  </section>
  <section class="section"><h2>Practice / 实际练习</h2><div class="step-list">${m.practice_en.map((x,i)=>`<label class="checkline"><input type="checkbox" data-task="${i}" ${tasks[i]?'checked':''}><div><strong>${i+1}. ${m.practice_zh[i]}</strong><div style="color:var(--muted);font-size:11px;margin-top:4px">${x}</div></div></label>`).join('')}</div></section>
  <section class="section"><h2>Pass Criteria / 通关标准</h2><div class="pair">${m.pass_en.map((x,i)=>`<div class="bulletbox good">✓ ${m.pass_zh[i]}<br><span style="color:var(--muted)">${x}</span></div>`).join('')}</div></section>
  <section class="section"><h2>Common Mistakes / 常见错误</h2><div class="pair">${m.mistakes_en.map((x,i)=>`<div class="bulletbox bad">✕ ${m.mistakes_zh[i]}<br><span style="color:var(--muted)">${x}</span></div>`).join('')}</div></section>
  <section class="section"><h2>Reflection / 自我反馈</h2><textarea id="reflection" placeholder="今天哪一点最顺？哪一点下次想改？ / What worked? What would you change next time?">${esc(refl)}</textarea></section>
  <section class="section"><h2>Upload Result / 上传作品</h2><div class="photo-upload"><label>＋ Choose Photo / 选择照片<input id="photoInput" type="file" accept="image/*" hidden></label><div class="photo-preview">${photo?`<img src="${photo}" alt="mission result">`:''}</div></div></section>
  <button id="completeBtn" class="complete-btn ${isComplete(id)?'done':allDone?'ready':''}">${isComplete(id)?'✓ MISSION COMPLETE / 已完成':allDone?'COMPLETE MISSION / 完成任务':'Finish Practice First / 先完成练习'}</button>
 </article>
 <aside class="sidebar card"><div class="eyebrow">MISSION LOADOUT</div><h3>Resources / 所需物品</h3>${m.resources.map(r=>`<div class="resource">${r}</div>`).join('')}
 <div style="margin-top:18px"><div class="mini-stat"><span>Practice</span><b>${taskDone}/${m.practice_en.length}</b></div><div class="mini-stat"><span>Reward</span><b>+${m.xp} XP</b></div><div class="mini-stat"><span>Status</span><b>${isComplete(id)?'Complete':'In Progress'}</b></div></div></aside>
 </div>`;
 document.querySelectorAll('[data-task]').forEach(cb=>cb.onchange=()=>{state.tasks[id]=state.tasks[id]||{};state.tasks[id][cb.dataset.task]=cb.checked;save();renderMission(id)});
 byId('reflection').oninput=e=>{state.reflections[id]=e.target.value;save()};
 byId('photoInput').onchange=e=>handlePhoto(id,e.target.files[0]);
 const btn=byId('completeBtn'); btn.onclick=()=>{if(!allDone||isComplete(id))return;state.completed[id]=true;save();toast(`MISSION COMPLETE +${m.xp} XP`);setTimeout(()=>renderMission(id),300)};
}
function handlePhoto(id,file){if(!file)return;const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const max=900,s=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);state.photos[id]=c.toDataURL('image/jpeg',.78);try{save();toast('PHOTO SAVED / 照片已保存');renderMission(id)}catch(err){alert('图片太大，浏览器存储空间不足。请选择更小的图片。')}};img.src=e.target.result};r.readAsDataURL(file)}
function renderGallery(){
 const items=allMissions().filter(m=>state.photos[m.id]);
 app.innerHTML=`<section class="hero"><div class="eyebrow">GALLERY</div><h1>YOUR PAINTING JOURNEY</h1><p>每一次上传都会成为成长记录。当前版本照片保存在这个浏览器里；下一版可以接云端同步。</p></section>
 ${items.length?`<section class="gallery-grid">${items.map(m=>`<article class="gallery-item card"><img src="${state.photos[m.id]}" alt="${m.title_en}"><h4>${m.title_en}</h4><p>${m.title_zh} · ${m.campaignTitle}</p>${state.reflections[m.id]?`<p style="margin-top:8px">${esc(state.reflections[m.id]).slice(0,120)}</p>`:''}</article>`).join('')}</section>`:`<div class="empty card">还没有上传作品。完成任意 Mission 后，把结果放进这里吧。</div>`}`;
}
function renderAchievements(){
 const defs=[
  ['✦','First Mission','第一个任务',()=>allMissions().some(m=>isComplete(m.id))],
  ['⚔','Recruit Cleared','新兵战役通关',()=>campaignComplete(0)],
  ['◈','Battle Brother','战斗兄弟',()=>campaignComplete(1)],
  ['▰','Veteran','老兵',()=>campaignComplete(2)],
  ['△','Sergeant','军士',()=>campaignComplete(3)],
  ['✎','Commission Ready','委托准备完成',()=>campaignComplete(4)],
  ['👑','Master Painter','大师画师',()=>campaignComplete(5)],
  ['▣','Gallery Started','作品集开始',()=>Object.keys(state.photos).length>=3],
  ['◎','Reflective Painter','会复盘的画师',()=>Object.values(state.reflections).filter(x=>x.trim()).length>=5]
 ];
 app.innerHTML=`<section class="hero"><div class="eyebrow">ACHIEVEMENTS</div><h1>BADGES</h1><p>这些成就只记录成长，不设置连续登录或“断签”惩罚。</p></section><section class="ach-grid">${defs.map(d=>`<article class="ach card ${d[3]()?'':'locked'}"><div class="icon">${d[0]}</div><h3>${d[1]}</h3><p>${d[2]}</p></article>`).join('')}</section>`;
}
function route(){
 const h=location.hash||'#/campaigns',p=h.replace('#/','').split('/');
 if(p[0]==='campaigns'||p[0]==='')renderHome();
 else if(p[0]==='campaign')renderCampaign(p[1]);
 else if(p[0]==='mission')renderMission(p[1]);
 else if(p[0]==='gallery')renderGallery();
 else if(p[0]==='achievements')renderAchievements();
 else renderHome();
}
route();
