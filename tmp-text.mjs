import fs from 'fs';
let h=fs.readFileSync(process.argv[2],'utf8');
h=h.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<svg[\s\S]*?<\/svg>/g,' ');
const out=[];
for(const m of h.matchAll(/>([^<>]+)</g)){
  const t=m[1].replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&[a-z]+;/g,' ').trim();
  if(t.length>1) out.push(t);
}
console.log([...new Set(out)].join('\n'));
