// ===== AFFICHAGE DES SECTIONS =====

function showSection(sectionId) {

    // Cacher toutes les sections
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Afficher la section choisie
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove('hidden');

        // Scroll automatique vers la section
        selectedSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// ===== ENREGISTREMENT DU SERVICE WORKER =====

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

        navigator.serviceWorker
            .register('./service-worker.js')

            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès');
            })

            .catch((error) => {
                console.log('❌ Erreur Service Worker :', error);
            });

    });

}


// ===== INSTALLATION PWA =====

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {

    // Empêcher l'affichage automatique
    e.preventDefault();

    deferredPrompt = e;

    // Créer le bouton d'installation
    const installBtn = document.createElement('button');

    installBtn.textContent = '📲 تثبيت التطبيق';

    installBtn.className = 'card-btn';

    installBtn.style.margin = '20px';

    installBtn.addEventListener('click', async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        console.log('Résultat installation :', outcome);

        deferredPrompt = null;

        installBtn.remove();

    });

    document.querySelector('.main-menu').appendChild(installBtn);

});


// ===== MESSAGE APRÈS INSTALLATION =====

window.addEventListener('appinstalled', () => {

    alert('🎉 تم تثبيت تطبيق مطعم الفنان بنجاح!');

});


// ===== CONSOLE =====

console.log('🍕 Restaurant El Fanen جاهز للعمل');
