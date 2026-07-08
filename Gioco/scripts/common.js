export function safeInit(sectionIdOrFn, initFn) {
  // Se il primo argomento è una funzione, eseguilo direttamente
  if (typeof sectionIdOrFn === 'function') {
    try { 
      sectionIdOrFn(); 
    } catch (e) { 
      console.error('safeInit failed:', e); 
    }
    return;
  }
  
  // Se è una stringa, verificare l'elemento
  if (!document.getElementById(sectionIdOrFn)) return;
  try { 
    initFn(); 
  } catch (e) { 
    console.error(`safeInit ${sectionIdOrFn} failed:`, e); 
  }
}
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function setStaticImage(imgElementId, src) {
  const imgElement = document.getElementById(imgElementId);
  if (imgElement) {
    imgElement.src = src;
    imgElement.classList.remove('hidden');
  }
}

export function closeModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.add('opacity-0');
  modalElement.addEventListener('transitionend', () => {
    modalElement.classList.add('hidden');
  }, { once: true });
}

// Expose some helpers to window for existing non-module inline scripts
if (typeof window !== 'undefined') {
  window.setStaticImage = setStaticImage;
  window.closeModal = closeModal;
}
