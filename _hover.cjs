const fs=require("fs");const{spawn}=require("child_process");
const PORT=9421,URL=process.argv[2],OUT=process.argv[3],SCRIPT=process.argv[4]||"";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const child=spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",["--headless=old","--disable-gpu","--no-first-run",`--remote-debugging-port=${PORT}`,"--user-data-dir=C:\\Users\\fahmi\\AppData\\Local\\Temp\\cr-cdp-"+Date.now(),"--hide-scrollbars","--window-size=1600,1000","about:blank"],{stdio:"ignore"});
let target=null;for(let i=0;i<40;i++){await sleep(300);try{const r=await fetch(`http://127.0.0.1:${PORT}/json/list`);const l=await r.json();target=l.find(t=>t.type==="page");if(target)break;}catch(_){}}
if(!target){console.error("no target");child.kill();process.exit(1);}
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
let id=0;const pending=new Map();ws.addEventListener("message",ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});
const send=(method,params={})=>new Promise(res=>{const mid=++id;pending.set(mid,res);ws.send(JSON.stringify({id:mid,method,params}));});
await send("Page.enable");await send("Runtime.enable");
await send("Page.navigate",{url:URL});await sleep(6500);
// sweep to hover a keycap
const box=await send("Runtime.evaluate",{expression:`(()=>{const s=document.querySelector('#keyboard-canvas');const r=s.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*0.55};})()`,returnByValue:true});
const b=box.result.result.value;
for(const [dx,dy] of [[0,0],[0,-40],[40,20],[-40,-20],[80,40],[-80,0]]){
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:b.x+dx,y:b.y+dy,button:"none"});
  await sleep(700);
  const st=await send("Runtime.evaluate",{expression:`(()=>{const c=document.querySelector('#tech-card');const cs=getComputedStyle(c);return {op:cs.opacity,vis:cs.visibility,name:document.querySelector('#tech-name').textContent,desc:document.querySelector('#tech-description').textContent,kick:document.querySelector('.card-kicker').textContent,lab:document.querySelector('.level-label').textContent,lvl:document.querySelector('#tech-level').textContent};})()`,returnByValue:true});
  const v=st.result.result.value;
  if(v.vis==="visible"&&parseFloat(v.op)>0.5){console.log("CARD:",JSON.stringify(v));break;}
}
const shot=await send("Page.captureScreenshot",{format:"png"});
fs.writeFileSync(OUT,Buffer.from(shot.result.data,"base64"));console.log("saved",OUT);
ws.close();child.kill();process.exit(0);})();