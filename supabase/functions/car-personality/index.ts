// Car Personality Reader proxy. Key is the OPENAI_API_KEY Edge Function secret. Hard cutoff below.
const CUTOFF = Date.parse('2026-10-28T19:35:00Z');
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST,OPTIONS'};
const IP_CAP=5, ALL_CAP=150, MAX=1_500_000;
const SB=Deno.env.get('SUPABASE_URL')!, SR=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const rpc=async(fn:string,body:unknown)=>{const r=await fetch(`${SB}/rest/v1/rpc/${fn}`,{method:'POST',headers:{apikey:SR,Authorization:'Bearer '+SR,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('rpc');return r.json()};
const J=(o:unknown,s=200)=>Response.json(o,{status:s,headers:CORS});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
 if(Date.now()>=CUTOFF)return J({error:'demo ended'},410);
 if(req.method!=='POST')return J({error:'method'},405);
 const len=+(req.headers.get('content-length')||0);if(len>MAX)return J({error:'too big'},413);
 const {image}=await req.json().catch(()=>({}));
 if(typeof image!=='string'||!/^data:image\/(jpeg|png|webp);base64,/.test(image)||image.length>MAX)return J({error:'bad image'},400);
 const ip=(req.headers.get('x-forwarded-for')||'?').split(',')[0].trim();
 try{const c=await rpc('cpr_hit',{ip});if(c.ip>IP_CAP||c.all>ALL_CAP)return J({error:'daily limit'},429)}catch{return J({error:'limit check'},503)}
 const key=Deno.env.get('OPENAI_API_KEY')||'';
 if(!key)return J({error:'not configured'},503);
 const prompt=`Identify the car in this photo (make, model, rough year, colour) and write a light, friendly, client-safe "car horoscope" a car salesperson could read aloud to a customer. Gentle humour only; never insult the car, owner, or anyone. If no car is visible, playfully invent one. Reply ONLY with JSON: {"car":"Make Model (~year)","color":"colour","vibe":"2-4 word vibe","sign":"one of the 12 western zodiac signs","traits":["3 short fun personality traits"],"idealOwner":"one sentence","luckyNumber":integer 1-99,"closingLine":"one cheesy salesperson closing line"}`;
 const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
  body:JSON.stringify({model:'gpt-4o-mini',response_format:{type:'json_object'},max_tokens:400,temperature:1,messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image,detail:'low'}}]}]})});
 if(!r.ok)return J({error:'ai failed'},502);
 try{const o=JSON.parse((await r.json()).choices[0].message.content);if(!o.sign||!Array.isArray(o.traits))throw 0;return J(o)}catch{return J({error:'parse'},502)}
});
