// NOT DEPLOYED YET. Needs secret OPENAI_API_KEY. Simple in-memory per-IP cap (resets on cold start).
const CORS={'Access-Control-Allow-Origin':'https://buddmathieson.github.io','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST,OPTIONS'};
const hits=new Map<string,{d:string,n:number}>();const CAP=10,MAX=1_500_000;
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
 if(req.method!=='POST')return new Response('Method not allowed',{status:405,headers:CORS});
 const ip=(req.headers.get('x-forwarded-for')||'?').split(',')[0].trim(),d=new Date().toISOString().slice(0,10);
 const h=hits.get(ip);if(h&&h.d===d&&h.n>=CAP)return Response.json({error:'daily limit'},{status:429,headers:CORS});
 hits.set(ip,{d,n:h&&h.d===d?h.n+1:1});
 const {image}=await req.json().catch(()=>({}));
 if(typeof image!=='string'||!image.startsWith('data:image/')||image.length>MAX)return Response.json({error:'bad image'},{status:400,headers:CORS});
 const key=Deno.env.get('OPENAI_API_KEY');if(!key)return Response.json({error:'not configured'},{status:503,headers:CORS});
 const prompt=`Identify the car in this photo and write a light, friendly, client-safe "car horoscope". Never insult anyone. If no car is visible, invent a playful one anyway. Return JSON: {"car":"Make Model (approx year)","vibe":"2-4 words","sign":"one of the 12 zodiac signs","traits":["3 short fun traits"],"idealOwner":"one sentence","luckyNumber":1-99,"closingLine":"cheesy salesperson closing line"}`;
 const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
  body:JSON.stringify({model:'gpt-4o-mini',response_format:{type:'json_object'},max_tokens:400,messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image,detail:'low'}}]}]})});
 if(!r.ok)return Response.json({error:'ai failed'},{status:502,headers:CORS});
 const j=await r.json();try{return Response.json(JSON.parse(j.choices[0].message.content),{headers:CORS})}catch{return Response.json({error:'parse'},{status:502,headers:CORS})}
});
