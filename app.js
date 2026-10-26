const CUTOFF=Date.parse('2026-10-28T19:35:00Z');
if(Date.now()>=CUTOFF){document.querySelector('main').innerHTML='<header><div class="stars">✦ ✧ ✦</div><h1>Car Personality Reader</h1></header><section class="card center"><div style="font-size:64px">🚗💫</div><h2>This demo has ended</h2><p class="hint">Thanks for playing! The stars have parked for now.</p></section><footer>Made with AI for fun</footer>';throw new Error('ended')}
const AI_URL='https://sfucyzoivepphqwimatg.supabase.co/functions/v1/car-personality';
const MAKES=['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','Genesis','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Mini','Mitsubishi','Nissan','Porsche','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other / Mystery'];
const TYPES=['Sedan','SUV','Truck','Coupe','Minivan','EV','Sports car'];
const $=s=>document.querySelector(s);let img=null,dataUrl=null,type='SUV';
const show=id=>['s-photo','s-pick','s-load','s-result'].forEach(s=>$('#'+s).hidden=s!==id);
$('#make').innerHTML=MAKES.map(m=>`<option>${m}</option>`).join('');$('#make').value='Toyota';
$('#types').innerHTML=TYPES.map(t=>`<button type="button" class="${t===type?'on':''}">${t}</button>`).join('');
$('#types').onclick=e=>{if(e.target.tagName!=='BUTTON')return;type=e.target.textContent;[...$('#types').children].forEach(b=>b.classList.toggle('on',b===e.target))};

$('#file').onchange=async e=>{const f=e.target.files[0];if(!f)return;
 const u=URL.createObjectURL(f);const i=new Image();i.onload=()=>{const s=Math.min(1,1024/Math.max(i.width,i.height));
  const c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);
  dataUrl=c.toDataURL('image/jpeg',.82);img=new Image();img.src=dataUrl;$('#preview').src=dataUrl;$('#preview').hidden=false;$('#dropTxt').hidden=true;$('#btnRead').disabled=false};i.src=u};

const LINES=['Reading tire tread for hidden feelings…','Consulting the cupholder constellations…','Aligning the chakras (and the wheels)…','Decoding the headlight gaze…','Calculating horsepower of the soul…'];
async function aura(ms){show('s-load');let k=0;const t=setInterval(()=>$('#loadTxt').textContent=LINES[k++%LINES.length],700);await new Promise(r=>setTimeout(r,ms));clearInterval(t)}

$('#btnRead').onclick=async()=>{show('s-load');$('#loadTxt').textContent='Analyzing your car\'s aura…';
 const t0=Date.now();let ai=null;
 try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),20000);
  const r=await fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:dataUrl}),signal:ctl.signal});
  if(r.ok){const j=await r.json();if(j&&j.sign&&Array.isArray(j.traits)){ai=j;ai.car=[j.color,j.car].filter(Boolean).join(' ')||'Mystery Car';ai.vibe=j.vibe||'Pure charisma';ai.idealOwner=j.idealOwner||'Someone with great taste';ai.luckyNumber=j.luckyNumber||7;ai.closingLine=j.closingLine||'The stars say: test drive.'}}}catch(e){}
 if(ai){await aura(Math.max(0,2500-(Date.now()-t0)));render(ai);}
 else{show('s-pick');$('#pickHint').textContent='The stars are a little cloudy right now. Tell us about this beauty:'}};
$('#btnPick').onclick=async()=>{await aura(3200);render(horoscope($('#make').value,type))};
$('#btnAgain').onclick=()=>{$('#file').value='';$('#preview').hidden=true;$('#dropTxt').hidden=false;$('#btnRead').disabled=true;show('s-photo')};

// seeded templates
function rng(seed){let h=1779033703^seed.length;for(const ch of seed){h=Math.imul(h^ch.charCodeAt(0),3432918353);h=h<<13|h>>>19}
 return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const SIGNS=[['Aries','♈'],['Taurus','♉'],['Gemini','♊'],['Cancer','♋'],['Leo','♌'],['Virgo','♍'],['Libra','♎'],['Scorpio','♏'],['Sagittarius','♐'],['Capricorn','♑'],['Aquarius','♒'],['Pisces','♓']];
const TRAITS={Sedan:['Dependable to a fault','Secretly loves a road trip','Always knows where the good parking is','Smooth operator','Remembers everyone\'s birthday'],
SUV:['Natural-born adventurer','Has room for everyone\'s feelings (and hockey bags)','Fearless in a snowbank','Protective of its people','Thrives on weekend plans'],
Truck:['Will help you move. Twice.','Strong, silent, reliable','Hauls its weight and yours','Owns at least one flannel','Unbothered by mud'],
Coupe:['Effortlessly stylish','Two doors, zero regrets','Turns heads in grocery store lots','Fond of scenic routes','Mysterious charm'],
Minivan:['Unsung hero of the family','Sliding doors, open heart','Snack-finding sixth sense','Calm in the chaos','Carpool royalty'],
EV:['Quietly brilliant','Lives in the future, visits the present','Charged with good vibes','Eco-conscious overachiever','Silent but thrilling'],
'Sports car':['Main-character energy','Does not believe in slow lanes','Lives for the open road','Confident, charming, a little dramatic','Makes Mondays feel like Fridays']};
const SHARED=['Excellent listener at red lights','Optimistic about gas prices','Has strong opinions about playlists','Born to be admired','Loyal like a golden retriever'];
const OWNERS=['Someone who waves at other drivers who let them merge','A weekend-cottage dreamer with a great snack game','A person who names their cars (this one is definitely a “Steve”)','The friend everyone calls when they need a ride to the airport','Someone with big plans and a good sense of humour','A coffee-in-the-cupholder, sunglasses-on kind of soul','A future legend of the family road trip'];
const CLOSERS=['The stars have spoken: this car is meant for you. Shall we do the paperwork?','Mercury isn\'t in retrograde, but this deal might be. Let\'s talk!','I\'m no astrologer, but I can see a test drive in your future.','This car already likes you. Honestly, that\'s rare.','Your horoscope says “new chapter.” Your car says “let\'s roll.”','The universe gave you a sign. I\'m just the guy holding the keys.','Good news: the stars approve financing of the heart.'];
const VIBES=['Sunday-drive serenity','Main-character energy','Cozy-but-capable','Adventure on standby','Quiet confidence','Road-trip royalty'];
function horoscope(make,type){const r=rng(make+type+Date.now()%100000),p=a=>a.splice(Math.floor(r()*a.length),1)[0];
 const s=SIGNS[Math.floor(r()*12)],t=[...TRAITS[type]||TRAITS.Sedan],sh=[...SHARED];
 return{car:`${make==='Other / Mystery'?'Mystery':make} ${type}`,vibe:p([...VIBES]),sign:s[0],symbol:s[1],traits:[p(t),p(t),p(sh)],idealOwner:p([...OWNERS]),luckyNumber:1+Math.floor(r()*99),closingLine:p([...CLOSERS])}}

function wrap(x,text,X,Y,w,lh){const ws=text.split(' ');let l='';for(const wd of ws){if(x.measureText(l+wd).width>w&&l){x.fillText(l,X,Y);Y+=lh;l=''}l+=wd+' '}x.fillText(l,X,Y);return Y+lh}
function render(h){const c=$('#cv'),x=c.getContext('2d'),W=1080;
 const sym=h.symbol||(SIGNS.find(s=>s[0]===h.sign)||['','✦'])[1];
 const g=x.createLinearGradient(0,0,W,1620);g.addColorStop(0,'#2a1660');g.addColorStop(1,'#6a1f5a');x.fillStyle=g;x.fillRect(0,0,W,1620);
 for(let i=0;i<90;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.6})`;x.beginPath();x.arc(Math.random()*W,Math.random()*1620,Math.random()*2.5,0,7);x.fill()}
 x.save();x.beginPath();x.roundRect(60,60,960,620,36);x.clip();const s=Math.max(960/img.width,620/img.height);
 x.drawImage(img,60+(960-img.width*s)/2,60+(620-img.height*s)/2,img.width*s,img.height*s);x.restore();
 x.textAlign='center';x.fillStyle='#ffd166';x.font='bold 40px system-ui';x.fillText('✦ CAR HOROSCOPE ✦',W/2,760);
 x.fillStyle='#fff';let fs=64;do{x.font=`bold ${fs}px system-ui`;fs-=2}while(x.measureText(h.car).width>960&&fs>30);x.fillText(h.car,W/2,840);
 x.font='italic 36px system-ui';x.fillStyle='#ffb3d4';x.fillText('Vibe: '+h.vibe,W/2,895);
 x.font='bold 54px system-ui';x.fillStyle='#ffd166';x.fillText(`${sym} ${h.sign}  ·  Lucky #${h.luckyNumber}`,W/2,985);
 x.textAlign='left';x.fillStyle='#fff';x.font='36px system-ui';let y=1065;
 for(const t of h.traits.slice(0,3)){y=wrap(x,'✧ '+t,110,y,860,46)}
 x.fillStyle='#ffd166';x.font='bold 34px system-ui';x.fillText('IDEAL OWNER',110,y+20);x.fillStyle='#fff';x.font='34px system-ui';y=wrap(x,h.idealOwner,110,y+66,860,44);
 x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.roundRect(80,y+10,920,170,28);x.fill();
 x.textAlign='center';x.fillStyle='#fff';x.font='italic bold 36px system-ui';wrap(x,'“'+h.closingLine+'”',W/2,y+75,840,46);
 x.font='26px system-ui';x.fillStyle='rgba(255,255,255,.6)';x.fillText('Made with AI for fun',W/2,1585);show('s-result')}

const blob=()=>new Promise(r=>$('#cv').toBlob(r,'image/png'));
$('#btnSave').onclick=async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(await blob());a.download='car-horoscope.png';a.click()};
$('#btnShare').onclick=async()=>{const f=new File([await blob()],'car-horoscope.png',{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'My car\'s horoscope'})}catch(e){}}else $('#btnSave').click()};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
