import fs from 'fs'; import path from 'path';
const pages=[]; (function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name); if(e.isDirectory())w(p); else if(e.name.endsWith('.html'))pages.push(p);}})('out');

// 1. IMAGINI
const imgRupte=new Map(); let ni=0;
for(const f of pages){
  const h=fs.readFileSync(f,'utf8');
  const srcs=new Set();
  for(const m of h.matchAll(/src="([^"]+)"/g)) srcs.add(m[1]);
  for(const m of h.matchAll(/srcSet="([^"]+)"/g)) m[1].split(',').forEach(s=>srcs.add(s.trim().split(' ')[0]));
  for(let s of srcs){
    if(!s.startsWith('/')||s.startsWith('//')) continue;
    if(s.startsWith('/_next/image')){ const u=decodeURIComponent((s.match(/url=([^&]+)/)||[])[1]||''); if(u.startsWith('/')) s=u; else continue; }
    if(s.startsWith('/_next/')) continue;
    ni++;
    if(!fs.existsSync(path.join('out', s.replace(/^\//,'')))){ if(!imgRupte.has(s))imgRupte.set(s,new Set()); imgRupte.get(s).add(path.basename(f)); }
  }
}
console.log(`IMAGINI  : ${ni} referinte, ${imgRupte.size} rupte`);
for(const [s,pg] of imgRupte) console.log(`   ${s} -> ${[...pg].slice(0,4).join(', ')}`);

// 2. LINKURI
const lkRupte=new Map(); let nl=0;
for(const f of pages){
  for(const m of fs.readFileSync(f,'utf8').matchAll(/href="([^"]+)"/g)){
    const l=m[1];
    if(!l.startsWith('/')||l.startsWith('//')||l.startsWith('/_next/')) continue;
    const c=l.split('#')[0].split('?')[0]; if(!c||c==='/') continue;
    if(/\.(png|jpg|jpeg|svg|ico|css|js|xml|txt|woff2?|webp)$/i.test(c)) continue;
    nl++;
    const p=c.replace(/^\//,'').replace(/\/$/,'');
    if(!fs.existsSync(path.join('out',p+'.html'))&&!fs.existsSync(path.join('out',p,'index.html'))&&!fs.existsSync(path.join('out',p))){
      if(!lkRupte.has(c))lkRupte.set(c,new Set()); lkRupte.get(c).add(path.basename(f));
    }
  }
}
console.log(`LINKURI  : ${nl} verificate, ${lkRupte.size} rupte`);
for(const [l,pg] of lkRupte) console.log(`   ${l} -> ${[...pg].slice(0,4).join(', ')}`);

// 3. ROMANA
const DIA=/[ăâîșțĂÂÎȘȚ]/;
const RO=/\b(si|sau|este|sunt|pentru|care|foarte|nostru|noastra|noastre|mergi|pagina|produs|produse|adauga|cauta|cosul|contul|comanda|comenzi|livrare|transport|gratuit|pret|reducere|cumpara|vezi|toate|acasa|despre|zilnic|corpul|sanatate|puritate|inapoi|incarca|eroare|salveaza|sterge|trimite|prenume|parola|adresa|adrese|factura|plata|retur|termeni|conditii|jurnal|articol|abonare|pachet|pachete|categorie|categorii|calitate|filtre|etichete|nevoie|descopera|recenzii|gol|utilizator|mele)\b/i;
const gas=new Map();
for(const f of pages){
  let h=fs.readFileSync(f,'utf8').replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ');
  const b=[...h.matchAll(/>([^<>]{3,200})</g)].map(m=>m[1]).concat([...h.matchAll(/(?:aria-label|alt|placeholder|title)="([^"]{3,200})"/g)].map(m=>m[1]));
  for(const raw of b){ const s=raw.replace(/&[a-z]+;/g,' ').trim(); if(s.length>=3&&(DIA.test(s)||RO.test(s))) gas.set(s.slice(0,100),path.basename(f)); }
}
console.log(`ROMANA   : ${gas.size} aparitii`);
for(const [s,f] of gas) console.log(`   "${s}" -> ${f}`);

// 4. PAGINI DE PRODUS - toate au imagine si pret?
let fara=0;
for(const f of pages.filter(p=>p.includes(path.sep+'product'+path.sep))){
  const h=fs.readFileSync(f,'utf8');
  const areImg=/priceCurrency/.test(h) && /<img/.test(h);
  if(!areImg){ console.log('   pagina incompleta: '+path.basename(f)); fara++; }
}
console.log(`PRODUSE  : ${pages.filter(p=>p.includes(path.sep+'product'+path.sep)).length} pagini, ${fara} incomplete`);
