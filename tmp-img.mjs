import fs from 'fs'; import path from 'path';
const pages=[]; (function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name); if(e.isDirectory())w(p); else if(e.name.endsWith('.html'))pages.push(p);}})('out');
const rupte=new Map(); let total=0;
for(const f of pages){
  const h=fs.readFileSync(f,'utf8');
  const srcs=new Set();
  for(const m of h.matchAll(/src="([^"]+)"/g)) srcs.add(m[1]);
  for(const m of h.matchAll(/srcSet="([^"]+)"/g)) m[1].split(',').forEach(s=>srcs.add(s.trim().split(' ')[0]));
  for(let s of srcs){
    if(!s.startsWith('/')||s.startsWith('//')) continue;
    // Next transforma imaginile prin /_next/image?url=...
    if(s.startsWith('/_next/image')){ const u=decodeURIComponent((s.match(/url=([^&]+)/)||[])[1]||''); if(u.startsWith('/')) s=u; else continue; }
    if(s.startsWith('/_next/')) continue;
    total++;
    const p=path.join('out', s.replace(/^\//,''));
    if(!fs.existsSync(p)){ if(!rupte.has(s)) rupte.set(s,new Set()); rupte.get(s).add(path.basename(f)); }
  }
}
console.log(`IMAGINI VERIFICATE: ${total} referinte in ${pages.length} pagini`);
console.log(`RUPTE: ${rupte.size}\n`);
for(const [s,pg] of rupte) console.log(`  ${s}\n     in: ${[...pg].slice(0,5).join(', ')}${pg.size>5?' (+'+(pg.size-5)+')':''}`);
