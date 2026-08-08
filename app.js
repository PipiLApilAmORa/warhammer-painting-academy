
const COURSES=window.COURSES, META=window.COURSE_META;
const app=document.getElementById('app'), STORE='wpa-v3-state';
let state=JSON.parse(localStorage.getItem(STORE)||'null')||{completed:{},tasks:{},reflections:{},photos:{}};
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const all=()=>COURSES.flatMap(c=>c.missions.map(m=>({...m,cid:c.id,ct:c.title,cz:c.title_zh})));
const complete=id=>!!state.completed[id];
const cdone=i=>COURSES[i].missions.every(m=>complete(m.id));
const unlocked=i=>i===0||cdone(i-1);
const bossok=(c,m)=>!m.boss||c.missions.filter(x=>!x.boss).every(x=>complete(x.id));
const xp=()=>all().filter(m=>complete(m.id)).reduce((n,m)=>n+m.xp,0);
function toast(t){let e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function esc(s=''){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>location.hash='#/'+b.dataset.nav);
addEventListener('hashchange',route);

function home(){
 let done=all().filter(m=>complete(m.id)).length,total=all().length,pct=Math.round(done/total*100),clear=COURSES.filter((c,i)=>cdone(i)).length;
 app.innerHTML=`<section class="hero"><div class="eyebrow">PAINTING CAMPAIGN · VERSION 3</div><h1>PAINT. LEARN. UNLOCK.</h1><p>没有日历，没有连续打卡，没有“落后”。当前战役里的 Mission 可以按心情选择；完成全部普通任务后解锁 Boss，打通 Boss 后开启下一场 Campaign。</p></section>
 <section class="dashboard"><div class="stat card"><small>Overall / 总进度</small><strong>${pct}%</strong><div class="progress"><div style="width:${pct}%"></div></div></div><div class="stat card"><small>Missions</small><strong>${done}/${total}</strong></div><div class="stat card"><small>XP</small><strong>${xp()}</strong></div><div class="stat card"><small>Campaigns Cleared</small><strong>${clear}/${COURSES.length}</strong></div></section>
 <div class="notice">${META.video_note_zh}</div>
 <section class="map">${COURSES.map((c,i)=>{let u=unlocked(i),d=c.missions.filter(m=>complete(m.id)).length,p=Math.round(d/c.missions.length*100);return `<article class="map-node card ${u?'':'locked'} ${cdone(i)?'cleared':''}" data-i="${i}"><span class="map-pin"></span><span class="roman">${c.roman}</span><div class="eyebrow">CAMPAIGN ${c.roman}</div><h2>${c.title}</h2><div class="zh">${c.title_zh}</div><p>${c.subtitle_zh}<br>${c.subtitle_en}</p><div class="map-meta"><span>${u?(cdone(i)?'✓ CLEARED / 已通关':'OPEN / 可进入'):'🔒 LOCKED / 未解锁'}</span><b>${d}/${c.missions.length}</b></div><div class="progress"><div style="width:${p}%"></div></div></article>`}).join('')}</section>`;
 document.querySelectorAll('.map-node:not(.locked)').forEach(x=>x.onclick=()=>location.hash='#/campaign/'+COURSES[+x.dataset.i].id);
}
function campaign(id){
 let ci=COURSES.findIndex(c=>c.id===id);if(ci<0||!unlocked(ci))return home();let c=COURSES[ci],d=c.missions.filter(m=>complete(m.id)).length,p=Math.round(d/c.missions.length*100);
 app.innerHTML=`<button class="back" onclick="location.hash='#/campaigns'">← Campaign Map / 战役地图</button><section class="campaign-head"><div><div class="eyebrow">CAMPAIGN ${c.roman}</div><h1>${c.title} · ${c.title_zh}</h1><p>${c.subtitle_zh}<br>${c.subtitle_en}</p></div><div class="campaign-progress"><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted)"><span>Progress</span><b>${d}/${c.missions.length}</b></div><div class="progress"><div style="width:${p}%"></div></div></div></section>
 <section class="mission-path">${c.missions.map((m,i)=>{let lock=!bossok(c,m),done=complete(m.id);return `<div class="path-row ${m.boss?'boss':''} ${done?'complete':''}"><div class="path-orb">${done?'✓':m.boss?'★':String(i+1).padStart(2,'0')}</div><article class="path-card card ${lock?'locked':''}" data-mid="${m.id}"><span class="tag">${done?'COMPLETE / 完成':lock?'LOCKED / 未解锁':m.boss?'BOSS':'OPEN'}</span><div class="eyebrow">${m.boss?'FINAL CHALLENGE':'MISSION'}</div><h3>${m.title_en}</h3><div class="zh">${m.title_zh}</div><p>${m.goal_zh}</p></article></div>`}).join('')}</section>`;
 document.querySelectorAll('.path-card:not(.locked)').forEach(x=>x.onclick=()=>location.hash='#/mission/'+x.dataset.mid);
}
function mission(id){
 let m=all().find(x=>x.id===id);if(!m)return home();let ci=COURSES.findIndex(c=>c.id===m.cid),c=COURSES[ci];if(!unlocked(ci)||!bossok(c,m))return campaign(c.id);
 let t=state.tasks[id]||{},td=m.practice_en.filter((_,i)=>t[i]).length,ready=td===m.practice_en.length,photo=state.photos[id]||'',refl=state.reflections[id]||'';
 app.innerHTML=`<button class="back" onclick="location.hash='#/campaign/${c.id}'">← ${c.title} / 返回战役</button><div class="mission-layout"><article class="mission-main card">
 <div class="eyebrow">${m.boss?'BOSS MISSION':'MISSION'} · +${m.xp} XP</div><h1>${m.title_en}</h1><div class="zh-title">${m.title_zh}</div>
 ${bi('Why / 为什么学',m.why_en,m.why_zh)}${bi('Learning Goal / 学习目标',m.goal_en,m.goal_zh)}
 <section class="section"><h2>Recommended Tutorials / 推荐教程</h2><p style="color:var(--muted);font-size:10px">不用全部看。先选一个；如果老师的讲法不适合你，再换另一个。 / You do not need to watch them all.</p><div class="tutorial-grid">${m.tutorials.map((v,i)=>`<a class="tutorial" href="${v[2]}" target="_blank" rel="noopener"><div><strong>Option ${String.fromCharCode(65+i)} · ${v[0]}</strong><small>${v[1]}</small></div><b>OPEN ↗</b></a>`).join('')}</div>
 <div class="search-hint">🔎 <b>自己找其他攻略 / Find another tutorial:</b><br>${m.search_hint.site_zh}<br><code>${m.search_hint.keywords_en}</code></div></section>
 <section class="section"><h2>Practice / 实际练习</h2><div class="steps">${m.practice_en.map((x,i)=>`<label class="step"><input type="checkbox" data-task="${i}" ${t[i]?'checked':''}><div><strong>${i+1}. ${m.practice_zh[i]}</strong><span>${x}</span></div></label>`).join('')}</div></section>
 <section class="section"><h2>Pass Criteria / 通关标准</h2><div class="criteria">${m.pass_en.map((x,i)=>`<div class="criterion good">✓ ${m.pass_zh[i]}<br><span>${x}</span></div>`).join('')}</div></section>
 <section class="section"><h2>Common Mistakes / 常见错误</h2><div class="criteria">${m.mistakes_en.map((x,i)=>`<div class="criterion bad">✕ ${m.mistakes_zh[i]}<br><span>${x}</span></div>`).join('')}</div></section>
 <section class="section"><h2>Reflection / 自我反馈</h2><textarea id="refl" placeholder="不用写很多：今天哪里最顺？下一次只想改善哪一件事？ / What worked? One thing to improve next time.">${esc(refl)}</textarea></section>
 <section class="section"><h2>Upload Result / 上传作品</h2><div class="upload"><label>＋ Choose Photo / 选择照片<input id="pic" type="file" accept="image/*" hidden></label><div class="preview">${photo?`<img src="${photo}">`:''}</div></div></section>
 <button id="done" class="complete-btn ${complete(id)?'done':ready?'ready':''}">${complete(id)?'✓ MISSION COMPLETE / 已完成':ready?'COMPLETE MISSION / 完成 Mission':'Finish Practice First / 先完成 Practice'}</button>
 </article><aside class="side card"><div class="eyebrow">MISSION LOADOUT</div><h3>Resources / 所需物品</h3>${m.resources.map(r=>`<div class="resource">${r}</div>`).join('')}<div class="side-note">不用为了 Mission 买齐所有品牌。已有功能相同的工具或颜料就可以替代。<br><br>There is no deadline. Repeat a mission whenever you want.</div></aside></div>`;
 document.querySelectorAll('[data-task]').forEach(x=>x.onchange=()=>{state.tasks[id]=state.tasks[id]||{};state.tasks[id][x.dataset.task]=x.checked;save();mission(id)});
 document.getElementById('refl').oninput=e=>{state.reflections[id]=e.target.value;save()};
 document.getElementById('pic').onchange=e=>photoSave(id,e.target.files[0]);
 document.getElementById('done').onclick=()=>{if(!ready||complete(id))return;state.completed[id]=true;save();toast(`MISSION COMPLETE +${m.xp} XP`);setTimeout(()=>mission(id),250)};
}
function bi(title,en,zh){return `<section class="section"><h2>${title}</h2><div class="bilingual"><div class="lang"><small>ENGLISH</small><p>${en}</p></div><div class="lang"><small>中文</small><p>${zh}</p></div></div></section>`}
function photoSave(id,f){if(!f)return;let r=new FileReader();r.onload=e=>{let im=new Image();im.onload=()=>{let max=900,s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);state.photos[id]=c.toDataURL('image/jpeg',.76);try{save();toast('PHOTO SAVED / 照片已保存');mission(id)}catch(err){alert('浏览器本地空间不足，请换一张更小的图片。')}};im.src=e.target.result};r.readAsDataURL(f)}
function gallery(){let a=all().filter(m=>state.photos[m.id]);app.innerHTML=`<section class="hero"><div class="eyebrow">GALLERY · PROGRESS ARCHIVE</div><h1>YOUR PAINTING JOURNEY</h1><p>Gallery 按 Mission 保存你的成长记录。当前 V3 仍为浏览器本地存储；后续接云端登录以后，可以跨设备保留。</p></section>${a.length?`<section class="gallery-grid">${a.map(m=>`<article class="gallery-item card"><img src="${state.photos[m.id]}"><h3>${m.title_en}</h3><p>${m.title_zh} · ${m.ct}</p>${state.reflections[m.id]?`<p style="margin-top:7px">${esc(state.reflections[m.id]).slice(0,120)}</p>`:''}</article>`).join('')}</section>`:`<div class="empty card">还没有照片。完成一个 Mission 后上传作品，它会自动出现在这里。</div>`}`}
function badges(){let ds=[['✦','First Mission','完成第一个 Mission',()=>all().some(m=>complete(m.id))],['⚔','The Recruit','通关 Campaign I',()=>cdone(0)],['◈','Battle Brother','通关 Campaign II',()=>cdone(1)],['▰','Veteran','通关 Campaign III',()=>cdone(2)],['△','Sergeant','通关 Campaign IV',()=>cdone(3)],['✎','Commission Painter','通关 Campaign V',()=>cdone(4)],['♛','Master Painter','通关 Campaign VI',()=>cdone(5)],['▣','Gallery Started','上传至少 3 张作品',()=>Object.keys(state.photos).length>=3],['◎','Reflective Painter','至少 5 个 Mission 写了复盘',()=>Object.values(state.reflections).filter(x=>x.trim()).length>=5]];app.innerHTML=`<section class="hero"><div class="eyebrow">ACHIEVEMENTS</div><h1>NO STREAKS. JUST PROGRESS.</h1><p>成就只记录已经学会和完成的东西，不设置断签惩罚。</p></section><section class="badges">${ds.map(d=>`<article class="badge card ${d[3]()?'':'locked'}"><div class="icon">${d[0]}</div><h3>${d[1]}</h3><p>${d[2]}</p></article>`).join('')}</section>`}
function route(){let p=(location.hash||'#/campaigns').replace('#/','').split('/');if(p[0]==='campaigns'||!p[0])home();else if(p[0]==='campaign')campaign(p[1]);else if(p[0]==='mission')mission(p[1]);else if(p[0]==='gallery')gallery();else if(p[0]==='achievements')badges();else home()}
route();
