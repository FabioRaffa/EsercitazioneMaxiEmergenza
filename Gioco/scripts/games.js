/*
 * games.js — Logica di tutti i mini-giochi della Maxi-Emergenza.
 * Estratto automaticamente dallo <script> monolitico di index.html.
 * Esposto come window.initGames() e invocato UNA volta dal wizard (main.js)
 * dopo che tutte le sezioni sono state iniettate nel DOM.
 */
window.initGames = function initGames() {
// Wrap the entire script in an IIFE to prevent global variable conflicts in environments that might re-execute the script.
(function() {
    // Declare variables in a scope that persists for the lifetime of the script's execution context.
    let visualizzaScenarioSection; // Declared here, assigned in DOMContentLoaded

    ;(function(){

        // Assign elements to the variables declared above
        visualizzaScenarioSection = document.getElementById('visualizza-scenario');

        // Mobile Menu
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton) { // Check if element exists
            mobileMenuButton.addEventListener('click', () => {
                if (mobileMenu) { // Check if element exists
                    mobileMenu.classList.toggle('hidden');
                }
            });
        }

        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu) { // Check if element exists
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Active Nav Link Scrolling
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Using document.documentElement.scrollTop for broader compatibility
                if (document.documentElement.scrollTop >= sectionTop - 80) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                link.classList.add('inactive-nav');
                // Ensure link.getAttribute('href') is not null before substring
                if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active-nav');
                    link.classList.remove('inactive-nav');
                }
            });
        });

        // Fasi Tabs
        const faseTabs = document.querySelectorAll('.fase-tab');
        faseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.target);

                faseTabs.forEach(t => {
                    t.classList.remove('border-red-500', 'text-red-600');
                    t.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                });
                tab.classList.add('border-red-500', 'text-red-600');
                tab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');

                const faseContentPanels = document.querySelectorAll('.fase-content-panel');
                faseContentPanels.forEach(panel => {
                    panel.classList.add('hidden');
                });
                if (target) { // Check if target exists
                    target.classList.remove('hidden');
                }
            });
        });

        // Modal Logic
        const roleCards = document.querySelectorAll('.role-card');
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                const modal = document.getElementById(card.dataset.modalTarget);
                if (modal) { // Check if modal exists
                    modal.classList.remove('invisible', 'opacity-0');
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) { // Check if modalContent exists
                        modalContent.classList.remove('scale-95');
                    }
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) { // Check if modal exists
                    closeModal(modal);
                }
            });
        });
        
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        // Function to close modal
        function closeModal(modalElement) {
            modalElement.classList.add('invisible', 'opacity-0');
            const modalContent = modalElement.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.add('scale-95');
            }
        }

        // Zone Diagram Interaction (Mappa Operativa del Sito) - Terminology Updated
        const zoneDiagram = document.getElementById('zone-diagram-game'); // Changed ID to game-specific
        // const hotZone = document.getElementById('hot-zone'); // These elements are now part of the game.
        // const warmZone = document.getElementById('warm-zone');
        const zoneInfoDisplay = document.getElementById('zone-info-display'); // This element is not used in the new game logic, can be removed or repurposed.

        // PMA Layout Interaction
        const pmaAreas = document.querySelectorAll('.pma-area');
        const pmaInfoBox = document.getElementById('pma-info-box');
        pmaAreas.forEach(area => {
            area.addEventListener('click', () => {
                if (pmaInfoBox) { // Check if pmaInfoBox exists
                    pmaInfoBox.textContent = area.dataset.info;
                }
                pmaAreas.forEach(a => a.classList.remove('ring-2', 'ring-blue-500'));
                area.classList.add('ring-2', 'ring-blue-500');
            });
        });

		// Triage Flow Interaction - Semplificato per visualizzazione sequenziale
		const triageFlowSteps = document.querySelectorAll('#triage-flow-steps .triage-step');
		const triageFlowResetBtn = document.getElementById('triage-flow-reset');
		let currentFlowStep = 1;

		// Funzione per mostrare i passi del triage fino a un certo punto
		const showTriageFlowStep = (stepNum) => {
			triageFlowSteps.forEach(step => {
				const n = parseInt(step.dataset.step);
				if (n <= stepNum) {
					step.classList.remove('hidden');
				} else {
					step.classList.add('hidden');
				}
				// Evidenzia il passo corrente cliccabile (l'ultimo visibile, se non è l'ultimo in assoluto)
				step.classList.toggle('triage-step-next', n === stepNum && stepNum < triageFlowSteps.length);
			});
			// Mostra il pulsante "Ricomincia" solo quando tutti i passi sono visibili
			if (stepNum >= triageFlowSteps.length && triageFlowResetBtn) {
				triageFlowResetBtn.classList.remove('hidden');
			} else if (triageFlowResetBtn) {
				triageFlowResetBtn.classList.add('hidden');
			}
			// Aggiorna il grafico: compaiono SOLO i colori "sbloccati" dai passi dell'algoritmo.
			// Passo 1: solo VERDE (100%). Passi 2-4 (tutti ROSSO): si bilanciano VERDE + ROSSO.
			// Ultimo passo: appare anche il GIALLO -> distribuzione finale 60/30/10.
			if (window.__triageChart && triageFlowSteps.length > 1) {
				const total = triageFlowSteps.length;
				const s = Math.min(stepNum, total);
				const finalVals = [60, 30, 10]; // [Verde, Giallo, Rosso]
				const mask = [true, s >= total, s >= 2]; // Verde sempre; Giallo solo all'ultimo; Rosso dal passo 2
				const activeSum = finalVals.reduce((acc, v, i) => acc + (mask[i] ? v : 0), 0);
				window.__triageChart.data.datasets[0].data = finalVals.map((v, i) => mask[i] ? Math.round(v / activeSum * 1000) / 10 : 0);
				window.__triageChart.update();
				const cap = document.getElementById('triage-chart-caption');
				if (cap) {
					if (s <= 1) cap.innerHTML = 'Al primo passo i deambulanti sono <span class="text-green-600 font-semibold">VERDI</span>.';
					else if (s < total) cap.innerHTML = 'Compaiono i <span class="text-red-600 font-semibold">ROSSI</span> (codici critici).';
					else cap.innerHTML = 'Distribuzione finale — <span class="text-green-600 font-semibold">Verde 60%</span> · <span class="text-yellow-500 font-semibold">Giallo 30%</span> · <span class="text-red-600 font-semibold">Rosso 10%</span>';
				}
			}
		};
		// Aggiungi event listener a ogni passo per rivelare il successivo
		triageFlowSteps.forEach(step => {
			step.addEventListener('click', () => {
				const clickedStepNum = parseInt(step.dataset.step);
				// Se clicchi sul passo corrente o uno precedente, avanza di uno
				if (clickedStepNum === currentFlowStep) {
					currentFlowStep++;
					showTriageFlowStep(currentFlowStep);
				} else if (clickedStepNum < currentFlowStep) {
					// Se clicchi su un passo già visualizzato, mostra tutti fino alla fine (o resetta a quel punto)
					showTriageFlowStep(triageFlowSteps.length); // Mostra tutti
				}
			});
		});

		// Event listener per il pulsante "Ricomincia"
		if (triageFlowResetBtn) {
			triageFlowResetBtn.addEventListener('click', () => {
				currentFlowStep = 1; // Resetta al primo passo
				showTriageFlowStep(currentFlowStep); // Mostra solo il primo passo
			});
		}

		// Inizializza il gioco mostrando solo il primo passo all'apertura della pagina
		showTriageFlowStep(currentFlowStep);

		// Il grafico a torta già esistente nella sezione "Mezzi e Strutture Operative" dovrebbe continuare a funzionare.
		// Non dobbiamo inizializzarlo qui, è già gestito da un blocco a sé stante più in alto.


/* --- JAVASCRIPT FOR "PRIMO MSB IN ARRIVO" GAME (MODIFIED) --- */
const msbRoleLabels = { Referente: 'Referente per la SOREU', Autista: 'Autista Soccorritore', Soccorritore: 'Soccorritore' };
const msbGameTasksData = [ // l'action card del primo MSB (manuale AREU 2026, p.27)
    { text: "Indossare la fascia gialla in dotazione (se si giunge come primo mezzo).", role: "Referente" },
    { text: "Effettuare una ricognizione del luogo dell'evento e dimensionare l'evento.", role: "Referente" },
    { text: "Adottare il metodo METHANE, anche confrontandosi con il capo squadra dei Vigili del Fuoco (casco rosso).", role: "Referente" },
    { text: "Comunicare alla SOREU quanto rilevato, prima possibile.", role: "Referente" },
    { text: "Effettuare lo sweeping triage START, suddividendo le vittime in codici VERDI, GIALLI e ROSSI e applicando i braccialetti colorati.", role: "Referente" },
    { text: "Comunicare alla SOREU gli esiti dello sweeping triage e la patologia prevalente (o all'equipaggio del MSA giunto in posto).", role: "Referente" },
    { text: "All'arrivo del MSA, comunicare quanto eseguito (passaggio di consegne) e mettersi a disposizione.", role: "Referente" },
    { text: "Posizionare il mezzo in zona sicura, ben visibile e identificabile, con i lampeggianti accesi (solo se primo mezzo).", role: "Autista" },
    { text: "Rimanere vicino al mezzo, pronto a spostarlo in ogni momento.", role: "Autista" },
    { text: "Garantire l'integrità delle comunicazioni radio con la SOREU.", role: "Autista" },
    { text: "Segnalare ai mezzi in arrivo le vie di accesso (check in), il luogo di stazionamento e le vie di fuga (check out).", role: "Autista" },
    { text: "Individuare i luoghi adatti all'atterraggio di elicotteri, attenti a cavi della corrente, teleferiche od ostacoli poco visibili.", role: "Autista" },
    { text: "All'arrivo del Direttore dei Trasporti (pettorina blu), mettersi a sua disposizione.", role: "Autista" },
    { text: "Identificare un'area sicura, a debita distanza dal luogo dell'evento, per le vittime in codice verde, in accordo con il capo equipaggio.", role: "Soccorritore" },
    { text: "Tenere sotto controllo quell'area, evitando che le vittime rientrino nell'area dell'incidente.", role: "Soccorritore" }
];

let currentSelectedMsbTask = null; // Nuovo nome per la variabile di selezione

const msbDraggableTasksContainer = document.getElementById('msb-draggable-tasks'); // Nuovo ID
const msbDropZones = document.querySelectorAll('#msb-game-section .msb-role-drop-zone'); // Nuovo selettore
const msbCheckButton = document.getElementById('msb-check-button'); // Nuovo ID
const msbResetButton = document.getElementById('msb-reset-button'); // Nuovo ID
const msbFeedbackDisplay = document.getElementById('msb-feedback-display'); // Nuovo ID

// Il nome del ruolo resta SEMPRE visibile come intestazione della drop zone
// (i compiti assegnati compaiono sotto di esso).
const updateMsbDropZoneTitleVisibility = (zoneElement) => {
    const roleTitleSpan = zoneElement.querySelector('.msb-role-title'); // Nuovo selettore
    if (roleTitleSpan) {
        roleTitleSpan.style.display = '';
    }
};

function initializeMsbGame() {
    if (!msbDraggableTasksContainer || !msbFeedbackDisplay) return;

    msbDraggableTasksContainer.innerHTML = '';
    msbFeedbackDisplay.innerHTML = '<p class="text-sm">Trascina i compiti sui ruoli corrispondenti. Ogni ruolo ha compiti multipli!</p>';
    currentSelectedMsbTask = null;

    msbDropZones.forEach(zone => {
        zone.innerHTML = `<span class="msb-role-title">${msbRoleLabels[zone.dataset.role] || zone.dataset.role}</span>`; // Nuovo selettore
        zone.classList.remove('correct-match', 'incorrect-match', 'active-drop', 'filled');
        updateMsbDropZoneTitleVisibility(zone);
    });

    const shuffledMsbTasks = [...msbGameTasksData].sort(() => Math.random() - 0.5);
    shuffledMsbTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('role-task-item', 'bg-gray-100', 'hover:bg-gray-200'); // Mantenute classi generiche per lo stile
        taskElement.setAttribute('draggable', 'true');
        taskElement.textContent = task.text;
        taskElement.dataset.taskRole = task.role;
        taskElement.dataset.msbTaskId = `msb-task-${index}`; // Nuovo dataset per l'ID del task

        taskElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', taskElement.dataset.msbTaskId);
            currentSelectedMsbTask = taskElement;
            setTimeout(() => {
                taskElement.classList.add('selected-for-match');
                taskElement.style.opacity = '0.5';
            }, 0);
        });

        taskElement.addEventListener('dragend', () => {
            taskElement.classList.remove('selected-for-match');
            taskElement.style.opacity = '1';
        });

        taskElement.addEventListener('click', (e) => {
            e.stopPropagation(); // evita il doppio toggle col delegato sul contenitore (rompeva il click-to-place, essenziale su touch)
            // Rimuovi selezione da tutti gli elementi MSB tasks
            document.querySelectorAll('#msb-game-section .role-task-item').forEach(item => {
                item.classList.remove('selected-for-match');
                item.style.opacity = '1';
            });

            if (currentSelectedMsbTask === taskElement) {
                currentSelectedMsbTask = null;
            } else {
                currentSelectedMsbTask = taskElement;
                taskElement.classList.add('selected-for-match');
                taskElement.style.opacity = '0.5';
            }
        });

        msbDraggableTasksContainer.appendChild(taskElement);
    });
}

const moveMsbTaskToZone = (taskElement, targetZone) => { // Nuovo nome funzione
    if (!taskElement || !targetZone) return;

    if (taskElement.parentNode === targetZone) {
        taskElement.classList.remove('selected-for-match');
        taskElement.style.opacity = '1';
        currentSelectedMsbTask = null;
        return;
    }

    const currentParent = taskElement.parentNode;
    if (currentParent) {
        currentParent.removeChild(taskElement);
        if (currentParent.classList.contains('msb-role-drop-zone')) { // Nuovo selettore
            updateMsbDropZoneTitleVisibility(currentParent);
            currentParent.classList.remove('correct-match', 'incorrect-match');
        } else if (currentParent === msbDraggableTasksContainer) {
            taskElement.classList.remove('correct-match', 'incorrect-match');
        }
    }

    targetZone.appendChild(taskElement);

    taskElement.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'selected-for-match');
    taskElement.style.backgroundColor = 'white';
    taskElement.style.color = '#1a202c';
    taskElement.classList.remove('matched');
    taskElement.style.opacity = '1';

    updateMsbDropZoneTitleVisibility(targetZone);
    targetZone.classList.remove('correct-match', 'incorrect-match');

    currentSelectedMsbTask = null;
    document.querySelectorAll('#msb-game-section .role-task-item').forEach(item => item.classList.remove('selected-for-match')); // Nuovo selettore
};

msbDropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('active-drop');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('active-drop');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active-drop');
        const taskId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`[data-msb-task-id="${taskId}"]`); // Nuovo dataset

        if (draggedElement) {
            moveMsbTaskToZone(draggedElement, zone);
        }
    });

    zone.addEventListener('click', () => {
        if (currentSelectedMsbTask && currentSelectedMsbTask.parentNode !== zone) {
            moveMsbTaskToZone(currentSelectedMsbTask, zone);
        } else if (currentSelectedMsbTask && currentSelectedMsbTask.parentNode === zone) {
            currentSelectedMsbTask.classList.remove('selected-for-match');
            currentSelectedMsbTask.style.opacity = '1';
            currentSelectedMsbTask = null;
        }
        msbDropZones.forEach(z => z.classList.remove('active-drop'));
    });
});

if (msbDraggableTasksContainer) {
    msbDraggableTasksContainer.addEventListener('click', (e) => {
        // Se si clicca su un elemento della palette, lo selezioniamo/deselezioniamo
        if (e.target.classList.contains('role-task-item')) {
            document.querySelectorAll('#msb-game-section .role-task-item').forEach(item => { // Nuovo selettore
                if (item !== e.target) {
                    item.classList.remove('selected-for-match');
                    item.style.opacity = '1';
                }
            });
            msbDropZones.forEach(zone => { // Anche nelle drop zones
                zone.querySelectorAll('.role-task-item').forEach(item => {
                    item.classList.remove('selected-for-match');
                    item.style.opacity = '1';
                });
            });

            if (currentSelectedMsbTask === e.target) {
                currentSelectedMsbTask = null;
                e.target.classList.remove('selected-for-match');
                e.target.style.opacity = '1';
            } else {
                currentSelectedMsbTask = e.target;
                e.target.classList.add('selected-for-match');
                e.target.style.opacity = '0.5';
            }
        } else if (currentSelectedMsbTask && currentSelectedMsbTask.parentNode !== msbDraggableTasksContainer) {
            // Se un elemento è selezionato e non è già nella palette, lo riportiamo nella palette
            moveMsbTaskToZone(currentSelectedMsbTask, msbDraggableTasksContainer);
        }
    });
}

if (msbCheckButton) {
    msbCheckButton.addEventListener('click', () => {
        let allOverallCorrect = true;
        let feedbackMessages = [];

        document.querySelectorAll('#msb-game-section .role-task-item').forEach(taskEl => { // Nuovo selettore
            taskEl.classList.remove('correct-match', 'incorrect-match', 'selected-for-match');
            taskEl.style.opacity = '1';
            taskEl.style.pointerEvents = 'auto';
        });
        msbDropZones.forEach(zone => {
            zone.classList.remove('correct-match', 'incorrect-match');
        });

        const assignedTasksPerRole = {
            'Referente': [],
            'Autista': [],
            'Soccorritore': []
        };

        msbDropZones.forEach(zone => {
            const roleName = zone.dataset.role;
            zone.querySelectorAll('.role-task-item').forEach(taskElement => {
                assignedTasksPerRole[roleName].push(taskElement.textContent);
            });
        });

        for (const roleName in assignedTasksPerRole) {
            const assignedTasks = assignedTasksPerRole[roleName].sort();
            const correctTasks = msbGameTasksData.filter(task => task.role === roleName).map(task => task.text).sort(); // Nuovo nome dataset
            const zoneElement = document.querySelector(`#msb-game-section .msb-role-drop-zone[data-role="${roleName}"]`); // Nuovo selettore

            let roleCorrect = true;
            if (assignedTasks.length !== correctTasks.length || JSON.stringify(assignedTasks) !== JSON.stringify(correctTasks)) {
                roleCorrect = false;
            }

            if (roleCorrect) {
                zoneElement.classList.add('correct-match');
                zoneElement.querySelectorAll('.role-task-item').forEach(taskEl => {
                    taskEl.classList.add('correct-match');
                    taskEl.style.pointerEvents = 'none';
                });
                feedbackMessages.push(`✔️ Compiti del <span class="font-bold">${msbRoleLabels[roleName]}</span>: TUTTI CORRETTI.`);
            } else {
                zoneElement.classList.add('incorrect-match');
                zoneElement.querySelectorAll('.role-task-item').forEach(taskEl => {
                    taskEl.classList.add('incorrect-match');
                });
                allOverallCorrect = false;
                feedbackMessages.push(`❌ Compiti del <span class="font-bold">${msbRoleLabels[roleName]}</span>: ALCUNI ERRORI.`);

                const missingInRole = correctTasks.filter(text => !assignedTasks.includes(text));
                if (missingInRole.length > 0) {
                    feedbackMessages.push(`&nbsp;&nbsp;&nbsp;Mancano: ${missingInRole.map(t => `"${t.substring(0, 30)}..."`).join(', ')}.`);
                }
                const extraInRole = assignedTasks.filter(text => !correctTasks.includes(text));
                if (extraInRole.length > 0) {
                    feedbackMessages.push(`&nbsp;&nbsp;&nbsp;Assegnati erroneamente (in più): ${extraInRole.map(t => `"${t.substring(0, 30)}..."`).join(', ')}.`);
                }
            }
        }

        const remainingUnassignedTasks = msbDraggableTasksContainer.querySelectorAll('.role-task-item'); // Nuovo selettore
        if (remainingUnassignedTasks.length > 0) {
            allOverallCorrect = false;
            const unassignedTexts = Array.from(remainingUnassignedTasks).map(t => t.textContent).join(', ');
            feedbackMessages.push(`<span class="text-red-600 font-bold">❌ Compiti rimasti non assegnati nella palette: ${unassignedTexts}.</span>`);
            remainingUnassignedTasks.forEach(taskEl => taskEl.classList.add('incorrect-match'));
        } else if (Object.keys(assignedTasksPerRole).flatMap(role => assignedTasksPerRole[role]).length !== msbGameTasksData.length) { // Nuovo nome dataset
            allOverallCorrect = false;
            feedbackMessages.push('<span class="text-red-600 font-bold">ATTENZIONE: Il numero totale di compiti assegnati non corrisponde ai compiti previsti!</span>');
        }

        if (msbFeedbackDisplay) { // Nuovo ID
            if (allOverallCorrect) {
                if (window.__markDone) window.__markDone('msb-game-section'); msbFeedbackDisplay.innerHTML = '<p class="font-bold text-green-600 text-lg">Eccellente! Tutti i compiti sono stati assegnati correttamente per ogni ruolo!</p>';
            } else {
                msbFeedbackDisplay.innerHTML = `<p class="font-bold text-red-600 text-lg">Rivedi gli incarichi.<br>${feedbackMessages.join('<br>')}</p>`;
            }
        }
    });
}

if (msbResetButton) { // Nuovo ID
    msbResetButton.addEventListener('click', initializeMsbGame);
}

initializeMsbGame();

        /* --- JAVASCRIPT FOR "ATTIVAZIONE CHIAMATA" --- */
        const activateCallButton = document.getElementById('activate-call-button');
        const activationAudio = document.getElementById('activation-audio');
        const callStatus = document.getElementById('call-status');

        if (activateCallButton && activationAudio && callStatus) {
            activateCallButton.addEventListener('click', () => {
                if (activationAudio.paused) {
                    activationAudio.play()
                        .then(() => {
                            callStatus.textContent = 'Chiamata in corso...';
                            activateCallButton.classList.add('animate-pulse');
                        })
                        .catch(error => {
                            callStatus.textContent = 'Errore durante la riproduzione audio.';
                            console.error('Audio play failed:', error);
                        });
                } else {
                    activationAudio.pause();
                    activationAudio.currentTime = 0;
                    callStatus.textContent = 'Chiamata terminata.';
                    activateCallButton.classList.remove('animate-pulse');
                }
            });

            activationAudio.addEventListener('ended', () => {
                callStatus.textContent = 'Chiamata completata.';
                activateCallButton.classList.remove('animate-pulse');
            });
        }

        /* --- JAVASCRIPT FOR "SCENARIO ASSESSMENT" GAME --- */
        const scenarioGameImage = document.getElementById('scenario-game-image');
        const eventMatchRadios = document.querySelectorAll('input[name="event-match"]');
        const scenarioDescriptionInput = document.getElementById('scenario-description');
        const evolutiveRiskRadios = document.querySelectorAll('input[name="evolutive-risk"]');
        const victimsInvolvedInput = document.getElementById('victims-involved');
        const prevalentPathologiesInput = document.getElementById('prevalent-pathologies');

        const checkScenarioAssessmentBtn = document.getElementById('check-scenario-assessment');
        const resetScenarioAssessmentBtn = document.getElementById('reset-scenario-assessment');

        const scenarioFeedback = {
            eventMatch: document.getElementById('event-match-feedback'),
            description: document.getElementById('scenario-description-feedback'),
            evolutiveRisk: document.getElementById('evolutive-risk-feedback'),
            victims: document.getElementById('victims-involved-feedback'),
            pathologies: document.getElementById('prevalent-pathologies-feedback'),
        };

        const correctScenarioAnswers = {
            eventMatch: 'si', 
            scenarioDescriptionKeywords: ['treno', 'derag', 'vagon', 'ribalta', 'fumo', 'viadotto', 'incidente', 'ferro', 'binari', 'vittim', 'ferit', 'danni', 'ostacol'],
            evolutiveRisk: 'si',
            victimsRange: [300, 500],
            prevalentPathologiesKeywords: ['traum', 'ustion', 'contusion', 'fratt', 'emorrag', 'shock', 'ferit', 'lesion', 'sangue'],
        };

        function resetScenarioAssessment() {
            eventMatchRadios.forEach(radio => radio.checked = false);
            scenarioDescriptionInput.value = '';
            evolutiveRiskRadios.forEach(radio => radio.checked = false);
            victimsInvolvedInput.value = '';
            prevalentPathologiesInput.value = '';

            for (const key in scenarioFeedback) {
                scenarioFeedback[key].textContent = '';
                scenarioFeedback[key].classList.remove('text-green-600', 'text-red-600');
            }
        }

        function checkScenarioAssessment() {
            let allCorrect = true;

            const selectedEventMatch = document.querySelector('input[name="event-match"]:checked')?.value;
            if (selectedEventMatch === correctScenarioAnswers.eventMatch) {
                scenarioFeedback.eventMatch.textContent = 'Corretto!';
                scenarioFeedback.eventMatch.classList.add('text-green-600');
				scenarioFeedback.eventMatch.classList.remove('text-red-600');
            } else {
                scenarioFeedback.eventMatch.textContent = 'Rivedi la risposta: confronta l\'immagine con quanto riferito dal 118.';
                scenarioFeedback.eventMatch.classList.add('text-red-600');
				scenarioFeedback.eventMatch.classList.remove('text-green-600');
                allCorrect = false;
            }

            const userDescription = scenarioDescriptionInput.value.toLowerCase();
            const hasEnoughKeywords = correctScenarioAnswers.scenarioDescriptionKeywords.filter(keyword => userDescription.includes(keyword)).length >= 2;
            if (userDescription.length > 15 && hasEnoughKeywords) {
                scenarioFeedback.description.textContent = 'Descrizione sufficiente!';
                scenarioFeedback.description.classList.add('text-green-600');
				scenarioFeedback.description.classList.remove('text-red-600');
            } else {
                scenarioFeedback.description.textContent = 'Rivedi la descrizione: è troppo breve o poco specifica. Cita almeno 2 elementi che osservi nella scena.';
                scenarioFeedback.description.classList.add('text-red-600');
				scenarioFeedback.description.classList.remove('text-green-600');
                allCorrect = false;
            }

            const selectedEvolutiveRisk = document.querySelector('input[name="evolutive-risk"]:checked')?.value;
            if (selectedEvolutiveRisk === correctScenarioAnswers.evolutiveRisk) {
                scenarioFeedback.evolutiveRisk.textContent = 'Corretto!';
                scenarioFeedback.evolutiveRisk.classList.add('text-green-600');
				scenarioFeedback.evolutiveRisk.classList.remove('text-red-600');
            } else {
                scenarioFeedback.evolutiveRisk.textContent = 'Rivedi la risposta: valuta se nella scena ci sono pericoli che possono aggravarsi.';
                scenarioFeedback.evolutiveRisk.classList.add('text-red-600');
				scenarioFeedback.evolutiveRisk.classList.remove('text-green-600');
                allCorrect = false;
            }

            const victimsCount = parseInt(victimsInvolvedInput.value);
            if (!isNaN(victimsCount) && victimsCount >= correctScenarioAnswers.victimsRange[0] && victimsCount <= correctScenarioAnswers.victimsRange[1]) {
                scenarioFeedback.victims.textContent = 'Stima corretta!';
                scenarioFeedback.victims.classList.add('text-green-600');
				scenarioFeedback.victims.classList.remove('text-red-600');
            } else {
                scenarioFeedback.victims.textContent = 'Rivedi la stima delle vittime: non rientra nell\'ordine di grandezza atteso per un evento di questa portata.';
                scenarioFeedback.victims.classList.add('text-red-600');
				scenarioFeedback.victims.classList.remove('text-green-600');			
                allCorrect = false;
            }

            const userPathologies = prevalentPathologiesInput.value.toLowerCase();
            const hasEnoughPathologyKeywords = correctScenarioAnswers.prevalentPathologiesKeywords.filter(keyword => userPathologies.includes(keyword)).length >= 2;
            if (userPathologies.length > 5 && hasEnoughPathologyKeywords) {
                scenarioFeedback.pathologies.textContent = 'Patologie plausibili!';
                scenarioFeedback.pathologies.classList.add('text-green-600');
				scenarioFeedback.pathologies.classList.remove('text-red-600'); 
            } else {
                scenarioFeedback.pathologies.textContent = 'Rivedi le patologie: indicane almeno 2 coerenti con il tipo di incidente.';
                scenarioFeedback.pathologies.classList.add('text-red-600');
				scenarioFeedback.pathologies.classList.remove('text-green-600');
                allCorrect = false;
            }

            if (allCorrect) {
                if (window.__markDone) window.__markDone('scenario'); scenarioFeedback.eventMatch.parentElement.parentElement.classList.add('border-green-500', 'border-2');
                scenarioFeedback.eventMatch.parentElement.parentElement.classList.remove('border-red-500');
            } else {
                scenarioFeedback.eventMatch.parentElement.parentElement.classList.add('border-red-500', 'border-2');
                scenarioFeedback.eventMatch.parentElement.parentElement.classList.remove('border-green-500');
            }
        }

        if (checkScenarioAssessmentBtn) {
            checkScenarioAssessmentBtn.addEventListener('click', checkScenarioAssessment);
        }
        if (resetScenarioAssessmentBtn) {
            resetScenarioAssessmentBtn.addEventListener('click', resetScenarioAssessment);
        }
        resetScenarioAssessment(); 


        /* --- JAVASCRIPT FOR "COMPITI DEL REFERENTE" GAME --- */
        const referenteTasksOrdered = [ // nell'ordine dell'action card (manuale AREU 2026, p.27)
            "Indossare la fascia gialla in dotazione (se si giunge come primo mezzo).",
            "Effettuare una ricognizione del luogo dell'evento.",
            "Dimensionare l'evento.",
            "Adottare il metodo METHANE, anche confrontandosi con il capo squadra dei Vigili del Fuoco (casco rosso).",
            "Comunicare alla SOREU quanto rilevato, prima possibile.",
            "Effettuare lo sweeping triage START, suddividendo le vittime in codici VERDI, GIALLI e ROSSI e applicando i braccialetti colorati.",
            "Comunicare alla SOREU gli esiti dello sweeping triage e la patologia prevalente (o all'equipaggio del MSA giunto in posto).",
            "All'arrivo del MSA, comunicare quanto eseguito (passaggio di consegne) e mettersi a disposizione."
        ];

        let currentDraggingSortableItem = null;

        const referenteTasksSortableContainer = document.getElementById('referente-tasks-sortable');
        const checkReferenteTasksBtn = document.getElementById('check-referente-tasks');
        const resetReferenteTasksBtn = document.getElementById('reset-referente-tasks');
        const referenteFeedbackArea = document.getElementById('referente-feedback-area');

        function initializeReferenteGame() {
            if (!referenteTasksSortableContainer || !referenteFeedbackArea) return;

            referenteTasksSortableContainer.innerHTML = '';
            referenteFeedbackArea.innerHTML = '<p class="text-sm">Riorganizza i compiti.</p>';

            const shuffledReferenteTasks = [...referenteTasksOrdered].sort(() => Math.random() - 0.5); 

            shuffledReferenteTasks.forEach((taskText, index) => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('role-task-item', 'bg-white', 'hover:bg-gray-100'); 
                taskElement.setAttribute('draggable', 'true');
                taskElement.dataset.originalIndex = referenteTasksOrdered.indexOf(taskText); 
                taskElement.textContent = taskText;

                taskElement.addEventListener('dragstart', (e) => {
                    currentDraggingSortableItem = taskElement;
                    e.dataTransfer.setData('text/plain', taskElement.dataset.originalIndex);
                    setTimeout(() => taskElement.classList.add('dragging'), 0); 
                });

                taskElement.addEventListener('dragend', () => {
                    if (currentDraggingSortableItem) {
                        currentDraggingSortableItem.classList.remove('dragging');
                    }
                    currentDraggingSortableItem = null;
                });

                taskElement.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    if (e.target.classList.contains('role-task-item') && e.target !== currentDraggingSortableItem) {
                        const bounding = e.target.getBoundingClientRect();
                        const offset = bounding.y + (bounding.height / 2);
                        if (e.clientY - offset > 0) {
                            e.target.parentNode.insertBefore(currentDraggingSortableItem, e.target.nextSibling);
                        } else {
                            e.target.parentNode.insertBefore(currentDraggingSortableItem, e.target);
                        }
                    }
                });

                taskElement.addEventListener('dragover', (e) => {
                    e.preventDefault(); 
                });

                referenteTasksSortableContainer.appendChild(taskElement);
            });
        }

        if (checkReferenteTasksBtn) {
            checkReferenteTasksBtn.addEventListener('click', () => {
                const currentOrderElements = Array.from(referenteTasksSortableContainer.children);
                const currentOrderTexts = currentOrderElements.map(el => el.textContent);

                let allCorrect = true;
                let feedback = [];

                for (let i = 0; i < referenteTasksOrdered.length; i++) {
                    if (currentOrderTexts[i] === referenteTasksOrdered[i]) {
                        currentOrderElements[i].classList.remove('incorrect-match');
                        currentOrderElements[i].classList.add('correct-match');
                    } else {
                        currentOrderElements[i].classList.remove('correct-match');
                        currentOrderElements[i].classList.add('incorrect-match');
                        allCorrect = false;
                    }
                }

                if (allCorrect) {
                    if (window.__markDone) window.__markDone('compiti-referente'); referenteFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Eccellente! L\'ordine dei compiti del Referente è perfetto!</p>';
                } else {
                    referenteFeedbackArea.innerHTML = '<p class="font-bold text-red-600 text-lg">Non è l\'ordine corretto. Riprova!</p>';
                }
            });
        }

        if (resetReferenteTasksBtn) {
            resetReferenteTasksBtn.addEventListener('click', initializeReferenteGame);
        }

        initializeReferenteGame(); 


        /* --- JAVASCRIPT FOR "COMUNICAZIONE SOREU: METHANE GAME" --- */
        const methaneGameData = [ // manuale AREU 2026, p.26
            { letter: 'M', definition: 'Maxiemergenza: la confermi?' },
            { letter: 'E', definition: 'Esatta localizzazione dell\'evento.' },
            { letter: 'T', definition: 'Tipo di evento (es. deragliamento, crollo, esplosione).' },
            { letter: 'H', definition: 'Hazards: pericoli presenti (es. fumo, incendio, linea elettrica, materiale pericolante).' },
            { letter: 'A', definition: 'Accessi per i mezzi di soccorso: quali.' },
            { letter: 'N', definition: 'Numero stimato dei coinvolti.' },
            { letter: 'E', definition: 'Enti presenti: Vigili del Fuoco e Forze dell\'Ordine.' }
        ];

        let currentDraggingMethaneLetter = null;
        let placedMethaneLetters = {}; 

        const methaneLettersContainer = document.getElementById('methane-letters-container');
        const methaneDefinitionsContainer = document.getElementById('methane-definitions-container');
        const checkMethaneGameBtn = document.getElementById('check-methane-game');
        const resetMethaneGameBtn = document.getElementById('reset-methane-game');
        const methaneGameFeedback = document.getElementById('methane-game-feedback');

        function initializeMethaneGame() {
            if (!methaneLettersContainer || !methaneDefinitionsContainer || !methaneGameFeedback) return;

            methaneLettersContainer.innerHTML = '';
            methaneDefinitionsContainer.innerHTML = '';
            methaneGameFeedback.innerHTML = '<p class="text-sm">Trascina le lettere sulle definizioni.</p>';
            placedMethaneLetters = {};

            const shuffledLetters = [...methaneGameData].sort(() => Math.random() - 0.5); 
            shuffledLetters.forEach((item, index) => {
                const letterElement = document.createElement('div');
                letterElement.classList.add('methane-letter-item');
                letterElement.setAttribute('draggable', 'true');
                letterElement.textContent = item.letter;
                letterElement.dataset.letter = item.letter; 
                letterElement.dataset.originalDefinition = item.definition; 
                letterElement.dataset.id = `methane-letter-${index}`; 

                letterElement.addEventListener('dragstart', (e) => {
                    currentDraggingMethaneLetter = letterElement;
                    e.dataTransfer.setData('text/plain', letterElement.dataset.id);
                    letterElement.classList.add('dragging');
                });
                letterElement.addEventListener('dragend', () => {
                    if (currentDraggingMethaneLetter) {
                        currentDraggingMethaneLetter.classList.remove('dragging');
                    }
                    currentDraggingMethaneLetter = null;
                });
                methaneLettersContainer.appendChild(letterElement);
            });

            const shuffledDefinitions = [...methaneGameData].sort(() => Math.random() - 0.5); 
            shuffledDefinitions.forEach((item, index) => {
                const dropZone = document.createElement('div');
                dropZone.classList.add('methane-drop-zone');
                dropZone.dataset.correctLetter = item.letter;
                dropZone.dataset.definitionText = item.definition; 
                dropZone.dataset.dropZoneId = `methane-dropzone-${index}`;
                dropZone.innerHTML = `<span class="text-secondary">${item.definition}</span>`; 

                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropZone.classList.add('drag-over');
                });
                dropZone.addEventListener('dragleave', () => {
                    dropZone.classList.remove('drag-over');
                });
                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('drag-over');
                    const letterId = e.dataTransfer.getData('text/plain');
                    const letterElement = document.querySelector(`[data-id="${letterId}"]`);

                    if (letterElement && currentDraggingMethaneLetter === letterElement) {
                        for (const key in placedMethaneLetters) {
                            if (placedMethaneLetters[key].letterElement === letterElement) {
                                const previousDropZone = document.querySelector(`[data-drop-zone-id="${key}"]`);
                                if (previousDropZone) {
                                    previousDropZone.classList.remove('correct', 'incorrect');
                                    previousDropZone.querySelector('.placed-letter')?.remove();
                                    previousDropZone.innerHTML = `<span class="text-secondary">${previousDropZone.dataset.definitionText}</span>`; 
                                }
                                delete placedMethaneLetters[key];
                                break;
                            }
                        }
                        
                        const placedLetterSpan = document.createElement('span');
                        placedLetterSpan.classList.add('placed-letter');
                        placedLetterSpan.textContent = letterElement.dataset.letter;
                        
                        dropZone.innerHTML = `<span class="text-secondary">${item.definition}</span>`; 
                        dropZone.appendChild(placedLetterSpan);
                        
                        letterElement.classList.add('matched');
                        letterElement.style.display = 'none'; 

                        placedMethaneLetters[dropZone.dataset.dropZoneId] = {
                            letterElement: letterElement,
                            letter: letterElement.dataset.letter
                        };
                    }
                });
                methaneDefinitionsContainer.appendChild(dropZone);
            });
        }

        if (checkMethaneGameBtn) {
            checkMethaneGameBtn.addEventListener('click', () => {
                let allCorrect = true;
                let feedbackMessages = [];
                
                methaneDefinitionsContainer.querySelectorAll('.methane-drop-zone').forEach(dropZone => {
                    dropZone.classList.remove('correct', 'incorrect');
                    const placedLetterSpan = dropZone.querySelector('.placed-letter');
                    
                    if (placedLetterSpan) {
                        const droppedLetter = placedLetterSpan.textContent;
                        const correctLetter = dropZone.dataset.correctLetter;

                        if (droppedLetter === correctLetter) {
                            dropZone.classList.add('correct');
                            feedbackMessages.push(`✔️ La lettera '${droppedLetter}' per "${dropZone.dataset.definitionText}" è corretta.`);
                        } else {
                            dropZone.classList.add('incorrect');
                            feedbackMessages.push(`❌ La lettera '${droppedLetter}' per "${dropZone.dataset.definitionText}" è sbagliata. Doveva essere '${correctLetter}'.`);
                            allCorrect = false;
                        }
                    } else {
                        dropZone.classList.add('incorrect'); 
                        feedbackMessages.push(`❌ La definizione per "${dropZone.dataset.definitionText}" è vuota.`);
                        allCorrect = false;
                    }
                });

                if (methaneGameFeedback) {
                    if (allCorrect && Object.keys(placedMethaneLetters).length === methaneGameData.length) {
                        if (window.__markDone) window.__markDone('comunicazione-soreu'); methaneGameFeedback.innerHTML = '<p class="font-bold text-green-600">Complimenti! Tutti gli abbinamenti M.E.T.H.A.N.E. sono corretti!</p>';
                    } else {
                        methaneGameFeedback.innerHTML = `<p class="font-bold text-red-600">Rivedi gli abbinamenti. ${feedbackMessages.join('<br>')}</p>`;
                    }
                }
            });
        }

        if (resetMethaneGameBtn) {
            resetMethaneGameBtn.addEventListener('click', initializeMethaneGame);
        }

        initializeMethaneGame(); 

/* --- JAVASCRIPT FOR "ABBINA IL RUOLO AL COLORE" GAME --- */
   const roleColorData = [
        { role: 'Direttore dei Soccorsi Sanitari', acronym: 'DSS', color: 'bg-yellow-400', nome: 'gialla' },
        { role: 'Coordinatore Incidente Maggiore', acronym: 'CIM', color: 'pettorina-scacchi', nome: 'a scacchi giallo-rossa' },
        { role: 'Direttore del PMA', acronym: 'PMA', color: 'bg-white border-2 border-black', nome: 'bianca' },
        { role: 'Direttore del Triage', acronym: 'Triage', color: 'bg-red-600', nome: 'rossa' },
        { role: 'Direttore dei Trasporti', acronym: 'Trasporti', color: 'bg-blue-500', nome: 'blu' }
    ];

    let currentDraggingRole = null;
    let placedRoleColorsMap = new Map();

    const roleDraggableContainer = document.getElementById('role-draggable-container');
    const colorDropzoneContainer = document.getElementById('color-dropzone-container');
    const checkRoleColorGameBtn = document.getElementById('check-role-color-game');
    const resetRoleColorGameBtn = document.getElementById('reset-role-color-game');
    const roleColorFeedback = document.getElementById('role-color-feedback');

    function initializeRoleColorGame() {
        if (!roleDraggableContainer || !colorDropzoneContainer || !roleColorFeedback) return;

        roleDraggableContainer.innerHTML = '';
        colorDropzoneContainer.innerHTML = '';
        roleColorFeedback.innerHTML = '<p class="text-sm">Trascina i ruoli sulle pettorine colorate.</p>';
        placedRoleColorsMap.clear();

        // Ruoli trascinabili
        const shuffledRoles = [...roleColorData].sort(() => Math.random() - 0.5);
        shuffledRoles.forEach((item, index) => {
            const roleElement = document.createElement('div');
            roleElement.classList.add('role-task-item', 'bg-white', 'hover:bg-gray-100');
            roleElement.setAttribute('draggable', 'true');
            roleElement.textContent = item.role;
            roleElement.dataset.roleAcronym = item.acronym;
            roleElement.dataset.roleColor = item.color;
            roleElement.dataset.id = `role-item-${index}`;

            roleElement.addEventListener('dragstart', (e) => {
                currentDraggingRole = roleElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData('text/plain', roleElement.dataset.id);
                }
                roleElement.classList.add('selected-for-match');
            });

            roleElement.addEventListener('dragend', () => {
                if (currentDraggingRole) {
                    currentDraggingRole.classList.remove('selected-for-match');
                }
                currentDraggingRole = null;
            });

            roleElement.addEventListener('click', (e) => {
                document.querySelectorAll('#role-draggable-container .role-task-item').forEach(item => item.classList.remove('selected-for-match'));
                e.target.classList.add('selected-for-match');
                currentDraggingRole = e.target;
            });

            roleElement.style.display = '';
            roleElement.classList.remove('matched', 'correct-match', 'incorrect-match');

            roleDraggableContainer.appendChild(roleElement);
        });

        // Dropzone colorate
        const shuffledColors = [...roleColorData].sort(() => Math.random() - 0.5);
        shuffledColors.forEach((item, index) => {
            const dropZone = document.createElement('div');
            dropZone.classList.add('role-drop-zone', 'w-32', 'h-32', 'rounded-full', 'flex', 'items-center', 'justify-content-center', 'relative');
            dropZone.classList.add(...item.color.split(' '));
            dropZone.dataset.correctAcronym = item.acronym;
            dropZone.dataset.colorName = item.color;
            dropZone.dataset.colorLabel = item.nome;
            dropZone.dataset.dropZoneId = `color-dropzone-${index}`;

            // L'acronimo sarà visualizzato sopra il colore, senza mai coprire il colore di sfondo!
            const acronymPlaceholder = document.createElement('span');
            acronymPlaceholder.classList.add('role-acronym-placeholder', 'text-center', 'font-bold', item.acronym.length > 4 ? 'text-lg' : 'text-2xl');
            acronymPlaceholder.style.background = 'transparent'; // esplicito per sicurezza
            acronymPlaceholder.style.position = 'absolute';
            acronymPlaceholder.style.width = '100%';
            acronymPlaceholder.style.left = '0';
            acronymPlaceholder.style.top = '50%';
            acronymPlaceholder.style.transform = 'translateY(-50%)';
            acronymPlaceholder.style.pointerEvents = 'none'; // cosi non blocca il drop

            dropZone.appendChild(acronymPlaceholder);

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('active-drop');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('active-drop');
            });

            // Funzione helper interna
            const handleDropOrClick = (roleElementToPlace, targetDropZone) => {
                if (!roleElementToPlace || !targetDropZone) return;

                // Rimuovi da eventuale vecchia dropZone
                for (let [zoneId, roleObj] of placedRoleColorsMap.entries()) {
                    if (roleObj.roleElement === roleElementToPlace) {
                        const prevDropZone = document.querySelector(`[data-drop-zone-id="${zoneId}"]`);
                        if (prevDropZone) {
                            const prevAcronymPlaceholder = prevDropZone.querySelector('.role-acronym-placeholder');
                            if (prevAcronymPlaceholder) prevAcronymPlaceholder.textContent = '';
                            prevDropZone.classList.remove('correct-match', 'incorrect-match', 'filled');
                        }
                        placedRoleColorsMap.delete(zoneId);
                        break;
                    }
                }

                // Se nella dropZone c'è già qualcosa, rimettilo nel palette
                const existingRoleIdInTargetZone = placedRoleColorsMap.get(targetDropZone.dataset.dropZoneId)?.roleElement?.dataset?.id;
                if (existingRoleIdInTargetZone) {
                    const existingRoleElementInTargetZone = document.querySelector(`[data-id="${existingRoleIdInTargetZone}"]`);
                    if (existingRoleElementInTargetZone && roleDraggableContainer) {
                        roleDraggableContainer.appendChild(existingRoleElementInTargetZone);
                        existingRoleElementInTargetZone.classList.remove('matched', 'correct-match', 'incorrect-match');
                        existingRoleElementInTargetZone.style.display = '';
                    }
                    placedRoleColorsMap.delete(targetDropZone.dataset.dropZoneId);
                }

                // Visualizza l'acronimo SENZA nessuno sfondo, solo testo sopra il colore!
                const targetAcronymPlaceholder = targetDropZone.querySelector('.role-acronym-placeholder');
                if (targetAcronymPlaceholder) {
                    targetAcronymPlaceholder.textContent = roleElementToPlace.dataset.roleAcronym || '';
                    targetAcronymPlaceholder.classList.remove('text-white', 'text-black');
                    targetAcronymPlaceholder.classList.add(targetDropZone.dataset.colorName.includes('bg-white') ? 'text-black' : 'text-white');
                }

                roleElementToPlace.classList.add('matched');
                roleElementToPlace.style.display = 'none';

                targetDropZone.classList.add('filled');
                placedRoleColorsMap.set(targetDropZone.dataset.dropZoneId, {
                    roleElement: roleElementToPlace,
                    acronym: roleElementToPlace.dataset.roleAcronym,
                    correctColor: targetDropZone.dataset.colorName
                });

                currentDraggingRole = null;
                document.querySelectorAll('#role-draggable-container .role-task-item').forEach(item => item.classList.remove('selected-for-match'));
            };

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('active-drop');
                const roleId = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
                const roleElement = roleId ? document.querySelector(`[data-id="${roleId}"]`) : null;

                if (roleElement && currentDraggingRole === roleElement) {
                    handleDropOrClick(roleElement, dropZone);
                }
            });

            dropZone.addEventListener('click', () => {
                if (currentDraggingRole) {
                    handleDropOrClick(currentDraggingRole, dropZone);
                }
            });

            colorDropzoneContainer.appendChild(dropZone);
        });

        // Listener per verifica abbinamenti
        if (checkRoleColorGameBtn) {
            checkRoleColorGameBtn.onclick = function () {
                let allCorrect = true;
                let feedbackMessages = [];
                let correctMatchesCount = 0;

                colorDropzoneContainer.querySelectorAll('.role-drop-zone').forEach(dropZone => {
                    dropZone.classList.remove('correct-match', 'incorrect-match');
                });
                document.querySelectorAll('#role-draggable-container .role-task-item').forEach(item => {
                    item.classList.remove('correct-match', 'incorrect-match');
                });

                colorDropzoneContainer.querySelectorAll('.role-drop-zone').forEach(dropZone => {
                    const placedAcronymSpan = dropZone.querySelector('.role-acronym-placeholder');
                    const placedAcronym = placedAcronymSpan ? placedAcronymSpan.textContent : '';
                    const correctAcronym = dropZone.dataset.correctAcronym;
                    const originalColorName = dropZone.dataset.colorName;

                    if (placedAcronym) {
                        if (placedAcronym === correctAcronym) {
                            dropZone.classList.add('correct-match');
                            feedbackMessages.push(`✔️ ${placedAcronym} è stato abbinato correttamente al suo colore.`);
                            correctMatchesCount++;
                        } else {
                            dropZone.classList.add('incorrect-match');
                            allCorrect = false;
                            feedbackMessages.push(`❌ ${placedAcronym} è sbagliato per questo colore. Doveva essere ${correctAcronym}.`);
                        }
                    } else {
                        dropZone.classList.add('incorrect-match');
                        allCorrect = false;
                        feedbackMessages.push(`❌ La pettorina ${dropZone.dataset.colorLabel} (${correctAcronym}) è vuota.`);
                    }
                });

  

                if (roleColorFeedback) {
                    if (allCorrect && correctMatchesCount === roleColorData.length) {
                        if (window.__markDone) window.__markDone('attori-colori'); roleColorFeedback.innerHTML = '<p class="font-bold text-green-600">Complimenti! Tutti gli abbinamenti Ruolo-Colore sono corretti!</p>';
                    } else {
                        roleColorFeedback.innerHTML = `<p class="font-bold text-red-600">Rivedi gli abbinamenti. ${feedbackMessages.join('<br>')}</p>`;
                    }
                }
            };
        }

        // Listener per reset
        if (resetRoleColorGameBtn) {
            resetRoleColorGameBtn.onclick = initializeRoleColorGame;
        }
    }

    // Avvio gioco
    initializeRoleColorGame();
	
	/* --- CHART FOR TRIAGE SWEEPING DISTRIBUTION --- */
const triageCtx = document.getElementById('triageChart');
if (triageCtx) {
    // Esposto su window: il flusso del triage (in un altro scope) lo riempie man mano.
    window.__triageChart = new Chart(triageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Verde (Lieve)', 'Giallo (Urgenza)', 'Rosso (Critico)'],
            datasets: [{
                label: 'Pazienti',
                data: [100, 0, 0], // Inizio: solo VERDE (primo passo del triage). Si morfa fino a 60/30/10.
                backgroundColor: [
                    '#48bb78', // Green-500
                    '#ecc94b', // Yellow-500
                    '#e53e3e'  // Red-500
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false, // Il titolo è già nell'HTML
                    text: 'Distribuzione tipica dei codici (Triage Sweeping)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

        /* --- JAVASCRIPT FOR "INTERAGISCI CON GLI ALTRI ENTI" GAME --- */
        const otherForcesQuestions = [
            {
                question: "1) Sei il primo MSB sul posto e la scena è instabile con rischio di crollo. Con chi devi interagire per ottenere l'autorizzazione all'accesso in sicurezza?",
                options: [
                    { text: "Il Funzionario di Polizia (casacca blu/divisa)", correct: false },
                    { text: "Il Capo Squadra dei Vigili del Fuoco (casco rosso)", correct: true },
                    { text: "Il Volontario della Protezione Civile (casacca giallo/arancio)", correct: false },
                    { text: "Il Direttore dei Soccorsi Sanitari (DSS)", correct: false }
                ],
                feedback: "Per la messa in sicurezza e l'autorizzazione all'accesso in scenari instabili, i Vigili del Fuoco sono l'autorità competente."
            },
            {
                question: "2) Sul crash mancano materiale e personale. A chi li chiede il Direttore del Triage?",
                options: [
                    { text: "Direttamente alla SOREU", correct: false },
                    { text: "Al DSS, al CIM o al Direttore dei Trasporti", correct: true },
                    { text: "Alla Protezione Civile", correct: false },
                    { text: "Alle Forze dell'Ordine", correct: false }
                ],
                feedback: "Il Direttore del Triage si rapporta con DSS, CIM e Direttore dei Trasporti per materiale e risorse umane, e non contatta mai direttamente la SOREU (manuale AREU 2026, p. 16)."
            },
            {
                question: "3) Al PMA mancano materiale e personale. A chi li chiede il Direttore del PMA?",
                options: [
                    { text: "Alla Protezione Civile", correct: false },
                    { text: "Ai Vigili del Fuoco", correct: false },
                    { text: "Al Direttore dei Soccorsi Sanitari o al Coordinatore Incidente Maggiore", correct: true },
                    { text: "Alle Forze dell'Ordine", correct: false }
                ],
                feedback: "Il Direttore del PMA si rapporta costantemente con il DSS e il CIM per la fornitura di materiale e risorse umane; il CIM risolve i problemi tecnici e logistici (manuale AREU 2026, p. 15 e 18)."
            },
            {
                question: "4) Nelle fasi iniziali, chi costituisce il Posto di Comando Avanzato provvisorio?",
                options: [
                    { text: "Il primo mezzo sanitario, la prima squadra dei Vigili del Fuoco e il primo mezzo delle Forze dell'Ordine", correct: true },
                    { text: "Il Direttore dei Soccorsi Sanitari da solo", correct: false },
                    { text: "La Protezione Civile e il Comune", correct: false },
                    { text: "I primi tre mezzi sanitari arrivati", correct: false }
                ],
                feedback: "Nelle fasi iniziali i referenti della prima ambulanza, della prima squadra dei VVF e del primo mezzo delle Forze dell'Ordine costituiscono il PCA provvisorio (manuale AREU 2026, p. 25)."
            },
            {
                question: "5) Hai bisogno di informazioni precise sulla presenza di materiali pericolosi o sulla stabilità di strutture danneggiate. Quale figura devi consultare?",
                options: [
                    { text: "Il Direttore del Triage", correct: false },
                    { text: "Il Capo Squadra dei Vigili del Fuoco", correct: true },
                    { text: "Il Direttore del PMA", correct: false },
                    { text: "Un operatore del 118", correct: false }
                ],
                feedback: "I Vigili del Fuoco sono esperti nella valutazione dei pericoli strutturali, chimici e ambientali."
            },
             {
                question: "6) Un paziente stabilizzato al PMA deve andare in ospedale. Chi decide l'ospedale di destinazione?",
                options: [
                    { text: "Il Capo Squadra dei Vigili del Fuoco", correct: false },
                    { text: "Il Direttore del Triage", correct: false },
                    { text: "La Centrale Operativa 118 (SOREU)", correct: true },
                    { text: "Il Direttore del PMA", correct: false }
                ],
                feedback: "La destinazione la indica la SOREU, in base alle condizioni riferite dal Direttore del PMA; il Direttore dei Trasporti le comunica il codice colore del paziente e il mezzo (manuale AREU 2026, p. 17)."
            },
            {
                question: "7) C'è uno sversamento di sostanze pericolose. Come si comporta il primo mezzo di soccorso?",
                options: [
                    { text: "Entra con i dispositivi di protezione per valutare subito i feriti", correct: false },
                    { text: "Si avvicina sopravento, si ferma a distanza (circa 500-800 metri), avvisa la SOREU e attende i Vigili del Fuoco", correct: true },
                    { text: "Chiede alla Protezione Civile di isolare l'area", correct: false },
                    { text: "Aspetta istruzioni dalle Forze dell'Ordine", correct: false }
                ],
                feedback: "Con sostanze pericolose i primi mezzi si avvicinano sopravento, si fermano a distanza adeguata, attendono i VVF facendo riferimento al caposquadra e avvisano la SOREU (manuale AREU 2026, p. 30)."
            },
            {
                question: "8) È necessario gestire il flusso dei mezzi di soccorso in arrivo e in uscita dall'area dell'incidente, per evitare ingorghi. Chi è il responsabile di questo coordinamento?",
                options: [
                    { text: "Il Direttore dei Soccorsi Sanitari (DSS)", correct: false },
                    { text: "Il Direttore dei Trasporti", correct: true },
                    { text: "Il Direttore del Triage", correct: false },
                    { text: "Un Ufficiale di Polizia Locale", correct: false }
                ],
                feedback: "Il Direttore dei Trasporti determina i check point, punti di passaggio obbligatorio dei mezzi, censisce mezzi e personale e registra i mezzi in entrata e in uscita (manuale AREU 2026, p. 17)."
            }
        ];

        let currentOtherForcesQuestionIndex = 0;
        let otherForcesCorrectAnswers = 0;

        const otherForcesQuestionText = document.getElementById('other-forces-question-text');
        const otherForcesOptionsContainer = document.getElementById('other-forces-options-container');
        const otherForcesFeedback = document.getElementById('other-forces-feedback');
        const otherForcesNextButton = document.getElementById('other-forces-next-button');
        const otherForcesRestartButton = document.getElementById('other-forces-restart-button');
        const otherForcesProgress = document.getElementById('other-forces-progress');

        function loadOtherForcesQuestion() {
            if (currentOtherForcesQuestionIndex < otherForcesQuestions.length) {
                const questionData = otherForcesQuestions[currentOtherForcesQuestionIndex];
                if (otherForcesQuestionText) otherForcesQuestionText.textContent = questionData.question;
                if (otherForcesOptionsContainer) otherForcesOptionsContainer.innerHTML = '';
                if (otherForcesFeedback) otherForcesFeedback.classList.add('hidden');
                if (otherForcesNextButton) otherForcesNextButton.classList.add('hidden');
                if (otherForcesRestartButton) otherForcesRestartButton.classList.add('hidden');
                if (otherForcesProgress) otherForcesProgress.textContent = `Situazione ${currentOtherForcesQuestionIndex + 1} di ${otherForcesQuestions.length}`;

                questionData.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('quiz-option', 'rounded-lg', 'shadow-sm', 'p-3', 'cursor-pointer');
                    optionElement.textContent = option.text;
                    optionElement.dataset.correct = option.correct;
                    optionElement.addEventListener('click', handleOtherForcesAnswerClick);
                    if (otherForcesOptionsContainer) otherForcesOptionsContainer.appendChild(optionElement);
                });
            } else {
                displayOtherForcesResults();
            }
        }

        function handleOtherForcesAnswerClick(event) {
            const selectedOption = event.target;
            const isCorrect = selectedOption.dataset.correct === 'true';
            const questionData = otherForcesQuestions[currentOtherForcesQuestionIndex];

            Array.from(otherForcesOptionsContainer.children).forEach(option => {
                option.classList.add('disabled');
                option.removeEventListener('click', handleOtherForcesAnswerClick);
            });

            if (isCorrect) {
                selectedOption.classList.add('correct');
                if (otherForcesFeedback) {
                    otherForcesFeedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                    otherForcesFeedback.classList.add('bg-green-100', 'text-green-700');
                    otherForcesFeedback.textContent = `Corretto! ${questionData.feedback || ''}`;
                }
                otherForcesCorrectAnswers++;
            } else {
                selectedOption.classList.add('incorrect');
                const correctOptionElement = Array.from(otherForcesOptionsContainer.children).find(option => option.dataset.correct === 'true');
                if (correctOptionElement) {
                    correctOptionElement.classList.add('correct');
                }
                if (otherForcesFeedback) {
                    otherForcesFeedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                    otherForcesFeedback.classList.add('bg-red-100', 'text-red-700');
                    otherForcesFeedback.textContent = `Sbagliato. ${questionData.feedback || ''}`;
                }
            }
            if (otherForcesNextButton) otherForcesNextButton.classList.remove('hidden');
        }

        function displayOtherForcesResults() {
            if (otherForcesQuestionText) otherForcesQuestionText.textContent = `Gioco Completato!`;
            if (otherForcesOptionsContainer) otherForcesOptionsContainer.innerHTML = '';
            if (otherForcesFeedback) {
                otherForcesFeedback.classList.remove('hidden', 'bg-red-100', 'bg-green-100', 'text-red-700', 'text-green-700');
                otherForcesFeedback.classList.add('bg-blue-100', 'text-blue-700');
                otherForcesFeedback.textContent = `Hai risposto correttamente a ${otherForcesCorrectAnswers} situazioni su ${otherForcesQuestions.length}.`;
            }
            if (otherForcesNextButton) otherForcesNextButton.classList.add('hidden');
            if (otherForcesRestartButton) otherForcesRestartButton.classList.remove('hidden');
            if (otherForcesProgress) otherForcesProgress.textContent = '';
        }

        if (otherForcesNextButton) {
            otherForcesNextButton.addEventListener('click', () => {
                currentOtherForcesQuestionIndex++;
                loadOtherForcesQuestion();
            });
        }

        if (otherForcesRestartButton) {
            otherForcesRestartButton.addEventListener('click', () => {
                currentOtherForcesQuestionIndex = 0;
                otherForcesCorrectAnswers = 0;
                loadOtherForcesQuestion();
            });
        }

        initializeOtherForcesGame = loadOtherForcesQuestion; 
        initializeOtherForcesGame(); 


		/* --- JAVASCRIPT FOR "ABBINA LE DEFINIZIONI ALLE ZONE OPERATIVE" GAME --- */
		const zoneDefinitionsData = [ // le aree del manuale AREU 2026 (p. 17, 19-20, 28, 30) e della lezione (istruzioni per il primo MSB)
			{
				zone: 'Luogo dell\'evento (crash)',
				definition: 'Il luogo del crash, circondato dall\'area di sicurezza da mantenere sgombra. Si entra solo dopo la ricognizione e con l\'autorizzazione dei Vigili del Fuoco, per lo sweeping triage.'
			},
			{
				zone: 'Area di raccolta dei codici giallo/rossi',
				definition: 'Un\'area sicura vicino al crash dove si convogliano le vittime in attesa del PMA: vi si porta il materiale dei mezzi e si iniziano le manovre salvavita. Se manca una struttura dedicata coincide con il PMA (PMA funzionale).'
			},
			{
				zone: 'Posto Medico Avanzato (PMA)',
				definition: 'Ai margini esterni dell\'area di sicurezza, con una buona viabilità di accesso e di evacuazione e, se possibile, entrata e uscita separate. Di norma vi accedono solo i codici giallo e rosso, che vengono rivalutati e stabilizzati.'
			},
			{
				zone: 'Area dei codici verdi',
				definition: 'Un\'area sicura, a debita distanza dal luogo dell\'evento, per chi ha il codice verde. La identifica il Soccorritore del primo MSB, che la tiene sotto controllo perché nessuno rientri nell\'area dell\'incidente.'
			},
			{
				zone: 'Check point',
				definition: 'I punti di passaggio obbligatori per tutti i mezzi in entrata e in uscita dal cantiere (check in e check out). Li individua l\'Autista del primo MSB, poi li determina e li presidia il Direttore dei Trasporti.'
			},
			{
				zone: 'Area delle salme',
				definition: 'Un\'area a parte dove si raccolgono le salme, dopo il consenso dell\'Autorità Giudiziaria.'
			}
		];

		let currentDraggingDefinition = null;
		// Mappa per tenere traccia quale definizione (ID) è piazzata in quale dropZone (ID)
		let placedZoneDefinitionsMap = new Map();

		const zoneDefinitionsDraggableContainer = document.getElementById('zone-definitions-draggable');
		// Seleziona solo le drop zone con l'attributo data-drop-zone-for
		const zoneGameDropZones = document.querySelectorAll('#zone-diagram-game .role-drop-zone[data-drop-zone-for]');
		const checkZoneGameBtn = document.getElementById('check-zone-game');
		const resetZoneGameBtn = document.getElementById('reset-zone-game');
		const zoneGameFeedback = document.getElementById('zone-game-feedback');

		function initializeZoneGame() {
			if (!zoneDefinitionsDraggableContainer || !zoneGameFeedback) return;

			zoneDefinitionsDraggableContainer.innerHTML = '';
			zoneGameFeedback.innerHTML = '<p class="text-sm">Trascina le definizioni sulle aree corrispondenti.</p>';
			placedZoneDefinitionsMap.clear(); // Resetta la mappa delle definizioni piazzate

			// Resetta tutte le drop zone ai loro stati iniziali e alla loro formattazione
			zoneGameDropZones.forEach(zone => {
				zone.classList.remove('correct-match', 'incorrect-match', 'filled');
				// Rimuove eventuali elementi figli che non siano lo span del titolo
				Array.from(zone.children).forEach(child => {
					if (!child.classList.contains('role-title')) {
						child.remove();
					}
				});
				const roleTitleSpan = zone.querySelector('.role-title');
				if (roleTitleSpan) {
					roleTitleSpan.style.display = ''; // Assicura che il titolo sia visibile
					roleTitleSpan.classList.remove('text-green-600', 'text-red-600', 'text-yellow-600', 'font-bold', 'text-sm'); // Rimuovi classi temporanee
					// Le aree non hanno un colore: il titolo torna nel colore del testo
					const originalColorClass = 'text-primary';
					roleTitleSpan.classList.add(originalColorClass, 'font-bold', 'text-sm');
				}
			});

			// Crea e aggiungi le definizioni trascinabili (mischia l'ordine)
			const shuffledDefinitions = [...zoneDefinitionsData].sort(() => Math.random() - 0.5);
			shuffledDefinitions.forEach((item, index) => {
				const definitionElement = document.createElement('div');
				definitionElement.classList.add('role-task-item', 'bg-white', 'hover:bg-gray-100');
				definitionElement.setAttribute('draggable', 'true');
				definitionElement.textContent = item.definition;
				definitionElement.dataset.correctZone = item.zone; // La zona corretta per questa definizione
				definitionElement.dataset.id = `zone-def-${index}`; // ID unico per l'elemento trascinabile

				definitionElement.addEventListener('dragstart', (e) => {
					currentDraggingDefinition = definitionElement;
					e.dataTransfer.setData('text/plain', definitionElement.dataset.id);
					definitionElement.classList.add('selected-for-match'); // Evidenzia l'elemento trascinato
				});

				definitionElement.addEventListener('dragend', () => {
					if (currentDraggingDefinition) {
						currentDraggingDefinition.classList.remove('selected-for-match');
					}
					currentDraggingDefinition = null;
				});

				// Permetti il click per selezionare l'elemento se non si vuole trascinare
				definitionElement.addEventListener('click', (e) => {
					document.querySelectorAll('#zone-definitions-draggable .role-task-item').forEach(item => item.classList.remove('selected-for-match'));
					e.target.classList.add('selected-for-match');
					currentDraggingDefinition = e.target;
				});

				zoneDefinitionsDraggableContainer.appendChild(definitionElement);
			});
		}

		// Aggiungi event listeners alle drop zone
		zoneGameDropZones.forEach(zone => {
			// Aggiungi un ID univoco per ogni drop zone basato sul suo tipo
			zone.dataset.dropZoneId = `zone-drop-${zone.dataset.dropZoneFor.replace(/\s/g, '-')}`;

			zone.addEventListener('dragover', (e) => {
				e.preventDefault(); // Permette il drop
				zone.classList.add('active-drop');
			});

			zone.addEventListener('dragleave', () => {
				zone.classList.remove('active-drop');
			});

			zone.addEventListener('drop', (e) => {
				e.preventDefault();
				zone.classList.remove('active-drop');
				const definitionId = e.dataTransfer.getData('text/plain');
				const definitionElement = document.querySelector(`[data-id="${definitionId}"]`);

				if (definitionElement && currentDraggingDefinition === definitionElement) {
					// Cerca se l'elemento trascinato era già in una drop zone
					let previousDropZone = null;
					for (let [zoneId, defObj] of placedZoneDefinitionsMap.entries()) {
						if (defObj.definitionElement === definitionElement) {
							previousDropZone = document.querySelector(`[data-drop-zone-id="${zoneId}"]`);
							break;
						}
					}

					// Rimuovi l'elemento dalla sua precedente drop zone se presente
					if (previousDropZone) {
						const prevTitleSpan = previousDropZone.querySelector('.role-title');
						if (prevTitleSpan) prevTitleSpan.style.display = ''; // Ri-mostra il titolo
						definitionElement.remove(); // Rimuove l'elemento dal DOM precedente
						placedZoneDefinitionsMap.delete(previousDropZone.dataset.dropZoneId); // Rimuovi dal tracking
					} else {
						// Se non era in una drop zone, rimuovilo dal contenitore draggable
						definitionElement.parentNode.removeChild(definitionElement);
					}

					// Se la dropzone attuale ha già un elemento, rimettilo nel contenitore draggable
					const existingElementInTargetZone = Array.from(zone.children).find(child => child.classList.contains('role-task-item'));
					if (existingElementInTargetZone) {
						zoneDefinitionsDraggableContainer.appendChild(existingElementInTargetZone);
						existingElementInTargetZone.classList.remove('matched', 'correct-match', 'incorrect-match');
						existingElementInTargetZone.style.display = ''; // Assicurati che sia visibile
					}


					// Sposta l'elemento trascinato nella drop zone attuale
					zone.appendChild(definitionElement);
					definitionElement.classList.remove('bg-white', 'hover:bg-gray-100', 'selected-for-match');
					definitionElement.classList.add('matched'); // Indica che è stato abbinato
					definitionElement.style.backgroundColor = 'transparent'; // Evita background specifici dell'item

					// Nascondi il titolo originale della drop zone se un elemento è stato piazzato
					const roleTitleSpan = zone.querySelector('.role-title');
					if (roleTitleSpan) {
						roleTitleSpan.style.display = ''; // il nome dell'area resta visibile sopra la definizione
					}

					// Aggiungi la definizione piazzata alla mappa di tracking
					placedZoneDefinitionsMap.set(zone.dataset.dropZoneId, {
						definitionElement: definitionElement,
						correctZone: definitionElement.dataset.correctZone
					});

					currentDraggingDefinition = null; // Resetta l'elemento trascinato
				}
			});

			// Gestisci il drop tramite click (se un elemento è selezionato)
			zone.addEventListener('click', () => {
				if (currentDraggingDefinition) {
					const definitionElement = currentDraggingDefinition;
					const definitionId = definitionElement.dataset.id;

					// Simula la logica del drop
					// Cerca se l'elemento trascinato era già in una drop zone
					let previousDropZone = null;
					for (let [zoneId, defObj] of placedZoneDefinitionsMap.entries()) {
						if (defObj.definitionElement === definitionElement) {
							previousDropZone = document.querySelector(`[data-drop-zone-id="${zoneId}"]`);
							break;
						}
					}

					if (previousDropZone) {
						const prevTitleSpan = previousDropZone.querySelector('.role-title');
						if (prevTitleSpan) prevTitleSpan.style.display = '';
						definitionElement.remove();
						placedZoneDefinitionsMap.delete(previousDropZone.dataset.dropZoneId);
					} else {
						definitionElement.parentNode.removeChild(definitionElement);
					}

					// Se la dropzone attuale ha già un elemento, rimettilo nel contenitore draggable
					const existingElementInTargetZone = Array.from(zone.children).find(child => child.classList.contains('role-task-item'));
					if (existingElementInTargetZone) {
						zoneDefinitionsDraggableContainer.appendChild(existingElementInTargetZone);
						existingElementInTargetZone.classList.remove('matched', 'correct-match', 'incorrect-match');
						existingElementInTargetZone.style.display = '';
					}

					zone.appendChild(definitionElement);
					definitionElement.classList.remove('bg-white', 'hover:bg-gray-100', 'selected-for-match');
					definitionElement.classList.add('matched');
					definitionElement.style.backgroundColor = 'transparent';

					const roleTitleSpan = zone.querySelector('.role-title');
					if (roleTitleSpan) {
						roleTitleSpan.style.display = ''; // il nome dell'area resta visibile sopra la definizione
					}

					placedZoneDefinitionsMap.set(zone.dataset.dropZoneId, {
						definitionElement: definitionElement,
						correctZone: definitionElement.dataset.correctZone
					});

					currentDraggingDefinition = null;
					document.querySelectorAll('#zone-definitions-draggable .role-task-item').forEach(item => item.classList.remove('selected-for-match'));
				}
			});
		});

		if (checkZoneGameBtn) {
			checkZoneGameBtn.addEventListener('click', () => {
				let allCorrect = true;
				let feedbackMessages = [];
				let correctMatchesCount = 0;

				// Rimuovi feedback precedenti su tutti gli elementi
				zoneGameDropZones.forEach(dropZone => {
					dropZone.classList.remove('correct-match', 'incorrect-match');
					const placedDefElement = dropZone.querySelector('.role-task-item');
					if (placedDefElement) {
						placedDefElement.classList.remove('correct-match', 'incorrect-match');
					}
				});
				// Rimuovi feedback dagli elementi non piazzati
				document.querySelectorAll('#zone-definitions-draggable .role-task-item').forEach(item => {
					item.classList.remove('correct-match', 'incorrect-match');
				});


				zoneGameDropZones.forEach(dropZone => {
					const placedDefinitionElement = dropZone.querySelector('.role-task-item');
					const originalZoneType = dropZone.dataset.dropZoneFor; // La zona che questa dropzone rappresenta

					if (placedDefinitionElement) {
						const correctZoneForDefinition = placedDefinitionElement.dataset.correctZone; // La zona corretta per questa definizione

						if (originalZoneType === correctZoneForDefinition) {
							// Se la definizione è stata piazzata nella sua zona corretta
							dropZone.classList.add('correct-match');
							placedDefinitionElement.classList.add('correct-match');
							feedbackMessages.push(`✔️ Definizione per "${originalZoneType}" è corretta.`);
							correctMatchesCount++;
						} else {
							// Se la definizione è stata piazzata in una zona sbagliata
							dropZone.classList.add('incorrect-match');
							placedDefinitionElement.classList.add('incorrect-match');
							allCorrect = false;
							const definitionText = placedDefinitionElement.textContent;
							feedbackMessages.push(`❌ La definizione "${definitionText.substring(0, 50)}..." è sbagliata per l'area "${originalZoneType}". Doveva essere la definizione di "${correctZoneForDefinition}".`);
						}
					} else {
						// La drop zone è vuota
						dropZone.classList.add('incorrect-match');
						allCorrect = false;
						feedbackMessages.push(`❌ L'area "${originalZoneType}" è vuota.`);
					}
				});

				// Controlla anche gli elementi rimasti nel contenitore trascinabile
				const remainingDraggableItems = zoneDefinitionsDraggableContainer.querySelectorAll('.role-task-item');
				remainingDraggableItems.forEach(item => {
					item.classList.add('incorrect-match'); // Segna come errore gli elementi non piazzati
					allCorrect = false;
					feedbackMessages.push(`❌ La definizione "${item.textContent.substring(0, 50)}..." non è stata piazzata.`);
				});


				if (zoneGameFeedback) {
					if (allCorrect && correctMatchesCount === zoneDefinitionsData.length) {
						if (window.__markDone) window.__markDone('fasi-zone'); zoneGameFeedback.innerHTML = '<p class="font-bold text-green-600">Complimenti! Tutte le definizioni sono state abbinate correttamente!</p>';
					} else {
						zoneGameFeedback.innerHTML = `<p class="font-bold text-red-600">Rivedi gli abbinamenti. ${feedbackMessages.join('<br>')}</p>`;
					}
				}
			});
		}

		if (resetZoneGameBtn) {
			resetZoneGameBtn.addEventListener('click', initializeZoneGame);
		}

		initializeZoneGame();


     /* --- JAVASCRIPT FOR "CRASH" GAME: il flusso dei mezzi (manuale AREU 2026, p. 17, 19, 29; lezione, la catena dei soccorsi) --- */
    (function() {
    const crashGrid = document.getElementById('crash-grid');
    const evaluateMarkersBtn = document.getElementById('evaluate-markers-btn');
    const resetMarkersBtn = document.getElementById('reset-markers-btn');
    const crashFeedback = document.getElementById('crash-feedback');

    const MAP_GRID_COLS = 7;
    const MAP_GRID_ROWS = 5;
    let currentSelectedMarker = null;
    let placedMarkers = {}; // { 'r-c': { type, display, originalClass } }

    // Il crash e il PMA sono già sulla mappa
    const crashCells = ['2-2', '2-3', '3-2', '3-3'];
    const fixedZones = { '1-5': { display: 'PMA', color: ['bg-indigo-600', 'text-white'] } };
    crashCells.forEach(id => { fixedZones[id] = { display: 'CRASH', color: ['bg-red-500', 'text-white'] }; });
    const pmaPos = { r: 1, c: 5 };
    const maxMarkers = { 'Entrata PMA': 1, 'Uscita PMA': 1, 'Check point': 2, 'Area di sosta': 1 };

    const pos = id => { const [r, c] = id.split('-').map(Number); return { r, c }; };
    const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
    const distCrash = p => Math.min(...crashCells.map(id => dist(p, pos(id))));
    const sulBordo = p => p.r === 0 || p.r === MAP_GRID_ROWS - 1 || p.c === 0 || p.c === MAP_GRID_COLS - 1;
    const posizioni = type => Object.keys(placedMarkers).filter(id => placedMarkers[id].type === type).map(pos);
    const quanti = n => n === 1 ? 'il marcatore' : `${n} marcatori`;

    function generateCrashGrid() {
        if (!crashGrid) return;
        crashGrid.innerHTML = '';
        crashGrid.style.gridTemplateColumns = `repeat(${MAP_GRID_COLS}, 1fr)`;
        crashGrid.style.gridTemplateRows = `repeat(${MAP_GRID_ROWS}, 1fr)`;
        for (let r = 0; r < MAP_GRID_ROWS; r++) {
            for (let c = 0; c < MAP_GRID_COLS; c++) {
                const cellId = `${r}-${c}`;
                const cell = document.createElement('div');
                cell.classList.add('grid-cell', 'grid-cell-overlay', 'rounded-none');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.dataset.cellId = cellId;
                if (fixedZones[cellId]) {
                    cell.classList.add('fixed-zone', ...fixedZones[cellId].color);
                    cell.innerHTML = `<span>${fixedZones[cellId].display}</span>`;
                    cell.style.cursor = 'not-allowed';
                } else {
                    if (placedMarkers[cellId]) {
                        cell.classList.add('placed');
                        if (placedMarkers[cellId].originalClass) cell.classList.add(...placedMarkers[cellId].originalClass.split(' '));
                        cell.innerHTML = `<span>${placedMarkers[cellId].display}</span>`;
                    }
                    cell.addEventListener('click', handleMapGridCellClick);
                }
                crashGrid.appendChild(cell);
            }
        }
    }

    function scriviFeedback(msg, errore) {
        if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm${errore ? ' text-red-600' : ''}">${msg}</p>`;
    }

    function handleMarkerPaletteClick(e) {
        const btn = e.currentTarget;
        document.querySelectorAll('.marker-palette-item').forEach(item => item.classList.remove('selected'));
        btn.classList.add('selected');
        currentSelectedMarker = {
            type: btn.dataset.markerType,
            display: btn.dataset.display,
            originalClass: Array.from(btn.classList).filter(cls => cls.startsWith('bg-') && !cls.includes('hover')).join(' ')
        };
        scriviFeedback(`Selezionato: <span class="font-bold">${currentSelectedMarker.display}</span>. Clicca sulla mappa per posizionarlo.`);
    }

    function handleMapGridCellClick(e) {
        const cell = e.target.closest('.grid-cell-overlay');
        if (!cell || fixedZones[cell.dataset.cellId]) return;
        const cellId = cell.dataset.cellId;
        if (!currentSelectedMarker) return scriviFeedback('Seleziona prima un marcatore dalla palette.', true);
        const { type, display } = currentSelectedMarker;
        if (placedMarkers[cellId]) {
            if (placedMarkers[cellId].type === type) {
                delete placedMarkers[cellId];
                generateCrashGrid();
                return scriviFeedback(`Marcatore ${display} rimosso.`);
            }
            return scriviFeedback(`Qui c'è già «${placedMarkers[cellId].display}». Per toglierlo, selezionalo nella palette e clicca su di esso.`, true);
        }
        if (posizioni(type).length >= maxMarkers[type]) {
            return scriviFeedback(`Hai già posizionato ${quanti(maxMarkers[type])} «${display}». Per spostar${maxMarkers[type] === 1 ? 'lo' : 'ne uno'}, clicca prima su quello già posizionato.`, true);
        }
        placedMarkers[cellId] = { type, display, originalClass: currentSelectedMarker.originalClass };
        generateCrashGrid();
        scriviFeedback(`Marcatore <span class="font-bold">${display}</span> posizionato. Posiziona gli altri o valuta la mappa.`);
    }

    function evaluateSimulaFlussoMezzi() {
        const mancanti = Object.keys(maxMarkers).filter(type => posizioni(type).length !== maxMarkers[type])
            .map(type => `❌ Devi posizionare ${quanti(maxMarkers[type])} «${type}» (ora: ${posizioni(type).length}).`);
        if (mancanti.length) {
            if (crashFeedback) crashFeedback.innerHTML = mancanti.map(msg => `<p class="text-sm text-red-600">${msg}</p>`).join('');
            return;
        }
        const feedback = [];
        let score = 0;
        const totalPointsPossible = 5;
        const entrata = posizioni('Entrata PMA')[0];
        const uscita = posizioni('Uscita PMA')[0];
        const sosta = posizioni('Area di sosta')[0];

        // Regola 1: entrata e uscita del PMA separate, a ridosso del PMA (manuale p. 19)
        if (dist(entrata, pmaPos) === 1 && dist(uscita, pmaPos) === 1) {
            score += 1;
            feedback.push('✔️ Entrata e uscita sono a ridosso del PMA e separate fra loro, come chiede il manuale (p. 19).');
        } else {
            feedback.push('❌ Entrata e uscita vanno a ridosso del PMA, separate fra loro (manuale AREU 2026, p. 19).');
        }
        // Regola 2: si entra dal lato del crash (piccola noria) e si esce verso gli ospedali (grande noria), p. 29
        if (distCrash(entrata) < distCrash(uscita)) {
            score += 1;
            feedback.push("✔️ L'entrata guarda il crash, da cui i pazienti arrivano con la piccola noria; l'uscita porta alla grande noria verso gli ospedali.");
        } else {
            feedback.push("❌ L'entrata va dal lato del crash (piccola noria, dal luogo dell'evento al PMA), l'uscita dall'altro (grande noria, dal PMA agli ospedali; manuale p. 29).");
        }
        // Regole 3-4: i check point sul perimetro del cantiere (manuale p. 17; lezione, la catena dei soccorsi)
        posizioni('Check point').forEach((p, i) => {
            if (sulBordo(p)) {
                score += 1;
                feedback.push(`✔️ Il check point ${i + 1} è sul perimetro del cantiere: ogni mezzo che entra o esce ci passa.`);
            } else {
                feedback.push(`❌ Il check point ${i + 1} è dentro il cantiere: i check point sono i punti di passaggio obbligatori per i mezzi in entrata e in uscita, sul suo perimetro (manuale AREU 2026, p. 17).`);
            }
        });
        // Regola 5: l'area di sosta dei mezzi, defilata dal crash e dal PMA (manuale p. 29)
        if (distCrash(sosta) >= 3 && dist(sosta, pmaPos) >= 2) {
            score += 1;
            feedback.push("✔️ L'area di sosta è defilata, a distanza dal crash e dal PMA: gli autisti restano a bordo, in ascolto radio con il Direttore dei Trasporti.");
        } else {
            feedback.push("❌ L'area di sosta dei mezzi è di solito defilata, a una certa distanza sia dal crash sia dal PMA; gli autisti restano a bordo in ascolto radio (manuale AREU 2026, p. 29).");
        }

        const esito = score === totalPointsPossible ? ['text-green-600', 'Eccellente! Il flusso dei mezzi segue il manuale.']
            : score >= totalPointsPossible * 0.7 ? ['text-orange-600', 'Buon lavoro, ma qualcosa si può migliorare.']
            : ['text-red-600', 'Rivedi la mappa: alcune scelte non seguono il manuale.'];
        if (score >= totalPointsPossible * 0.7 && window.__markDone) window.__markDone('crash');
        if (crashFeedback) crashFeedback.innerHTML = `<p class="font-bold ${esito[0]} text-lg">${esito[1]} Punteggio: ${score}/${totalPointsPossible}</p>` + feedback.map(msg => `<p class="text-sm">${msg}</p>`).join('');
    }

    function resetCrashGame() {
        placedMarkers = {};
        currentSelectedMarker = null;
        generateCrashGrid();
        document.querySelectorAll('.marker-palette-item').forEach(item => item.classList.remove('selected'));
        if (crashFeedback) crashFeedback.innerHTML = '';
    }

    document.querySelectorAll('.marker-palette-item').forEach(item => item.addEventListener('click', handleMarkerPaletteClick));
    if (evaluateMarkersBtn) evaluateMarkersBtn.addEventListener('click', evaluateSimulaFlussoMezzi);
    if (resetMarkersBtn) resetMarkersBtn.addEventListener('click', resetCrashGame);
    generateCrashGrid();
    })();

        /* --- JAVASCRIPT FOR "PROGETTA IL TUO PIANO SUL CAMPO": le aree delle vittime (manuale AREU 2026, p. 19-20, 28; lezione, istruzioni per il primo MSB) --- */
        (function() {
        const planIncidentGrid = document.getElementById('plan-incident-grid');
        const evaluatePlanBtn = document.getElementById('evaluate-plan-btn');
        const resetPlanBtn = document.getElementById('reset-plan-btn');
        const planFeedbackArea = document.getElementById('plan-feedback-area');
        const planHints = planFeedbackArea ? planFeedbackArea.innerHTML : '';

        const PLAN_GRID_SIZE = 5;
        let currentSelectedPlanZone = null;
        let placedPlanZones = {};

        // Il luogo del crash con l'area di sicurezza intorno, da mantenere sgombra
        const planFixedZones = {
            '2-2': { display: '🚆', color: 'bg-red-700 text-white' },
            '2-1': { display: '🔥', color: 'bg-orange-700 text-white' },
            '1-2': { display: '🔥', color: 'bg-orange-700 text-white' },
            '3-2': { display: '🔥', color: 'bg-orange-700 text-white' },
            '2-3': { display: '🔥', color: 'bg-orange-700 text-white' }
        };
        const planZoneDisplays = { 'Area di raccolta': 'Raccolta', 'PMA': 'PMA', 'Area verdi': 'Verdi' };
        const crashPos = { r: 2, c: 2 };
        const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);

        const generatePlanGrid = () => {
            if (!planIncidentGrid) return;
            planIncidentGrid.innerHTML = '';
            planIncidentGrid.style.gridTemplateColumns = `repeat(${PLAN_GRID_SIZE}, 1fr)`;
            planIncidentGrid.style.gridTemplateRows = `repeat(${PLAN_GRID_SIZE}, 1fr)`;
            for (let r = 0; r < PLAN_GRID_SIZE; r++) {
                for (let c = 0; c < PLAN_GRID_SIZE; c++) {
                    const cellId = `${r}-${c}`;
                    const cell = document.createElement('div');
                    cell.classList.add('grid-cell', 'rounded-md', 'flex-grow');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.style.zIndex = '10';
                    const zona = planFixedZones[cellId] || placedPlanZones[cellId];
                    if (zona) {
                        cell.classList.add(...zona.color.split(' '));
                        cell.innerHTML = `<span class="font-bold text-white">${zona.display || planZoneDisplays[zona.type]}</span>`;
                    } else {
                        cell.style.backgroundColor = 'white';
                        cell.classList.add('hover:bg-gray-300');
                    }
                    cell.addEventListener('click', handlePlanGridCellClick);
                    planIncidentGrid.appendChild(cell);
                }
            }
        };

        const handlePlanZoneItemClick = (e) => {
            const btn = e.currentTarget;
            document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
            btn.classList.add('selected');
            currentSelectedPlanZone = { type: btn.dataset.zoneType, color: btn.dataset.color + ' text-white', label: btn.textContent };
            if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="text-sm">Selezionato: <span class="font-bold">${currentSelectedPlanZone.label}</span>. Clicca su una cella della griglia per posizionarlo.</p>`;
        };

        const handlePlanGridCellClick = (e) => {
            const cell = e.target.closest('.grid-cell');
            if (!cell) return;
            const cellId = `${cell.dataset.row}-${cell.dataset.col}`;
            if (planFixedZones[cellId]) {
                if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="text-sm text-red-600">Non puoi posizionare qui: è il luogo del crash, con l'area di sicurezza da mantenere sgombra.</p>`;
                return;
            }
            if (!currentSelectedPlanZone) {
                if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="text-sm text-red-600">Seleziona prima un'area dalla palette.</p>`;
                return;
            }
            for (const key in placedPlanZones) {
                if (placedPlanZones[key].type === currentSelectedPlanZone.type) delete placedPlanZones[key];
            }
            placedPlanZones[cellId] = currentSelectedPlanZone;
            const label = currentSelectedPlanZone.label;
            currentSelectedPlanZone = null;
            generatePlanGrid();
            document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
            if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="text-sm">Area <span class="font-bold">${label}</span> posizionata. Seleziona un'altra area o valuta il tuo piano.</p>`;
        };

        const evaluatePlanFn = () => {
            const getZonePos = (type) => {
                for (const key in placedPlanZones) {
                    if (placedPlanZones[key].type === type) {
                        const [r, c] = key.split('-').map(Number);
                        return { r, c };
                    }
                }
                return null;
            };
            const mancanti = Object.keys(planZoneDisplays).filter(type => !getZonePos(type));
            if (mancanti.length) {
                if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="font-bold text-red-600">Completa il tuo piano!</p>` + mancanti.map(type => `<p class="text-sm text-red-600">Manca l'area: <span class="font-bold">${type}</span>.</p>`).join('');
                return;
            }
            const feedback = [];
            let score = 0;
            const actualMaxScore = 5;
            const raccolta = getZonePos('Area di raccolta');
            const pma = getZonePos('PMA');
            const verdi = getZonePos('Area verdi');

            if (dist(raccolta, crashPos) <= 2) {
                score += 1;
                feedback.push("✔️ L'area di raccolta dei codici giallo/rossi è un'area sicura vicino al crash (manuale AREU 2026, p. 20).");
            } else {
                feedback.push("❌ L'area di raccolta va vicino al crash: lì si convogliano le vittime, si porta il materiale dei mezzi e si iniziano le manovre salvavita (manuale AREU 2026, p. 20).");
            }
            if (dist(pma, crashPos) >= 3) {
                score += 1;
                feedback.push("✔️ Il PMA è ai margini esterni dell'area di sicurezza (p. 19).");
            } else {
                feedback.push("❌ Il PMA è troppo vicino al crash: va ai margini esterni dell'area di sicurezza, con una buona viabilità di accesso e di evacuazione (p. 19).");
            }
            if (dist(pma, raccolta) <= 2) {
                score += 1;
                feedback.push("✔️ PMA e area di raccolta sono vicini: le distanze fra le due aree devono essere minime, per comunicare a voce e spostare le vittime a piedi (p. 20).");
            } else {
                feedback.push("❌ PMA e area di raccolta sono lontani: il manuale chiede distanze minime fra le due aree (p. 20).");
            }
            if (dist(verdi, crashPos) >= 3) {
                score += 1;
                feedback.push("✔️ L'area dei codici verdi è a debita distanza dal luogo dell'evento: il Soccorritore la tiene sotto controllo perché nessuno rientri nell'area dell'incidente.");
            } else {
                feedback.push("❌ L'area dei codici verdi va a debita distanza dal luogo dell'evento (lezione AREU 2026, istruzioni per il primo MSB).");
            }
            if (dist(verdi, pma) >= 2) {
                score += 1;
                feedback.push("✔️ I verdi hanno la loro area, distinta dal PMA, dove di norma accedono solo i gialli e i rossi (p. 19, 28).");
            } else {
                feedback.push("❌ L'area dei verdi è attaccata al PMA: al PMA accedono di norma solo i gialli e i rossi, i verdi vanno in un'area definita e presidiata (p. 19, 28).");
            }

            const esito = score === actualMaxScore ? ['text-green-600', 'Eccellente! Il tuo piano segue il manuale.']
                : score >= actualMaxScore * 0.7 ? ['text-orange-600', 'Buon lavoro, ma qualcosa si può migliorare.']
                : ['text-red-600', 'Rivedi il tuo piano: alcune aree non sono dove le vuole il manuale.'];
            if (score >= actualMaxScore * 0.7 && window.__markDone) window.__markDone('progetta-piano');
            if (planFeedbackArea) planFeedbackArea.innerHTML = `<p class="font-bold ${esito[0]} text-lg">${esito[1]} Punteggio: ${score}/${actualMaxScore}</p>` + feedback.map(msg => `<p class="text-sm">${msg}</p>`).join('');
        };

        const resetPlanFn = () => {
            placedPlanZones = {};
            currentSelectedPlanZone = null;
            generatePlanGrid();
            document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
            if (planFeedbackArea) planFeedbackArea.innerHTML = planHints;
        };

        document.querySelectorAll('.plan-zone-item').forEach(item => item.addEventListener('click', handlePlanZoneItemClick));
        if (evaluatePlanBtn) evaluatePlanBtn.addEventListener('click', evaluatePlanFn);
        if (resetPlanBtn) resetPlanBtn.addEventListener('click', resetPlanFn);
        generatePlanGrid();
        })();


        function setStaticImage(imgElementId, src) {
            const imgElement = document.getElementById(imgElementId);
            if (imgElement) { 
                imgElement.src = src;
                imgElement.classList.remove('hidden'); 
            }
        }

        const showScenarioVizButton = document.getElementById('show-scenario-viz-button');

        if (showScenarioVizButton && visualizzaScenarioSection) { 
            showScenarioVizButton.addEventListener('click', () => {
                visualizzaScenarioSection.classList.toggle('hidden');
                if (!visualizzaScenarioSection.classList.contains('hidden')) {
                    setStaticImage('scenario-image-1', 'images/scenario-1.jpg');
                    setStaticImage('scenario-image-2', 'images/scenario-2.jpg');
                    setStaticImage('scenario-image-3', 'images/scenario-3.jpg');
                    setStaticImage('scenario-image-4', 'images/scenario-4.jpg');
                }
            });
        }

        const navLinkVisualizzaScenario = document.querySelector('a[href="#visualizza-scenario"]');
        if (navLinkVisualizzaScenario && visualizzaScenarioSection) { 
            navLinkVisualizzaScenario.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (visualizzaScenarioSection.classList.contains('hidden')) {
                    visualizzaScenarioSection.classList.remove('hidden');
                    setStaticImage('scenario-image-1', 'images/scenario-1.jpg');
                    setStaticImage('scenario-image-2', 'images/scenario-2.jpg');
                    setStaticImage('scenario-image-3', 'images/scenario-3.jpg');
                    setStaticImage('scenario-image-4', 'images/scenario-4.jpg');
                }
            });
        }


        /* --- Quiz Logic --- */
        const startQuizQuestions = [
            {
                question: "1) Paziente cosciente, non riesce a camminare per il fumo, ha respiro affannoso con FR 35 atti/min, polso periferico presente FC 110. Non esegue ordini semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "2) Paziente supino incosciente. Non respira nemmeno dopo pervietà delle vie aeree e cannula. Polso periferico assente. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "3) Paziente seduto a terra. Gli chiedi di alzarsi: si alza e cammina fino all'area dei codici verdi. Respiro regolare FR 16 atti/min, polso periferico presente FC 60. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Verde",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "4) Paziente seduto. Respiro FR 28 atti/min, polso periferico FC 90. Presenta sanguinamento massivo alla coscia destra e non esegue ordini semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "5) Paziente a terra, non riesce a camminare. Respiro FR 35 atti/min, polso periferico FC 100. Esegue ordini semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "6) Paziente seduto. Respiro FR 32 atti/min, polso periferico FC 140. Presenta frattura esposta tibia sinistra ed è disorientato. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "7) Un paziente è cosciente, cammina autonomamente e ha solo una piccola abrasione al braccio. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Verde",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "8) Trovi un paziente incosciente. Apri le vie aeree, ma non inizia a respirare. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "9) Un paziente è cosciente ma non cammina, e la sua frequenza respiratoria è di 35 atti/minuto. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "10) Un paziente è incosciente, respira a 18 atti/minuto, ha il polso radiale presente. Non risponde a comandi semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "11) Un paziente è cosciente ma non riesce ad alzarsi per il forte dolore addominale. Respira a 16 atti/minuto, ha il polso radiale presente e segue i tuoi ordini. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Giallo",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "12) Un paziente è intrappolato, respira a 25 atti/minuto, ha il polso radiale presente. È disorientato e non risponde a comandi semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "13) Trovi a terra un paziente con una grave emorragia esterna che non riesci a controllare con la compressione diretta. La sua frequenza respiratoria è di 20 atti/minuto e il polso radiale non si sente. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "14) Un paziente è un bambino di 5 anni: piange, cerca la mamma e cammina verso di lei. Respira bene, è roseo e non ha ferite evidenti. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Verde",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "15) Un paziente ha una frattura esposta alla gamba e non può camminare, ma è cosciente, respira a 14 atti/minuto, polso radiale presente e segue i comandi. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Giallo",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "16) Un paziente anziano è incosciente, non respira e, dopo pervietà delle vie aeree e cannula, non riprende a respirare. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "17) Un paziente è cosciente, ma non riesce a camminare a causa di un forte dolore alla caviglia. Respira regolarmente (18 atti/minuto), il polso radiale è presente ed esegue gli ordini. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Giallo",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "18) Trovi un paziente incosciente che respira a 8 atti/minuto. Ha il polso radiale presente. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "19) Un paziente cammina tra i feriti, ma ha un'ustione di secondo grado non estesa sul braccio. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Verde",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "20) Un paziente a terra è cosciente, con una ferita al torace che fischia (pneumotorace aperto), respira con difficoltà a 34 atti/minuto e ha un polso debole. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            }
        ];

        const conceptsQuizQuestions = [
            {
                question: "1) Che cosa distingue un incidente maggiore (o maxiemergenza) dalla catastrofe?",
                options: ["Il tipo di veicoli coinvolti", "Nell'incidente maggiore le strutture di soccorso del territorio restano integre e i soccorsi durano meno di 12 ore", "La presenza di fumo", "Il numero di soccorritori sul posto"],
                correctAnswer: "Nell'incidente maggiore le strutture di soccorso del territorio restano integre e i soccorsi durano meno di 12 ore",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "2) Cosa rappresenta la lettera 'H' nell'acronimo M.E.T.H.A.N.E.?",
                options: ["Ospedali", "Pericoli", "Aiuti", "Ora dell'evento"],
                correctAnswer: "Pericoli",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "3) Qual è lo scopo principale del Posto Medico Avanzato (PMA)?",
                options: ["Trasporto diretto dei pazienti in ospedale", "Selezione, trattamento e stabilizzazione delle vittime", "Gestione delle comunicazioni radio", "Controllo del traffico veicolare"],
                correctAnswer: "Selezione, trattamento e stabilizzazione delle vittime",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "4) Chi è il Direttore dei Soccorsi Sanitari (DSS) e che pettorina indossa?",
                options: ["Un infermiere, pettorina rossa", "Il medico responsabile degli interventi sanitari sul posto, pettorina gialla", "Un autista di ambulanza, pettorina blu", "Il responsabile della Protezione Civile, pettorina arancione"],
                correctAnswer: "Il medico responsabile degli interventi sanitari sul posto, pettorina gialla",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "5) Cosa si intende per 'Grande Noria' nel contesto delle maxi-emergenze?",
                options: ["Il trasporto di pazienti dalla scena al PMA", "L'afflusso di ambulanze al pronto soccorso", "L'evacuazione dei pazienti dal PMA agli ospedali", "Il coordinamento dei Vigili del Fuoco"],
                correctAnswer: "L'evacuazione dei pazienti dal PMA agli ospedali",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "6) Quali fasi prevedono sia la risposta rapida sia la risposta differita?",
                options: ["Triage, trasporto e ospedale", "Ricognizione, METHANE e START", "Preallarme, allarme ed emergenza", "Chiamata, partenza e arrivo"],
                correctAnswer: "Preallarme, allarme ed emergenza",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "7) Quali mezzi di soccorso sono subito operativi in una maxiemergenza, secondo il manuale AREU?",
                options: ["Solo le ambulanze con il medico a bordo", "MSB, MSA1, MSA2 ed elisoccorso", "Solo i mezzi della Protezione Civile", "Solo l'elisoccorso"],
                correctAnswer: "MSB, MSA1, MSA2 ed elisoccorso",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "8) Chi coordina il triage sul crash e indica ai soccorritori quali pazienti evacuare?",
                options: ["Il Direttore dei Trasporti", "Il Direttore del PMA", "Il Direttore dei Soccorsi Sanitari", "Il Direttore del Triage, infermiere con la pettorina rossa"],
                correctAnswer: "Il Direttore del Triage, infermiere con la pettorina rossa",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "9) Qual è il principale vantaggio di una comunicazione efficace con la SOREU (Centrale Operativa 118) nelle fasi iniziali di una maxi-emergenza?",
                options: ["Assicurare il trasporto immediato di tutti i feriti", "Garantire che i media siano informati correttamente", "Permettere alla Centrale di dimensionare correttamente l'evento e mobilitare le risorse adeguate", "Accelerare le indagini sulla causa dell'incidente"],
                correctAnswer: "Permettere alla Centrale di dimensionare correttamente l'evento e mobilitare le risorse adeguate",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "10) Qual è il principio di base della medicina delle catastrofi?",
                options: ["Curare tutti i pazienti sul posto", "Trasportare per primi i pazienti più vicini", "Salvare il maggior numero possibile di vittime, gestendo lo squilibrio tra risorse e necessità", "Identificare per primi i deceduti"],
                correctAnswer: "Salvare il maggior numero possibile di vittime, gestendo lo squilibrio tra risorse e necessità",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "11) Quale di queste NON è un'area della maxiemergenza nel manuale AREU 2026?",
                options: ["Area di raccolta dei codici giallo/rossi", "Area dei codici verdi", "Zona gialla del triage", "Check point"],
                correctAnswer: "Zona gialla del triage",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "12) Chi gestisce la movimentazione dei mezzi e chiede alla SOREU la destinazione ospedaliera dei pazienti?",
                options: ["Il Direttore del PMA", "Il Direttore del Triage", "Il Direttore dei Trasporti", "Il Direttore dei Soccorsi Sanitari"],
                correctAnswer: "Il Direttore dei Trasporti",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "13) Chi accede, di norma, al Posto Medico Avanzato?",
                options: ["Tutti i coinvolti, anche i verdi", "Solo i codici giallo e rosso", "Solo i codici rossi", "Solo chi è già stato cartellinato"],
                correctAnswer: "Solo i codici giallo e rosso",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "14) Con quale acronimo il primo equipaggio comunica alla SOREU la prima ricognizione?",
                options: ["START", "GCS", "M.E.T.H.A.N.E.", "BLS"],
                correctAnswer: "M.E.T.H.A.N.E.",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "15) Dove vanno i feriti che camminano, con il codice verde?",
                options: ["Nel settore dei rossi del PMA", "Restano sul crash in attesa dei mezzi", "In un'area sicura a debita distanza dal luogo dell'evento, presidiata dal Soccorritore del primo MSB", "Si allontanano da soli"],
                correctAnswer: "In un'area sicura a debita distanza dal luogo dell'evento, presidiata dal Soccorritore del primo MSB",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "16) Chi è a capo del Posto di Comando Avanzato (PCA)?",
                options: ["Il Direttore del Triage", "Il Direttore dei Soccorsi Sanitari", "Il Direttore Tecnico dei Soccorsi dei Vigili del Fuoco (ROS)", "Il Direttore del PMA"],
                correctAnswer: "Il Direttore Tecnico dei Soccorsi dei Vigili del Fuoco (ROS)",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "17) La 'Piccola Noria' si riferisce al trasporto dei pazienti:",
                options: ["Dagli ospedali al PMA", "Dalla scena dell'incidente al PMA", "Dal PMA agli ospedali", "Dalle zone di attesa ai mezzi di soccorso"],
                correctAnswer: "Dalla scena dell'incidente al PMA",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "18) A che cosa servono le esercitazioni, secondo il manuale?",
                options: ["A stabilire il costo dell'intervento", "A definire il ruolo dei media sul campo", "A sostituire la formazione teorica", "A convalidare i contenuti del piano e a valutare le capacità operative e gestionali del personale"],
                correctAnswer: "A convalidare i contenuti del piano e a valutare le capacità operative e gestionali del personale",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "19) Di che colore è la pettorina del Coordinatore Incidente Maggiore (CIM)?",
                options: ["Rossa", "A scacchi giallo-rossa", "Bianca", "Blu"],
                correctAnswer: "A scacchi giallo-rossa",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "20) Dove si colloca il Posto Medico Avanzato (PMA)?",
                options: ["Dentro l'area di sicurezza, accanto al crash", "Nell'area di sosta dei mezzi", "Ai margini esterni dell'area di sicurezza, con una buona viabilità di accesso e di evacuazione", "Sempre dentro l'ospedale più vicino"],
                correctAnswer: "Ai margini esterni dell'area di sicurezza, con una buona viabilità di accesso e di evacuazione",
                imagePrompt: "images/quiz-general.jpg"
            }
        ];

        let currentQuizQuestions = startQuizQuestions; 
        let currentQuizQuestionIndex = 0;
        let correctAnswersCount = 0;
        let activeQuizType = 'start';

        const quizQuestionText = document.getElementById('quiz-question-text');
        const quizOptionsContainer = document.getElementById('quiz-options');
        const quizFeedback = document.getElementById('quiz-feedback');
        const quizNextButton = document.getElementById('quiz-next-button');
        const quizRestartButton = document.getElementById('quiz-restart-button');
        const quizProgress = document.getElementById('quiz-progress');
        const quizImage = document.getElementById('quiz-image');

        const quizTabs = document.querySelectorAll('.quiz-tab');

        function loadQuestion() {
            if (currentQuizQuestionIndex < currentQuizQuestions.length) {
                const questionData = currentQuizQuestions[currentQuizQuestionIndex];
			   // Visualizza il testo della domanda
				if (quizQuestionText) quizQuestionText.textContent = `${questionData.question}`; 
                if (quizOptionsContainer) quizOptionsContainer.innerHTML = '';
                if (quizFeedback) quizFeedback.classList.add('hidden');
                if (quizNextButton) quizNextButton.classList.add('hidden');
                if (quizRestartButton) quizRestartButton.classList.add('hidden');
                if (quizProgress) quizProgress.textContent = `Domanda ${currentQuizQuestionIndex + 1} di ${currentQuizQuestions.length}`;

                questionData.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('quiz-option', 'rounded-lg', 'shadow-sm', 'p-3', 'cursor-pointer');
                    optionElement.textContent = option;
                    optionElement.dataset.answer = option;
                    optionElement.addEventListener('click', handleAnswerClick);
                    if (quizOptionsContainer) quizOptionsContainer.appendChild(optionElement);
                });

                if (quizImage) {
                    quizImage.src = questionData.imagePrompt;
                    quizImage.classList.remove('hidden');
                }

            } else {
                displayQuizResults();
            }
        }

        function handleAnswerClick(event) {
            const selectedOption = event.target;
            const userAnswer = selectedOption.dataset.answer;
            const correctAnswer = currentQuizQuestions[currentQuizQuestionIndex].correctAnswer;

            Array.from(quizOptionsContainer.children).forEach(option => {
                option.classList.add('disabled');
                option.removeEventListener('click', handleAnswerClick);
            });

            if (userAnswer === correctAnswer) {
                selectedOption.classList.add('correct');
                if (quizFeedback) {
                    quizFeedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                    quizFeedback.classList.add('bg-green-100', 'text-green-700');
                    quizFeedback.textContent = activeQuizType === 'start' ? `Corretto! Il codice è ${correctAnswer}.` : 'Corretto!';
                }
                correctAnswersCount++;
            } else {
                selectedOption.classList.add('incorrect');
                const correctOptionElement = Array.from(quizOptionsContainer.children).find(option => option.dataset.answer === correctAnswer);
                if (correctOptionElement) {
                    correctOptionElement.classList.add('correct');
                }
                if (quizFeedback) {
                    quizFeedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                    quizFeedback.classList.add('bg-red-100', 'text-red-700');
                    quizFeedback.textContent = activeQuizType === 'start' ? `Sbagliato. Il codice è ${correctAnswer}.` : `Sbagliato. La risposta corretta è: ${correctAnswer}.`;
                }
            }
            if (quizNextButton) quizNextButton.classList.remove('hidden');
        }

        function displayQuizResults() { if (window.__markDone) window.__markDone('quiz');
            if (quizQuestionText) quizQuestionText.textContent = `Quiz Completato!`;
            if (quizOptionsContainer) quizOptionsContainer.innerHTML = '';
            if (quizFeedback) {
                quizFeedback.classList.remove('hidden', 'bg-red-100', 'bg-green-100', 'text-red-700', 'text-green-700');
                quizFeedback.classList.add('bg-blue-100', 'text-blue-700');
                quizFeedback.textContent = `Hai risposto correttamente a ${correctAnswersCount} domande su ${currentQuizQuestions.length}.`;
            }
            if (quizNextButton) quizNextButton.classList.add('hidden');
            if (quizRestartButton) quizRestartButton.classList.remove('hidden');
            if (quizProgress) quizProgress.textContent = '';
            if (quizImage) quizImage.classList.add('hidden'); 
        }

        if (quizNextButton) {
            quizNextButton.addEventListener('click', () => {
                currentQuizQuestionIndex++;
                loadQuestion();
            });
        }

        if (quizRestartButton) {
            quizRestartButton.addEventListener('click', () => {
                currentQuizQuestionIndex = 0;
                correctAnswersCount = 0;
                loadQuestion();
            });
        }

        quizTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                quizTabs.forEach(t => {
                    t.classList.remove('border-red-500', 'text-red-600');
                    t.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                });
                tab.classList.add('border-red-500', 'text-red-600');
                tab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');

                activeQuizType = tab.dataset.quizType;
                if (activeQuizType === 'start') {
                    currentQuizQuestions = startQuizQuestions;
                } else if (activeQuizType === 'concepts') {
                    currentQuizQuestions = conceptsQuizQuestions;
                }
                currentQuizQuestionIndex = 0;
                correctAnswersCount = 0;
                loadQuestion();
            });
        });

        loadQuestion();

    })();
	      /* --- START ACTIVITY BUTTON LOGIC (NEW) --- */
        const startActivityButton = document.getElementById('start-activity-button');
        const overlayStartActivityButton = document.getElementById('overlay-start-activity-button');
        const startActivityButtonOverlay = document.getElementById('start-activity-button-overlay');
        const mainContent = document.getElementById('main-content');
        const header = document.querySelector('header'); // Get the header element

        function initializeActivityLock() {
            if (mainContent) {
                mainContent.classList.add('content-locked');
            }
            if (header) { // Ensure header is also locked
                header.classList.add('content-locked');
            }
            if (startActivityButtonOverlay) {
                startActivityButtonOverlay.classList.remove('hidden');
            }
            document.body.classList.add('locked'); // Prevent scrolling
        }

        function unlockActivity() {
            if (startActivityButtonOverlay) {
                startActivityButtonOverlay.classList.add('hidden');
                startActivityButtonOverlay.addEventListener('transitionend', () => {
                    startActivityButtonOverlay.style.display = 'none'; // Fully remove from layout after fade
                }, { once: true });
            }
            if (mainContent) {
                mainContent.classList.remove('content-locked');
                mainContent.classList.add('content-unlocked');
            }
            if (header) { // Unlock header
                header.classList.remove('content-locked');
                header.classList.add('content-unlocked');
            }
            document.body.classList.remove('locked'); // Allow scrolling
        }

        if (startActivityButton) {
            startActivityButton.addEventListener('click', unlockActivity);
        }
        if (overlayStartActivityButton) {
            overlayStartActivityButton.addEventListener('click', unlockActivity);
        }

        // Initialize the lock state when the DOM is fully loaded
        /* initializeActivityLock();  // disabilitato: overlay gestito dal wizard (main.js) */

/* --- JAVASCRIPT FOR "PRIORITÀ D'INTERVENTO" GAME --- */
    (function() {
        // la sequenza del primo equipaggio: manuale AREU 2026, p. 26 e 28, e action card del primo MSB
        const priorityActions = [
            { text: "Fermarti a distanza di sicurezza e fare la prima ricognizione: la linea elettrica aerea, la stabilità dei vagoni, il fumo.", priority: 1 },
            { text: "Comunicare alla SOREU il METHANE, confrontandoti sui pericoli con il capo squadra dei Vigili del Fuoco (casco rosso).", priority: 2 },
            { text: "Attendere l'indicazione della SOREU e l'autorizzazione ad accedere dei Vigili del Fuoco.", priority: 3 },
            { text: "Fare lo sweeping triage START, applicando a ogni vittima il braccialetto del suo colore.", priority: 4 },
            { text: "Comunicare alla SOREU gli esiti dello sweeping triage, per codice colore, e la patologia prevalente.", priority: 5 },
            { text: "All'arrivo del MSA, comunicare quanto eseguito (passaggio di consegne) e mettersi a disposizione.", priority: 6 }
        ];

        let currentPriorityScenario = {
            image: "images/scenario-5.jpg", // Sostituisci con la tua immagine reale
            description: "Un treno è deragliato, con alcuni vagoni rovesciati. Si vedono fumo e detriti. Si sentono lamenti dalle lamiere accartocciate. La linea elettrica aerea del treno sembra danneggiata."
        };

        const actionsToOrderContainer = document.getElementById('actions-to-order');
        const checkPriorityActionsBtn = document.getElementById('check-priority-actions');
        const resetPriorityActionsBtn = document.getElementById('reset-priority-actions');
        const priorityFeedbackArea = document.getElementById('priority-feedback-area');
        const priorityScenarioImage = document.getElementById('priority-scenario-image');
        const priorityScenarioDescription = document.getElementById('priority-scenario-description');

        let draggedItem = null;

        function initializePriorityGame() {
            if (!actionsToOrderContainer || !priorityFeedbackArea) return;

            // Reset feedback
            priorityFeedbackArea.innerHTML = '<p class="text-sm">Qui riceverai feedback sull\'ordine delle tue azioni.</p>';

            // Set scenario details
            if (priorityScenarioImage) priorityScenarioImage.querySelector('img').src = currentPriorityScenario.image;
            if (priorityScenarioDescription) priorityScenarioDescription.textContent = currentPriorityScenario.description;

            // Shuffle actions and render them
            actionsToOrderContainer.innerHTML = '';
            const shuffledActions = [...priorityActions].sort(() => Math.random() - 0.5); // Shuffle for each reset
            shuffledActions.forEach((action, index) => {
                const actionElement = document.createElement('div');
                actionElement.classList.add('priority-action-item'); // Stile specifico
                actionElement.setAttribute('draggable', 'true');
                actionElement.dataset.priority = action.priority;
                actionElement.textContent = action.text;
                actionElement.id = `action-${index}`;

                actionElement.addEventListener('dragstart', (e) => {
                    draggedItem = actionElement;
                    e.dataTransfer.setData('text/plain', actionElement.id);
                    // Add a class to hide the dragged element temporarily while dragging
                    setTimeout(() => actionElement.classList.add('opacity-50'), 0); 
                });

                actionElement.addEventListener('dragend', () => {
                    // Remove the temporary hiding class
                    if (draggedItem) { // Ensure draggedItem is not null
                        draggedItem.classList.remove('opacity-50');
                    }
                    draggedItem = null;
                });

                actionsToOrderContainer.appendChild(actionElement);
            });
        }

        // Drag and drop sorting logic
        if (actionsToOrderContainer) {
            actionsToOrderContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(actionsToOrderContainer, e.clientY);
                const draggable = document.querySelector('.opacity-50'); // The one currently being dragged
                if (draggable) {
                    if (afterElement == null) {
                        actionsToOrderContainer.appendChild(draggable);
                    } else {
                        actionsToOrderContainer.insertBefore(draggable, afterElement);
                    }
                }
            });

            function getDragAfterElement(container, y) {
                // Select all draggable elements that are NOT the one currently being dragged
                const draggableElements = [...container.querySelectorAll('.priority-action-item:not(.opacity-50)')]; 

                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    // Calculate the offset of the mouse pointer relative to the middle of the child element
                    const offset = y - box.top - box.height / 2;
                    // If the offset is negative and closer to the center than the current closest, update closest
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                }, { offset: -Infinity }).element; // Initialize with a very small offset
            }
        }


        if (checkPriorityActionsBtn) {
            checkPriorityActionsBtn.addEventListener('click', () => {
                const currentOrder = Array.from(actionsToOrderContainer.children).map(el => parseInt(el.dataset.priority));
                const correctOrder = priorityActions.map(a => a.priority).sort((a, b) => a - b);

                let allCorrect = true;
                let feedbackMessages = [];
                let correctCount = 0;

                for (let i = 0; i < currentOrder.length; i++) {
                    // Remove previous feedback classes before re-checking
                    actionsToOrderContainer.children[i].classList.remove('correct-match', 'incorrect-match');

                    if (currentOrder[i] === correctOrder[i]) {
                        feedbackMessages.push(`✔️ Posizione ${i + 1}: Corretta. (Compito: ${priorityActions.find(a => a.priority === currentOrder[i]).text})`);
                        actionsToOrderContainer.children[i].classList.add('correct-match'); 
                        correctCount++;
                    } else {
                        feedbackMessages.push(`❌ Posizione ${i + 1}: Errata. Doveva essere "${priorityActions.find(a => a.priority === correctOrder[i]).text}". Hai messo "${priorityActions.find(a => a.priority === currentOrder[i]).text}".`);
                        actionsToOrderContainer.children[i].classList.add('incorrect-match'); 
                        allCorrect = false;
                    }
                }

                if (allCorrect) {
                    if (window.__markDone) window.__markDone('priority-intervention'); priorityFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Eccellente! È la sequenza del manuale AREU 2026: prima la ricognizione a distanza e il METHANE, poi, con l\'autorizzazione dei Vigili del Fuoco, lo sweeping triage.</p>';
                } else {
                    priorityFeedbackArea.innerHTML = `<p class="font-bold text-red-600 text-lg">Ci sono ${priorityActions.length - correctCount} errori. Riprova! Prima di qualsiasi altra operazione si fa la ricognizione a distanza di sicurezza (manuale AREU 2026, p. 26).<br>${feedbackMessages.join('<br>')}</p>`;
                }
            });
        }

        if (resetPriorityActionsBtn) {
            resetPriorityActionsBtn.addEventListener('click', initializePriorityGame);
        }

        // Initialize the game when the page loads
        initializePriorityGame();
    })();


    /* --- JAVASCRIPT FOR "GESTIONE DELLE RISORSE" GAME --- */
    (function() {
        // Chi lavora in quale area (manuale AREU 2026, p. 17, 19, 25, 28-29, glossario; lezione, responsabili presenti sul posto)
        const resourcesData = [
            { id: 'res-1', type: 'Vigili del Fuoco', display: 'Vigili del Fuoco', count: 1 },
            { id: 'res-2', type: 'Squadra di soccorso', display: 'Squadra di soccorso', count: 2 },
            { id: 'res-3', type: 'Direttore del Triage', display: 'Direttore del Triage', count: 1 },
            { id: 'res-4', type: 'Direttore del PMA', display: 'Direttore del PMA', count: 1 },
            { id: 'res-5', type: 'Medici e infermieri', display: 'Medici e infermieri', count: 2 },
            { id: 'res-6', type: 'Soccorritore del primo MSB', display: 'Soccorritore del primo MSB', count: 1 },
            { id: 'res-7', type: 'Direttore dei Trasporti', display: 'Direttore dei Trasporti', count: 1 },
            { id: 'res-8', type: "Forze dell'Ordine", display: "Forze dell'Ordine", count: 1 },
            { id: 'res-9', type: 'Autisti delle ambulanze', display: 'Autisti delle ambulanze', count: 2 },
            { id: 'res-10', type: 'Direttore dei Soccorsi Sanitari', display: 'Direttore dei Soccorsi Sanitari (DSS)', count: 1 },
            { id: 'res-11', type: 'Direttore Tecnico dei Soccorsi', display: 'Direttore Tecnico dei Soccorsi (VVF)', count: 1 }
        ];

        const zonesData = [
            // i VVF autorizzano l'accesso; le squadre fanno lo sweeping triage e portano le vittime al PMA; il Direttore del Triage coordina e settorializza
            { id: 'zone-1', type: "Luogo dell'evento", display: "Luogo dell'evento (crash)", expectedResources: ['Vigili del Fuoco', 'Squadra di soccorso', 'Squadra di soccorso', 'Direttore del Triage'] },
            // medici, infermieri e soccorritori supervisionati dal Direttore del PMA
            { id: 'zone-2', type: 'PMA', display: 'Posto Medico Avanzato (PMA)', expectedResources: ['Direttore del PMA', 'Medici e infermieri', 'Medici e infermieri'] },
            { id: 'zone-3', type: 'Area verdi', display: 'Area dei codici verdi', expectedResources: ['Soccorritore del primo MSB'] },
            // il Direttore dei Trasporti identifica e presidia i check point, presidiati anche dalle Forze dell'Ordine
            { id: 'zone-4', type: 'Check point', display: 'Check point', expectedResources: ['Direttore dei Trasporti', "Forze dell'Ordine"] },
            // gli autisti restano a bordo, in ascolto radio
            { id: 'zone-5', type: 'Area di sosta', display: 'Area di sosta dei mezzi', expectedResources: ['Autisti delle ambulanze', 'Autisti delle ambulanze'] },
            // il DSS si coordina con il DTS dei VVF, che è a capo del PCA
            { id: 'zone-6', type: 'PCA', display: 'Posto di Comando Avanzato (PCA)', expectedResources: ['Direttore dei Soccorsi Sanitari', 'Direttore Tecnico dei Soccorsi'] }
        ];

        const resourcePalette = document.getElementById('resource-palette');
        const resourceMapGrid = document.getElementById('resource-map-grid');
        const checkResourceAllocationBtn = document.getElementById('check-resource-allocation');
        const resetResourceAllocationBtn = document.getElementById('reset-resource-allocation');
        const resourceFeedbackArea = document.getElementById('resource-feedback-area');

        let draggedResource = null;

        function initializeResourceGame() {
            if (!resourcePalette || !resourceMapGrid || !resourceFeedbackArea) return;

            resourcePalette.innerHTML = '';
            resourceMapGrid.innerHTML = '';
            resourceFeedbackArea.innerHTML = '<p class="text-sm">Trascina le risorse sulle aree corrispondenti.</p>';

            // Render all available resources in the palette, including duplicates
            resourcesData.forEach(resource => {
                for (let i = 0; i < resource.count; i++) { // Create 'count' instances of each resource
                    const resourceElement = document.createElement('button');
                    resourceElement.classList.add('resource-palette-item'); // Specific style
                    resourceElement.setAttribute('draggable', 'true');
                    resourceElement.dataset.resourceId = `${resource.id}-${i}`; // Unique ID for each draggable instance
                    resourceElement.dataset.resourceType = resource.type;
                    resourceElement.textContent = resource.display;

                    resourceElement.addEventListener('dragstart', (e) => {
                        draggedResource = resourceElement;
                        e.dataTransfer.setData('text/plain', resourceElement.dataset.resourceId);
                        // Hide original element during drag operation
                        setTimeout(() => resourceElement.classList.add('opacity-50'), 0);
                    });
                    resourceElement.addEventListener('dragend', () => {
                        // Restore opacity if it wasn't dropped in a zone (meaning it's still in the palette)
                        if (draggedResource && draggedResource.parentElement === resourcePalette) {
                            draggedResource.classList.remove('opacity-50');
                        }
                        draggedResource = null;
                    });
                    resourcePalette.appendChild(resourceElement);
                }
            });

            // Render zones in map grid
            resourceMapGrid.style.gridTemplateColumns = `repeat(auto-fit, minmax(120px, 1fr))`; 
            // Clear existing zones before re-rendering
            resourceMapGrid.querySelectorAll('.resource-drop-zone').forEach(zone => zone.remove());

            zonesData.forEach(zone => {
                const zoneElement = document.createElement('div');
                zoneElement.classList.add('resource-drop-zone'); // Specific style
                zoneElement.dataset.zoneType = zone.type;
                zoneElement.dataset.zoneId = zone.id;
                zoneElement.innerHTML = `<span class="font-semibold text-primary">${zone.display}</span><div class="assigned-resources text-xs text-secondary mt-1"></div>`; 

                zoneElement.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zoneElement.classList.add('active-drop'); // Specific style
                });
                zoneElement.addEventListener('dragleave', () => {
                    zoneElement.classList.remove('active-drop'); // Specific style
                });
                zoneElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zoneElement.classList.remove('active-drop'); // Specific style
                    if (draggedResource) {
                        const resourceId = draggedResource.dataset.resourceId;
                        
                        // Find the original element which is currently being dragged
                        const originalElement = document.querySelector(`[data-resource-id="${resourceId}"]`);
                        
                        // If it was already placed in a zone, remove it from its old spot
                        const currentParent = originalElement.parentElement;
                        if (currentParent && currentParent.classList.contains('assigned-resources')) {
                            currentParent.removeChild(originalElement);
                            // Clear feedback classes from the old zone if it had them
                            const oldZone = currentParent.closest('.resource-drop-zone');
                            if (oldZone) oldZone.classList.remove('correct-match', 'incorrect-match');
                        } else if (originalElement.closest('#resource-palette')) {
                            // If it was in the palette, hide it from there
                             originalElement.style.display = 'none';
                        }
                        
                        // Now, add the element to the new drop zone
                        originalElement.classList.remove('opacity-50', 'resource-palette-item'); 
                        originalElement.classList.add('placed-resource-item'); // Add style for placed resource
                        originalElement.removeAttribute('draggable'); // Not draggable from here
                        originalElement.style.transform = 'none'; // Remove any hover transforms
                        originalElement.style.display = ''; // Ensure it's visible in its new spot

                        // Add a click listener to return it to the palette
                        originalElement.addEventListener('click', function returnToPalette() {
                            this.parentElement.removeChild(this); 
                            resourcePalette.appendChild(this);
                            this.setAttribute('draggable', 'true'); 
                            this.classList.remove('placed-resource-item'); 
                            this.classList.add('resource-palette-item'); 
                            this.style.display = ''; // Make it visible again in palette
                            this.removeEventListener('click', returnToPalette); // Clean up listener
                            // Clear feedback classes from the zone if a resource is removed after check
                            zoneElement.classList.remove('correct-match', 'incorrect-match');
                        });
                        
                        zoneElement.querySelector('.assigned-resources').appendChild(originalElement);
                        // Clear feedback classes from the new zone if a resource is placed after check
                        zoneElement.classList.remove('correct-match', 'incorrect-match');
                    }
                });
                resourceMapGrid.appendChild(zoneElement);
            });
        }

        if (checkResourceAllocationBtn) {
            checkResourceAllocationBtn.addEventListener('click', () => {
                let overallCorrect = true;
                let feedback = [];

                zonesData.forEach(zone => {
                    const zoneElement = document.querySelector(`.resource-drop-zone[data-zone-type="${zone.type}"]`); 
                    const assignedResourceTypes = Array.from(zoneElement.querySelectorAll('.placed-resource-item')).map(res => res.dataset.resourceType); 

                    // Reset zone visual feedback
                    zoneElement.classList.remove('correct-match', 'incorrect-match');

                    // Create a frequency map for expected resources
                    const expectedFreq = zone.expectedResources.reduce((acc, type) => {
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {});

                    // Create a frequency map for assigned resources
                    const assignedFreq = assignedResourceTypes.reduce((acc, type) => {
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {});

                    let zoneIsCorrect = true;
                    let zoneFeedback = [];

                    // Check if all expected resources are present and in correct quantities
                    for (const type in expectedFreq) {
                        if ((assignedFreq[type] || 0) < expectedFreq[type]) {
                            zoneIsCorrect = false;
                            zoneFeedback.push(`Mancano ${expectedFreq[type] - (assignedFreq[type] || 0)} "${type}"`);
                        }
                    }

                    // Check for any extra/incorrectly assigned resources
                    for (const type in assignedFreq) {
                        if ((expectedFreq[type] || 0) < assignedFreq[type]) {
                            zoneIsCorrect = false;
                            zoneFeedback.push(`Ci sono ${assignedFreq[type] - (expectedFreq[type] || 0)} "${type}" in più`);
                        }
                    }

                    // Check for any resources that are not allowed in this zone at all
                    const disallowedResources = assignedResourceTypes.filter(type => !zone.expectedResources.includes(type));
                    if (disallowedResources.length > 0) {
                        zoneIsCorrect = false;
                        zoneFeedback.push(`Risorse non pertinenti in questa zona: ${disallowedResources.join(', ')}`);
                    }


                    if (zoneIsCorrect) {
                        feedback.push(`✔️ ${zone.display}: Allocazione corretta.`);
                        zoneElement.classList.add('correct-match'); 
                    } else {
                        overallCorrect = false;
                        feedback.push(`❌ ${zone.display}: Allocazione non ottimale. ${zoneFeedback.join('. ')}. Chi lavora in quest'area: ${[...new Set(zone.expectedResources)].join(', ')}.`);
                        zoneElement.classList.add('incorrect-match'); 
                    }
                });

                // Check for unassigned resources in the palette
                const unassignedResourcesInPalette = Array.from(resourcePalette.children).filter(el => el.style.display !== 'none');
                if (unassignedResourcesInPalette.length > 0) {
                    overallCorrect = false;
                    const unassignedTypes = unassignedResourcesInPalette.map(el => el.dataset.resourceType).join(', ');
                    feedback.push(`❌ Risorse non utilizzate: ${unassignedTypes}.`);
                }

                if (overallCorrect) {
                    if (window.__markDone) window.__markDone('resource-management'); resourceFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Complimenti! Ognuno è nell\'area in cui lavora.</p>';
                } else {
                    resourceFeedbackArea.innerHTML = `<p class="font-bold text-red-600 text-lg">Rivedi l'allocazione delle risorse.<br>${feedback.join('<br>')}</p>`;
                }
            });
        }

        if (resetResourceAllocationBtn) {
            resetResourceAllocationBtn.addEventListener('click', initializeResourceGame);
        }

        // Initialize the game when the page loads
        initializeResourceGame();
    })();


    /* --- JAVASCRIPT FOR "COMUNICAZIONE RADIO" GAME --- */
    (function() {
        // che cosa comunicare e a chi (manuale AREU 2026, p. 17, 19, 22-23, 26, 28-30; lezione, il Direttore del Triage)
        const radioScenarios = [
            {
                scenario: "Sei il primo mezzo sul luogo del deragliamento. Ti fermi a distanza: vagoni rovesciati, fumo denso e un odore acuto che non riconosci. Che cosa comunichi alla SOREU?",
                options: [
                    { text: "MSB 1 a SOREU: incidente al treno, c'è fumo e puzza, mandate aiuti.", correct: false, feedback: "Mancano quasi tutte le informazioni del METHANE: dove si trova l'evento, da dove accedono i mezzi, quanti sono i coinvolti, quali enti sono presenti." },
                    { text: "MSB 1 a SOREU: maxiemergenza confermata; deragliamento sulla linea all'altezza di via Roma; pericoli: fumo denso e un odore non identificato; accesso per i mezzi da via Roma; stimiamo una cinquantina di coinvolti; Vigili del Fuoco non ancora presenti. Restiamo a distanza, sopravento.", correct: true, feedback: "È il METHANE: Maxiemergenza, Esatta localizzazione, Tipo di evento, Hazards, Accessi, Numero stimato dei coinvolti, Enti presenti. Con un possibile pericolo chimico non ci si avvicina, si resta sopravento e si avvisano la SOREU e i soccorritori in arrivo (manuale AREU 2026, p. 26 e 30)." },
                    { text: "MSB 1 a SOREU: entriamo a vedere quanti feriti ci sono e vi richiamiamo.", correct: false, feedback: "Prima di qualsiasi altra operazione si fa la ricognizione a distanza di sicurezza; con un possibile pericolo chimico si attendono i Vigili del Fuoco e si entra solo con la loro autorizzazione (manuale AREU 2026, p. 26 e 30)." },
                    { text: "MSB 1 a SOREU: ci sono molti feriti, iniziamo subito la rianimazione del primo che troviamo.", correct: false, feedback: "Nella maxiemergenza non si inizia la rianimazione e non si entra senza l'autorizzazione dei Vigili del Fuoco: prima si comunica il METHANE (manuale AREU 2026, p. 22-23 e 26)." }
                ]
            },
            {
                scenario: "Hai concluso lo sweeping triage START: 30 coinvolti, 15 verdi, 10 gialli, 5 rossi. Quasi tutti hanno traumi da urto; uno dei rossi ha lesioni incompatibili con la vita, e il Direttore del Triage non è ancora arrivato. Che cosa comunichi alla SOREU?",
                options: [
                    { text: "Abbiamo circa 30 feriti: molti lievi, alcuni medi, pochi gravi e un morto.", correct: false, feedback: "Servono i numeri per codice colore, non giudizi a occhio; e il soccorritore non dichiara un morto: lo segnala come rosso." },
                    { text: "Sweeping triage concluso: 30 coinvolti, 15 verdi, 10 gialli, 4 rossi, 1 nero.", correct: false, feedback: "Il nero lo attribuiscono solo i sanitari: chi ha lesioni incompatibili con la vita resta rosso, e lo si segnala. Manca anche la patologia prevalente (manuale AREU 2026, p. 22-23)." },
                    { text: "Sweeping triage concluso: 30 coinvolti, 15 verdi, 10 gialli, 5 rossi; patologia prevalente traumatica; fra i rossi uno con lesioni incompatibili con la vita.", correct: true, feedback: "Il numero dei coinvolti per codice colore e la patologia prevalente, come chiede l'action card del primo MSB. Il rosso con lesioni incompatibili con la vita, se il Direttore del Triage non c'è ancora, si segnala alla SOREU al termine del triage (manuale AREU 2026, p. 22-23)." },
                    { text: "Sweeping triage concluso: 30 coinvolti, 15 verdi, 10 gialli, 5 rossi.", correct: false, feedback: "I numeri ci sono, ma l'action card chiede di comunicare anche la patologia prevalente; e il rosso con lesioni incompatibili con la vita va segnalato alla SOREU." }
                ]
            },
            {
                scenario: "Sei l'autista di un MSB arrivato dopo il primo: il mezzo è nell'area di sosta, defilata. Dal crash i colleghi chiedono una mano per portare i feriti. Che cosa fai?",
                options: [
                    { text: "Lascio il mezzo e corro sul crash: lì servono braccia.", correct: false, feedback: "Se l'autista lascia il mezzo, il Direttore dei Trasporti non riesce più a farlo muovere: gli autisti restano a bordo in ascolto radio (manuale AREU 2026, p. 29)." },
                    { text: "Porto il mezzo vicino al crash, così si fa prima.", correct: false, feedback: "I mezzi si muovono su indicazione del Direttore dei Trasporti, che li fa passare dai check point (manuale AREU 2026, p. 17)." },
                    { text: "Spengo la radio per non intasare il canale e aspetto.", correct: false, feedback: "La radio è l'unico canale con cui il Direttore dei Trasporti può chiamarti: va tenuta accesa e ascoltata (manuale AREU 2026, p. 29)." },
                    { text: "Resto a bordo, in ascolto radio: è l'unico canale con cui il Direttore dei Trasporti può chiamarmi.", correct: true, feedback: "L'area di sosta è spesso lontana dal crash e dal PMA, e la radio è l'unico contatto con il Direttore dei Trasporti: gli autisti restano a bordo, in ascolto (manuale AREU 2026, p. 29)." }
                ]
            },
            {
                scenario: "Sei l'autista soccorritore del primo MSA e hai preso il ruolo di Direttore dei Trasporti. Il Direttore del PMA ti chiede di trasportare in ospedale un paziente. Che cosa comunichi alla SOREU?",
                options: [
                    { text: "Il codice colore del paziente, la patologia rilevante e l'identificativo del mezzo, per avere la destinazione ospedaliera.", correct: true, feedback: "È quello che il Direttore dei Trasporti comunica alla SOREU, che indirizza il paziente nell'ospedale più idoneo (manuale AREU 2026, p. 17 e 19)." },
                    { text: "Niente: scelgo l'ospedale più vicino e faccio partire il mezzo.", correct: false, feedback: "La destinazione la indica la SOREU, che cerca l'ospedale più idoneo ed evita di intasare i pronto soccorso (manuale AREU 2026, p. 17 e 19)." },
                    { text: "Chiedo alla SOREU di chiamare direttamente il Direttore del PMA.", correct: false, feedback: "La SOREU contatta direttamente il Direttore del PMA solo per reale necessità clinica: di norma la richiesta passa dal Direttore dei Trasporti (manuale AREU 2026, p. 19)." },
                    { text: "Il nome del paziente e il recapito dei familiari.", correct: false, feedback: "Per la destinazione la SOREU ha bisogno del codice colore, della patologia rilevante e dell'identificativo del mezzo (manuale AREU 2026, p. 17)." }
                ]
            },
            {
                scenario: "Sei un soccorritore di un MSB arrivato dopo, al lavoro sul crash. Nel terzo vagone trovi un ferito incastrato fra le lamiere. A chi lo dici, e come?",
                options: [
                    { text: "Chiamo la SOREU dal cellulare e spiego tutta la situazione.", correct: false, feedback: "Con tante chiamate la telefonia mobile si sovraccarica, e con la SOREU parlano le figure di riferimento: tu riferisci a chi coordina sul crash (manuale AREU 2026, p. 29)." },
                    { text: "Con poche parole alla mia figura di riferimento sul crash: il Referente del primo MSB o, quando c'è, il Direttore del Triage.", correct: true, feedback: "Le comunicazioni sul campo sono brevi, essenziali e limitate alle figure di riferimento; i MSB successivi si mettono a disposizione del primo equipaggio, e il Direttore del Triage supervisiona la decarcerazione dei Vigili del Fuoco (manuale AREU 2026, p. 28-29; lezione, il Direttore del Triage)." },
                    { text: "Lo annuncio via radio a tutti, sul canale comune, con tutti i dettagli.", correct: false, feedback: "Le comunicazioni devono essere brevi ed essenziali e limitate alle figure di riferimento (manuale AREU 2026, p. 29)." },
                    { text: "Provo a estrarlo da solo con i colleghi.", correct: false, feedback: "La decarcerazione la fanno i Vigili del Fuoco, sotto la supervisione del Direttore del Triage (lezione AREU 2026, il Direttore del Triage)." }
                ]
            }
        ];

        let currentRadioScenarioIndex = 0;

        const radioScenarioText = document.getElementById('radio-scenario-text');
        const radioOptionsContainer = document.getElementById('radio-options-container');
        const nextRadioScenarioBtn = document.getElementById('next-radio-scenario');
        const resetRadioGameBtn = document.getElementById('reset-radio-game'); 
        const radioFeedbackArea = document.getElementById('radio-feedback-area');

        function initializeRadioGame() {
            if (!radioScenarioText || !radioOptionsContainer || !radioFeedbackArea) return;

            currentRadioScenarioIndex = 0;
            loadRadioScenario(currentRadioScenarioIndex);
        }

        function loadRadioScenario(index) {
            if (index >= radioScenarios.length) {
                radioScenarioText.textContent = "Hai completato tutte le situazioni!";
                radioOptionsContainer.innerHTML = '';
                nextRadioScenarioBtn.classList.add('hidden');
                if (window.__markDone) window.__markDone('radio-communication'); radioFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Ben fatto! Comunicazioni brevi ed essenziali, alle figure di riferimento.</p>';
                return;
            }

            const scenario = radioScenarios[index];
            radioScenarioText.textContent = scenario.scenario;
            radioOptionsContainer.innerHTML = '';
            radioFeedbackArea.innerHTML = '<p class="text-sm">Scegli la risposta corretta.</p>';
            nextRadioScenarioBtn.classList.add('hidden'); 

            scenario.options.forEach((option, optionIndex) => {
                const button = document.createElement('button');
                button.classList.add('radio-question-option', 'w-full', 'text-left'); // Stile specifico
                button.textContent = option.text;
                button.dataset.optionIndex = optionIndex;

                button.addEventListener('click', () => handleRadioOptionClick(option, button));
                radioOptionsContainer.appendChild(button);
            });
        }

        function handleRadioOptionClick(selectedOption, clickedButton) {
            // Disable all buttons after selection
            Array.from(radioOptionsContainer.children).forEach(button => {
                button.disabled = true;
                button.classList.remove('hover:bg-gray-200'); 
            });

            if (selectedOption.correct) {
                radioFeedbackArea.innerHTML = `<p class="font-bold text-green-600">✔️ Corretto!</p><p class="text-sm">${selectedOption.feedback}</p>`;
                clickedButton.classList.add('correct-answer'); // Stile specifico
            } else {
                radioFeedbackArea.innerHTML = `<p class="font-bold text-red-600">❌ Sbagliato!</p><p class="text-sm">${selectedOption.feedback}</p>`;
                clickedButton.classList.add('incorrect-answer'); // Stile specifico
                // Highlight correct answer
                const correctOptionButton = Array.from(radioOptionsContainer.children).find(btn => {
                    const optionData = radioScenarios[currentRadioScenarioIndex].options[btn.dataset.optionIndex];
                    return optionData && optionData.correct;
                });
                if (correctOptionButton) {
                    correctOptionButton.classList.add('correct-answer'); // Stile specifico
                }
            }
            nextRadioScenarioBtn.classList.remove('hidden');
        }

        if (nextRadioScenarioBtn) {
            nextRadioScenarioBtn.addEventListener('click', () => {
                currentRadioScenarioIndex++;
                loadRadioScenario(currentRadioScenarioIndex);
            });
        }

        if (resetRadioGameBtn) {
            resetRadioGameBtn.addEventListener('click', initializeRadioGame);
        }

        // Initialize the game when the page loads
        initializeRadioGame();
    })();


    /* --- JAVASCRIPT FOR "DILEMMA ETICO/DECISIONALE RAPIDO" GAME --- */
    (function() {
        const ethicalDilemmas = [
            {
                scenario: "Durante lo sweeping triage trovi, uno accanto all'altro, un adulto con un'emorragia esterna abbondante a un braccio e un bambino incosciente che respira. Sei solo. Che cosa fai?",
                options: [
                    { text: "Resto con il bambino fino all'arrivo di un medico.", isCorrect: false },
                    { text: "Assegno il codice a tutti e due, faccio solo le manovre previste (compressione diretta o bendaggio compressivo dell'emorragia, cannula) e proseguo il triage.", isCorrect: true },
                    { text: "Mi fermo a trattare l'adulto finché l'emorragia non è del tutto controllata.", isCorrect: false }
                ],
                outcomeExplanation: {
                    true: "Durante lo START le sole manovre sono la rimozione di un corpo estraneo con la cannula orofaringea e la compressione diretta o il bendaggio compressivo di un'emorragia: poi si prosegue, perché lo sweeping triage serve a contare e classificare tutti i coinvolti (manuale AREU 2026, p. 22-23).",
                    false: "Nello sweeping triage non ci si ferma a trattare: si assegna il codice, si fanno solo le manovre essenziali e si prosegue (manuale AREU 2026, p. 22-23)."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Al luogo del crash ci sono pazienti gialli, rossi e verdi, e arrivano altre squadre. Chi decide chi si evacua e dove?",
                options: [
                    { text: "Ogni squadra porta via i pazienti che riesce a caricare.", isCorrect: false },
                    { text: "Il Direttore del Triage, in base ai codici colore: gialli e rossi verso l'area di raccolta e il PMA, verdi nella loro area presidiata.", isCorrect: true },
                    { text: "Si portano via prima i verdi, che si spostano più in fretta.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "L'evacuazione dal crash si fa su indicazione del Direttore del Triage, sulla base dei codici colore: gialli e rossi al PMA, verdi in un'area definita e presidiata. Prima del suo arrivo i mezzi successivi si mettono a disposizione del primo equipaggio (manuale AREU 2026, p. 28).",
                    "false": "L'evacuazione non la decide la singola squadra: la indica il Direttore del Triage, in base ai codici colore (manuale AREU 2026, p. 28)."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Un paziente rosso è intrappolato vicino ai binari. La linea elettrica non è ancora stata disattivata e i Vigili del Fuoco non hanno autorizzato l'accesso. Il paziente sta peggiorando. Che cosa fai?",
                options: [
                    { text: "Tento l'estricazione con la massima cautela, tenendomi lontano dai cavi.", isCorrect: false },
                    { text: "Resto a distanza di sicurezza, informo la SOREU e attendo che i Vigili del Fuoco autorizzino l'accesso.", isCorrect: true },
                    { text: "Mi avvicino solo per valutarlo, senza toccarlo.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "La ricognizione si fa a distanza di sicurezza e si comunica alla SOREU; si accede solo con l'autorizzazione dei Vigili del Fuoco (manuale AREU 2026, p. 26 e 28). La disincarcerazione si fa insieme ai Vigili del Fuoco (p. 16). La procedura protegge te e il paziente.",
                    "false": "Finché i Vigili del Fuoco non autorizzano l'accesso non ci si avvicina: si resta a distanza di sicurezza e si informa la SOREU (manuale AREU 2026, p. 28). Un soccorritore ferito è una vittima in più."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Arrivi per primo all'imbocco di una galleria ferroviaria dopo un impatto. Dall'interno esce fumo, ci sono passeggeri disorientati e la radio va a intermittenza. Qual è la tua priorità?",
                options: [
                    { text: "Entro a cercare il pannello di emergenza per la ventilazione.", isCorrect: false },
                    { text: "Resto all'esterno a distanza di sicurezza, comunico il METHANE alla SOREU e attendo che i Vigili del Fuoco autorizzino l'accesso.", isCorrect: true },
                    { text: "Entro nel primo vagone per contare i feriti.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "Prima di qualsiasi altra operazione si fa la prima ricognizione a distanza di sicurezza e la si comunica alla SOREU con il METHANE; nel fumo si entra solo con l'autorizzazione dei Vigili del Fuoco (manuale AREU 2026, p. 26 e 28).",
                    "false": "Nel fumo non si entra senza l'autorizzazione dei Vigili del Fuoco: si resta a distanza di sicurezza e si comunica alla SOREU (manuale AREU 2026, p. 26 e 28)."
                },
                timeLimit: 60 // seconds
            }
        ];

        let currentDilemmaIndex = 0;
        let timerInterval;
        let timeRemaining;
        let dilemmaSolved = false;

        const dilemmaGameContent = document.getElementById('dilemma-game-content');
        const startDilemmaGameBtn = document.getElementById('start-dilemma-game');
        const dilemmaScenarioText = document.getElementById('dilemma-scenario-text');
        const dilemmaOptionsContainer = document.getElementById('dilemma-options-container');
        const dilemmaTimerDisplay = document.getElementById('dilemma-timer');
        const dilemmaFeedbackArea = document.getElementById('dilemma-feedback-area');
        const revealDilemmaOutcomeBtn = document.getElementById('reveal-dilemma-outcome');
        const nextDilemmaBtn = document.getElementById('next-dilemma');
        const resetDilemmaGameBtn = document.getElementById('reset-dilemma-game'); 

        function initializeDilemmaGame() {
            if (!dilemmaGameContent || !dilemmaScenarioText || !dilemmaOptionsContainer || !dilemmaTimerDisplay || !dilemmaFeedbackArea) return;

            currentDilemmaIndex = 0;
            dilemmaGameContent.classList.add('hidden'); // Hide game content initially
            startDilemmaGameBtn.classList.remove('hidden'); // Show start button
            resetDilemmaGameBtn.classList.remove('hidden'); // Show reset button
            dilemmaFeedbackArea.innerHTML = '<p class="text-sm">Premi "Inizia il Gioco dei Dilemmi" per iniziare.</p>';
            clearInterval(timerInterval); // Ensure any running timer is stopped
            dilemmaTimerDisplay.textContent = ''; // Clear timer display
            dilemmaOptionsContainer.innerHTML = ''; // Clear options
            dilemmaScenarioText.textContent = 'Caricamento dilemma...'; // Reset scenario text
            revealDilemmaOutcomeBtn.classList.add('hidden');
            nextDilemmaBtn.classList.add('hidden');
        }

        function loadDilemma(index) {
            if (index >= ethicalDilemmas.length) {
                dilemmaScenarioText.textContent = "Hai completato tutte le scelte difficili.";
                dilemmaOptionsContainer.innerHTML = '';
                dilemmaTimerDisplay.textContent = '';
                if (window.__markDone) window.__markDone('ethical-dilemma'); dilemmaFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Fine: nelle scelte difficili la procedura protegge te e i pazienti.</p>';
                nextDilemmaBtn.classList.add('hidden');
                revealDilemmaOutcomeBtn.classList.add('hidden');
                clearInterval(timerInterval);
                return;
            }

            dilemmaSolved = false;
            clearInterval(timerInterval); // Clear any previous timer
            dilemmaFeedbackArea.innerHTML = '';
            revealDilemmaOutcomeBtn.classList.add('hidden');
            nextDilemmaBtn.classList.add('hidden'); // Hide next button until current dilemma is resolved

            const dilemma = ethicalDilemmas[index];
            dilemmaScenarioText.textContent = dilemma.scenario;
            dilemmaOptionsContainer.innerHTML = '';
            dilemmaTimerDisplay.textContent = `Tempo: ${dilemma.timeLimit}s`;
            timeRemaining = dilemma.timeLimit;

            dilemma.options.forEach((option, optionIndex) => {
                const button = document.createElement('button');
                button.classList.add('dilemma-choice-option', 'w-full', 'text-left'); // Stile specifico
                button.textContent = option.text;
                button.dataset.optionIndex = optionIndex;
                button.addEventListener('click', () => handleDilemmaOptionClick(option, button, index));
                dilemmaOptionsContainer.appendChild(button);
            });

            // Start timer
            timerInterval = setInterval(() => {
                timeRemaining--;
                dilemmaTimerDisplay.textContent = `Tempo: ${timeRemaining}s`;
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    dilemmaTimerDisplay.textContent = 'Tempo Scaduto!';
                    dilemmaFeedbackArea.innerHTML = '<p class="font-bold text-red-600">Tempo scaduto! Non hai preso una decisione in tempo.</p>';
                    revealDilemmaOutcomeBtn.classList.remove('hidden'); // Allow revealing outcome manually
                    nextDilemmaBtn.classList.remove('hidden');
                    // Disable options
                    Array.from(dilemmaOptionsContainer.children).forEach(button => {
                        button.disabled = true;
                        button.classList.remove('hover:bg-gray-200');
                        // Highlight the correct answer among all options
                        const optionData = ethicalDilemmas[dilemmaIndex].options[button.dataset.optionIndex];
                        if (optionData.isCorrect) {
                            button.classList.add('correct-feedback-highlight'); // Apply green highlight for correct answer
                        }
                    });
                    dilemmaSolved = true;
                }
            }, 1000);
        }

        function handleDilemmaOptionClick(selectedOption, clickedButton, dilemmaIndex) {
            if (dilemmaSolved) return; // Prevent multiple clicks or after timeout
            dilemmaSolved = true;
            clearInterval(timerInterval);
            dilemmaTimerDisplay.textContent = `Decisione presa in ${ethicalDilemmas[dilemmaIndex].timeLimit - timeRemaining}s!`;

            // Disable all options
            Array.from(dilemmaOptionsContainer.children).forEach(button => {
                button.disabled = true;
                button.classList.remove('hover:bg-gray-200');
                // Highlight the correct answer among all options
                const optionData = ethicalDilemmas[dilemmaIndex].options[button.dataset.optionIndex];
                if (optionData.isCorrect) {
                    button.classList.add('correct-feedback-highlight'); // Apply green highlight for correct answer
                }
            });
            
            // Display correctness feedback (Correct!/Wrong!)
            dilemmaFeedbackArea.innerHTML = (selectedOption.isCorrect ? "<span class='font-bold text-green-600'>✔️ Corretto!</span>" : "<span class='font-bold text-red-600'>❌ Sbagliato!</span>") + " ";

            // Append the detailed outcome explanation
            dilemmaFeedbackArea.innerHTML += `<p class="text-sm mt-2">${ethicalDilemmas[dilemmaIndex].outcomeExplanation[selectedOption.isCorrect]}</p>`;
            
            clickedButton.classList.add('chosen-option'); // Apply specific style to the chosen option
            nextDilemmaBtn.classList.remove('hidden');
        }

        if (revealDilemmaOutcomeBtn) {
            revealDilemmaOutcomeBtn.addEventListener('click', () => {
                // This button is mostly for when time runs out or to see an explanation.
                // If already solved by click, its logic is simpler.
                if (!dilemmaSolved) { // If user wants to just reveal without choosing
                     dilemmaFeedbackArea.innerHTML = '<p class="text-sm">Nessuna scelta effettuata. Riprova nel prossimo dilemma.</p>';
                }
                // Logic to show "correct" path if not chosen could be added here
            });
        }

        if (nextDilemmaBtn) {
            nextDilemmaBtn.classList.remove('bg-gray-300', 'text-gray-800', 'hover:bg-gray-400'); // Remove gray styles
            nextDilemmaBtn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700'); // Add blue styles
            nextDilemmaBtn.addEventListener('click', () => {
                currentDilemmaIndex++;
                loadDilemma(currentDilemmaIndex);
            });
        }

        // Event listener for Start button
        if (startDilemmaGameBtn) {
            startDilemmaGameBtn.addEventListener('click', () => {
                dilemmaGameContent.classList.remove('hidden'); // Show game content
                startDilemmaGameBtn.classList.add('hidden'); // Hide start button
                loadDilemma(currentDilemmaIndex); // Start the first dilemma
            });
        }

        // Event listener for Reset button
        if (resetDilemmaGameBtn) {
            resetDilemmaGameBtn.addEventListener('click', initializeDilemmaGame);
        }

        // Initialize the game when the page loads
        initializeDilemmaGame();
    })();

})(); // End of IIFE
};
