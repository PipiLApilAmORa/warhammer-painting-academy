const COURSE = [
  {
    day:1, title:"Day 1 · Paint Control", skill:"Brush Control",
    video:{title:"Apply Thin Coats & Improve your miniature painting",author:"Duncan Rhodes Painting Academy",url:"https://www.youtube.com/watch?v=28DbD9JwQCI"},
    practice:["准备 3–5 个练习零件或旧模型","练习只用笔尖取适量颜料，不让颜料爬到金属箍","在肩甲/平面上画 10 条尽量笔直、宽度一致的线","清洗画笔并把笔尖重新整理成尖点"],
    criteria:"完成标准：能够控制落笔位置；颜料主要停在想要的位置；画笔清洗后仍保持尖点。",
    skillDesc:"控笔、取漆、落笔位置"
  },
  {
    day:2, title:"Day 2 · Thin Your Paint", skill:"Paint Consistency",
    video:{title:"Apply Thin Coats & Improve your miniature painting",author:"Duncan Rhodes Painting Academy",url:"https://www.youtube.com/watch?v=28DbD9JwQCI"},
    practice:["分别试验：原漆、略微稀释、过度稀释三种状态","找出能顺畅离笔、又不会乱流的浓度","在同一块练习面完成两层薄涂","等待第一层完全干燥后再上第二层"],
    criteria:"完成标准：表面没有明显厚重刷痕，模型细节没有被颜料填平；两层后颜色较均匀。",
    skillDesc:"理解薄涂与颜料浓度"
  },
  {
    day:3, title:"Day 3 · Smooth Basecoat", skill:"Basecoat",
    video:{title:"Two thin coats refresher",author:"Duncan Rhodes Painting Academy",url:"https://www.youtube.com/watch?v=28DbD9JwQCI"},
    practice:["选择 5 个肩甲或类似平整部件","每个部件使用相同颜色和相同稀释比例","每层薄涂，必要时用 2–3 层得到完整覆盖","并排比较 5 个零件的一致性"],
    criteria:"完成标准：5 个部件颜色接近、覆盖均匀、不积漆、不糊细节。",
    skillDesc:"稳定、均匀的底色"
  },
  {
    day:4, title:"Day 4 · Shade & Recess", skill:"Shade",
    video:{title:"Shade practice mission",author:"Use your preferred Warhammer / miniature tutorial",url:"https://www.youtube.com/results?search_query=warhammer+shade+wash+beginner+tutorial"},
    practice:["找 3–5 个有明显凹槽的模型零件","练习少量 Wash，让它自然进入凹槽","用干净画笔及时吸走大面积积液","比较整体 Wash 与只做凹槽阴影的区别"],
    criteria:"完成标准：阴影主要留在凹陷位置；平面没有大片水渍或明显脏斑。",
    skillDesc:"阴影、Wash 与积液控制"
  },
  {
    day:5, title:"Day 5 · Drybrush", skill:"Drybrush",
    video:{title:"Drybrushing basics",author:"Choose a beginner drybrush tutorial",url:"https://www.youtube.com/results?search_query=miniature+painting+drybrush+beginner+Vince+Venturella"},
    practice:["准备地台、石头或纹理明显的练习件","蘸漆后在纸巾/纹理板上移除大部分颜料","用轻压力反复扫过凸起处","做一个从深到底色、再到浅色的两级干扫"],
    criteria:"完成标准：高处变亮、凹处仍暗；没有明显湿漆条纹或大片粉状堆积。",
    skillDesc:"快速提取纹理与高光"
  },
  {
    day:6, title:"Day 6 · Edge Highlight", skill:"Edge Highlight",
    video:{title:"Edge highlighting beginner practice",author:"Search: Vince Venturella / Warhammer",url:"https://www.youtube.com/results?search_query=edge+highlighting+miniatures+beginner+Vince+Venturella"},
    practice:["用画笔侧面轻擦 10 条容易接触的硬边","再用笔尖画 10 条较难接触的边","在一个肩甲上完成一圈尽量等宽的高光","只追求线条稳定，不追求极细"],
    criteria:"完成标准：大多数高光线条连续、宽度接近，不需要反复覆盖很大面积来修正。",
    skillDesc:"稳定的桌面级边缘高光"
  },
  {
    day:7, title:"Day 7 · First Battle Ready Mini", skill:"Battle Ready",
    video:{title:"Full miniature workflow",author:"Review the week's tutorials",url:"https://www.youtube.com/results?search_query=warhammer+beginner+paint+space+marine+full+tutorial"},
    practice:["从头开始完成 1 个模型：底色 → 阴影 → 恢复底色 → 简单高光","完成武器、金属、皮革等主要区域","完成基础地台","拍照：正面、背面、45° 各一张"],
    criteria:"完成标准：桌面距离看起来干净完整；主要颜色清楚；无大面积溢色；地台完成。",
    skillDesc:"独立完成一个完整模型"
  }
];

const BADGES = [
  {name:"First Stroke", icon:"✦", desc:"完成第一个任务", test:s=>s.completedTasks.length>=1},
  {name:"Two Thin Coats", icon:"◈", desc:"完成 Day 2", test:s=>dayDone(2,s)},
  {name:"Smooth Operator", icon:"▰", desc:"完成 Day 3", test:s=>dayDone(3,s)},
  {name:"Into the Shadows", icon:"☾", desc:"完成 Day 4", test:s=>dayDone(4,s)},
  {name:"Texture Hunter", icon:"⌁", desc:"完成 Day 5", test:s=>dayDone(5,s)},
  {name:"Edge Initiate", icon:"△", desc:"完成 Day 6", test:s=>dayDone(6,s)},
  {name:"Battle Ready", icon:"⚔", desc:"完成第一周全部任务", test:s=>COURSE.every(d=>dayDone(d.day,s))},
  {name:"Field Journal", icon:"✎", desc:"写下至少 3 天反馈", test:s=>Object.values(s.journal).filter(j=>j && Object.values(j).some(v=>v.trim?.())).length>=3}
];

let state = JSON.parse(localStorage.getItem("wpa-state") || "null") || {
  selectedDay:1,
  completedTasks:[],
  journal:{},
  photos:{}
};

const $ = id => document.getElementById(id);
const key = (day,i)=>`d${day}-t${i}`;
function save(){localStorage.setItem("wpa-state",JSON.stringify(state));updateUI();}
function dayDone(day,s=state){
  const d=COURSE.find(x=>x.day===day);
  return d.practice.every((_,i)=>s.completedTasks.includes(key(day,i)));
}
function xpTotal(){return state.completedTasks.length*20 + COURSE.filter(d=>dayDone(d.day)).length*40;}
function showToast(text){
  $("toast").textContent=text;$("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),1400);
}

function renderDaySelect(){
  $("daySelect").innerHTML = COURSE.map(d=>`<option value="${d.day}">Day ${d.day}${dayDone(d.day)?" ✓":""}</option>`).join("");
  $("daySelect").value=state.selectedDay;
}

function renderMission(){
  const d=COURSE.find(x=>x.day===+state.selectedDay);
  $("missionTitle").textContent=d.title;
  $("missionBody").innerHTML=`
    <div class="mission-block">
      <div class="block-title"><span>01</span><strong>Watch</strong></div>
      <a class="video-link" href="${d.video.url}" target="_blank" rel="noopener">
        <div><strong>${d.video.title}</strong><small>${d.video.author}</small></div><b>WATCH ↗</b>
      </a>
    </div>
    <div class="mission-block">
      <div class="block-title"><span>02</span><strong>Practice</strong></div>
      ${d.practice.map((t,i)=>`
        <label class="task">
          <input type="checkbox" data-task="${i}" ${state.completedTasks.includes(key(d.day,i))?"checked":""}>
          <span>${t} <small style="color:#777">· +20 XP</small></span>
        </label>`).join("")}
    </div>
    <div class="mission-block">
      <div class="block-title"><span>03</span><strong>Pass Condition</strong></div>
      <div class="success-criteria">${d.criteria}</div>
    </div>`;
  $("missionComplete").classList.toggle("show",dayDone(d.day));
  document.querySelectorAll("[data-task]").forEach(cb=>cb.addEventListener("change",e=>{
    const k=key(d.day,+e.target.dataset.task);
    if(e.target.checked && !state.completedTasks.includes(k)){state.completedTasks.push(k);showToast("+20 XP");}
    else state.completedTasks=state.completedTasks.filter(x=>x!==k);
    save(); render();
  }));
}

function renderSkills(){
  $("skillTree").innerHTML=COURSE.map((d,idx)=>{
    const unlocked = d.day===1 || dayDone(d.day-1);
    const completed = dayDone(d.day);
    return `<div class="skill-row ${unlocked||completed?"unlocked":""}">
      <div class="skill-node">${completed?"✓":idx+1}</div>
      <div><strong>${d.skill}</strong><p>${d.skillDesc}</p></div>
    </div>`;
  }).join("");
}

function renderBadges(){
  $("badges").innerHTML=BADGES.map(b=>{
    const u=b.test(state);
    return `<div class="badge ${u?"unlocked":"locked"}"><div class="icon">${b.icon}</div><strong>${b.name}</strong><p>${b.desc}</p></div>`;
  }).join("");
  $("badgesDone").textContent=BADGES.filter(b=>b.test(state)).length;
}

function updateDashboard(){
  const xp=xpTotal(), level=Math.floor(xp/100)+1, within=xp%100;
  const ranks=["Recruit","Initiate","Battle Brother","Veteran","Sergeant","Captain"];
  $("xp").textContent=xp;$("level").textContent=level;$("xpNext").textContent=within===0&&xp>0?100:100-within;
  $("xpFill").style.width=within+"%";
  $("rankName").textContent=ranks[Math.min(level-1,ranks.length-1)];
  $("tasksDone").textContent=state.completedTasks.length;
  $("daysDone").textContent=COURSE.filter(d=>dayDone(d.day)).length;
  const total=COURSE.reduce((a,d)=>a+d.practice.length,0);
  $("percent").textContent=Math.round(state.completedTasks.length/total*100)+"%";
}

function loadJournal(){
  const j=state.journal[state.selectedDay]||{};
  ["bestThing","hardThing","nextThing","partnerNote"].forEach(id=>$(id).value=j[id]||"");
  renderPhoto();
}
function bindJournal(){
  ["bestThing","hardThing","nextThing","partnerNote"].forEach(id=>{
    $(id).addEventListener("input",()=>{
      state.journal[state.selectedDay] ||= {};
      state.journal[state.selectedDay][id]=$(id).value;
      localStorage.setItem("wpa-state",JSON.stringify(state));
      renderBadges();
    });
  });
}
function renderPhoto(){
  const img=state.photos[state.selectedDay];
  $("photoPreview").innerHTML=img?`<img src="${img}" alt="今日作品照片">`:"";
}
$("photoInput").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const max=800, scale=Math.min(1,max/Math.max(img.width,img.height));
      const c=document.createElement("canvas"); c.width=img.width*scale;c.height=img.height*scale;
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      state.photos[state.selectedDay]=c.toDataURL("image/jpeg",.72);
      try{save();renderPhoto();showToast("PHOTO SAVED");}
      catch(err){alert("照片太大，浏览器本地存储空间不足。请选择更小的图片。");}
    }; img.src=ev.target.result;
  }; reader.readAsDataURL(file);
});

$("daySelect").addEventListener("change",e=>{state.selectedDay=+e.target.value;save();render();});
$("resetBtn").addEventListener("click",()=>{
  if(confirm("确定要清空所有进度和反馈吗？")){localStorage.removeItem("wpa-state");location.reload();}
});
bindJournal();

function render(){
  renderDaySelect();renderMission();renderSkills();renderBadges();updateDashboard();loadJournal();
}
render();
