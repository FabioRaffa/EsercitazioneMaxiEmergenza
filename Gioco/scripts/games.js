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

        // The previous simple click interaction on nested divs is removed as it's replaced by the drag&drop game.
        // The zoneDescriptions object is still valid as data for the new game.
        const zoneDescriptions = {
            'Punto di Crash': 'L\'area immediatamente interessata dall\'incidente, dove i pericoli sono maggiori (es. fumo, crolli, sostanze tossiche). L\'accesso è limitato solo al personale strettamente necessario e con dotazioni di protezione individuali.',
            'Triage': 'Il Triage è l\'area di transizione tra il punto di crash e il punto di raccolta. Qui viene effettuato il triage primario (metodo START) e i pazienti vengono stabilizzati rapidamente prima di essere trasferiti al PMA.',
            'Punto di Raccolta': 'Il Punto di Raccolta è l\'area sicura e più lontana dall\'evento. Qui si trovano il Posto Medico Avanzato (PMA), l\'area di raccolta mezzi, le postazioni per la stampa e le autorità. È il punto di arrivo e partenza controllato per tutte le risorse.'
        };


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
				if (parseInt(step.dataset.step) <= stepNum) {
					step.classList.remove('hidden');
				} else {
					step.classList.add('hidden');
				}
			});
			// Mostra il pulsante "Ricomincia" solo quando tutti i passi sono visibili
			if (stepNum >= triageFlowSteps.length && triageFlowResetBtn) {
				triageFlowResetBtn.classList.remove('hidden');
			} else if (triageFlowResetBtn) {
				triageFlowResetBtn.classList.add('hidden');
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
const msbGameTasksData = [ // Nuovo nome per il dataset
    { text: "Indossare la dotazione prevista.", role: "Referente" },
    { text: "Verificare l'esattezza delle informazioni fornite dalla SOREU sulla tipologia dell'evento.", role: "Referente" },
    { text: "Effettuare una ricognizione del luogo dell'evento, dimensionandolo e verificando l'estensione e la presenza di rischi evolutivi, anche confrontandosi con il capo squadra dei Vigili del Fuoco (riconoscibile dal casco rosso).", role: "Referente" },
    { text: "Valutare in sequenza: Se l'evento corrisponde a quanto riferito dal 118; Se il luogo è accessibile ai mezzi di soccorso; Se sono presenti fuoco, fumo, materiale pericolante, sostanze pericolose o inondazione.", role: "Referente" },
    { text: "Effettuare uno sweeping-triage utilizzando il metodo S.T.A.R.T., quantificando il numero dei soggetti coinvolti e suddividendoli in codici VERDI, GIALLI, ROSSI e NERI, applicando i braccialetti colorati corrispondenti.", role: "Referente" },
    { text: "Comunica alla SOREU gli esiti della ricognizione, l'estensione del luogo interessato, il numero dei soggetti coinvolti suddivisi per codice colore e la patologia prevalente (se non già comunicato all'equipaggio del MSA giunto sul posto).", role: "Referente" },
    { text: "Rimanere vicino al mezzo.", role: "Autista" },
    { text: "Posizionare il mezzo in zona sicura, rendendolo ben visibile e identificabile (es. lampeggianti accesi).", role: "Autista" },
    { text: "Garantire l'integrità delle comunicazioni radio con la SOREU per comunicazioni in tempo reale.", role: "Autista" },
    { text: "Essere pronto a spostare il mezzo in ogni momento.", role: "Autista" },
    { text: "Segnalare ai mezzi in arrivo le vie di accesso, il luogo di stazionamento e le vie di fuga.", role: "Autista" },
    { text: "Individuare i luoghi più adatti per l'atterraggio di elicotteri, prestando attenzione a cavi della corrente, teleferiche o ostacoli poco visibili.", role: "Autista" },
    { text: "Identificare un'area sicura, a debita distanza dal luogo dell'evento, per collocare i pazienti con codice verde.", role: "Terzo Soccorritore" },
    { text: "Tiene sotto controllo l'area identificata, evitando che i pazienti presenti rientrino nell'area dell'incidente.", role: "Terzo Soccorritore" }
];

let currentSelectedMsbTask = null; // Nuovo nome per la variabile di selezione

const msbDraggableTasksContainer = document.getElementById('msb-draggable-tasks'); // Nuovo ID
const msbDropZones = document.querySelectorAll('#msb-game-section .msb-role-drop-zone'); // Nuovo selettore
const msbCheckButton = document.getElementById('msb-check-button'); // Nuovo ID
const msbResetButton = document.getElementById('msb-reset-button'); // Nuovo ID
const msbFeedbackDisplay = document.getElementById('msb-feedback-display'); // Nuovo ID

// Funzione per aggiornare la visibilità del titolo nella drop zone
const updateMsbDropZoneTitleVisibility = (zoneElement) => {
    const roleTitleSpan = zoneElement.querySelector('.msb-role-title'); // Nuovo selettore
    if (roleTitleSpan) {
        const hasChildrenTasks = zoneElement.querySelector('.role-task-item') !== null;
        roleTitleSpan.style.display = hasChildrenTasks ? 'none' : '';
    }
};

function initializeMsbGame() {
    if (!msbDraggableTasksContainer || !msbFeedbackDisplay) return;

    msbDraggableTasksContainer.innerHTML = '';
    msbFeedbackDisplay.innerHTML = '<p class="text-sm">Trascina i compiti sui ruoli corrispondenti. Ogni ruolo ha compiti multipli!</p>';
    currentSelectedMsbTask = null;

    msbDropZones.forEach(zone => {
        zone.innerHTML = `<span class="msb-role-title">${zone.dataset.role}</span>`; // Nuovo selettore
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
            'Terzo Soccorritore': []
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
                feedbackMessages.push(`✔️ Compiti del <span class="font-bold">${roleName}</span>: TUTTI CORRETTI.`);
            } else {
                zoneElement.classList.add('incorrect-match');
                zoneElement.querySelectorAll('.role-task-item').forEach(taskEl => {
                    taskEl.classList.add('incorrect-match');
                });
                allOverallCorrect = false;
                feedbackMessages.push(`❌ Compiti del <span class="font-bold">${roleName}</span>: ALCUNI ERRORI.`);

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
            scenarioDescriptionKeywords: ['treno', 'deragliato', 'vagoni', 'ribaltati', 'fumo', 'viadotto', 'accesso difficile', 'strade strette', 'ostacoli'],
            evolutiveRisk: 'si',
            victimsRange: [300, 500], 
            prevalentPathologiesKeywords: ['traumi', 'ustioni', 'contusioni', 'fratture', 'emorragie', 'shock'],
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
                scenarioFeedback.eventMatch.textContent = 'Sbagliato. L\'evento corrisponde a quanto riferito.';
                scenarioFeedback.eventMatch.classList.add('text-red-600');
				scenarioFeedback.eventMatch.classList.remove('text-green-600');
                allCorrect = false;
            }

            const userDescription = scenarioDescriptionInput.value.toLowerCase();
            const hasEnoughKeywords = correctScenarioAnswers.scenarioDescriptionKeywords.some(keyword => userDescription.includes(keyword));
            if (userDescription.length > 50 && hasEnoughKeywords) { 
                scenarioFeedback.description.textContent = 'Descrizione sufficiente!';
                scenarioFeedback.description.classList.add('text-green-600');
				scenarioFeedback.description.classList.remove('text-red-600');
            } else {
                scenarioFeedback.description.textContent = 'Descrizione insufficiente o poco dettagliata.';
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
                scenarioFeedback.evolutiveRisk.textContent = 'Sbagliato. Ci sono rischi evolutivi presenti.';
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
                scenarioFeedback.victims.textContent = `La stima delle vittime non è accurata. Si attendono circa ${correctScenarioAnswers.victimsRange[0]}-${correctScenarioAnswers.victimsRange[1]} coinvolti.`;
                scenarioFeedback.victims.classList.add('text-red-600');
				scenarioFeedback.victims.classList.remove('text-green-600');			
                allCorrect = false;
            }

            const userPathologies = prevalentPathologiesInput.value.toLowerCase();
            const hasEnoughPathologyKeywords = correctScenarioAnswers.prevalentPathologiesKeywords.some(keyword => userPathologies.includes(keyword));
            if (userPathologies.length > 20 && hasEnoughPathologyKeywords) {
                scenarioFeedback.pathologies.textContent = 'Patologie plausibili!';
                scenarioFeedback.pathologies.classList.add('text-green-600');
				scenarioFeedback.pathologies.classList.remove('text-red-600'); 
            } else {
                scenarioFeedback.pathologies.textContent = 'Descrizione delle patologie insufficiente o poco pertinente.';
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
        const referenteTasksOrdered = [
            "Indossare la dotazione prevista.",
            "Verificare l'esattezza delle informazioni fornite dalla SOREU sulla tipologia dell'evento.",
            "Effettuare una ricognizione del luogo dell'evento, dimensionandolo e verificando l'estensione e la presenza di rischi evolutivi, anche confrontandosi con il capo squadra dei Vigili del Fuoco (riconoscibile dal casco rosso).",
            "Valutare in sequenza: Se l'evento corrisponde a quanto riferito dal 118.",
            "Valutare in sequenza: Se il luogo è accessibile ai mezzi di soccorso.",
            "Valutare in sequenza: Se sono presenti fuoco, fumo, materiale pericolante, sostanze pericolose o inondazione.",
            "In caso di pericolo: Stazionare in luogo sicuro.",
            "In caso di pericolo: Accedere solo dopo autorizzazione del 115.",
            "In caso di pericolo: Informare il 118 e attendere istruzioni.",
            "Effettuare uno sweeping-triage utilizzando il metodo S.T.A.R.T., quantificando il numero dei soggetti coinvolti e suddividendoli in codici VERDI, GIALLI, ROSSI e NERI, applicando i braccialetti colorati corrispondenti.",
            "Comunicare alla SOREU gli esiti della ricognizione, l'estensione del luogo interessato, il numero dei soggetti coinvolti suddivisi per codice colore e la patologia prevalente (se non già comunicato all'equipaggio del MSA giunto sul posto)."
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
        const methaneGameData = [
            { letter: 'M', definition: 'Conferma che l\'evento è una Maxi-emergenza (Livello 3).' },
            { letter: 'E', definition: 'Localizzazione Esatta dell\'incidente per indirizzare i soccorsi.' },
            { letter: 'T', definition: 'Identificazione della Tipologia dell\'evento (es. deragliamento, crollo, esplosione) per prevedere rischi e lesioni.' },
            { letter: 'H', definition: 'Valutazione dei rischi presenti o evolutivi (es. fumo, incendio, sversamenti, instabilità strutturale).' },
            { letter: 'A', definition: 'Condizioni delle vie di Accesso e Uscita per i mezzi di soccorso (strade bloccate, terreno impervio).' },
            { letter: 'N', definition: 'Stima del Numero di persone coinvolte e della gravità delle lesioni.' },
            { letter: 'E', definition: 'Presenza di Soccorsi di Emergenza già sul posto o necessità di risorse aggiuntive.' }
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
        { role: 'Direttore dei Soccorsi Sanitari', acronym: 'DSS', color: 'bg-yellow-400' },
        { role: 'Direttore del PMA', acronym: 'DPMA', color: 'bg-white border-2 border-black' },
        { role: 'Direttore di Triage', acronym: 'TRO', color: 'bg-red-500' },
        { role: 'Direttore dei Trasporti', acronym: 'ALO', color: 'bg-blue-500' }
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
        roleColorFeedback.innerHTML = '<p class="text-sm">Trascina i ruoli sui giubbotti colorati.</p>';
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
            dropZone.dataset.dropZoneId = `color-dropzone-${index}`;

            // L'acronimo sarà visualizzato sopra il colore, senza mai coprire il colore di sfondo!
            const acronymPlaceholder = document.createElement('span');
            acronymPlaceholder.classList.add('role-acronym-placeholder', 'text-center', 'font-bold', 'text-2xl');
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
                        const colorDisplay = originalColorName ? originalColorName.replace('bg-', '').replace('border-2 border-black', 'bianca') : '';
                        feedbackMessages.push(`❌ La zona ${colorDisplay} per ${correctAcronym} è vuota.`);
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
	
	/* --- CHARTS FOR "MEZZI E STRUTTURE" SECTION --- */
const mezziCtx = document.getElementById('mezziChart');
if (mezziCtx) {
    new Chart(mezziCtx, {
        type: 'bar',
        data: {
            labels: ['MSB', 'MSI', 'MSA'], // Nomi dei tipi di ambulanza
            datasets: [
                {
                    label: 'Autista',
                    data: [1, 1, 1], // Sempre 1 autista
                    backgroundColor: '#4299e1' // Blue
                },
                {
                    label: 'Soccorritore',
                    data: [2, 0, 0], // 2 per MSA/MSB, 1 per Mike (spesso)
                    backgroundColor: '#667eea' // Indigo
                },
                {
                    label: 'Infermiere',
                    data: [0, 1, 1], // 0 per MSA, 1 per MSB, 1 per Mike
                    backgroundColor: '#805ad5' // Purple
                },
                {
                    label: 'Medico',
                    data: [0, 0, 1], // 0 per MSA/MSB, 1 per Mike
                    backgroundColor: '#d53f8c' // Pink
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Tipo di Ambulanza'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Numero di Personale'
                    },
                    ticks: {
                        stepSize: 1 // Assicura che i tick siano numeri interi
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Composizione Equipaggio Ambulanze'
                }
            }
        }
    });
}

/* --- CHART FOR TRIAGE SWEEPING DISTRIBUTION --- */
const triageCtx = document.getElementById('triageChart');
if (triageCtx) {
    new Chart(triageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Verde (Lieve)', 'Giallo (Urgenza)', 'Rosso (Critico)'],
            datasets: [{
                label: 'Pazienti',
                data: [60, 30, 10], // Percentuali tipiche: 60% Verdi, 30% Gialli, 10% Rossi (circa)
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
                question: "2) Devi delimitare l'area di sicurezza attorno all'incidente. Quale colore di giubbotto o simbolo cercheresti per identificare il responsabile della sicurezza perimetrale?",
                options: [
                    { text: "Giubbotto giallo (DSS)", correct: false },
                    { text: "Casacca blu (Forze dell'Ordine)", correct: true },
                    { text: "Casacca verde (Volontario Croce Rossa)", correct: false },
                    { text: "Casco rosso (Vigili del Fuoco)", correct: false }
                ],
                feedback: "La sicurezza perimetrale e il mantenimento dell'ordine sono compiti delle Forze dell'Ordine."
            },
            {
                question: "3) Ti trovi nel Punto di Raccolta e hai bisogno di supporto logistico (es. tende, barriere, illuminazione) per il PMA. Con quale forza collaboreresti prioritariamente?",
                options: [
                    { text: "Vigili del Fuoco", correct: false },
                    { text: "Forze dell'Ordine", correct: false },
                    { text: "Protezione Civile", correct: true },
                    { text: "Servizio Sanitario (altri medici/infermieri)", correct: false }
                ],
                feedback: "La Protezione Civile è specializzata nel supporto logistico e nell'allestimento di strutture temporanee."
            },
            {
                question: "4) Un familiare agitato cerca di superare il cordone di sicurezza per raggiungere un parente. Chi è la figura più adatta a gestire la situazione e fornire informazioni controllate?",
                options: [
                    { text: "Un Medico del PMA", correct: false },
                    { text: "Un Agente delle Forze dell'Ordine", correct: true },
                    { text: "Un Volontario MSB", correct: false },
                    { text: "Il Direttore dei Trasporti (ALO)", correct: false }
                ],
                feedback: "Le Forze dell'Ordine sono preposte al mantenimento dell'ordine pubblico e alla gestione dei civili nell'area di emergenza."
            },
            {
                question: "5) Hai bisogno di informazioni precise sulla presenza di materiali pericolosi o sulla stabilità di strutture danneggiate. Quale figura devi consultare?",
                options: [
                    { text: "Il Direttore di Triage (TRO)", correct: false },
                    { text: "Il Capo Squadra dei Vigili del Fuoco", correct: true },
                    { text: "Il Direttore del PMA (DPMA)", correct: false },
                    { text: "Un operatore del 118", correct: false }
                ],
                feedback: "I Vigili del Fuoco sono esperti nella valutazione dei pericoli strutturali, chimici e ambientali."
            },
             {
                question: "6) Devi trasportare un paziente con una lesione grave che richiede il trasferimento in un ospedale specialistico. Chi coordina il trasporto e l'assegnazione dell'ospedale?",
                options: [
                    { text: "Il Capo Squadra dei Vigili del Fuoco", correct: false },
                    { text: "Il Direttore di Triage (TRO)", correct: false },
                    { text: "La Centrale Operativa 118 (SOREU)", correct: true },
                    { text: "Il Direttore del PMA (DPMA)", correct: false }
                ],
                feedback: "La Centrale Operativa 118 (SOREU) ha la visione d'insieme delle risorse ospedaliere disponibili e coordina i trasporti complessi."
            },
            {
                question: "7) Devi isolare una zona a rischio per la presenza di un sversamento di sostanze chimiche. Con quale ente collaboreresti per la messa in sicurezza dell'area?",
                options: [
                    { text: "Protezione Civile", correct: false },
                    { text: "Forze dell'Ordine", correct: false },
                    { text: "Vigili del Fuoco (Nucleo NBCR)", correct: true },
                    { text: "Servizio Sanitario 118", correct: false }
                ],
                feedback: "I Vigili del Fuoco, in particolare il Nucleo NBCR, sono addestrati per la gestione di pericoli nucleari, biologici, chimici e radiologici."
            },
            {
                question: "8) È necessario gestire il flusso dei mezzi di soccorso in arrivo e in uscita dall'area dell'incidente, per evitare ingorghi. Chi è il responsabile di questo coordinamento?",
                options: [
                    { text: "Il Direttore dei Soccorsi Sanitari (DSS)", correct: false },
                    { text: "Il Direttore dei Trasporti (ALO)", correct: true },
                    { text: "Il Direttore di Triage (TRO)", correct: false },
                    { text: "Un Ufficiale di Polizia Locale", correct: false }
                ],
                feedback: "Il Direttore dei Trasporti (ALO) è specificamente incaricato della gestione della logistica dei mezzi."
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
		const zoneDefinitionsData = [
			{
				zone: 'Punto di Crash',
				definition: 'L\'area immediatamente interessata dall\'incidente, dove i pericoli sono maggiori (es. fumo, crolli, sostanze tossiche). L\'accesso è limitato solo al personale strettamente necessario e con dotazioni di protezione individuali.'
			},
			{
				zone: 'Triage',
				definition: 'L\'area di transizione tra il punto di crash e il punto di raccolta. Qui viene effettuato il triage primario (metodo START) e i pazienti vengono stabilizzati rapidamente prima di essere trasferiti al PMA.'
			},
			{
				zone: 'Punto di Raccolta',
				definition: 'L\'area sicura e più lontana dall\'evento. Qui si trovano il Posto Medico Avanzato (PMA), l\'area di raccolta mezzi, le postazioni per la stampa e le autorità. È il punto di arrivo e partenza controllato per tutte le risorse.'
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
			zoneGameFeedback.innerHTML = '<p class="text-sm">Trascina le definizioni sulle zone corrispondenti.</p>';
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
					// Ripristina le classi di colore originali basate su data-drop-zone-for
					const originalZoneType = zone.dataset.dropZoneFor;
					const originalColorClass = originalZoneType === 'Punto di Crash' ? 'text-red-600' : originalZoneType === 'Triage' ? 'text-yellow-600' : 'text-green-600';
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
						roleTitleSpan.style.display = 'none';
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
						roleTitleSpan.style.display = 'none';
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
							feedbackMessages.push(`❌ La definizione "${definitionText.substring(0, 50)}..." è sbagliata per la zona "${originalZoneType}". Doveva essere la definizione di "${correctZoneForDefinition}".`);
						}
					} else {
						// La drop zone è vuota
						dropZone.classList.add('incorrect-match');
						allCorrect = false;
						feedbackMessages.push(`❌ La zona "${originalZoneType}" è vuota.`);
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


     /* --- JAVASCRIPT FOR "CRASH" GAME --- */
    const crashGrid = document.getElementById('crash-grid');
    const markerPalette = document.getElementById('marker-palette');
    const evaluateMarkersBtn = document.getElementById('evaluate-markers-btn');
    const resetMarkersBtn = document.getElementById('reset-markers-btn');
    const crashFeedback = document.getElementById('crash-feedback');

    const MAP_GRID_COLS = 7;
    const MAP_GRID_ROWS = 5;
    let currentSelectedMarker = null;
    let placedMarkers = {}; // Stores { 'cellId': { type: 'Accesso Mezzi', display: 'Accesso IN' } }

    // Define all fixed zones on the map, including Incident, PMA, Area Verdi, Triage
    const fixedZones = {
        // Incident Zones (Red) - User cannot place here
        '2-3': { type: 'INCIDENTE', display: 'INCIDENTE', color: ['bg-red-500', 'text-white'] },
        '3-3': { type: 'INCIDENTE', display: 'INCIDENTE', color: ['bg-red-500', 'text-white'] },
        '2-4': { type: 'INCIDENTE', display: 'INCIDENTE', color: ['bg-red-500', 'text-white'] },
        '3-2': { type: 'INCIDENTE', display: 'INCIDENTE', color: ['bg-red-500', 'text-white'] },
    };
    // The PMA fixed position (used for evaluation of Access/Exit proximity)
    const pmaFixedPos = { r: 1, c: 5 };

    const dist = (pos1, pos2) => Math.abs(pos1.r - pos2.r) + Math.abs(pos1.c - pos2.c);

    function generateCrashGrid() {
        if (!crashGrid) return;
        crashGrid.innerHTML = '';
        crashGrid.style.gridTemplateColumns = `repeat(${MAP_GRID_COLS}, 1fr)`;
        crashGrid.style.gridTemplateRows = `repeat(${MAP_GRID_ROWS}, 1fr)`;

        for (let r = 0; r < MAP_GRID_ROWS; r++) {
            for (let c = 0; c < MAP_GRID_COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell', 'grid-cell-overlay', 'rounded-none');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.dataset.cellId = `${r}-${c}`;

                const cellId = `${r}-${c}`;

               if (fixedZones[cellId]) { // Check if this is a fixed zone
                    cell.classList.add('fixed-zone', ...fixedZones[cellId].color); // Apply fixed zone styling using spread operator
                    cell.innerHTML = `<span>${fixedZones[cellId].display}</span>`;
                    cell.style.cursor = 'not-allowed';
                } else if (placedMarkers[cellId]) { // Check for user-placed markers
                    cell.classList.add('placed');
                    // Aggiungi la classe di colore originale del marcatore qui
                    if (placedMarkers[cellId].originalClass) { // Verifica che esista la classe originale
                        cell.classList.add(placedMarkers[cellId].originalClass);
                    }
                    cell.innerHTML = `<span>${placedMarkers[cellId].display}</span>`;
                } else {
                    cell.innerHTML = '';
                }

                if (!fixedZones[cellId]) { // Only allow interaction on non-fixed zones
                    cell.addEventListener('click', handleMapGridCellClick);
                }
                crashGrid.appendChild(cell);
            }
        }
    }

    function handleMarkerPaletteClick(e) {
        document.querySelectorAll('.marker-palette-item').forEach(item => item.classList.remove('selected'));
        e.target.classList.add('selected');
        currentSelectedMarker = {
                type: e.target.dataset.markerType,
                display: e.target.dataset.display,
                originalClass: Array.from(e.target.classList).filter(cls => cls.startsWith('bg-') && !cls.includes('hover')).join(' ') // Cattura la classe bg-XXX
            };
        if (crashFeedback) {
            crashFeedback.innerHTML = `<p class="text-sm">Selezionato: <span class="font-bold">${currentSelectedMarker.display}</span>. Clicca sulla mappa per posizionarlo.</p>`;
        }
    }

    function handleMapGridCellClick(e) {
        const cell = e.target.closest('.grid-cell-overlay');
        if (!cell || fixedZones[cell.dataset.cellId]) return; // Cannot place on fixed zones

        const cellId = cell.dataset.cellId;

        if (currentSelectedMarker) {
            const markerType = currentSelectedMarker.type;
            const markerDisplay = currentSelectedMarker.display;
            const maxMarkersOfType = 2; // Accesso/Uscita always have limit 2

            // Get all current markers of the selected type
            let markersOfCurrentType = Object.entries(placedMarkers).filter(([key, value]) => value.type === markerType);
            
            // Check if the clicked cell already has a marker of the *currently selected type*
            const isClickingOnOwnExistingMarker = placedMarkers[cellId] && placedMarkers[cellId].type === markerType;

            // --- Case 1: User clicks on an existing marker (of any type) ---
            if (placedMarkers[cellId]) {
                if (isClickingOnOwnExistingMarker) {
                    // User clicked on their own marker: remove it (toggle off)
                    delete placedMarkers[cellId];
                    if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm">Marcatore ${markerDisplay} rimosso da ${cellId}.</p>`;
                    generateCrashGrid(); // Re-render grid to reflect removal
                    return; // Action completed: marker removed
                } else {
                    // User clicked on a cell with a DIFFERENT type marker. Prevent placing on it.
                    if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm text-red-600">Non puoi posizionare un marcatore sopra un tipo diverso (${placedMarkers[cellId].display}). Rimuovi prima quello esistente (clicca su di esso con il suo tipo selezionato).</p>`;
                    return; // Block placement
                }
            }

            // --- Case 2: User clicks on an EMPTY cell (to place a new marker) ---
            if (markersOfCurrentType.length >= maxMarkersOfType) {
                // If already at max limit, and trying to place a NEW one in an empty cell
                if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm text-red-600">Hai già posizionato ${maxMarkersOfType} punti di ${markerType}. Per rimuovere un marcatore, clicca su uno esistente dello stesso tipo.</p>`;
                return; // Block placement of a new unique marker
            }

            // --- Step 3: Place the new marker (allowed if reached here) ---
			placedMarkers[cellId] = { type: markerType, display: markerDisplay, originalClass: currentSelectedMarker.originalClass };
            if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm">Marcatore <span class="font-bold">${markerDisplay}</span> posizionato. Posiziona altri marcatori o valuta la mappa.</p>`;
            generateCrashGrid();

        } else {
            // No marker selected from palette
            if (crashFeedback) crashFeedback.innerHTML = `<p class="text-sm text-red-600">Seleziona prima un marcatore dalla palette.</p>`;
        }
    }


 function evaluateSimulaFlussoMezzi() {
        let feedback = [];
        let score = 0;
        let totalPointsPossible = 0; // Punteggio massimo possibile per questa valutazione

        const getMarkerPos = (type) => {
            for (const key in placedMarkers) {
                if (placedMarkers[key].type === type) {
                    const [r, c] = key.split('-').map(Number);
                    return { r, c };
                }
            }
            return null;
        };

        const dist = (pos1, pos2) => Math.abs(pos1.r - pos2.r) + Math.abs(pos1.c - pos2.c);

        const incidentPos = { r: 2, c: 3 }; // Posizione centrale dell'incidente, da riferimento fixedZones

        // Definizione delle quantità attese per ogni tipo di marcatore
        const expectedCounts = {
            'Accesso Mezzi': 2,
            'Uscita Mezzi': 2,
            'PMA': 1,
            'Triage': 1,
            'Area Verdi': 1
        };

        // Verifica che tutti i marcatori necessari siano stati posizionati
        let allRequiredMarkersPlaced = true;
        for (const type in expectedCounts) {
            const actualCount = Object.values(placedMarkers).filter(m => m.type === type).length;
            if (actualCount !== expectedCounts[type]) {
                feedback.push(`❌ Devi posizionare esattamente ${expectedCounts[type]} marcatore/i di "${type}". Attualmente hai ${actualCount}.`);
                allRequiredMarkersPlaced = false;
            }
        }

        if (!allRequiredMarkersPlaced) {
            if (crashFeedback) crashFeedback.innerHTML = feedback.map(msg => `<p class="text-sm text-red-600">${msg}</p>`).join('');
            return; // Non procedere con la valutazione se i conteggi non sono corretti
        }

        // Estrai le posizioni dei marcatori che sono stati posizionati
        const triagePos = getMarkerPos('Triage');
        const pmaPos = getMarkerPos('PMA');
        const areaVerdiPos = getMarkerPos('Area Verdi');
        const accessoMarkers = Object.entries(placedMarkers).filter(([key, value]) => value.type === 'Accesso Mezzi').map(([key, val]) => {
            const [r, c] = key.split('-').map(Number);
            return { r, c };
        });
        const uscitaMarkers = Object.entries(placedMarkers).filter(([key, value]) => value.type === 'Uscita Mezzi').map(([key, val]) => {
            const [r, c] = key.split('-').map(Number);
            return { r, c };
        });

        // Regola 1: Triage vicino all'incidente
        totalPointsPossible += 1;
        if (triagePos && dist(triagePos, incidentPos) <= 2) { // Distanza Manhattan <= 2
            score += 1;
            feedback.push(`✔️ Triage (Zona Calda) posizionato correttamente vicino all'incidente.`);
        } else {
            feedback.push(`❌ Il Triage (Zona Calda) dovrebbe essere più vicino all'incidente per la valutazione rapida.`);
        }

        // Regola 2: PMA vicino al Triage e in un'area sicura (lontana dall'incidente)
        totalPointsPossible += 2; // Assegna più punti per importanza strategica
        if (pmaPos && triagePos && dist(pmaPos, triagePos) <= 2 && dist(pmaPos, incidentPos) >= 3) {
            score += 2;
            feedback.push(`✔️ PMA (Posto Medico Avanzato) posizionato correttamente vicino al Triage e in zona sicura.`);
        } else {
            feedback.push(`❌ PMA (Posto Medico Avanzato) dovrebbe essere più vicino al Triage e in una zona sicura, lontana dall'incidente.`);
        }

        // Regola 3: Area Verdi vicino al PMA
        totalPointsPossible += 1;
        if (areaVerdiPos && pmaPos && dist(areaVerdiPos, pmaPos) <= 2) {
            score += 1;
            feedback.push(`✔️ Area Verdi (Zona Fredda) posizionata correttamente vicino al PMA.`);
        } else {
            feedback.push(`❌ L'Area Verdi (Zona Fredda) dovrebbe essere posizionata vicino al PMA.`);
        }

        // Regola 4: Accessi vicini al PMA
        totalPointsPossible += 2;
        let accessProximityScore = 0;
        if (pmaPos) { // Valuta solo se PMA è posizionato
            accessoMarkers.forEach(pos => {
                if (dist(pos, pmaPos) <= 3) { // Entro 3 celle dal PMA
                    accessProximityScore++;
                }
            });
        }
        score += Math.min(accessProximityScore, 2);
        if (accessProximityScore === 2) {
            feedback.push(`✔️ Entrambi i punti di Accesso sono ben posizionati rispetto al PMA.`);
        } else if (accessProximityScore === 1) {
            feedback.push(`⚠️ Un punto di Accesso è ben posizionato, l'altro potrebbe essere ottimizzato.`);
        } else {
            feedback.push(`❌ I punti di Accesso dovrebbero essere posizionati più vicino al PMA.`);
        }

        // Regola 5: Uscite vicine al PMA (ma distinte dagli accessi)
        totalPointsPossible += 2;
        let uscitaProximityScore = 0;
        if (pmaPos) { // Valuta solo se PMA è posizionato
            uscitaMarkers.forEach(pos => {
                if (dist(pos, pmaPos) <= 3) { // Entro 3 celle dal PMA
                    uscitaProximityScore++;
                }
            });
        }
        score += Math.min(uscitaProximityScore, 2);
        if (uscitaProximityScore === 2) {
            feedback.push(`✔️ Entrambi i punti di Uscita sono ben posizionati rispetto al PMA.`);
        } else if (uscitaProximityScore === 1) {
            feedback.push(`⚠️ Un punto di Uscita è ben posizionato, l'altro potrebbe essere ottimizzato.`);
        } else {
            feedback.push(`❌ I punti di Uscita dovrebbero essere posizionati più vicino al PMA.`);
        }

        // Regola 6: Flusso chiaro (Accessi e Uscite non adiacenti tra loro)
        totalPointsPossible += 1;
        let mixedAdjacent = false;
        for (const aPos of accessoMarkers) {
            for (const uPos of uscitaMarkers) {
                if (dist(aPos, uPos) === 1) { // Se la distanza è 1, sono adiacenti
                    mixedAdjacent = true;
                    break;
                }
            }
            if (mixedAdjacent) break;
        }
        if (!mixedAdjacent) {
            score += 1;
            feedback.push(`✔️ Punti di Accesso e Uscita sono ben separati, minimizzando l'incrocio di flussi.`);
        } else {
            feedback.push(`⚠️ Alcuni punti di Accesso e Uscita sono troppo vicini, il che potrebbe causare congestione nel flusso.`);
        }

        let overallFeedback = '';
        if (score === totalPointsPossible) {
            overallFeedback = `<p class="font-bold text-green-600 text-lg">Eccellente! Il tuo piano di flusso mezzi è ottimale! Punteggio: ${score}/${totalPointsPossible}</p>`;
        } else if (score >= totalPointsPossible * 0.7) {
            overallFeedback = `<p class="font-bold text-orange-600 text-lg">Buon lavoro! Il tuo piano è funzionale, ma ci sono aree di miglioramento. Punteggio: ${score}/${totalPointsPossible}</p>`;
        } else {
            overallFeedback = `<p class="font-bold text-red-600 text-lg">Rivedi il tuo piano. Ci sono alcune aree critiche da migliorare. Punteggio: ${score}/${totalPointsPossible}</p>`;
        }

        if (crashFeedback) {
            if (score >= totalPointsPossible * 0.7 && window.__markDone) window.__markDone('crash'); crashFeedback.innerHTML = overallFeedback + feedback.map(msg => `<p class="text-sm">${msg}</p>`).join('');
        }
    }

    function resetCrashGame() {
        placedMarkers = {}; // Reset user-placed markers
        currentSelectedMarker = null;
        generateCrashGrid(); // Re-generate grid to show fixed zones
        document.querySelectorAll('.marker-palette-item').forEach(item => item.classList.remove('selected'));
        // Restore initial empty feedback
        if (crashFeedback) {
            crashFeedback.innerHTML = ``; // Cleared content for hints
        }
    }

    // Event Listeners for Crash Game
    document.querySelectorAll('.marker-palette-item').forEach(item => {
        item.addEventListener('click', handleMarkerPaletteClick);
    });

    if (evaluateMarkersBtn) {
        evaluateMarkersBtn.addEventListener('click', evaluateSimulaFlussoMezzi);
    }
    if (resetMarkersBtn) {
        resetMarkersBtn.addEventListener('click', resetCrashGame);
    }

    generateCrashGrid();

        /* --- JAVASCRIPT FOR "PROGETTA IL TUO PIANO SUL CAMPO" --- */
        const planIncidentGrid = document.getElementById('plan-incident-grid');
        const planZonePalette = document.getElementById('plan-zone-palette');
        const evaluatePlanBtn = document.getElementById('evaluate-plan-btn');
        const resetPlanBtn = document.getElementById('reset-plan-btn');
        const planFeedbackArea = document.getElementById('plan-feedback-area');

        const PLAN_GRID_SIZE = 5;
        let currentSelectedPlanZone = null;
        let placedPlanZones = {};

        const planFixedZones = {
            '2-2': { type: 'Sito Incidente', display: '🚆', color: 'bg-red-700 text-white' },
            '2-1': { type: 'Punto di Crash', display: '🔥', color: 'bg-orange-700 text-white' },
            '1-2': { type: 'Punto di Crash', display: '🔥', color: 'bg-orange-700 text-white' },
            '3-2': { type: 'Punto di Crash', display: '🔥', color: 'bg-orange-700 text-white' },
            '2-3': { type: 'Punto di Crash', display: '🔥', color: 'bg-orange-700 text-white' }
        };

        const planZoneDisplays = {
            'Triage': 'Triage',
            'PMA': 'PMA',
            'Accesso Mezzi': 'Accesso',
            'Uscita Mezzi': 'Uscita',
            'PCA': 'PCA',
            'Area Verdi': 'Verdi',
            'Sito Incidente': '🚆',
            'Punto di Crash': '🔥'
        };

        const generatePlanGrid = () => {
            if (!planIncidentGrid) return; 

            planIncidentGrid.innerHTML = '';
            planIncidentGrid.style.gridTemplateColumns = `repeat(${PLAN_GRID_SIZE}, 1fr)`;
            planIncidentGrid.style.gridTemplateRows = `repeat(${PLAN_GRID_SIZE}, 1fr)`;
            
            planIncidentGrid.style.backgroundImage = 'none';
            planIncidentGrid.style.opacity = '1'; 

            for (let r = 0; r < PLAN_GRID_SIZE; r++) {
                for (let c = 0; c < PLAN_GRID_SIZE; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('grid-cell', 'rounded-md', 'flex-grow');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.style.zIndex = '10'; 

                    const cellId = `${r}-${c}`;
                    if (planFixedZones[cellId]) {
                        cell.classList.add(...planFixedZones[cellId].color.split(' '));
                        cell.innerHTML = `<span class="font-bold text-white">${planFixedZones[cellId].display}</span>`;
                        cell.dataset.zoneType = planFixedZones[cellId].type;
                        cell.style.backgroundColor = ''; 
                    } else if (placedPlanZones[cellId]) {
                        cell.classList.add(...placedPlanZones[cellId].color.split(' '));
                        cell.innerHTML = `<span class="font-bold text-white">${planZoneDisplays[placedPlanZones[cellId].type]}</span>`;
                        cell.dataset.zoneType = placedPlanZones[cellId].type;
                        cell.style.backgroundColor = ''; 
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
            document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
            e.target.classList.add('selected');
            currentSelectedPlanZone = {
                type: e.target.dataset.zoneType,
                color: e.target.dataset.color
            };
            if (planFeedbackArea) { 
                planFeedbackArea.innerHTML = `<p class="text-sm">Selezionato: <span class="font-bold">${currentSelectedPlanZone.type}</span>. Clicca su una cella della griglia per posizionarlo.</p>`;
            }
        };

        const handlePlanGridCellClick = (e) => {
            const cell = e.target.closest('.grid-cell');
            if (!cell) return;

            const cellId = `${cell.dataset.row}-${cell.dataset.col}`;
            if (planFixedZones[cellId]) {
                if (planFeedbackArea) { 
                    planFeedbackArea.innerHTML = `<p class="text-sm text-red-600">Non puoi posizionare qui. Questa è l'area dell'incidente o <span class="text-orange-700 font-bold">punto di crash</span>.</p>`;
                }
                return;
            }

            if (currentSelectedPlanZone) {
                for (const key in placedPlanZones) {
                    if (placedPlanZones[key].type === currentSelectedPlanZone.type) {
                        delete placedPlanZones[key];
                    }
                }
                placedPlanZones[cellId] = currentSelectedPlanZone;
                generatePlanGrid();
                currentSelectedPlanZone = null;
                document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
                if (planFeedbackArea) { 
                    planFeedbackArea.innerHTML = `<p class="text-sm">Area <span class="font-bold">${placedPlanZones[cellId].type}</span> posizionata. Seleziona un'altra area o valuta il tuo piano.</p>`;
                }
            } else {
                if (planFeedbackArea) { 
                    planFeedbackArea.innerHTML = `<p class="text-sm text-red-600">Seleziona prima un'area dalla palette.</p>`;
                }
            }
        };

        const evaluatePlanFn = () => {
            let feedback = [];
            let score = 0;
            const requiredZones = ['Triage', 'PMA', 'Accesso Mezzi', 'Uscita Mezzi', 'PCA', 'Area Verdi'];
            const placedZoneTypes = new Set(Object.values(placedPlanZones).map(z => z.type));

            requiredZones.forEach(zoneType => {
                if (!placedZoneTypes.has(zoneType)) {
                    feedback.push(`Manca l'area: <span class="font-bold">${zoneType}</span>.`);
                }
            });

            if (feedback.length > 0) {
                if (planFeedbackArea) { 
                    planFeedbackArea.innerHTML = `<p class="font-bold text-red-600">Completa il tuo piano!</p>` + feedback.map(msg => `<p class="text-sm text-red-600">${msg}</p>`).join('');
                }
                return;
            }

            const getZonePos = (type) => {
                for (const key in placedPlanZones) {
                    if (placedPlanZones[key].type === type) {
                        const [r, c] = key.split('-').map(Number);
                        return { r, c };
                    }
                }
                return null;
            };

            const dist = (pos1, pos2) => Math.abs(pos1.r - pos2.r) + Math.abs(pos1.c - pos2.c);

            const incidentPos = { r: 2, c: 2 }; 

            const triagePos = getZonePos('Triage');
            const pmaPos = getZonePos('PMA');
            const accessoMezziPos = getZonePos('Accesso Mezzi');
            const uscitaMezziPos = getZonePos('Uscita Mezzi');
            const pcaPos = getZonePos('PCA');
            const areaVerdiPos = getZonePos('Area Verdi');

            if (triagePos && dist(triagePos, incidentPos) <= 2) {
                score += 1;
                feedback.push(`✔️ Triage ben posizionato vicino all'incidente.`);
            } else {
                feedback.push(`❌ Triage dovrebbe essere più vicino all'area del <span class="text-orange-700 font-bold">Punto di Crash</span>.`);
            }

            if (pmaPos && triagePos && dist(pmaPos, triagePos) <= 2) {
                score += 1;
                feedback.push(`✔️ PMA ben posizionato vicino al Triage.`);
            } else {
                feedback.push(`❌ PMA dovrebbe essere più vicino al Triage per un flusso efficiente.`);
            }

            if (accessoMezziPos && uscitaMezziPos && dist(accessoMezziPos, uscitaMezziPos) > 1) {
                score += 2;
                feedback.push(`✔️ Vie di accesso e uscita dei mezzi distinte.`);
            } else {
                feedback.push(`❌ Le vie di accesso e uscita dei mezzi dovrebbero essere distinte.`);
            }

            if (pcaPos && (dist(pcaPos, triagePos) <= 3 || dist(pcaPos, accessoMezziPos) <= 3)) {
                score += 1;
                feedback.push(`✔️ PCA ben posizionato in un'area sicura e accessibile.`);
            } else {
                feedback.push(`❌ PCA dovrebbe essere in un'area sicura e facilmente accessibile per il coordinamento.`);
            }

            if (areaVerdiPos && dist(areaVerdiPos, pmaPos) <= 3) {
                score += 1;
                feedback.push(`✔️ Area Verdi posizionata in modo logico rispetto al PMA.`);
            } else {
                feedback.push(`❌ L'Area Verdi può essere più lontana dal Triage ma comunque accessibile al PMA.`);
            }

            let overallFeedback = '';
            const actualMaxScore = 6; 
            if (score === actualMaxScore) {
                overallFeedback = `<p class="font-bold text-green-600 text-lg">Eccellente! Il tuo piano è molto ben ottimizzato! Punteggio: ${score}/${actualMaxScore}</p>`;
            } else if (score >= actualMaxScore / 2) {
                overallFeedback = `<p class="font-bold text-orange-600 text-lg">Buon lavoro! Il tuo piano è funzionale, ma ci sono aree di miglioramento. Punteggio: ${score}/${actualMaxScore}</p>`;
            } else {
                overallFeedback = `<p class="font-bold text-red-600 text-lg">Rivedi il tuo piano. Ci sono alcune aree critiche da migliorare. Punteggio: ${score}/${actualMaxScore}</p>`;
            }

            if (planFeedbackArea) { 
                if (score >= actualMaxScore / 2 && window.__markDone) window.__markDone('progetta-piano'); planFeedbackArea.innerHTML = overallFeedback + feedback.map(msg => `<p class="text-sm">${msg}</p>`).join('');
            }
        };

        const resetPlanFn = () => {
            placedPlanZones = {};
            currentSelectedPlanZone = null;
            generatePlanGrid();
            document.querySelectorAll('.plan-zone-item').forEach(item => item.classList.remove('selected'));
            if (planFeedbackArea) { 
                planFeedbackArea.innerHTML = `
                    <h5 class="font-semibold text-primary mb-2">Consigli per il posizionamento:</h5>
                    <ul class="list-disc list-inside text-sm space-y-1">
                        <li>Il **Triage** dovrebbe essere vicino al <span class="text-orange-700 font-bold">Punto di Crash</span> per una valutazione rapida.</li>
                        <li>Il **PMA** (Posto Medico Avanzato) va posizionato nel <span class="text-green-500 font-bold">Punto di Raccolta</span>, vicino al Triage ma in un'area sicura.</li>
                        <li>Le **Vie di Accesso e Uscita Mezzi** devono essere distinte per evitare ingorghi e facilitare il flusso (la "Noria").</li>
                        <li>Il **PCA** (Posto di Comando Avanzato) dovrebbe essere in un punto strategico, sicuro e facilmente raggiungibile da tutte le aree operative.</li>
                        <li>L'**Area Verdi** (per i feriti lievi) può essere leggermente più defilata ma sempre accessibile al PMA.</li>
                        <li>L'**Area Deceduti** (nella simulazione seguente) deve essere appartata e lontana dal flusso principale dei pazienti vivi.</li>
                    </ul>
                `;
            }
        };

        document.querySelectorAll('.plan-zone-item').forEach(item => {
            item.addEventListener('click', handlePlanZoneItemClick);
        });
        if (evaluatePlanBtn) { 
            evaluatePlanBtn.addEventListener('click', evaluatePlanFn);
        }
        if (resetPlanBtn) { 
            resetPlanBtn.addEventListener('click', resetPlanFn);
        }

        generatePlanGrid();


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
                question: "1) Paziente cosciente, cammina con difficoltà per il fumo, ha respiro affannoso con FR 35 atti/min, polso periferico presente FC 110. Non esegue ordini semplici. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "2) Paziente supino incosciente. Non respira dopo aver aperto le vie aeree. Polso periferico assente. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "3) Paziente seduto. Respiro regolare FR 16 atti/min, polso periferico presente FC 60. Esegue ordini semplici. Che codice gli assegni?",
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
                question: "5) Paziente in piedi. Respiro FR 35 atti/min, polso periferico FC 100. Esegue ordini semplici. Che codice gli assegni?",
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
                question: "9) Un paziente è cosciente, ma la sua frequenza respiratoria è di 35 atti/minuto. Che codice gli assegni?",
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
                question: "11) Un paziente è cosciente, respira a 16 atti/minuto, ha il polso radiale presente. Si lamenta di forte dolore addominale ma segue i tuoi ordini. Che codice gli assegni?",
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
                question: "13) Trovi un paziente con una grave emorragia esterna che non riesci a controllare con la compressione diretta. La sua frequenza respiratoria è di 20 atti/minuto e il polso radiale è debole. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "14) Un paziente è un bambino di 5 anni, piange e cerca la mamma. Respira bene, è roseo e non ha ferite evidenti. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Verde",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "15) Un paziente ha una frattura esposta alla gamba, ma è cosciente, respira a 14 atti/minuto, polso radiale presente e segue i comandi. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Giallo",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "16) Un paziente anziano è incosciente, non respira e, dopo aver aperto le vie aeree, non riprende a respirare. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            },
            {
                question: "17) Un paziente è cosciente, ma non riesce a camminare a causa di un forte dolore alla caviglia. Respira regolarmente (18 atti/minuto) e il polso radiale è presente. Che codice gli assegni?",
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
                question: "20) Un paziente è cosciente, con una ferita al torace che fischia (pneumotorace aperto), respira con difficoltà a 28 atti/minuto e ha un polso debole. Che codice gli assegni?",
                options: ["Rosso", "Giallo", "Verde"],
                correctAnswer: "Rosso",
                imagePrompt: "images/quiz-start.jpg"
            }
        ];

        const conceptsQuizQuestions = [
            {
                question: "1) Qual è la caratteristica principale che distingue una 'maxi-emergenza' da un 'incidente maggiore'?",
                options: ["Il tipo di veicoli coinvolti", "La durata e la sproporzione bisogni/risorse", "La presenza di fumo", "Il numero di soccorritori sul posto"],
                correctAnswer: "La durata e la sproporzione bisogni/risorse",
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
                question: "4) Chi è il Direttore dei Soccorsi Sanitari (DSS) e che colore di giubbotto indossa?",
                options: ["Un infermiere, giubbotto rosso", "Il comandante sanitario sul campo, giubbotto giallo", "Un autista di ambulanza, giubbotto blu", "Il responsabile della Protezione Civile, giubbotto arancione"],
                correctAnswer: "Il comandante sanitario sul campo, giubbotto giallo",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "5) Cosa si intende per 'Grande Noria' nel contesto delle maxi-emergenze?",
                options: ["Il trasporto di pazienti dalla scena al PMA", "L'afflusso di ambulanze al pronto soccorso", "L'evacuazione dei pazienti dal PMA agli ospedali", "Il coordinamento dei Vigili del Fuoco"],
                correctAnswer: "L'evacuazione dei pazienti dal PMA agli ospedali",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "6) Quale fase della risposta include la mappatura dei rischi e la preparazione dei Piani di Soccorso?",
                options: ["Fase di Allarme", "Fase di Risposta Immediata", "Fase Preparatoria", "Fase di Risposta Differita"],
                correctAnswer: "Fase Preparatoria",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "7) Quale è la composizione tipica dell'equipaggio di un'Ambulanza Medicalizzata (Codice Mike)?",
                options: ["Autista, Soccorritore", "Autista, Infermiere", "Autista, Soccorritore, Infermiere", "Autista, Soccorritore, Infermiere, Medico"],
                correctAnswer: "Autista, Soccorritore, Infermiere, Medico",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "8) Chi è il responsabile del triage sul campo (primario e secondario) e del recupero dei feriti?",
                options: ["Direttore dei Trasporti (ALO)", "Direttore del PMA (DPMA)", "Direttore dei Soccorsi Sanitari (DSS)", "Direttore di Triage (TRO)"],
                correctAnswer: "Direttore di Triage (TRO)",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "9) Qual è il principale vantaggio di una comunicazione efficace con la SOREU (Centrale Operativa 118) nelle fasi iniziali di una maxi-emergenza?",
                options: ["Assicurare il trasporto immediato di tutti i feriti", "Garantire che i media siano informati correttamente", "Permettere alla Centrale di dimensionare correttamente l'evento e mobilitare le risorse adeguate", "Accelerare le indagini sulla causa dell'incidente"],
                correctAnswer: "Permettere alla Centrale di dimensionare correttamente l'evento e mobilitare le risorse adeguate",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "10) Qual è il principale obiettivo del triage in una maxi-emergenza?",
                options: ["Curare tutti i pazienti sul posto", "Trasportare i pazienti più gravi per primi", "Ottimizzare la gestione delle risorse scarse per la sopravvivenza del maggior numero", "Identificare tutti i pazienti deceduti"],
                correctAnswer: "Ottimizzare la gestione delle risorse scarse per la sopravvivenza del maggior numero",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "11) Quale delle seguenti non è una delle zone operative principali in una maxi-emergenza?",
                options: ["Punto di Crash", "Zona Neutra", "Triage", "Punto di Raccolta"],
                correctAnswer: "Zona Neutra",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "12) Chi è il responsabile del coordinamento della logistica dei trasporti (la Noria)?",
                options: ["Direttore del PMA", "Direttore di Triage", "Direttore dei Trasporti", "Direttore dei Soccorsi Sanitari"],
                correctAnswer: "Direttore dei Trasporti",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "13) In quale fase si allestisce il Posto Medico Avanzato (PMA)?",
                options: ["Fase Preparatoria", "Fase di Allarme", "Fase di Risposta Immediata", "Fase di Risposta Differita"],
                correctAnswer: "Fase di Risposta Differita",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "14) Quale acronimo viene usato per la valutazione iniziale e la comunicazione con la Centrale Operativa 118?",
                options: ["START", "GCS", "M.E.T.H.A.N.E.", "BLS"],
                correctAnswer: "M.E.T.H.A.N.E.",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "15) Qual è il ruolo principale dei 'walking wounded' e in quale area vengono generalmente raggruppati inizialmente?",
                options: ["Pazienti gravissimi; Area Rossi", "Pazienti deceduti; Area Neri", "Pazienti feriti lievi che possono camminare; Area Verdi", "Pazienti che necessitano di estricazione; Punto di Crash"],
                correctAnswer: "Pazienti feriti lievi che possono camminare; Area Verdi",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "16) Quale delle seguenti figure ha il compito di stabilire l'ubicazione del Posto di Comando Avanzato (PCA)?",
                options: ["Il Direttore di Triage (TRO)", "Il Direttore dei Soccorsi Sanitari (DSS)", "Il Direttore dei Trasporti (ALO)", "Il Direttore del PMA (DPMA)"],
                correctAnswer: "Il Direttore dei Soccorsi Sanitari (DSS)",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "17) La 'Piccola Noria' si riferisce al trasporto dei pazienti:",
                options: ["Dagli ospedali al PMA", "Dalla scena dell'incidente al PMA", "Dal PMA agli ospedali", "Dalle zone di attesa ai mezzi di soccorso"],
                correctAnswer: "Dalla scena dell'incidente al PMA",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "18) Qual è l'importanza delle esercitazioni congiunte tra le diverse componenti del soccorso (118, VVF, Protezione Civile) nella fase preparatoria?",
                options: ["Per testare la rapidità dei trasporti in ospedale", "Per definire i ruoli dei media sul campo", "Per testare protocolli e creare sinergia tra gli operatori", "Per stabilire il costo dell'intervento"],
                correctAnswer: "Per testare protocolli e creare sinergia tra gli operatori",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "19) Quale principio guida il triage in situazioni di maxi-emergenza?",
                options: ["Curare il primo paziente che si incontra", "Trasportare tutti i pazienti immediatamente all'ospedale più vicino", "Ottimizzare la gestione delle risorse scarse per la sopravvivenza del maggior numero", "Garantire il comfort di ogni singolo paziente"],
                correctAnswer: "Ottimizzare la gestione delle risorse scarse per la sopravvivenza del maggior numero",
                imagePrompt: "images/quiz-general.jpg"
            },
            {
                question: "20) L'area del Posto Medico Avanzato (PMA) è tipicamente allestita all'interno di quale zona operativa?",
                options: ["Punto di Crash", "Triage", "Punto di Raccolta", "Area Deceduti"],
                correctAnswer: "Punto di Raccolta",
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
                    quizFeedback.textContent = `Corretto! Il codice è ${correctAnswer}.`;
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
                    quizFeedback.textContent = `Sbagliato. La risposta corretta era ${correctAnswer}.`;
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
        const priorityActions = [
            { text: "Valutare la sicurezza della scena, in particolare la linea elettrica aerea del treno e la stabilità dei vagoni.", priority: 1, type: "safety" },
            { text: "Richiedere immediatamente il personale RFI (Rete Ferroviaria Italiana) e i Vigili del Fuoco per la messa in sicurezza e l'estricazione.", priority: 2, type: "communication" },
            { text: "Stabilire un perimetro di sicurezza e allontanare i curiosi.", priority: 3, type: "scene_management" },
            { text: "Effettuare un rapido sweeping triage visivo per identificare le vittime più gravi (ROSSI) e quelle deambulanti (VERDI).", priority: 4, type: "triage" },
            { text: "Comunicare alla SOREU una stima dei coinvolti e i rischi prevalenti, inclusa l'interruzione della linea ferroviaria.", priority: 5, type: "communication" },
            { text: "Tentare l'approccio e la valutazione delle vittime intrappolate, se le condizioni di sicurezza lo permettono.", priority: 6, type: "patient_care" },
            { text: "Preparare il materiale necessario per il primo soccorso avanzato nell'area di pre-triage.", priority: 7, type: "preparation" },
            { text: "Individuare un'area sicura per l'allestimento del PMA e delle aree di raccolta vittime.", priority: 8, type: "logistics" }
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
                    if (window.__markDone) window.__markDone('priority-intervention'); priorityFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Eccellente! Hai ordinato le azioni perfettamente!</p>';
                } else {
                    priorityFeedbackArea.innerHTML = `<p class="font-bold text-red-600 text-lg">Ci sono ${priorityActions.length - correctCount} errori. Riprova! <br>${feedbackMessages.join('<br>')}</p>`;
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
        // Updated resource data for balance and realism
        const resourcesData = [
            { id: 'res-1', type: 'Ambulanza Base', display: 'Ambulanza Base', count: 4 }, // Updated count
            { id: 'res-2', type: 'Ambulanza Avanzata', display: 'Ambulanza Avanzata', count: 2 },
            { id: 'res-3', type: 'Vigili del Fuoco', display: 'Vigili del Fuoco', count: 2 }, 
            { id: 'res-4', type: 'Squadra Medica', display: 'Squadra Medica', count: 2 },
            { id: 'res-5', type: 'Pullman Verdi', display: 'Pullman Verdi', count: 1 }, 
            { id: 'res-6', type: 'Personale RFI', display: 'Personale RFI', count: 3 }, // Updated count
            { id: 'res-7', type: 'Supporto Psicologico', display: 'Supporto Psicologico', count: 2 }, // Updated count
            { id: 'res-8', type: 'Autorità Giudiziaria', display: 'Autorità Giudiziaria', count: 1 } // New resource
        ];

        // Updated zones and their expected resources for realism and balance
        const zonesData = [
            { id: 'zone-1', type: 'Crash / Incidente', display: 'Crash / Incidente', expectedResources: ['Vigili del Fuoco', 'Personale RFI'] },
            { id: 'zone-2', type: 'Triage', display: 'Triage', expectedResources: ['Ambulanza Avanzata', 'Squadra Medica'] },
            { id: 'zone-3', type: 'Raccolta', display: 'Raccolta', expectedResources: ['Ambulanza Base', 'Pullman Verdi', 'Supporto Psicologico'] },
            { id: 'zone-4', type: 'PMA', display: 'PMA', expectedResources: ['Ambulanza Avanzata', 'Squadra Medica', 'Ambulanza Base', 'Supporto Psicologico'] }, 
            { id: 'zone-5', type: 'Logistica', display: 'Logistica', expectedResources: ['Ambulanza Base', 'Vigili del Fuoco', 'Personale RFI'] },
            { id: 'zone-6', type: 'Punto Raccolta Salme', display: 'Punto Raccolta Salme', expectedResources: ['Autorità Giudiziaria', 'Ambulanza Base'] }, // Updated expected resource
            { id: 'zone-7', type: 'Zona Tecnica', display: 'Zona Tecnica RFI', expectedResources: ['Personale RFI'] }
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
                        feedback.push(`❌ ${zone.display}: Allocazione non ottimale. ${zoneFeedback.join('. ')}. Risorse necessarie per questa area: ${zone.expectedResources.join(', ')}.`);
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
                    if (window.__markDone) window.__markDone('resource-management'); resourceFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Complimenti! Tutte le risorse sono state allocate perfettamente!</p>';
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
        const radioScenarios = [
            {
                scenario: "Sei il primo mezzo sul luogo del deragliamento. Vedi vagoni rovesciati e un fumo denso. C'è un odore acuto, non identificato. Qual è la tua prima comunicazione alla SOREU?",
                options: [
                    { text: "Qui MSB 1, incidente treno! C'è fumo e puzza. Mandate aiuti! Passo.", correct: false, feedback: "Troppo generico e poco professionale. Mancano dettagli essenziali e la terminologia corretta." },
                    { text: "MSB 1 a SOREU, confermo deragliamento treno, numerosi vagoni rovesciati, fumo denso e odore sconosciuto. Necessari VVF, ARPA, e squadre sanitarie multiple. Passo.", correct: true, feedback: "Corretto! Fornisce un quadro chiaro, identifica i rischi principali (fumo, odore sconosciuto) e richiede risorse specifiche e appropriate." },
                    { text: "SOREU, qui MSB 1, è un disastro! Molti feriti, credo. Finito.", correct: false, feedback: "Eccessivamente emotivo e non fornisce informazioni operative utili. La terminologia 'finito' non è lo standard." },
                    { text: "Situazione critica, vagoni a terra. Ho bisogno di rinforzi subito. Passo.", correct: false, feedback: "Migliore ma ancora troppo vago. Non specifica il tipo di incidente, i rischi o le risorse necessarie in dettaglio." },
                    { text: "Ho visto un treno cappottato, vado a vedere quanti feriti ci sono. Vi richiamo. Passo.", correct: false, feedback: "Errato! Non hai valutato la sicurezza della scena, il rischio chimico/biologico/radiologico e l'integrità strutturale." }
                ]
            },
            {
                scenario: "Hai identificato la presenza di passeggeri intrappolati all'interno di un vagone parzialmente sommerso dall'acqua (a seguito del deragliamento vicino a un canale). Come lo segnali?",
                options: [
                    { text: "MSB 1 a SOREU, passeggeri intrappolati in vagone sommerso. Richiedo sommozzatori e VVF con mezzi per estricazione in acqua. Passo.", correct: true, feedback: "Corretto! Segnalazione precisa del problema e richiesta di risorse altamente specializzate per l'ambiente specifico." },
                    { text: "C'è gente nell'acqua nel treno. Venite veloci! Passo.", correct: false, feedback: "Non professionale e non fornisce dettagli utili per la pianificazione dell'intervento." },
                    { text: "Ho visto delle persone dentro al vagone nell'acqua. Urge aiuto. Finito.", correct: false, feedback: "Manca di formalità e specificità per un'emergenza complessa come questa." },
                    { text: "Richiedo un'ambulanza extra, ci sono dei passeggeri con l'acqua alla gola. Passo.", correct: false, feedback: "La richiesta è insufficiente. Non basta un'ambulanza, servono mezzi specializzati per il salvataggio in acqua." },
                    { text: "SOREU, qui MSB 1, il treno è affondato parzialmente. Passeggeri all'interno. Ho bisogno di supporto generico. Passo.", correct: false, feedback: "La terminologia è imprecisa ('affondato') e la richiesta è troppo generica per un intervento così specifico." }
                ]
            },
            {
                scenario: "Hai attivato la procedura START e hai concluso il triage dei primi 30 pazienti. Bilancio: 15 Verdi, 10 Gialli, 4 Rossi, 1 Nero. Come lo comunichi alla SOREU?",
                options: [
                    { text: "SOREU da MSB 1, bilancio vittime: 15 minimi, 10 ritardati, 4 immediati, 1 deceduto. Passo.", correct: true, feedback: "Corretto! Utilizza la terminologia START standardizzata e concisa per il bilancio vittime." },
                    { text: "Qui MSB 1, abbiamo circa 30 feriti. Molti lievi, alcuni medi, pochi gravi e un morto. Passo.", correct: false, feedback: "Linguaggio colloquiale, non usa la terminologia START e non è sufficientemente professionale." },
                    { text: "SOREU, qui MSB 1, ho finito di contare i feriti. Ho 15 'green', 10 'yellow', 4 'red', 1 'black'. Finisco.", correct: false, feedback: "L'uso di termini inglesi non è standard nel protocollo radio italiano. 'Finisco' non è l'interminabile di comunicazione." },
                    { text: "Ho 15 sani, 10 che camminano male, 4 che stanno morendo, e uno morto. Venite subito. Passo.", correct: false, feedback: "Assolutamente inaccettabile. Linguaggio inappropriato, emotivo e non professionale. Non è una comunicazione radio." },
                    { text: "MSB 1 a SOREU, ho 15 pazienti che posso mandare via, 10 che possono aspettare un po', 4 gravissimi e uno che non ce l'ha fatta. Passo.", correct: false, feedback: "Descrizione troppo prolissa e imprecisa. Si perde in descrizioni quando servono codici chiari e rapidi." }
                ]
            },
            {
                scenario: "Sei il referente del PMA e un mezzo di soccorso ti chiede la posizione del punto di raccolta salme. Come rispondi?",
                options: [
                    { text: "Qui Referente PMA, il punto salme è oltre il terzo vagone, in un'area discreta. Passo.", correct: false, feedback: "La descrizione 'terzo vagone' è ambigua e può variare. Serve un riferimento fisso e non ambiguo." },
                    { text: "Referente PMA a SOREU, Punto Raccolta Salme si trova a est dell'area logistica, ben segnalato. Passo.", correct: true, feedback: "Corretto! Fornisce un riferimento geografico chiaro (est dell'area logistica) e indica che è segnalato, aiutando l'orientamento." },
                    { text: "Venite qui che vi indico. Passo.", correct: false, feedback: "Inefficace. Non fornisce le informazioni richieste e fa perdere tempo prezioso al mezzo." },
                    { text: "Il punto salme è dove non c'è nessuno. Passo.", correct: false, feedback: "Non è una comunicazione utile e non professionale." },
                    { text: "Punto Raccolta Salme dietro al PMA. Passo.", correct: false, feedback: "Troppo generico. 'Dietro' può significare diverse posizioni a seconda del punto di osservazione." }
                ]
            },
            {
                scenario: "Ti viene comunicato dalla SOREU che la Protezione Civile sta allestendo un campo base per gli sfollati a 2 km dal luogo dell'incidente. Come confermi la ricezione del messaggio?",
                options: [
                    { text: "OK, ricevuto. Passo.", correct: false, feedback: "Breve, ma troppo informale. 'Ricevuto, passo' è corretto, ma si può essere più espliciti." },
                    { text: "Compreso. Campo base PC a 2km. Passo.", correct: true, feedback: "Corretto! Conferma la comprensione del messaggio, riepilogando l'informazione chiave per evitare malintesi." },
                    { text: "Sì, ho capito. Vado avanti. Finito.", correct: false, feedback: "Linguaggio non standardizzato e poco professionale. 'Finito' non è un termine di chiusura radio." },
                    { text: "Messaggio ricevuto, grazie. Passo.", correct: false, feedback: "Professionale ma non riepiloga l'informazione. Riepilogare aiuta a verificare la corretta ricezione." },
                    { text: "Va bene, quando è pronto fatemi sapere. Passo.", correct: false, feedback: "Non è una conferma di ricezione ma una richiesta successiva, che non risponde al quesito." }
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
                radioScenarioText.textContent = "Hai completato tutti gli scenari radio! Complimenti per l'ottima comunicazione!";
                radioOptionsContainer.innerHTML = '';
                nextRadioScenarioBtn.classList.add('hidden');
                if (window.__markDone) window.__markDone('radio-communication'); radioFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Ben fatto! Ottima padronanza della comunicazione radio.</p>';
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
                scenario: "Sei il primo medico a raggiungere una scena con due vagoni rovesciati. Nel primo, vedi un bambino con trauma cranico grave e una ferita addominale. Nel secondo, un adulto con un'emorragia arteriosa massiva da un arto amputato. Hai solo un tourniquet e puoi raggiungere uno dei due subito. Chi tratti per primo? (Ricorda: in maxi emergenza la priorità è salvare il maggior numero di vite in base alla 'salvabilità immediata')",
                options: [
                    { text: "Il bambino – è più vulnerabile.", isCorrect: false },
                    { text: "L'adulto – l'emorragia arteriosa è più rapidamente trattabile e minaccia la vita nell'immediato.", isCorrect: true }
                ],
                outcomeExplanation: {
                    false: "Moralmente comprensibile, ma in un contesto di maxi emergenza la priorità è massimizzare i sopravvissuti. L'emorragia arteriosa dell'adulto è più rapidamente letale e controllabile con il tourniquet. Salvare l'adulto potrebbe liberare risorse più velocemente. In questa fase si valuta la 'salvabilità immediata'.",
                    true: "In un contesto di maxi emergenza, l'obiettivo è la massimizzazione dei salvati. L'emorragia maggiore dell'adulto è una causa di morte rapida e prevenibile con il tuo unico tourniquet, mentre il trauma cranico e addominale del bambino potrebbe avere esiti meno modificabili nell'immediato o richiedere interventi diversi che al momento non puoi offrire."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Hai un mezzo di soccorso con 3 posti disponibili. Sei in un'area remota dell'incidente ferroviario e hai 5 pazienti 'gialli' (urgenti ma stabili) e 2 pazienti 'verdi' (lievi) che possono deambulare autonomamente. Il PMA è a 10 minuti. Cosa decidi di trasportare?",
                options: [
                    { text: "Caricare i 3 pazienti 'gialli' più critici per ridurre il rischio di aggravamento.", isCorrect: true },
                    { text: "Caricare i 3 pazienti 'verdi' per liberare la zona più velocemente e attendere un altro mezzo per i gialli.", isCorrect: false },
                    { text: "Lasciare il mezzo fermo in attesa di istruzioni più precise dalla SOREU.", isCorrect: false },
                    { text: "Caricare 2 gialli e 1 verde per bilanciare il trasporto.", isCorrect: false },
                    { text: "Far camminare i verdi verso un punto di raccolta più vicino e caricare i 3 gialli più critici.", isCorrect: true } 
                ],
                outcomeExplanation: {
                    "true": "Anche all'interno di una stessa categoria di triage (Giallo), è bene prioritizzare chi ha maggiore rischio di aggravamento o chi può beneficiare maggiormente del trattamento immediato al PMA. I 'verdi' possono attendere o essere indirizzati autonomamente. Se i 'verdi' possono essere instradati autonomamente, liberare il mezzo per i 'gialli' è ottimale.",
                    "false": "In una maxi emergenza si prioritizzano sempre i casi più gravi (rossi e gialli) rispetto ai verdi, anche se i verdi sono più facili da trasportare. Non si 'sprecano' posti per chi può aspettare o muoversi autonomamente. Un mezzo fermo è una risorsa non utilizzata; le risorse vanno mobilizzate rapidamente."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Ti viene comunicato che la linea ferroviaria non sarà disalimentata per almeno altri 20 minuti, ma c'è un paziente rosso intrappolato vicino ai binari. Hai un'attrezzatura minima per la protezione personale e il paziente sta peggiorando. Cosa fai?",
                options: [
                    { text: "Aspetti la disalimentazione completa della linea, la sicurezza viene prima di tutto.", isCorrect: false },
                    { text: "Tenti l'estricazione del paziente con la massima cautela, mantenendo una distanza di sicurezza dai cavi elettrici e monitorando i segnali di disalimentazione.", isCorrect: true },
                    { text: "Richiedi urgentemente al personale RFI di accelerare la disalimentazione e ti prepari a intervenire al primo segnale di sicurezza.", isCorrect: false },
                    { text: "Lasci il paziente lì e ti concentri sui pazienti in zone più sicure, per non rischiare la tua vita.", isCorrect: false },
                    { text: "Comunichi alla SOREU la situazione e chiedi istruzioni precise prima di agire.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "Se la situazione lo permette con attrezzatura minima e massima cautela, un 'rosso' ha la priorità assoluta. Il rischio va mitigato il più possibile, ma non si può attendere in caso di imminente pericolo di vita per il paziente.",
                    "false": "Sebbene la sicurezza sia fondamentale, in caso di 'paziente rosso' con rischio di vita imminente e possibilità di accesso sicuro con precauzioni minime, l'attesa può essere fatale. Si valuta il rischio/beneficio con l'equipaggiamento disponibile. Un soccorritore è addestrato a gestire il rischio, non ad abbandonare. La SOREU è un centro di coordinamento, non un decisore sul campo per ogni singola azione in tempo reale."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Hai appena estratto un paziente 'giallo' gravemente ustionato, ma noti che le fiamme stanno divampando rapidamente verso la tua posizione. Hai solo il tempo di portare il paziente in un'area sicura o di recuperare una valigetta di farmaci essenziali rimasta indietro. Cosa scegli?",
                options: [
                    { text: "Recuperare la valigetta di farmaci, sono risorse vitali per molti pazienti.", isCorrect: false },
                    { text: "Mettere in sicurezza immediatamente il paziente ustionato, abbandonando la valigetta se necessario.", isCorrect: true },
                    { text: "Cercare di recuperare sia il paziente che la valigetta, rischiando di rallentare troppo.", isCorrect: false },
                    { text: "Chiedere alla SOREU se è più importante il paziente o la valigetta.", isCorrect: false },
                    { text: "Coprire il paziente con una coperta antifiamma e recuperare la valigetta, poi allontanarsi.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "La priorità assoluta è la sicurezza del paziente e del soccorritore. Le risorse materiali sono secondarie rispetto alla vita. Le fiamme che avanzano rappresentano un pericolo imminente.",
                    "false": "Nessuna risorsa materiale è più importante di una vita umana. In situazioni di pericolo imminente e tempo limitato, tentare di salvare tutto può portare a perdere tutto. La decisione deve essere rapida e chiara sulla priorità della vita. La priorità della vita umana è sempre superiore a quella delle risorse."
                },
                timeLimit: 60 // seconds
            },
            {
                scenario: "Sei il primo ad arrivare in una galleria ferroviaria dopo un impatto. Ci sono molti passeggeri disorientati e alcuni vagoni fumanti. La visibilità è ridotta. La tua radio funziona a intermittenza. Qual è la tua priorità immediata?",
                options: [
                    { text: "Cercare subito il pannello di emergenza per i sistemi di ventilazione e illuminazione della galleria.", isCorrect: true },
                    { text: "Iniziare il triage dei pazienti più vicini immediatamente.", isCorrect: false },
                    { text: "Tentare di ripristinare la comunicazione radio uscendo dalla galleria per un segnale migliore.", isCorrect: false },
                    { text: "Urlare per calmare i passeggeri e indirizzarli verso l'uscita più vicina.", isCorrect: false },
                    { text: "Entrare nel vagone più vicino per vedere quanti feriti ci sono e iniziare a trattarli.", isCorrect: false }
                ],
                outcomeExplanation: {
                    "true": "Migliorare la visibilità e la qualità dell'aria (eliminare il fumo) è cruciale per la sicurezza e la capacità di soccorso. È una priorità sulla scena prima di qualsiasi altro intervento diretto sui pazienti.",
                    "false": "Prima di operare, devi assicurare che l'ambiente sia il più sicuro possibile per te e per le vittime. Non si entra in un ambiente pericoloso (fumo, poca visibilità, vagoni fumanti) senza averne mitigato i rischi o averne compreso la dinamica. La sicurezza della scena prima del soccorso diretto. Anche la comunicazione è importante, ma se ci sono pericoli immediati per la vita in galleria, la mitigazione del rischio ambientale è prioritaria."
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
                dilemmaScenarioText.textContent = "Hai completato tutti i dilemmi! Ottimo lavoro sulla capacità decisionale!";
                dilemmaOptionsContainer.innerHTML = '';
                dilemmaTimerDisplay.textContent = '';
                if (window.__markDone) window.__markDone('ethical-dilemma'); dilemmaFeedbackArea.innerHTML = '<p class="font-bold text-green-600 text-lg">Hai affrontato con successo tutti i dilemmi decisionali!</p>';
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
