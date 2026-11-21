(() => {
  'use strict';
  const TZ = 'Asia/Jakarta';
  const RELEASES = [
    '2026-11-22T00:00:00+07:00',
    '2026-11-22T10:00:00+07:00',
    '2026-11-22T13:00:00+07:00',
    '2026-11-22T17:00:00+07:00',
    '2026-11-22T22:00:00+07:00'
  ].map(x => new Date(x));
  const CHAPTERS = ['The Birthday Letter','The Rose Quest',"The Prince's Ride",'The Movie Date','The Final Chapter'];
  const KEY = 'birthdayQuest2026';
  const app = document.getElementById('app');
  const clock = document.getElementById('clock');
  const music = document.getElementById('music');
  let state = readState();
  let current = getDefaultChapter();
  let countdownTimer = null;

  function readState(){
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (!raw || !Array.isArray(raw.visited) || !Array.isArray(raw.completed)) throw new Error('invalid save');
      return { visited:[...new Set(raw.visited.filter(n=>Number.isInteger(n)&&n>=0&&n<5))], completed:[...new Set(raw.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<4))], music:false };
    } catch { return {visited:[],completed:[],music:false}; }
  }
  function save(){ try{localStorage.setItem(KEY,JSON.stringify(state));}catch{} }
  const now = () => new Date();
  const released = i => now() >= RELEASES[i];
  function prerequisiteMet(i){return i===0 || state.completed.includes(i-1);}
  function canOpen(i){return i>=0&&i<5&&released(i)&&prerequisiteMet(i);}
  function getDefaultChapter(){
    for(let i=4;i>=0;i--) if(canOpen(i)&&!state.completed.includes(i)) return i;
    for(let i=4;i>=0;i--) if(canOpen(i)) return i;
    return 0;
  }
  const hasVisited = i => state.visited.includes(i);
  function remember(i){if(!hasVisited(i)){state.visited.push(i);state.visited.sort((a,b)=>a-b);save();}}
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function clockLabel(){return now().toLocaleString('en-GB',{timeZone:TZ,day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',',' ·').toUpperCase()+' WIB';}
  function releaseLabel(i){return RELEASES[i].toLocaleString('en-GB',{timeZone:TZ,day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',',' ·')+' WIB';}
  function chapterIndex(){return `<nav class="index" aria-label="Chapter navigation">${state.visited.filter(i=>canOpen(i)).map(i=>`<button class="chapter-chip ${i===current?'active':''}" data-chapter="${i}" ${i===current?'aria-current="page"':''}>${String(i+1).padStart(2,'0')} · ${CHAPTERS[i]}</button>`).join('')}</nav>`;}
  function renderShell(content){
    if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}
    app.innerHTML=`<section class="panel">${chapterIndex()}<div class="page-transition">${content}</div></section>`;
    app.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.chapter))));
  }
  function navigate(i){if(!canOpen(i)){renderLocked(i);return;}current=i;remember(i);render();window.scrollTo({top:0,behavior:'smooth'});}
  function footerProgress(){return `<div class="progress-note">CHAPTER ${current+1} / 5 <span>·</span> ${state.completed.length} QUESTS CLEARED</div>`;}
  function button(label, id='next'){return `<button class="btn" id="${id}">${label}</button>`;}
  function renderLocked(i){current=i;const next=RELEASES[i];renderShell(`<section class="locked"><div class="lockmark">✧</div><div class="eyebrow">QUEST NOT READY</div><h1 class="title">${safe(CHAPTERS[i]||'Unknown Chapter')}</h1><p class="subtitle center">${i>0&&!state.completed.includes(i-1)?'The previous quest must be completed before this chapter can be accessed.':'A new chapter is waiting to unfold. Return when the time is right.'}</p><div class="countdown" id="countdown"></div><p class="smallnote">Scheduled release · ${releaseLabel(i)} · 22 NOV 2026</p><div class="btnrow">${button('RETURN TO YOUR QUEST','return')}</div></section>`);
    const tick=()=>{const el=document.getElementById('countdown');if(!el)return;let ms=next-now();if(ms<=0){el.textContent='TIME GATE OPEN';return;}const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);el.textContent=`${d?d+'d · ':''}${String(h).padStart(2,'0')} : ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}`;};tick();countdownTimer=setInterval(tick,1000);document.getElementById('return')?.addEventListener('click',()=>navigate(getDefaultChapter()));}
  function render(){if(!canOpen(current)){renderLocked(current);return;}remember(current);switch(current){case 0:home();break;case 1:rose();break;case 2:ride();break;case 3:movie();break;case 4:finale();break;}}
  function home(){renderShell(`<section class="hero center"><div class="eyebrow">22 NOVEMBER 2026 · A DAY MADE FOR YOU</div><h1 class="title">Happy Birthday</h1><p class="subtitle center">to the Prettiest Thing I've Ever Seen.</p><div class="ornament">✧ · ✦ · ✧</div><div class="gallery"><figure class="photo tall"><img src="assets/photos/photo1.jpg" alt="Birthday memory, photo one"></figure><figure class="photo"><img src="assets/photos/photo2.jpg" alt="Birthday memory, photo two"></figure><figure class="photo"><img src="assets/photos/photo3.jpg" alt="Birthday memory, photo three"></figure></div><p class="letter">Happy birthday to the Prettiest Thing I've Ever Seen. I hope this next chapter brings you endless joy, bold career breakthroughs, and the courage and blessings to turn every quiet dream into reality</p><div class="music-card"><div class="music-copy"><span class="music-icon">♫</span><div><strong>LANY</strong><small>Prettiest Thing I've Ever Seen</small></div></div><button class="music-button" id="musicToggle" aria-label="Play birthday soundtrack">▶ PLAY SONG</button><p class="smallnote">Add your legally obtained song file as <code>assets/music.mp3</code> to enable playback.</p></div><div class="btnrow">${button('BEGIN THE QUEST →')}</div>${footerProgress()}</section>`);
    document.getElementById('next').addEventListener('click',()=>{state.completed=[...new Set([...state.completed,0])];save();navigate(1);});setupMusic();}
  function setupMusic(){const b=document.getElementById('musicToggle');if(!b)return;music.src='assets/music.mp3';music.volume=.45;let isPlaying=false;b.addEventListener('click',async()=>{if(!isPlaying){try{await music.play();isPlaying=true;b.textContent='Ⅱ PAUSE SONG';b.setAttribute('aria-label','Pause birthday soundtrack');}catch{b.textContent='SONG FILE NOT FOUND';}}else{music.pause();isPlaying=false;b.textContent='▶ PLAY SONG';b.setAttribute('aria-label','Play birthday soundtrack');}});music.addEventListener('ended',()=>{isPlaying=false;b.textContent='▶ PLAY SONG';});}
  function intro(title,roman,desc,question){return `<section class="hero center"><div class="eyebrow">MAIN QUEST · CHAPTER ${roman}</div><h1 class="title">${title}</h1><p class="subtitle center">${desc}</p><div class="questbox"><div class="eyebrow">QUEST OBJECTIVE</div><h2>${question}</h2><div class="divider"></div><p>Answer correctly to complete this quest and claim your reward.</p></div></section>`;}
  function runQuiz({title,roman,desc,question,answers,successTitle,successText,nextLabel,nextChapter,extra='',normalize=x=>x.toLowerCase().trim()}){
    renderShell(`${intro(title,roman,desc,question)}<form class="answerwrap" id="quiz"><label class="sr-only" for="answer">Your answer</label><input id="answer" autocomplete="off" placeholder="Type your answer…" aria-label="Quest answer" required><button class="btn" type="submit">SUBMIT</button></form><div class="feedback" id="feedback" role="status" aria-live="polite"></div><div id="reward"></div><div class="btnrow hidden" id="nextrow">${button(nextLabel,'next')}</div>${footerProgress()}`);
    const form=document.getElementById('quiz'),input=document.getElementById('answer'),feedback=document.getElementById('feedback'),reward=document.getElementById('reward');
    form.addEventListener('submit',e=>{e.preventDefault();if(answers.some(a=>normalize(a)===normalize(input.value))){state.completed=[...new Set([...state.completed,current])];save();feedback.textContent='';reward.innerHTML=`<section class="success center"><div class="eyebrow">QUEST COMPLETED · REWARD UNLOCKED</div><h2>${successTitle}</h2><p>${successText}</p>${extra}</section>`;document.getElementById('nextrow').classList.remove('hidden');input.disabled=true;form.querySelector('button').disabled=true;document.getElementById('next').addEventListener('click',()=>navigate(nextChapter));}else{feedback.textContent='Not quite, adventurer. Try again!';input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake');input.focus();}});
  }
  function rose(){runQuiz({title:'The Rose Quest',roman:'II',desc:'A little delivery has been sent to brighten your day. Before claiming the reward, solve this tiny mystery.',question:'How many roses are waiting for you?',answers:['5'],successTitle:'Five Roses, Just for You',successText:'Your flower reward has been claimed. I hope they bring a little extra beauty to your birthday.',nextLabel:'UNLOCK THE NEXT CHAPTER →',nextChapter:2});}
  function ride(){const extra=`<div class="mapcard center"><div class="eyebrow">DESTINATION REVEALED</div><h2>Pakuwon Mall Bekasi</h2><p>You must guide your prince there to claim your next reward.</p><a class="maplink" href="https://www.google.com/maps/search/?api=1&query=Pakuwon+Mall+Bekasi" target="_blank" rel="noopener">OPEN MAP ↗</a></div>`;runQuiz({title:"The Prince's Ride",roman:'III',desc:'Your prince is ready to pick you up. But first, identify the legendary ride that will carry him to you.',question:'What ride is your prince bringing to pick you up?',answers:['Yamaha XSR','XSR'],successTitle:'Destination Unlocked',successText:'Quest cleared. Your next destination has appeared on the map.',nextLabel:'CONTINUE TO CHAPTER IV →',nextChapter:3,extra,normalize:x=>x.toLowerCase().trim().replace(/[^a-z0-9]/g,'')});}
  function movie(){const extra=`<div class="mapcard center"><div class="eyebrow">DESTINATION REVEALED</div><h2>Movie Date Location</h2><p>Guide your prince there, then download your tickets below.</p><a class="maplink" href="https://share.google/keUJrW4ZXsBFLcMgq" target="_blank" rel="noopener">OPEN DESTINATION MAP ↗</a></div><div class="tickets"><article class="ticket"><img src="assets/tickets/ticket1.jpg" alt="Movie ticket one"><a href="assets/tickets/ticket1.jpg" download="Birthday-Quest-Ticket-01.jpg">DOWNLOAD TICKET 01 ↓</a></article><article class="ticket"><img src="assets/tickets/ticket2.jpg" alt="Movie ticket two"><a href="assets/tickets/ticket2.jpg" download="Birthday-Quest-Ticket-02.jpg">DOWNLOAD TICKET 02 ↓</a></article><article class="ticket"><img src="assets/tickets/ticket3.jpg" alt="Movie ticket three"><a href="assets/tickets/ticket3.jpg" download="Birthday-Quest-Ticket-03.jpg">DOWNLOAD TICKET 03 ↓</a></article></div>`;runQuiz({title:'The Movie Date',roman:'IV',desc:'A special screening awaits. One final riddle stands between you and the next reward.',question:'Which movie are we going to watch together?',answers:['The Hunger Game','The Hunger Games'],successTitle:'Movie Quest Completed',successText:'Your destination is ready, and your tickets are waiting to be downloaded.',nextLabel:'PROCEED TO FINAL CHAPTER →',nextChapter:4,extra,normalize:x=>x.toLowerCase().trim().replace(/[^a-z]/g,'')});}
  function finale(){renderShell(`<section class="hero center"><div class="finalstars">✦ ✧ ✦</div><div class="eyebrow">QUEST COMPLETE</div><h1 class="title">The Final Chapter</h1><p class="subtitle center">You made it to the end of today's adventure.</p><div class="success"><p class="letter">Thank you for taking the time to complete every little quest I made for you today.</p><p class="letter">I hope every surprise, every gift, and every little moment made you smile. More than anything, I hope you had a beautiful birthday and felt just how special you are.</p><p class="letter">You deserve happiness, love, beautiful opportunities, and a life filled with things you once only dreamed about.</p><p class="letter"><i>Happy birthday, my favorite person.</i></p></div><div class="review"><h2>Leave Your Quest Review</h2><p>Did you enjoy today's adventure?</p><p class="smallnote">Your feedback is always welcome, especially if it comes with a smile.</p><div class="finalstars">★★★★★</div><a class="maplink" href="https://wa.me/6282181809513?text=${encodeURIComponent('Hi, I just completed my birthday quest! Thank you for everything today. Here is my review: ')}" target="_blank" rel="noopener">SEND MY REVIEW VIA WHATSAPP ↗</a></div>${footerProgress()}</section>`);}
  function updateClock(){clock.textContent=clockLabel();}
  updateClock();setInterval(updateClock,30000);
  if(!canOpen(current))current=getDefaultChapter();
  render();
})();
