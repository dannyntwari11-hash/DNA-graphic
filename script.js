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
