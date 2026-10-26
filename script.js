const phrases=[
 {text:'carve a pumpkin',verb:'carve',img:'carve.png',alt:'A woman carving a pumpkin'},
 {text:'wear a costume',verb:'wear',img:'costume.png',alt:'A woman admiring her witch costume'},
 {text:'dress up as a witch',verb:'dress up',img:'witch.png',alt:'A woman dressed as a witch with a broom'},
 {text:'see a ghost',verb:'see',img:'ghost.png',alt:'A surprised witch seeing a friendly ghost'},
 {text:'visit a haunted house',verb:'visit',img:'haunted-house.png',alt:'A visitor entering a haunted house'},
 {text:'watch a horror film',verb:'watch',img:'horror-film.png',alt:'A woman watching a scary film'},
 {text:'tell a scary story',verb:'tell',img:'scary-story.png',alt:'Friends listening to a scary story'},
 {text:'go trick-or-treating',verb:'go',img:'trick-or-treat.png',alt:'Children going trick-or-treating'},
 {text:'decorate a house',verb:'decorate',img:'decorate.png',alt:'A woman decorating a house for Halloween'},
 {text:'go to a Halloween party',verb:'go',img:'party-guests.png',alt:'Costumed friends going to a Halloween party'},
 {text:'eat Halloween sweets',verb:'eat',img:'sweets.png',alt:'A witch eating Halloween sweets'},
 {text:'make a Halloween lantern',verb:'make',img:'lantern.png',alt:'A woman making a pumpkin lantern'}
];
const verbs=[['carve','carved','carved'],['wear','wore','worn'],['dress up','dressed up','dressed up'],['see','saw','seen'],['visit','visited','visited'],['watch','watched','watched'],['tell','told','told'],['go','went','gone'],['eat','ate','eaten'],['make','made','made']];
const state={phrase:0,experiences:{},plan:[],sound:true};
const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900)}
function ping(freq=500,dur=.045){if(!state.sound)return;try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+dur);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch(e){}}

const phraseImage=$('#phraseImage'),phraseText=$('#phraseText'),phraseAnswer=$('#phraseAnswer');
function renderPhrase(){const p=phrases[state.phrase],card=$('#phraseCard');card.classList.add('is-changing');setTimeout(()=>{phraseImage.src='assets/'+p.img;phraseImage.alt=p.alt;phraseText.textContent=p.text;$('#verbChip').textContent=p.verb;$('#phraseCount').textContent=String(state.phrase+1).padStart(2,'0')+' / 12';phraseAnswer.classList.remove('show');$('#revealPhrase').style.display='block';$$('#phraseDots button').forEach((d,i)=>d.classList.toggle('active',i===state.phrase));card.classList.remove('is-changing')},180)}
phrases.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Show phrase '+(i+1));b.onclick=()=>{state.phrase=i;renderPhrase()};$('#phraseDots').append(b)});renderPhrase();
$('#prevPhrase').onclick=()=>{state.phrase=(state.phrase+phrases.length-1)%phrases.length;renderPhrase();ping(390)};
$('#nextPhrase').onclick=()=>{state.phrase=(state.phrase+1)%phrases.length;renderPhrase();ping(540)};
$('#revealPhrase').onclick=()=>{phraseAnswer.classList.add('show');$('#revealPhrase').style.display='none';ping(660)};
$('#speakPhrase').onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(phrases[state.phrase].text);u.lang='en-GB';u.rate=.82;speechSynthesis.speak(u)};
$('#soundToggle').onclick=e=>{state.sound=!state.sound;e.currentTarget.textContent=state.sound?'Sound on':'Sound off';e.currentTarget.setAttribute('aria-pressed',String(state.sound));};

verbs.forEach(([base,past,part],i)=>{$('#verbLab').insertAdjacentHTML('beforeend',`<label class="verb-row"><strong>${base}</strong><span>${past}</span><input data-answer="${part}" aria-label="Past participle of ${base}" placeholder="past participle"></label>`)});
$('#checkVerbs').onclick=()=>{let score=0;$$('#verbLab input').forEach(i=>{const ok=i.value.trim().toLowerCase()===i.dataset.answer;i.classList.toggle('correct',ok);i.classList.toggle('incorrect',!ok);if(ok)score++});$('#verbFeedback').textContent=score===verbs.length?'Perfect spell! 10 / 10 ✨':`${score} / ${verbs.length} correct — look again at the glowing boxes.`;ping(score===verbs.length?760:260)};
$('#resetVerbs').onclick=()=>{$$('#verbLab input').forEach(i=>{i.value='';i.className=''});$('#verbFeedback').textContent=''};

const formulas=[['Affirmative','I / You / We / They','have'],['Affirmative','He / She','has'],['Negative','I / You / We / They',"haven’t"],['Negative','He / She',"hasn’t"],['Question','I / you / we / they','Have'],['Question','he / she','Has']];
formulas.forEach(([type,subject,answer])=>$('#formulaGrid').insertAdjacentHTML('beforeend',`<div class="formula-row"><span>${type}</span><div class="formula-sentence">${type==='Question'?'':' '+subject+' '}<select data-answer="${answer}" aria-label="Choose auxiliary"><option value=""></option><option>have</option><option>has</option><option>haven’t</option><option>hasn’t</option><option>Have</option><option>Has</option></select>${type==='Question'?' '+subject:''} + past participle${type==='Question'?'?':'.'}</div></div>`));
$('#checkFormula').onclick=()=>{let n=0;$$('#formulaGrid select').forEach(s=>{const ok=s.value===s.dataset.answer;s.parentElement.classList.toggle('correct',ok);s.parentElement.classList.toggle('incorrect',!ok);if(ok)n++});$('#formulaFeedback').textContent=n===6?'You rebuilt the whole formula! ✦':`${n} / 6 correct. Check the subject and sentence type.`;ping(n===6?760:260)};

const matches=[['Anna has worn a Halloween costume.','happened'],["Anna hasn’t visited a haunted house.",'not'],['Has Anna ever carved a pumpkin?','ask']];
const matchLabels={happened:'It has happened',not:"It hasn’t happened",ask:'Ask about experience'};
matches.forEach(([sentence,answer],i)=>{$('#matchList').insertAdjacentHTML('beforeend',`<div class="match-item" data-answer="${answer}"><p>${sentence}</p><div class="match-options">${Object.entries(matchLabels).map(([v,l])=>`<button data-value="${v}">${l}</button>`).join('')}</div></div>`)});
$('#matchList').onclick=e=>{if(!e.target.matches('button'))return;$$('button',e.target.parentElement).forEach(b=>b.classList.remove('selected'));e.target.classList.add('selected');ping(520)};
$('#checkMeaning').onclick=()=>{let n=0;$$('.match-item').forEach(item=>{const v=$('.selected',item)?.dataset.value,ok=v===item.dataset.answer;item.classList.toggle('correct',ok);item.classList.toggle('incorrect',!ok);if(ok)n++});$('#meaningFeedback').textContent=n===3?'Exactly right — meaning mastered!':'Check the sentence shape: affirmative, negative, or question.';ping(n===3?760:260)};

const experienceItems=[0,1,5,4,6,9,8,7,11,2];
function sentenceFor(p,stateName){const part={carve:'carved',wear:'worn',watch:'watched',visit:'visited',tell:'told',go:'gone',decorate:'decorated',make:'made','dress up':'dressed up'}[p.verb];if(stateName==='done')return `I have ${part} ${p.text.slice(p.verb.length).trim()}.`;if(stateName==='not')return `I haven’t ${part} ${p.text.slice(p.verb.length).trim()}.`;return `I haven’t ${part} ${p.text.slice(p.verb.length).trim()}, but I would like to do it.`}
experienceItems.forEach(idx=>{const p=phrases[idx];$('#experienceGrid').insertAdjacentHTML('beforeend',`<article class="experience-card" data-index="${idx}"><img class="experience-thumb" src="assets/${p.img}" alt=""><div class="experience-main"><h3>${p.text}</h3><div class="state-buttons"><button class="state-button" data-state="done" aria-label="I have done it">✅</button><button class="state-button" data-state="not" aria-label="I have not done it">❌</button><button class="state-button" data-state="want" aria-label="I would like to do it">👀</button></div><p class="generated-sentence">Choose your answer.</p><input class="detail-input" placeholder="Add a Past Simple detail…" aria-label="Past Simple detail" hidden></div></article>`)});
function updateStory(){const cards=$$('.experience-card'),sentences=[];cards.forEach(c=>{const s=state.experiences[c.dataset.index];if(s){let line=sentenceFor(phrases[c.dataset.index],s),detail=$('.detail-input',c).value.trim();if(detail)line+=' '+detail;sentences.push(line)}});$('#storyOutput').textContent=sentences.length?sentences.join('\n'):'Your sentences will appear here.';$('#boardHeadline').textContent=sentences.length?`You have described ${sentences.length} experience${sentences.length===1?'':'s'}.`:'Choose a few cards to begin.'}
$('#experienceGrid').onclick=e=>{if(!e.target.matches('.state-button'))return;const c=e.target.closest('.experience-card'),s=e.target.dataset.state;state.experiences[c.dataset.index]=s;$$('.state-button',c).forEach(b=>b.classList.toggle('active',b===e.target));$('.generated-sentence',c).textContent=sentenceFor(phrases[c.dataset.index],s);$('.detail-input',c).hidden=s!=='done';updateStory();ping(550)};
$('#experienceGrid').addEventListener('input',updateStory);$('#copyStory').onclick=()=>copyText($('#storyOutput').textContent,'Experience story copied!');

const messages=[
 ['mia','We need ideas!','<select data-a="Have"><option value=""></option><option>Have</option><option>Has</option><option>Did</option></select> you ever <select data-a="organised"><option value=""></option><option>organise</option><option>organised</option><option>organising</option></select> a Halloween party?'],
 ['leo','Not yet…','No, I <select data-a="haven’t"><option value=""></option><option>haven’t</option><option>hasn’t</option><option>didn’t</option></select>, but I <select data-a="have been"><option value=""></option><option>have been</option><option>was</option><option>has been</option></select> to many Halloween parties.'],
 ['mia','Pumpkins?','<select data-a="Have"><option value=""></option><option>Have</option><option>Has</option></select> you ever <select data-a="carved"><option value=""></option><option>carve</option><option>carved</option></select> a pumpkin?'],
 ['leo','Yes!','Yes, I <select data-a="have"><option value=""></option><option>have</option><option>has</option></select>. I carved one with my brother last year.'],
 ['mia','Hard work','I <select data-a="have"><option value=""></option><option>have</option><option>has</option></select> never <select data-a="made"><option value=""></option><option>make</option><option>made</option></select> one.'],
 ['leo','Decorations','<select data-a="Has"><option value=""></option><option>Have</option><option>Has</option></select> Anna <select data-a="decorated"><option value=""></option><option>decorate</option><option>decorated</option></select> the room?'],
 ['mia','Costumes','No, she <select data-a="hasn’t"><option value=""></option><option>haven’t</option><option>hasn’t</option></select>. I <select data-a="have chosen"><option value=""></option><option>have chosen</option><option>has chose</option></select> mine, but Tom <select data-a="hasn’t chosen"><option value=""></option><option>haven’t chosen</option><option>hasn’t chosen</option></select> his.'],
 ['leo','Vampire?','<select data-a="Has"><option value=""></option><option>Have</option><option>Has</option></select> he ever <select data-a="dressed"><option value=""></option><option>dress</option><option>dressed</option></select> up as a vampire?'],
 ['mia','No fangs','No, he <select data-a="hasn’t"><option value=""></option><option>haven’t</option><option>hasn’t</option></select>.'],
 ['mia','Film night','We <select data-a="have"><option value=""></option><option>have</option><option>has</option></select> not <select data-a="chosen"><option value=""></option><option>chose</option><option>chosen</option></select> one. <select data-a="Have"><option value=""></option><option>Have</option><option>Has</option></select> you ever <select data-a="seen"><option value=""></option><option>saw</option><option>seen</option></select> a really scary film?'],
 ['leo','Too scary!','Yes, I <select data-a="have"><option value=""></option><option>have</option><option>has</option></select>. I watched one last weekend!']
];
messages.forEach(([who,label,text])=>$('#dialogueMessages').insertAdjacentHTML('beforeend',`<div class="message ${who}"><b>${who==='mia'?'MIA · ':'LEO · '}${label}</b>${text}</div>`));
$('#checkDialogue').onclick=()=>{let n=0,total=0;$$('#dialogueMessages .message').forEach(m=>{let all=true;$$('select',m).forEach(s=>{total++;const ok=s.value===s.dataset.a;if(ok)n++;else all=false});m.classList.toggle('correct',all);m.classList.toggle('incorrect',!all)});$('#dialogueFeedback').textContent=n===total?`All ${total} gaps are correct — Leo is the expert!`:`${n} / ${total} correct. Green messages are complete.`;ping(n===total?760:260)};

const repairs=[
 ['Leo have found some decorations.','Leo has found some decorations.','Leo have found some decorations.'],
 ['I has chosen my costume.','I have chosen my costume.','I chose have my costume.'],
 ["Tom haven’t chosen his costume.","Tom hasn’t chosen his costume.","Tom not has chosen his costume."],
 ['Have he ever dressed up as a vampire?','Has he ever dressed up as a vampire?','He has ever dressed up as a vampire?'],
 ["He hasn’t never done that.","He has never done that.","He hasn’t ever never done that."],
 ['We have saw several horror films.','We have seen several horror films.','We has seen several horror films.'],
 ['Last night, I have bought some sweets.','Last night, I bought some sweets.','Last night, I have buy some sweets.']
];
repairs.forEach((r,i)=>{const opts=[r[1],r[2]].sort(()=>Math.random()-.5);$('#repairGrid').insertAdjacentHTML('beforeend',`<article class="repair-card" data-answer="${r[1].replaceAll('"','&quot;')}"><p>${r[0]}</p>${opts.map(o=>`<label><input type="radio" name="repair${i}" value="${o.replaceAll('"','&quot;')}"> ${o}</label>`).join('')}</article>`)});
$('#checkRepair').onclick=()=>{let n=0;$$('.repair-card').forEach(c=>{const ok=$('input:checked',c)?.value===c.dataset.answer;c.classList.toggle('correct',ok);c.classList.toggle('incorrect',!ok);if(ok)n++});$('#repairFeedback').textContent=n===repairs.length?'No gremlins left — excellent editing!':`${n} / ${repairs.length} repaired. Look at the red cards again.`;ping(n===repairs.length?760:260)};

const planIndexes=[0,1,5,6,8,11,10,4,9,7];
planIndexes.forEach(idx=>{const p=phrases[idx];$('#planGrid').insertAdjacentHTML('beforeend',`<button class="plan-card" data-index="${idx}"><span>${p.text}</span><img src="assets/${p.img}" alt=""></button>`)});
function updatePlan(){const c=state.plan.length;$('#choiceCount').textContent=`${c} / 5`;$$('.plan-card').forEach(b=>b.classList.toggle('selected',state.plan.includes(+b.dataset.index)));if(c===5){$('#missionTitle').textContent='Your five-activity night is ready!';$('#missionList').innerHTML=state.plan.map(i=>`<li><strong>${phrases[i].text}</strong> — Have you ever ${phrases[i].text}?</li>`).join('');$('#copyPlan').disabled=false}else{$('#missionTitle').textContent=`Choose ${5-c} more activit${5-c===1?'y':'ies'} to unlock your plan.`;$('#missionList').innerHTML='';$('#copyPlan').disabled=true}}
$('#planGrid').onclick=e=>{const b=e.target.closest('.plan-card');if(!b)return;const i=+b.dataset.index,pos=state.plan.indexOf(i);if(pos>=0)state.plan.splice(pos,1);else if(state.plan.length<5)state.plan.push(i);else{b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),300);toast('Five activities maximum!');return}updatePlan();ping(560)};updatePlan();
$('#copyPlan').onclick=()=>copyText(state.plan.map(i=>`Have you ever ${phrases[i].text}? Why should we include it?`).join('\n'),'Speaking prompts copied!');

const exits=['one activity you have done','one activity you have never done','one experience a friend has had','one Present Perfect question','one Past Simple detail'];
exits.forEach((t,i)=>$('#exitDoors').insertAdjacentHTML('beforeend',`<button class="door"><span>${i+1}</span><p>Say ${t}.</p></button>`));
$('#exitDoors').onclick=e=>{const d=e.target.closest('.door');if(!d)return;d.classList.toggle('done');const done=$$('.door.done').length;$('#exitFinish').classList.toggle('show',done===5);if(done===5){ping(820,.12);markStep(5,'Mission complete')}};
$('#restartLesson').onclick=()=>{localStorage.removeItem('halloweenProgressV2');location.reload()};
function copyText(text,msg){navigator.clipboard?.writeText(text).then(()=>toast(msg)).catch(()=>toast('Select and copy the text manually.'))}

const sections=$$('[data-step]');function markStep(step,label){const p=Math.max(step,+localStorage.getItem('halloweenProgressV2')||0);localStorage.setItem('halloweenProgressV2',p);$('#progressFill').style.width=(p/5*100)+'%';$('#progressCount').textContent=p+' / 5';$('#progressLabel').textContent=label||['Welcome','Language','Grammar','Meaning','My experience','Mission'][p]}
markStep(+localStorage.getItem('halloweenProgressV2')||0);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');const s=e.target.closest('[data-step]');if(s)markStep(+s.dataset.step)}}),{threshold:.16});$$('.reveal').forEach(el=>observer.observe(el));
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&document.activeElement.tagName==='BODY')$('#nextPhrase').click();if(e.key==='ArrowLeft'&&document.activeElement.tagName==='BODY')$('#prevPhrase').click()});
