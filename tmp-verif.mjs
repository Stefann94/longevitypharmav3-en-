import fs from 'fs'; import path from 'path';
const pages=[]; (function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name); if(e.isDirectory())w(p); else if(e.name.endsWith('.html'))pages.push(p);}})('out');

// 1. LINKURI
const rupte=new Map(); let nl=0;
for(const f of pages){
  for(const m of fs.readFileSync(f,'utf8').matchAll(/href="([^"]+)"/g)){
    const l=m[1];
    if(!l.startsWith('/')||l.startsWith('//')||l.startsWith('/_next/')) continue;
    const c=l.split('#')[0].split('?')[0]; if(!c||c==='/') continue;
    if(/\.(png|jpg|jpeg|svg|ico|css|js|xml|txt|woff2?|webp)$/i.test(c)) continue;
    nl++;
    const p=c.replace(/^\//,'').replace(/\/$/,'');
    if(!fs.existsSync(path.join('out',p+'.html'))&&!fs.existsSync(path.join('out',p,'index.html'))&&!fs.existsSync(path.join('out',p))){
      if(!rupte.has(c))rupte.set(c,new Set()); rupte.get(c).add(path.basename(f));
    }
  }
}
console.log(`LINKURI : ${nl} verificate, ${rupte.size} rupte`);
for(const [l,pg] of rupte) console.log(`   ${l} -> ${[...pg].slice(0,3).join(', ')}`);

// 2. ROMANA in text vizibil
const DIA=/[ăâîșțĂÂÎȘȚ]/;
const RO=/\b(si|sau|este|sunt|pentru|care|foarte|nostru|noastra|noastre|mergi|pagina|produs|produse|adauga|cauta|cosul|contul|comanda|comenzi|livrare|transport|gratuit|pret|reducere|cumpara|vezi|toate|acasa|despre|zilnic|corpul|sanatate|puritate|inapoi|incarca|eroare|salveaza|sterge|trimite|prenume|parola|adresa|adrese|factura|plata|retur|termeni|conditii|jurnal|articol|abonare|pachet|pachete|categorie|categorii|calitate|filtre|etichete|nevoie|descopera|recenzii|gol|utilizator|mele|noi|viitorul|misiunea|povestea)\b/i;
const gas=new Map();
for(const f of pages){
  let h=fs.readFileSync(f,'utf8').replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ');
  const b=[...h.matchAll(/>([^<>]{3,200})</g)].map(m=>m[1]).concat([...h.matchAll(/(?:aria-label|alt|placeholder|title)="([^"]{3,200})"/g)].map(m=>m[1]));
  for(const raw of b){ const s=raw.replace(/&[a-z]+;/g,' ').trim(); if(s.length>=3&&(DIA.test(s)||RO.test(s))) gas.set(s.slice(0,110),path.basename(f)); }
}
console.log(`ROMANA  : ${gas.size} aparitii`);
for(const [s,f] of gas) console.log(`   "${s}" -> ${f}`);

// 3. CAI cu nume romanesc (fisiere si imagini)
const caiRo=new Set();
for(const f of pages){
  for(const m of fs.readFileSync(f,'utf8').matchAll(/(?:src|href)="(\/[^"]+)"/g)){
    if(/despre|jurnal|calitate|claritate|longevitate|pachete|imagini|colagen|inflamatie|testare/i.test(m[1])) caiRo.add(m[1].split('?')[0].slice(0,90));
  }
}
console.log(`CAI RO  : ${caiRo.size}`);
[...caiRo].sort().forEach(c=>console.log('   '+c));
