const menuToggle=document.querySelector('.menu-toggle');
const menuClose=document.querySelector('.menu-close');
const nav=document.querySelector('.main-nav');
if(menuToggle&&nav){menuToggle.addEventListener('click',()=>nav.classList.add('active'));}
if(menuClose&&nav){menuClose.addEventListener('click',()=>nav.classList.remove('active'));}
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>nav&&nav.classList.remove('active')));

const reveals=document.querySelectorAll('.reveal,.reveal-left');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -30px'});
  reveals.forEach(el=>observer.observe(el));
}else{
  reveals.forEach(el=>el.classList.add('show'));
}

const artworkInput=document.querySelector('#artwork');
const uploadBox=document.querySelector('#uploadBox');
const fileList=document.querySelector('#fileList');
const artworkFiles=document.querySelector('#artworkFiles');
const whatsappUpload=document.querySelector('#sendArtworkWhatsApp');
const uploadStatus=document.querySelector('#uploadStatus');
const quoteForm=document.querySelector('.quote-form');
const MAX_TOTAL_SIZE=10*1024*1024;
const ALLOWED_TYPES=['image/jpeg','image/png','image/webp','application/pdf','image/svg+xml','application/postscript','application/x-photoshop'];
const ALLOWED_EXTENSIONS=['jpg','jpeg','png','webp','pdf','ai','psd','svg'];
let validArtworkFiles=[];

function extensionOf(name){return name.split('.').pop().toLowerCase();}
function setUploadStatus(message,type=''){if(uploadStatus){uploadStatus.textContent=message;uploadStatus.className=`upload-status ${type}`.trim();}}
function renderFiles(files){
  if(!fileList)return;
  fileList.innerHTML='';
  validArtworkFiles=[];
  let total=0;
  Array.from(files||[]).forEach(file=>{
    const ext=extensionOf(file.name);
    if(!ALLOWED_EXTENSIONS.includes(ext)){
      const e=document.createElement('div');e.className='upload-error';e.textContent=`${file.name}: file type not supported.`;fileList.appendChild(e);return;
    }
    if(total+file.size>MAX_TOTAL_SIZE){
      const e=document.createElement('div');e.className='upload-error';e.textContent=`${file.name} would exceed the 10MB total upload limit.`;fileList.appendChild(e);return;
    }
    total+=file.size;validArtworkFiles.push(file);
    const item=document.createElement('div');item.className='file-item';
    const name=document.createElement('span');name.textContent=file.name;
    const size=document.createElement('span');size.textContent=`${(file.size/1024/1024).toFixed(2)} MB`;
    item.append(name,size);fileList.appendChild(item);
  });
  if(artworkFiles)artworkFiles.value=validArtworkFiles.map(f=>f.name).join(', ');
  if(whatsappUpload)whatsappUpload.disabled=validArtworkFiles.length===0;
  setUploadStatus(validArtworkFiles.length?`${validArtworkFiles.length} artwork file${validArtworkFiles.length>1?'s':''} ready.`:'Select at least one valid artwork file.');
}

if(artworkInput&&fileList){
  artworkInput.addEventListener('change',()=>renderFiles(artworkInput.files));
  ['dragenter','dragover'].forEach(ev=>uploadBox?.addEventListener(ev,e=>{e.preventDefault();uploadBox.classList.add('dragover');}));
  ['dragleave','drop'].forEach(ev=>uploadBox?.addEventListener(ev,e=>{e.preventDefault();uploadBox.classList.remove('dragover');}));
  uploadBox?.addEventListener('drop',e=>{if(e.dataTransfer.files.length){try{artworkInput.files=e.dataTransfer.files;}catch(_){ }renderFiles(e.dataTransfer.files);}});
}

async function shareArtworkToWhatsApp(){
  if(!validArtworkFiles.length){setUploadStatus('Please choose artwork first.','error');return;}
  const message='DNA Graphics artwork submission. Please review the attached artwork files.';
  try{
    if(navigator.share&&navigator.canShare){
      const shareData={title:'DNA Graphics Artwork',text:message,files:validArtworkFiles};
      if(navigator.canShare({files:validArtworkFiles})){await navigator.share(shareData);setUploadStatus('Artwork shared. Select WhatsApp in the share sheet to send it.','success');return;}
    }
    const url=`https://wa.me/250780317239?text=${encodeURIComponent(message+' Files: '+validArtworkFiles.map(f=>f.name).join(', '))}`;
    window.open(url,'_blank','noopener');
    setUploadStatus('WhatsApp opened. Please attach the selected artwork files in the chat.','success');
  }catch(error){
    if(error&&error.name==='AbortError'){setUploadStatus('Share cancelled. Your files are still selected.');return;}
    const url=`https://wa.me/250780317239?text=${encodeURIComponent(message)}`;
    window.open(url,'_blank','noopener');
    setUploadStatus('WhatsApp opened. Please attach the artwork files.','success');
  }
}
if(whatsappUpload){whatsappUpload.addEventListener('click',shareArtworkToWhatsApp);}

// If the user submits with artwork selected, keep the normal email submission intact.
// The WhatsApp button is intentionally separate because static GitHub Pages cannot silently upload a local file into WhatsApp.
if(quoteForm){quoteForm.addEventListener('submit',()=>{if(validArtworkFiles.length){setUploadStatus('Sending your quote and artwork by email…','success');}});}

/* =========================
   PROFESSIONAL BINARY RAIN
========================= */
(function binaryRain(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas=document.createElement('canvas');
  canvas.className='binary-rain';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx) return;

  let width=0,height=0,dpr=1,columns=[],fontSize=15,last=0,frame=0;
  const accent={r:57,g:211,b:83};

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    width=window.innerWidth;
    height=window.innerHeight;
    canvas.width=Math.floor(width*dpr);
    canvas.height=Math.floor(height*dpr);
    canvas.style.width=width+'px';
    canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    fontSize=width<800?13:15;
    const count=Math.ceil(width/(fontSize*1.65));
    columns=Array.from({length:count},(_,i)=>({
      x:i*fontSize*1.65+Math.random()*fontSize,
      y:Math.random()*height-height,
      speed:(55+Math.random()*115)*(width<800?.72:1),
      length:Math.floor(8+Math.random()*24),
      gap:Math.floor(4+Math.random()*8),
      alpha:.16+Math.random()*.42,
      phase:Math.random()*Math.PI*2,
      drift:(Math.random()-.5)*.18
    }));
  }

  function draw(time){
    const dt=Math.min((time-last)/1000,.05)||0;
    last=time;
    ctx.clearRect(0,0,width,height);
    ctx.font=`600 ${fontSize}px ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace`;
    ctx.textAlign='center';

    for(const col of columns){
      col.y+=col.speed*dt;
      col.phase+=dt*1.4;
      col.x+=col.drift*dt;
      if(col.y-(col.length+col.gap)*fontSize>height){
        col.y=-Math.random()*height*.35;
        col.x=Math.max(0,Math.min(width,col.x));
        col.speed=(55+Math.random()*115)*(width<800?.72:1);
        col.length=Math.floor(8+Math.random()*24);
      }

      for(let j=0;j<col.length;j++){
        const y=col.y-j*fontSize;
        if(y<-fontSize||y>height+fontSize) continue;
        const progress=j/Math.max(1,col.length-1);
        const wave=.72+.28*Math.sin(col.phase+j*.52);
        const fade=.15+(1-progress)*.85;
        const alpha=col.alpha*fade*wave;
        const head=j===0;
        ctx.shadowBlur=head?10:4;
        ctx.shadowColor=`rgba(${accent.r},${accent.g},${accent.b},${alpha})`;
        ctx.fillStyle=head
          ? `rgba(115,255,126,${Math.min(.95,alpha+.3)})`
          : `rgba(${accent.r},${accent.g},${accent.b},${alpha})`;
        ctx.fillText(Math.random()>.5?'1':'0',col.x,y);
      }
    }
    ctx.shadowBlur=0;
    frame=requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);}
    else{last=performance.now();frame=requestAnimationFrame(draw);}
  });
  resize();
  frame=requestAnimationFrame(draw);
})();
