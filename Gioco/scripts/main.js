/**
 * main.js - NAVIGAZIONE SEZIONICarica ogni sezione da file separati in sections/
 * Navigazione prev/next tra le sezioni
 */

// Lista ordinata delle sezioni
const sections = [
  { id: 'hero', label: 'Introduzione', file: 'sections/01-hero.html' },
  { id: 'attivazione-chiamata', label: 'Attivazione Chiamata', file: 'sections/02-attivazione-chiamata.html' },
  { id: 'scenario', label: 'Valutazione Scenario', file: 'sections/03-scenario.html' },
  { id: 'fasi', label: 'Fasi di Risposta', file: 'sections/04-fasi.html' },
  { id: 'attori', label: 'Attori Chiave', file: 'sections/05-attori.html' },
  { id: 'mezzi', label: 'Mezzi e Strutture', file: 'sections/06-mezzi.html' },
  { id: 'msb-game-section', label: 'Primo MSB', file: 'sections/07-msb-game-section.html' },
  { id: 'compiti-referente', label: 'Compiti Referente', file: 'sections/08-compiti-referente.html' },
  { id: 'comunicazione-soreu', label: 'Comunicazione SOREU', file: 'sections/09-comunicazione-soreu.html' },
  { id: 'progetta-piano', label: 'Progetta Piano', file: 'sections/10-progetta-piano.html' },
  { id: 'crash', label: 'Crash', file: 'sections/11-crash.html' },
  { id: 'priority-intervention', label: 'Priorità Intervento', file: 'sections/12-priority-intervention.html' },
  { id: 'resource-management', label: 'Gestione Risorse', file: 'sections/13-resource-management.html' },
  { id: 'radio-communication', label: 'Comunicazione Radio', file: 'sections/14-radio-communication.html' },
  { id: 'ethical-dilemma', label: 'Dilemma Etico', file: 'sections/15-ethical-dilemma.html' },
  { id: 'quiz', label: 'Quiz', file: 'sections/16-quiz.html' }
];

let currentSectionIndex = 0;
let gameScriptCode = null; // Store the game script code

// Load master game script from gioco.html (only once)
function loadGameScript() {
  if (gameScriptCode !== null) return Promise.resolve();
  
  return fetch('gioco.html')
    .then(response => response.text())
    .then(html => {
      // Extract script tag from gioco.html
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const scripts = doc.querySelectorAll('script');
      
      // Find and extract the main game script (the IIFE with DOMContentLoaded)
      scripts.forEach(script => {
        if (script.innerHTML && script.innerHTML.includes('DOMContentLoaded')) {
          // Store the script code - we'll execute just the content without waiting for DOMContentLoaded
          gameScriptCode = script.innerHTML
            .replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/, '')
            .replace(/\}\);?\s*\}\);?$/, '');
        }
      });
      
      if (!gameScriptCode) {
        console.error('Could not extract game script from gioco.html');
      }
      console.log('Game script loaded successfully');
    })
    .catch(error => console.error('Failed to load game script:', error));
}

// Setup overlay IMMEDIATELY
function setupOverlay() {
  const overlayBtn = document.getElementById('overlay-start-activity-button');
  const overlay = document.getElementById('start-activity-button-overlay');
  const appContent = document.getElementById('app');
  const navControls = document.querySelector('.bg-surface.border-t.border-color');
  const header = document.querySelector('header');
  
  if (!overlayBtn) return;
  
  // Lock content on load
  if (appContent) appContent.classList.add('content-locked');
  if (navControls) navControls.classList.add('content-locked');
  if (header) header.classList.add('content-locked');
  
  // Unlock on button click
  overlayBtn.addEventListener('click', () => {
    // Load game script first, then unlock and load first section
    loadGameScript().then(() => {
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
      }
      if (appContent) appContent.classList.remove('content-locked');
      if (navControls) navControls.classList.remove('content-locked');
      if (header) header.classList.remove('content-locked');
      
      // Load first section after script is loaded
      loadSection(0);
    });
  });
}

// Load a section by index
function loadSection(index) {
  if (index < 0 || index >= sections.length) return;
  
  currentSectionIndex = index;
  const section = sections[index];
  
  fetch(section.file)
    .then(response => response.text())
    .then(html => {
      const appContainer = document.getElementById('app');
      appContainer.innerHTML = html;
      
      // Execute inline scripts from the section
      const sectionScripts = appContainer.querySelectorAll('script');
      sectionScripts.forEach(script => {
        if (script.innerHTML) {
          try {
            eval(script.innerHTML);
          } catch (error) {
            console.error('Script error in section:', error);
          }
        }
      });
      
      // Execute master game script (re-execute to reinitialize for new section)
      if (gameScriptCode) {
        try {
          eval(gameScriptCode);
        } catch (error) {
          console.error('Error executing game script:', error);
        }
      }
      
      // Update navigation buttons
      updateNavigationButtons();
      
      // Scroll to top
      window.scrollTo(0, 0);
    })
    .catch(error => {
      console.error('Failed to load section:', error);
      document.getElementById('app').innerHTML = '<p>Errore nel caricamento della sezione.</p>';
    });
}

// Update prev/next button states
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-section-btn');
  const nextBtn = document.getElementById('next-section-btn');
  const sectionLabel = document.getElementById('section-label');
  
  // Update section label
  if (sectionLabel) {
    sectionLabel.textContent = `${currentSectionIndex + 1}/${sections.length} - ${sections[currentSectionIndex].label}`;
  }
  
  // Update button states
  if (prevBtn) {
    if (currentSectionIndex === 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.5';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = '1';
    }
  }
  
  if (nextBtn) {
    if (currentSectionIndex === sections.length - 1) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.5';
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }
  }
}

// Setup overlay IMMEDIATELY (not inside DOMContentLoaded)
setupOverlay();

// Navigation button click handlers
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prev-section-btn');
  const nextBtn = document.getElementById('next-section-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSectionIndex > 0) {
        loadSection(currentSectionIndex - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSectionIndex < sections.length - 1) {
        loadSection(currentSectionIndex + 1);
      }
    });
  }
});
