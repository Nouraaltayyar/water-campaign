
const $=i=>document.getElementById(i);
const cfg=window.FIREBASE_CONFIG||{};
let ready=!!cfg.apiKey&&!cfg.apiKey.startsWith("YOUR");
let initializeApp,getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,getDatabase,ref,get,set,push,remove;
const cats=["الكل","إرشاد","نصيحة","خبر","حقيقة"];
const seed=window.SITE_DATA;
let auth,db,me=null,isAdmin=false,cat="الكل",hero={...seed.hero},posts=[...seed.posts];

function toast(t){const e=$("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",3500)}
function errMsg(e){const m={"auth/email-already-in-use":"هذا الإيميل مسجّل من قبل","auth/invalid-email":"الإيميل غير صحيح","auth/weak-password":"كلمة المرور ضعيفة (6 خانات على الأقل)","auth/invalid-credential":"الإيميل أو كلمة المرور غير صحيحة","auth/too-many-requests":"محاولات كثيرة، انتظري شوي"};return m[e.code]||"صار خطأ، حاولي مرة ثانية"}

function head(){$("hTitle").textContent=hero.title;$("hSub").textContent=hero.sub}
function nav(){
  const n=$("navr");n.innerHTML="";
  if(!me){const b=document.createElement("button");b.className="btn sm gold";b.textContent="تسجيل الدخول";b.onclick=()=>$("dlg").showModal();n.appendChild(b);return}
  const s=document.createElement("span");s.textContent=(isAdmin?"أدمن — ":"مرحبًا ")+(me.name||"");n.appendChild(s);
  const o=document.createElement("button");o.className="btn sm ghost";o.textContent="خروج";o.onclick=()=>signOut(auth);n.appendChild(o);
}
function adminPanel(){const on=isAdmin;$("admin").style.display=on?"block":"none";if(on){$("aTitle").value=hero.title;$("aSub").value=hero.sub}}
function chips(){const c=$("chips");c.innerHTML="";cats.forEach(k=>{const b=document.createElement("button");b.className="chip";b.textContent=k;b.setAttribute("aria-pressed",k===cat);b.onclick=()=>{cat=k;chips();render()};c.appendChild(b)})}
function render(){
  const g=$("pg");g.innerHTML="";let n=0;
  posts.forEach(p=>{
    if(cat!=="الكل"&&p.cat!==cat)return;n++;
    const d=document.createElement("article");d.className="post";
    if(p.img&&p.img.startsWith("data:image/")){const i=document.createElement("img");i.src=p.img;i.alt=p.title;d.appendChild(i)}
    const b=document.createElement("div");b.className="pb";
    const t=document.createElement("span");t.className="tag";t.textContent=p.cat;
    const h=document.createElement("h3");h.textContent=p.title;
    const x=document.createElement("p");x.textContent=p.text;
    b.append(t,h,x);
    if(isAdmin&&p.id){const r=document.createElement("button");r.className="del";r.textContent="حذف";r.onclick=async()=>{if(!confirm("حذف هذا المنشور؟"))return;try{await remove(ref(db,"posts/"+p.id));await load()}catch(e){toast("تعذّر الحذف")}};b.appendChild(r)}
    d.appendChild(b);g.appendChild(d);
  });
  $("empty").hidden=n>0;
}
async function load(){
  if(!ready){head();render();return}
  try{
    const h=await get(ref(db,"settings/hero"));if(h.exists())hero=h.val();
    const s=await get(ref(db,"posts"));const v=s.val();
    posts=v?Object.entries(v).map(([id,p])=>({id,...p})).sort((x,y)=>(y.createdAt||0)-(x.createdAt||0)):[...seed.posts];
  }catch(e){console.error(e)}
  head();render();
}
function compress(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,800/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);c.getContext("2d").drawImage(i,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.7))};i.onerror=rej;i.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}

// ---- login / signup ----
function tab(login){$("fLogin").hidden=!login;$("fSign").hidden=login;$("tLogin").setAttribute("aria-pressed",login);$("tSign").setAttribute("aria-pressed",!login);$("dTitle").textContent=login?"تسجيل الدخول":"إنشاء حساب";$("lmsg").textContent=""}
$("tLogin").onclick=()=>tab(true);$("tSign").onclick=()=>tab(false);$("dClose").onclick=()=>$("dlg").close();
$("fLogin").onsubmit=async e=>{e.preventDefault();if(!ready){$("lmsg").textContent="اربطي Firebase أول (شوفي README)";return}
  try{await signInWithEmailAndPassword(auth,$("lEmail").value.trim(),$("lPass").value);$("dlg").close();e.target.reset()}catch(x){$("lmsg").textContent=errMsg(x)}};
$("fSign").onsubmit=async e=>{e.preventDefault();if(!ready){$("lmsg").textContent="اربطي Firebase أول (شوفي README)";return}
  const name=$("sName").value.trim(),phone=$("sPhone").value.trim();
  if(!/^[0-9+\s-]{9,15}$/.test(phone)){$("lmsg").textContent="رقم الجوال غير صحيح";return}
  try{
    const c=await createUserWithEmailAndPassword(auth,$("sEmail").value.trim(),$("sPass").value);
    await set(ref(db,"users/"+c.user.uid),{name,phone,email:c.user.email,createdAt:Date.now()});
    if(me){me.name=name;nav()}
    $("dlg").close();e.target.reset();toast("تم إنشاء حسابك");
  }catch(x){$("lmsg").textContent=errMsg(x)}};

// ---- admin actions ----
$("saveHero").onclick=async()=>{try{const v={title:$("aTitle").value.trim()||hero.title,sub:$("aSub").value.trim()||hero.sub};await set(ref(db,"settings/hero"),v);hero=v;head();toast("تم الحفظ")}catch(e){toast("تعذّر الحفظ")}};
$("addPost").onclick=async()=>{
  const t=$("pTitle").value.trim(),x=$("pText").value.trim();if(!t||!x){toast("اكتبي العنوان والنص");return}
  let img="";const f=$("pImg").files[0];
  if(f){try{img=await compress(f)}catch(e){toast("تعذّر قراءة الصورة");return}if(img.length>900000){toast("الصورة كبيرة، اختاري أصغر");return}}
  try{await push(ref(db,"posts"),{cat:$("pCat").value,title:t,text:x,img,createdAt:Date.now()});$("pTitle").value="";$("pText").value="";$("pImg").value="";await load();toast("تم النشر")}catch(e){toast("تعذّر النشر")}
};

async function init(){
  if(!ready)return;
  try{
    const B="https://www.gstatic.com/firebasejs/10.12.2/";
    const A=await import(B+"firebase-app.js"),U=await import(B+"firebase-auth.js"),D=await import(B+"firebase-database.js");
    ({initializeApp}=A);
    ({getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut}=U);
    ({getDatabase,ref,get,set,push,remove}=D);
    const app=initializeApp(cfg);auth=getAuth(app);db=getDatabase(app);
    onAuthStateChanged(auth,async u=>{
      me=u?{uid:u.uid,name:u.email}:null;isAdmin=false;
      if(u){try{isAdmin=(await get(ref(db,"admins/"+u.uid))).exists();const p=await get(ref(db,"users/"+u.uid));if(p.exists())me.name=p.val().name}catch(e){}}
      nav();adminPanel();render();
    });
    await load();
  }catch(e){ready=false;console.error(e);toast("تعذّر الاتصال بـ Firebase، تأكدي من الإنترنت")}
}
head();nav();adminPanel();chips();render();
init();
