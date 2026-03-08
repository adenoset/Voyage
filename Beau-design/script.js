// JavaScript for Donezo Dashboard Interactions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard Loaded");

    // Optional: Add some simple ticking logic for the time tracker to feel alive
    const timeDisplay = document.querySelector('.time-display');
    let secondsElapsed = 3600 + 24 * 60 + 8; // "01:24:08" in seconds initially
    let timerInterval = null;
    let isPlaying = true; // Assume playing based on the UI

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isPlaying) {
            clearInterval(timerInterval);
            isPlaying = false;
            // Optionally change icon to play
        } else {
            timerInterval = setInterval(() => {
                secondsElapsed++;
                if (timeDisplay) {
                    timeDisplay.textContent = formatTime(secondsElapsed);
                }
            }, 1000);
            isPlaying = true;
        }
    };

    const pauseBtn = document.querySelector('.control-btn.pause');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            toggleTimer();
            // Toggle internal icon dynamically
            const icon = pauseBtn.querySelector('i');
            if (isPlaying) {
                icon.setAttribute('data-lucide', 'pause');
            } else {
                icon.setAttribute('data-lucide', 'play');
            }
            lucide.createIcons(); // Re-init icon
        });
    }

    // Start timer initially
    timerInterval = setInterval(() => {
        secondsElapsed++;
        if (timeDisplay) {
            timeDisplay.textContent = formatTime(secondsElapsed);
        }
    }, 1000);

    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.id === 'dark-mode-toggle') {
                    const isDark = document.body.getAttribute('data-theme') === 'dark';
                    if (isDark) {
                        document.body.removeAttribute('data-theme');
                    } else {
                        document.body.setAttribute('data-theme', 'dark');
                    }
                    const icon = item.querySelector('i');
                    icon.setAttribute('data-lucide', !isDark ? 'sun' : 'moon');
                    item.querySelector('span').textContent = !isDark ? 'Mode Clair' : 'Mode Sombre';
                    lucide.createIcons();
                    return;
                }

                // Remove active from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add active to clicked nav item
                item.classList.add('active');

                // Hide all views
                viewSections.forEach(view => {
                    view.classList.remove('active');
                    view.style.display = 'none';
                });

                // Show targeted view
                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    const targetView = document.getElementById(targetId);
                    if (targetView) {
                        targetView.classList.add('active');
                        targetView.style.display = 'flex';
                    }

                    // Fix map rendering bug if exploration view is re-opened
                    if (targetId === 'exploration-view' && map) {
                        setTimeout(() => { map.invalidateSize(); }, 300);
                    }
                }
            });
        });
    }


    // --- Destination Selectors Logic ---
    const countrySelect = document.getElementById('country-select');
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');
    const excursionSelect = document.getElementById('excursion-select');

    // Dummy data for illustration (With coordinates)
    // Dummy data for illustration (With coordinates)
    const destData = {
        'france': {
            regions: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Nouvelle-Aquitaine', 'Corrèze', 'Auvergne-Rhône-Alpes', 'Bretagne', 'Occitanie', 'Normandie', 'Grand Est', 'Hauts-de-France', 'Bourgogne-Franche-Comté', 'Pays de la Loire', 'Centre-Val de Loire', 'Corse'],
            cities: {
                'Île-de-France': ['Paris', 'Versailles', 'Fontainebleau', 'Provins', 'Saint-Germain-en-Laye', 'Vincennes', 'Boulogne-Billancourt', 'Rueil-Malmaison', 'Melun', 'Saint-Denis'],
                'Provence-Alpes-Côte d\'Azur': ['Nice', 'Marseille', 'Cannes', 'Aix-en-Provence', 'Grasse', 'Avignon', 'Arles', 'Toulon', 'Antibes', 'Saint-Tropez', 'Menton', 'Cassis', 'Gordes', 'Les Baux-de-Provence'],
                'Nouvelle-Aquitaine': ['Bordeaux', 'Biarritz', 'Saint-Émilion', 'Arcachon', 'La Rochelle', 'Pau', 'Bayonne', 'Limoges', 'Poitiers', 'Angoulême', 'Périgueux', 'Agen', 'Sarlat-la-Canéda', 'Montignac-Lascaux'],
                'Corrèze': ['Brive-la-Gaillarde', 'Tulle', 'Uzerche'],
                'Auvergne-Rhône-Alpes': ['Lyon', 'Annecy', 'Chamonix', 'Grenoble', 'Clermont-Ferrand', 'Valence', 'Chambéry', 'Saint-Étienne', 'Vichy', 'Montélimar', 'Vienne', 'Bourg-en-Bresse'],
                'Bretagne': ['Rennes', 'Saint-Malo', 'Vannes', 'Brest', 'Quimper', 'Dinard', 'Lorient', 'Saint-Brieuc', 'Concarneau', 'Carnac', 'Lannion'],
                'Occitanie': ['Toulouse', 'Montpellier', 'Carcassonne', 'Nîmes', 'Albi', 'Perpignan', 'Béziers', 'Narbonne', 'Tarbes', 'Lourdes', 'Cahors', 'Rodez', 'Rocamadour', 'Padirac'],
                'Normandie': ['Rouen', 'Caen', 'Le Havre', 'Honfleur', 'Deauville', 'Dieppe', 'Cherbourg', 'Bayeux', 'Étretat', 'Lisieux', 'Évreux', 'Alençon', 'Le Mont-Saint-Michel'],
                'Grand Est': ['Strasbourg', 'Colmar', 'Reims', 'Nancy', 'Metz', 'Mulhouse', 'Troyes', 'Châlons-en-Champagne', 'Épinal', 'Thionville', 'Charleville-Mézières'],
                'Hauts-de-France': ['Lille', 'Amiens'],
                'Bourgogne-Franche-Comté': ['Dijon'],
                'Pays de la Loire': ['Nantes'],
                'Centre-Val de Loire': ['Chambord', 'Chenonceaux'],
                'Corse': ['Bonifacio', 'Porto-Vecchio']
            },
            excursions: {
                'Paris': {
                    'Tour Eiffel -> Arc de Triomphe': [
                        [48.8584, 2.2945], // Tour Eiffel
                        [48.8650, 2.3086], // Invalides (waypoint)
                        [48.8738, 2.2950]  // Arc de Triomphe
                    ],
                    'Le long de la Seine (Notre Dame -> Louvre)': [
                        [48.8530, 2.3499], // Notre Dame
                        [48.8590, 2.3364], // Pont des Arts
                        [48.8606, 2.3376]  // Louvre
                    ],
                    'Montmartre Évasion': [
                        [48.8826, 2.3323], // Moulin Rouge
                        [48.8867, 2.3385], // Place du Tertre
                        [48.8867, 2.3431]  // Sacré-Cœur
                    ]
                },
                'Versailles': {
                    'Domaine de Marie-Antoinette': [
                        [48.8034, 2.1198], // Château
                        [48.8156, 2.1039], // Grand Trianon
                        [48.8166, 2.1098]  // Hameau de la Reine
                    ]
                },
                'Fontainebleau': {
                    'Forêt et Château': [
                        [48.4021, 2.6995], // Château
                        [48.4116, 2.6841], // Gorges de Franchard
                        [48.4230, 2.6580]  // Point de vue Gorges d'Apremont
                    ]
                },
                'Provins': {
                    'Tour des Remparts Médiévaux': [
                        [48.5623, 3.2980], // Tour César
                        [48.5639, 3.2953], // Place du Châtel
                        [48.5654, 3.2878]  // Remparts
                    ]
                },
                'Saint-Germain-en-Laye': {
                    'Terrasse par Le Nôtre': [
                        [48.8980, 2.0964], // Château
                        [48.9009, 2.1011], // Début Terrasse
                        [48.9100, 2.1130]  // Fin Terrasse
                    ]
                },
                'Nice': {
                    'Promenade des Anglais': [
                        [43.6823, 7.2065], // Aeroport start
                        [43.6934, 7.2530], // Negresco
                        [43.6954, 7.2720]  // Colline du Chateau
                    ],
                    'Vieux Nice et Marché aux Fleurs': [
                        [43.6961, 7.2713], // Cours Saleya
                        [43.6976, 7.2773], // Place Rossetti
                        [43.7009, 7.2818]  // MAMAC
                    ]
                },
                'Marseille': {
                    'Calanques de Cassis': [
                        [43.2965, 5.3698], // Vieux Port
                        [43.2183, 5.4608], // Calanque de Sormiou
                        [43.2136, 5.4984]  // Calanque d'En-Vau
                    ],
                    'Notre-Dame de la Garde': [
                        [43.2965, 5.3698], // Vieux Port
                        [43.2905, 5.3735], // Abbaye St-Victor
                        [43.2839, 5.3712]  // Basilique
                    ]
                },
                'Cannes': {
                    'La Croisette': [
                        [43.5513, 7.0128], // Palais des festivals
                        [43.5487, 7.0261], // Plage
                        [43.5424, 7.0374]  // Palm Beach
                    ]
                },
                'Aix-en-Provence': {
                    'Sur les traces de Cézanne': [
                        [43.5298, 5.4474], // Cours Mirabeau
                        [43.5350, 5.4510], // Atelier Cézanne
                        [43.5317, 5.4602]  // Terrain des Peintres
                    ]
                },
                'Grasse': {
                    'Sentier des Parfums': [
                        [43.6582, 6.9240], // Musée Fragonard
                        [43.6601, 6.9221], // Cathédrale
                        [43.6640, 6.9200]  // Usine Historique
                    ]
                },
                'Avignon': {
                    'Cité des Papes': [
                        [43.9515, 4.8055], // Pont d'Avignon
                        [43.9507, 4.8075], // Rocher des Doms
                        [43.9501, 4.8073]  // Palais des Papes
                    ]
                },
                'Arles': {
                    'Arles Antique': [
                        [43.6784, 4.6300], // Amphithéâtre
                        [43.6765, 4.6280], // Théâtre Antique
                        [43.6749, 4.6277]  // Alyscamps
                    ]
                },
                'Bordeaux': {
                    'Route des Vins - Médoc': [
                        [44.8378, -0.5792], // Bordeaux (Place de la Bourse)
                        [45.0416, -0.7303], // Margaux
                        [45.2031, -0.7411]  // Pauillac
                    ],
                    'Balade sur les Quais': [
                        [44.8450, -0.5714], // Pont de Pierre
                        [44.8528, -0.5658], // Miroir d'Eau
                        [44.8617, -0.5539]  // Cité du Vin
                    ]
                },
                'Saint-Émilion': {
                    'Visite des Vignobles et Cité Médiévale': [
                        [44.8931, -0.1557], // Église Monolithe
                        [44.8872, -0.1556], // Château Ausone
                        [44.8992, -0.1656]  // Château Cheval Blanc
                    ]
                },
                'Biarritz': {
                    'Côte des Basques': [
                        [43.4832, -1.5586], // Phare de Biarritz
                        [43.4815, -1.5645], // Rocher de la Vierge
                        [43.4754, -1.5651]  // Côte des Basques
                    ]
                },
                'Arcachon': {
                    'Dune du Pilat et Pinasses': [
                        [44.6586, -1.1645], // Jetée Thiers
                        [44.6268, -1.2144], // Le Moulleau
                        [44.5900, -1.2120]  // Dune du Pilat
                    ]
                },
                'La Rochelle': {
                    'Vieux Port et Tours': [
                        [46.1559, -1.1524], // Tour de la Lanterne
                        [46.1565, -1.1540], // Tour de la Chaîne
                        [46.1567, -1.1518]  // Tour Saint-Nicolas
                    ]
                },
                'Pau': {
                    'Boulevard des Pyrénées': [
                        [43.2951, -0.3708], // Château de Pau
                        [43.2938, -0.3662], // Boulevard des Pyrénées (Début)
                        [43.2955, -0.3610]  // Parc Beaumont
                    ]
                },
                'Bayonne': {
                    'Cœur Basque': [
                        [43.4905, -1.4746], // Cathédrale Sainte-Marie
                        [43.4925, -1.4720], // Halles de Bayonne
                        [43.4941, -1.4658]  // Petit Bayonne
                    ]
                },
                'Lyon': {
                    'Fourvière et Vieux Lyon': [
                        [45.7622, 4.8219], // Basilique Notre-Dame de Fourvière
                        [45.7629, 4.8266], // Théâtre Gallo-Romain
                        [45.7601, 4.8277]  // Cathédrale Saint-Jean
                    ],
                    'Presqu\'île': [
                        [45.7578, 4.8320], // Place Bellecour
                        [45.7635, 4.8351], // Place de la République
                        [45.7674, 4.8335]  // Place des Terreaux
                    ]
                },
                'Annecy': {
                    'Tour du Lac à Vélo': [
                        [45.8992, 6.1294], // Annecy Centre (Jardins de l'Europe)
                        [45.8603, 6.1738], // Veyrier-du-Lac
                        [45.8354, 6.2045], // Talloires
                        [45.7954, 6.2163]  // Doussard
                    ]
                },
                'Chamonix': {
                    'Mer de Glace': [
                        [45.9237, 6.8694], // Gare Montenvers
                        [45.9329, 6.9142], // Refuge du Montenvers
                        [45.9221, 6.9535]  // Grotte de Glace
                    ],
                    'Aiguille du Midi': [
                        [45.9189, 6.8702], // Gare Téléphérique
                        [45.9031, 6.8715], // Plan de l'Aiguille
                        [45.8797, 6.8876]  // Aiguille du Midi sommet
                    ]
                },
                'Grenoble': {
                    'La Bastille': [
                        [45.1950, 5.7225], // Téléphérique
                        [45.1973, 5.7197], // Fort de la Bastille
                        [45.2021, 5.7145]  // Mont Jalla
                    ]
                },
                'Clermont-Ferrand': {
                    'Puy de Dôme': [
                        [45.7770, 3.0822], // Centre (Cathédrale)
                        [45.7720, 2.9660], // Gare Panoramique des Dômes
                        [45.7725, 2.9641]  // Sommet Puy de Dôme
                    ]
                },
                'Valence': {
                    'Canaux de Valence': [
                        [44.9333, 4.8917], // Champ de Mars
                        [44.9285, 4.8960], // Parc Jouvet
                        [44.9200, 4.9100]  // Canaux (Châteauvert)
                    ]
                },
                'Rennes': {
                    'Centre Historique': [
                        [48.1113, -1.6800], // Parlement de Bretagne
                        [48.1121, -1.6826], // Place des Lices
                        [48.1147, -1.6738]  // Parc du Thabor
                    ]
                },
                'Saint-Malo': {
                    'Tour des Remparts': [
                        [48.6506, -2.0233], // Porte Saint-Vincent
                        [48.6534, -2.0272], // Bastion de la Hollande
                        [48.6521, -2.0298]  // Fort National
                    ]
                },
                'Vannes': {
                    'Golfe du Morbihan': [
                        [47.6533, -2.7597], // Port de Vannes
                        [47.6186, -2.7663], // Conleau
                        [47.5800, -2.8500]  // Île aux Moines
                    ]
                },
                'Brest': {
                    'Océanopolis et Rade': [
                        [48.3895, -4.4860], // Les Capucins
                        [48.3845, -4.4965], // Château de Brest
                        [48.3900, -4.4350]  // Océanopolis
                    ]
                },
                'Quimper': {
                    'Cœur de Cornouaille': [
                        [47.9959, -4.1027], // Cathédrale Saint-Corentin
                        [47.9975, -4.1085], // Quartier Locmaria
                        [47.9900, -4.1100]  // Les Rives de l'Odet
                    ]
                },
                'Dinard': {
                    'Promenade au Clair de Lune': [
                        [48.6346, -2.0558], // Plage de l'Écluse
                        [48.6322, -2.0520], // Pointe du Moulinet
                        [48.6300, -2.0450]  // Promenade au Clair de Lune
                    ]
                },
                'Toulouse': {
                    'Canal du Midi et Capitole': [
                        [43.6047, 1.4442], // Place du Capitole
                        [43.6000, 1.4430], // Pont Neuf
                        [43.5900, 1.4550]  // Canal du Midi (Port Saint-Sauveur)
                    ]
                },
                'Montpellier': {
                    'Écusson et Lez': [
                        [43.6086, 3.8795], // Place de la Comédie
                        [43.6111, 3.8732], // Promenade du Peyrou
                        [43.6015, 3.8970]  // Antigone (Rives du Lez)
                    ]
                },
                'Carcassonne': {
                    'Cité Médiévale': [
                        [43.2093, 2.3619], // Porte Narbonnaise
                        [43.2066, 2.3621], // Basilique Saint-Nazaire
                        [43.2060, 2.3640]  // Château Comtal
                    ]
                },
                'Nîmes': {
                    'Nîmes la Romaine': [
                        [43.8349, 4.3596], // Arènes de Nîmes
                        [43.8382, 4.3561], // Maison Carrée
                        [43.8396, 4.3490]  // Jardins de la Fontaine
                    ]
                },
                'Albi': {
                    'Cité Épiscopale': [
                        [43.9286, 2.1425], // Cathédrale Sainte-Cécile
                        [43.9295, 2.1430], // Palais de la Berbie
                        [43.9290, 2.1450]  // Pont-Vieux
                    ]
                },
                'Rouen': {
                    'Sur les pas de Jeanne d\'Arc': [
                        [49.4402, 1.0940], // Cathédrale Notre-Dame
                        [49.4414, 1.0888], // Gros-Horloge
                        [49.4430, 1.0880]  // Place du Vieux-Marché
                    ]
                },
                'Caen': {
                    'Abbaye et Mémorial': [
                        [49.1820, -0.3705], // Abbaye aux Hommes
                        [49.1865, -0.3625], // Château de Caen
                        [49.1970, -0.3840]  // Mémorial
                    ]
                },
                'Le Havre': {
                    'Architecture Perret': [
                        [49.4938, 0.1064], // Hôtel de Ville
                        [49.4905, 0.1035], // Église Saint-Joseph
                        [49.4880, 0.0980]  // Plage du Havre
                    ]
                },
                'Honfleur': {
                    'Vieux Bassin': [
                        [49.4208, 0.2325], // Église Sainte-Catherine
                        [49.4195, 0.2330], // Vieux Bassin
                        [49.4210, 0.2345]  // Chapelle Notre-Dame de Grâce
                    ]
                },
                'Deauville': {
                    'Planches et Villas': [
                        [49.3601, 0.0763], // Casino
                        [49.3620, 0.0680], // Les Planches
                        [49.3640, 0.0650]  // Port-Deauville
                    ]
                },
                'Strasbourg': {
                    'Petite France et Cathédrale': [
                        [48.5810, 7.7508], // Cathédrale Notre-Dame
                        [48.5829, 7.7443], // Place Kléber
                        [48.5804, 7.7380]  // Ponts Couverts (Petite France)
                    ]
                },
                'Colmar': {
                    'Petite Venise': [
                        [48.0772, 7.3595], // Musée Unterlinden
                        [48.0734, 7.3585], // Collégiale Saint-Martin
                        [48.0740, 7.3598]  // Petite Venise
                    ]
                },
                'Reims': {
                    'Cité des Sacres': [
                        [49.2536, 4.0340], // Cathédrale Notre-Dame
                        [49.2520, 4.0322], // Palais du Tau
                        [49.2482, 4.0375]  // Basilique Saint-Remi
                    ]
                },
                'Nancy': {
                    'Art Nouveau': [
                        [48.6936, 6.1832], // Place Stanislas
                        [48.6945, 6.1820], // Pépinière
                        [48.6820, 6.1700]  // Musée de l'École de Nancy
                    ]
                },
                'Metz': {
                    'Mosaïque Couronnée': [
                        [49.1197, 6.1758], // Cathédrale Saint-Étienne
                        [49.1215, 6.1740], // Temple Neuf
                        [49.1085, 6.1830]  // Centre Pompidou-Metz
                    ]
                },
                // --- NEW ILLE-DE-FRANCE ---
                'Vincennes': { 'Château et Bois': [[48.8427, 2.4357], [48.8340, 2.4340], [48.8310, 2.4200]] },
                'Boulogne-Billancourt': { 'Albert Kahn': [[48.8414, 2.2530], [48.8339, 2.2475], [48.8265, 2.2354]] },
                'Rueil-Malmaison': { 'Château de Malmaison': [[48.8708, 2.1812], [48.8732, 2.1706], [48.8752, 2.1620]] },
                'Melun': { 'Vaux-le-Vicomte (Proximité)': [[48.5413, 2.6593], [48.5606, 2.7093], [48.5658, 2.7145]] },
                'Saint-Denis': { 'Basilique et Stade': [[48.9355, 2.3598], [48.9356, 2.3597], [48.9244, 2.3601]] },
                // --- NEW PACA ---
                'Toulon': { 'Mont Faron': [[43.1242, 5.9280], [43.1417, 5.9405], [43.1511, 5.9388]] },
                'Antibes': { 'Cap d\'Antibes': [[43.5804, 7.1251], [43.5673, 7.1274], [43.5484, 7.1248]] },
                'Saint-Tropez': { 'Citadelle': [[43.2727, 6.6387], [43.2711, 6.6420], [43.2721, 6.6455]] },
                'Menton': { 'Jardins et Citrons': [[43.7745, 7.5085], [43.7770, 7.5020], [43.7820, 7.4910]] },
                'Cassis': { 'Route des Crêtes': [[43.2144, 5.5385], [43.2030, 5.5401], [43.1866, 5.5724]] },
                // --- NEW NOUVELLE-AQUITAINE ---
                'Limoges': { 'Porcelaine et Histoire': [[45.8336, 1.2611], [45.8286, 1.2588], [45.8202, 1.2505]] },
                'Poitiers': { 'Futuroscope': [[46.5802, 0.3404], [46.5776, 0.3458], [46.6669, 0.3664]] },
                'Angoulême': { 'Capitale de la BD': [[45.6521, 0.1504], [45.6496, 0.1558], [45.6517, 0.1517]] },
                'Périgueux': { 'Vesunna': [[45.1843, 0.7208], [45.1869, 0.7163], [45.1818, 0.7126]] },
                'Agen': { 'Pont-Canal': [[44.2049, 0.6186], [44.2005, 0.6135], [44.1950, 0.6050]] },
                'Brive-la-Gaillarde': {
                    'Marché Georges Brassens': [
                        [45.1583, 1.5330], // Halle Georges Brassens
                        [45.1590, 1.5315], // Collégiale Saint-Martin
                        [45.1575, 1.5280]  // Centre historique
                    ],
                    'Grottes de Saint-Antoine': [
                        [45.1565, 1.5298], // Entrée des grottes
                        [45.1550, 1.5260], // Chapelle Saint-Antoine
                        [45.1480, 1.5200]  // Belvédère
                    ]
                },
                'Tulle': {
                    'Cloître et Cathédrale': [
                        [45.2678, 1.7690], // Cathédrale Notre-Dame
                        [45.2670, 1.7675], // Cloître
                        [45.2660, 1.7650]  // Quais de la Corrèze
                    ]
                },
                'Uzerche': {
                    'Perle du Limousin': [
                        [45.4240, 1.5630], // Porte Bécharie
                        [45.4250, 1.5645], // Église Saint-Pierre
                        [45.4260, 1.5660]  // Belvédère de la Vézère
                    ]
                },
                // --- NEW AUVERGNE-RHÔNE-ALPES ---
                'Chambéry': { 'Ducs de Savoie': [[45.5663, 5.9221], [45.5654, 5.9189], [45.5610, 5.9200]] },
                'Saint-Étienne': { 'Design et Mine': [[45.4397, 4.3872], [45.4365, 4.3905], [45.4261, 4.3989]] },
                'Vichy': { 'Reine des Villes d\'Eaux': [[46.1265, 3.4244], [46.1215, 3.4208], [46.1150, 3.4150]] },
                'Montélimar': { 'Nougat et Château': [[44.5582, 4.7507], [44.5560, 4.7525], [44.5500, 4.7550]] },
                'Vienne': { 'Théâtre Antique': [[45.5255, 4.8760], [45.5244, 4.8785], [45.5200, 4.8800]] },
                'Bourg-en-Bresse': { 'Monastère de Brou': [[46.2052, 5.2255], [46.2030, 5.2280], [46.1970, 5.2355]] },
                // --- NEW BRETAGNE ---
                'Lorient': { 'Cité de la Voile': [[47.7476, -3.3660], [47.7300, -3.3700], [47.7285, -3.3725]] },
                'Saint-Brieuc': { 'Baie de Saint-Brieuc': [[48.5140, -2.7650], [48.5200, -2.7600], [48.5300, -2.7400]] },
                'Concarneau': { 'Ville Close': [[47.8732, -3.9189], [47.8725, -3.9145], [47.8700, -3.9120]] },
                'Carnac': { 'Alignements Mégalithiques': [[47.5855, -3.0760], [47.5840, -3.0650], [47.5800, -3.0500]] },
                'Lannion': { 'Côte de Granit Rose': [[48.7323, -3.4615], [48.7800, -3.4800], [48.8285, -3.4875]] },
                // --- NEW OCCITANIE ---
                'Perpignan': { 'Palais des Rois': [[42.6986, 2.8956], [42.6950, 2.8980], [42.6934, 2.8943]] },
                'Béziers': { 'Les Neuf Écluses': [[43.3414, 3.2140], [43.3385, 3.2090], [43.3300, 3.1990]] },
                'Narbonne': { 'Canal de la Robine': [[43.1837, 3.0042], [43.1815, 3.0035], [43.1790, 3.0020]] },
                'Tarbes': { 'Haras National': [[43.2325, 0.0768], [43.2300, 0.0730], [43.2250, 0.0650]] },
                'Lourdes': { 'Sanctuaires': [[43.0975, -0.0460], [43.0973, -0.0544], [43.0970, -0.0570]] },
                'Cahors': { 'Pont Valentré': [[44.4475, 1.4420], [44.4445, 1.4390], [44.4452, 1.4317]] },
                'Rodez': { 'Musée Soulages': [[44.3508, 2.5746], [44.3515, 2.5710], [44.3522, 2.5684]] },
                // --- NEW NORMANDIE ---
                'Dieppe': { 'Plage et Château': [[49.9275, 1.0760], [49.9248, 1.0736], [49.9230, 1.0700]] },
                'Cherbourg': { 'Cité de la Mer': [[49.6400, -1.6250], [49.6450, -1.6180], [49.6482, -1.6155]] },
                'Bayeux': { 'Tapisserie': [[49.2785, -0.7020], [49.2755, -0.7025], [49.2740, -0.7000]] },
                'Étretat': { 'Aiguille': [[49.7075, 0.2030], [49.7085, 0.2005], [49.7081, 0.1945]] },
                'Lisieux': { 'Basilique': [[49.1450, 0.2260], [49.1435, 0.2315], [49.1415, 0.2366]] },
                'Évreux': { 'Cité de l\'Iton': [[49.0270, 1.1500], [49.0245, 1.1508], [49.0230, 1.1530]] },
                'Alençon': { 'Dentelle': [[48.4310, 0.0920], [48.4300, 0.0890], [48.4285, 0.0860]] },
                // --- NEW GRAND EST ---
                'Mulhouse': { 'Cité de l\'Automobile': [[47.7490, 7.3395], [47.7565, 7.3325], [47.7616, 7.3292]] },
                'Troyes': { 'Bouchon de Champagne': [[48.2974, 4.0747], [48.2960, 4.0720], [48.2945, 4.0700]] },
                'Châlons-en-Champagne': { 'Balade en Barque': [[48.9560, 4.3640], [48.9555, 4.3615], [48.9540, 4.3590]] },
                'Épinal': { 'Cité de l\'Image': [[48.1735, 6.4500], [48.1750, 6.4515], [48.1800, 6.4540]] },
                'Thionville': { 'Trois Frontières': [[49.3590, 6.1660], [49.3580, 6.1645], [49.3550, 6.1600]] },
                'Charleville-Mézières': { 'Place Ducale': [[49.7735, 4.7198], [49.7720, 4.7205], [49.7680, 4.7220]] },
                // --- NEW GRAND EST ---
                'Strasbourg': { 'Visite de la Grande Île et de la cathédrale': [[48.5846, 7.7507], [48.5866, 7.7537], [48.5896, 7.7497]] }, 
                'Reims': { 'Cathédrale Notre-Dame': [[49.2578, 4.0319], [49.2598, 4.0349], [49.2628, 4.0309]] }, 
                // --- NEW HAUTS-DE-FRANCE ---
                'Lille': { 'Architecture du Vieux-Lille': [[50.6366, 3.0635], [50.6386, 3.0665], [50.6416, 3.0625]] }, 
                'Amiens': { "Cathédrale d'Amiens": [[49.8942, 2.2957], [49.8962, 2.2987], [49.8992, 2.2947]] }, 
                // --- NEW BOURGOGNE-FRANCHE-COMTÉ ---
                'Dijon': { 'Palais des ducs de Bourgogne': [[47.3216, 5.0415], [47.3236, 5.0445], [47.3266, 5.0405]] }, 
                // --- NEW PAYS DE LA LOIRE ---
                'Nantes': { "Les Machines de l'île": [[47.2186, -1.5541], [47.2206, -1.5511], [47.2236, -1.5551]] }, 
                // --- NEW NORMANDIE ---
                'Rouen': { 'Centre historique Gros-Horloge': [[49.4405, 1.094], [49.4425, 1.097], [49.4455, 1.093]] },
                // --- SITES HISTORIQUES REMARQUABLES ---
                'Sarlat-la-Canéda': { 'Cité Médiévale et Marché': [[44.8879, 1.2161], [44.8899, 1.2191], [44.8929, 1.2151]] }, 
                'Montignac-Lascaux': { 'Grotte de Lascaux': [[45.0650, 1.1670], [45.0670, 1.1700], [45.0700, 1.1660]] }, 
                'Rocamadour': { 'Cité Religieuse Perchée': [[44.7995, 1.6182], [44.8015, 1.6212], [44.8045, 1.6172]] }, 
                'Padirac': { 'Gouffre de Padirac': [[44.8419, 1.753], [44.8439, 1.756], [44.8469, 1.752]] }, 
                'Le Mont-Saint-Michel': { 'Abbaye et Baie': [[48.6355, -1.5103], [48.6375, -1.5073], [48.6405, -1.5113]] }, 
                'Chambord': { 'Château de Chambord': [[47.6160, 1.5170], [47.6180, 1.5200], [47.6210, 1.5160]] }, 
                'Chenonceaux': { 'Château de Chenonceau': [[47.332, 1.0704], [47.334, 1.0734], [47.337, 1.0694]] }, 
                'Gordes': { 'Village perché et Abbaye de Sénanque': [[43.9111, 5.2002], [43.9131, 5.2032], [43.9161, 5.1992]] }, 
                'Les Baux-de-Provence': { 'Citadelle et Carrières de Lumières': [[43.7436, 4.795], [43.7456, 4.798], [43.7486, 4.794]] }, 
                'Bonifacio': { 'Falaises et Citadelle': [[41.3878, 9.1606], [41.3898, 9.1636], [41.3928, 9.1596]] }, 
                'Porto-Vecchio': { 'Plage de Palombaggia et Golfe': [[41.5911, 9.2794], [41.5931, 9.2824], [41.5961, 9.2784]] }
            }
        },
        'italy': {
            regions: ['Latium', 'Lombardie', 'Toscane', 'Campanie', 'Vénétie', 'Pouilles', 'Sicile', 'Émilie-Romagne', 'Piémont'],
            cities: {
                'Latium': ['Rome', 'Tivoli', 'Viterbe', 'Frascati'],
                'Lombardie': ['Milan', 'Côme', 'Bergame', 'Brescia', 'Mantoue'],
                'Toscane': ['Florence', 'Pise', 'Sienne', 'Lucques', 'San Gimignano', 'Arezzo', 'Montepulciano'],
                'Campanie': ['Naples', 'Pompéi', 'Sorrente', 'Amalfi', 'Capri', 'Positano'],
                'Vénétie': ['Venise', 'Vérone', 'Padoue', 'Vicence', 'Trévise'],
                'Pouilles': ['Bari', 'Lecce', 'Alberobello', 'Monopoli', 'Ostuni'],
                'Sicile': ['Palerme', 'Catane', 'Syracuse', 'Taormina', 'Agrigente'],
                'Émilie-Romagne': ['Bologne', 'Parme', 'Modène', 'Ravenne', 'Ferrare'],
                'Piémont': ['Turin', 'Alba', 'Asti', 'Barolo']
            },
            excursions: {
                'Rome': {
                    'Rome Antique': [[41.8902, 12.4922], [41.8925, 12.4853], [41.8956, 12.4828]],
                    'Pèlerinage au Vatican': [[41.9022, 12.4533], [41.9065, 12.4536], [41.9030, 12.4663]],
                    'Dégustation d\'Huile d\'Olive (Sabina)': [[42.2384, 12.7212], [42.2450, 12.7300], [42.2500, 12.7350]]
                },
                'Tivoli': { 'Villa d\'Este et Villa Adriana': [[41.9632, 12.7963], [41.9427, 12.7766], [41.9600, 12.7900]] },
                'Viterbe': { 'Thermes et Cité des Papes': [[42.4170, 12.1080], [42.4150, 12.1050], [42.4200, 12.1000]] },
                'Frascati': { 'Vignobles et Huiles': [[41.8085, 12.6780], [41.8100, 12.6800], [41.8050, 12.6700]] },
                'Milan': {
                    'Duomo et Galleria': [[45.4642, 9.1900], [45.4658, 9.1899], [45.4705, 9.1834]],
                    'Cène de de Vinci': [[45.4659, 9.1711], [45.4680, 9.1750], [45.4700, 9.1800]]
                },
                'Côme': { 'Croisière sur le Lac': [[45.8117, 9.0833], [45.9890, 9.2590], [46.0150, 9.2620]] },
                'Bergame': { 'Città Alta': [[45.7032, 9.6601], [45.7040, 9.6620], [45.7080, 9.6650]] },
                'Brescia': { 'Mille Miglia et Château': [[45.5410, 10.2185], [45.5450, 10.2200], [45.5500, 10.2250]] },
                'Mantoue': { 'Palais Ducal': [[45.1601, 10.7963], [45.1620, 10.8000], [45.1650, 10.8050]] },
                'Florence': {
                    'Art et Histoire': [[43.7696, 11.2558], [43.7687, 11.2569], [43.7731, 11.2560]],
                    'Route de l\'Huile du Chianti': [[43.5850, 11.3150], [43.5600, 11.3300], [43.5400, 11.3400]]
                },
                'Pise': { 'Piazza dei Miracoli': [[43.7230, 10.3966], [43.7235, 10.3970], [43.7225, 10.3950]] },
                'Sienne': { 'Piazza del Campo': [[43.3182, 11.3306], [43.3175, 11.3280], [43.3150, 11.3250]] },
                'Lucques': { 'Tour des Remparts à vélo': [[43.8437, 10.5050], [43.8450, 10.5100], [43.8420, 10.5150]] },
                'San Gimignano': { 'Tours Médiévales': [[43.4680, 11.0435], [43.4690, 11.0450], [43.4700, 11.0480]] },
                'Arezzo': { 'Piazza Grande': [[43.4658, 11.8845], [43.4665, 11.8860], [43.4680, 11.8880]] },
                'Montepulciano': { 'Vins, Huiles et Vallées': [[43.0925, 11.7800], [43.0900, 11.7750], [43.0850, 11.7700]] },
                'Naples': {
                    'Centre Historique': [[40.8518, 14.2681], [40.8500, 14.2650], [40.8480, 14.2600]],
                    'Dégustation d\'Huile Campanie': [[40.6750, 14.7660], [40.6700, 14.7600], [40.6650, 14.7550]]
                },
                'Pompéi': { 'Cité Ensevelie': [[40.7490, 14.4862], [40.7500, 14.4900], [40.7520, 14.4950]] },
                'Sorrente': { 'Citrons et Falaises': [[40.6260, 14.3765], [40.6280, 14.3800], [40.6300, 14.3850]] },
                'Amalfi': { 'Côte Amalfitaine': [[40.6340, 14.6025], [40.6360, 14.6050], [40.6380, 14.6100]] },
                'Capri': { 'Grotte Bleue': [[40.5550, 14.2050], [40.5560, 14.2080], [40.5580, 14.2150]] },
                'Positano': { 'Village Vertical': [[40.6286, 14.4842], [40.6300, 14.4880], [40.6320, 14.4920]] },
                'Venise': {
                    'Balade sur le Grand Canal': [[45.4408, 12.3155], [45.4381, 12.3359], [45.4336, 12.3384]],
                    'Îles de la Lagune (Murano/Burano)': [[45.4545, 12.3524], [45.4851, 12.4187], [45.4885, 12.4132]]
                },
                'Vérone': { 'Arènes et Roméo/Juliette': [[45.4389, 10.9926], [45.4420, 10.9985], [45.4435, 10.9995]] },
                'Padoue': { 'Chapelle des Scrovegni': [[45.4116, 11.8797], [45.4130, 11.8820], [45.4150, 11.8850]] },
                'Vicence': { 'Villas Palladiennes': [[45.5460, 11.5450], [45.5480, 11.5500], [45.5520, 11.5550]] },
                'Trévise': { 'Canaux de Trévise': [[45.6660, 12.2450], [45.6680, 12.2480], [45.6720, 12.2530]] },
                'Bari': { 'Bari Vecchia et Huiles d\'Olive des Pouilles': [[41.1275, 16.8665], [41.1300, 16.8700], [41.1350, 16.8750]] },
                'Lecce': { 'Florence du Sud': [[40.3530, 18.1710], [40.3550, 18.1750], [40.3580, 18.1800]] },
                'Alberobello': { 'Village des Trulli': [[40.7830, 17.2370], [40.7850, 17.2400], [40.7880, 17.2450]] },
                'Monopoli': { 'Sur la Côte adriatique': [[40.9520, 17.3000], [40.9540, 17.3050], [40.9580, 17.3100]] },
                'Ostuni': { 'Cité Blanche et Oliveraies Millénaires': [[40.7320, 17.5780], [40.7300, 17.5850], [40.7250, 17.5950]] },
                'Palerme': { 'Marchés et Palais': [[38.1157, 13.3615], [38.1130, 13.3550], [38.1100, 13.3500]] },
                'Catane': { 'Mt. Etna et Gastronomie': [[37.5020, 15.0870], [37.5500, 15.0500], [37.7500, 14.9900]] },
                'Syracuse': { 'Ortygie': [[37.0620, 15.2930], [37.0600, 15.2950], [37.0580, 15.2980]] },
                'Taormina': { 'Théâtre Greco-Romain': [[37.8520, 15.2920], [37.8500, 15.2900], [37.8480, 15.2880]] },
                'Agrigente': { 'Vallée des Temples et Domaine Oléicole': [[37.2900, 13.5850], [37.2880, 13.5900], [37.2850, 13.5950]] },
                'Bologne': { 'La Dotta, La Rossa, La Grassa': [[44.4940, 11.3420], [44.4950, 11.3450], [44.4980, 11.3500]] },
                'Parme': { 'Dégustation Prosciutto, Parmesan et Huile': [[44.8010, 10.3280], [44.8030, 10.3320], [44.8050, 10.3350]] },
                'Modène': { 'Vinaigre Balsamique': [[44.6460, 10.9250], [44.6480, 10.9280], [44.6500, 10.9320]] },
                'Ravenne': { 'Basiliques et Mosaïques': [[44.4180, 12.1980], [44.4200, 12.2000], [44.4220, 12.2050]] },
                'Ferrare': { 'Château d\'Este': [[44.8375, 11.6200], [44.8400, 11.6230], [44.8420, 11.6260]] },
                'Turin': { 'Musée Égyptien et Palais Royaux': [[45.0680, 7.6830], [45.0700, 7.6850], [45.0750, 7.6900]] },
                'Alba': { 'Truffes Blanches et Collines Viti-olioles': [[44.7000, 8.0330], [44.7020, 8.0350], [44.7050, 8.0400]] },
                'Asti': { 'Piazza Alfieri': [[44.8980, 8.2040], [44.9000, 8.2060], [44.9020, 8.2100]] },
                'Barolo': { 'Terroir du Barolo': [[44.6100, 7.9420], [44.6120, 7.9450], [44.6150, 7.9500]] }
            }
        },
        'spain': {
            regions: [
                'Andalousie', 'Catalogne', 'Madrid', 'Valence', 'Galice',
                'Pays Basque', 'Baléares', 'Canaries', 'Aragon',
                'Castille-et-León', 'Castille-La Manche', 'Murcie',
                'Estrémadure', 'Asturies', 'Cantabrie', 'La Rioja', 'Navarre'
            ],
            cities: {
                'Andalousie': ['Séville', 'Grenade', 'Cordoue', 'Malaga', 'Cadix', 'Marbella', 'Ronda', 'Almería', 'Huelva', 'Jaén', 'Jerez de la Frontera'],
                'Catalogne': ['Barcelone', 'Gérone', 'Tarragone', 'Sitges', 'Figueres', 'Lleida', 'Reus', 'Cadaqués', 'Lloret de Mar'],
                'Madrid': ['Madrid', 'Tolède', 'Ségovie', 'Alcalá de Henares', 'Aranjuez', 'San Lorenzo de El Escorial'],
                'Valence': ['Valence', 'Alicante', 'Benidorm', 'Elche', 'Castellón de la Plana', 'Torrevieja', 'Gandia'],
                'Galice': ['Saint-Jacques-de-Compostelle', 'Vigo', 'La Corogne', 'Ourense', 'Pontevedra', 'Lugo'],
                'Pays Basque': ['Bilbao', 'Saint-Sébastien', 'Vitoria-Gasteiz', 'Zarautz', 'Hondarribia', 'Laguardia', 'Getaria', 'Pasai Donibane', 'Eibar', 'Bermeo', 'Mundaka', 'Lekeitio', 'Oñati', 'Tolosa', 'Gernika'],
                'Baléares': ['Palma de Majorque', 'Ibiza', 'Minorque', 'Formentera', 'Alcudia'],
                'Canaries': ['Tenerife', 'Lanzarote', 'Grande Canarie', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'],
                'Aragon': ['Saragosse', 'Teruel', 'Huesca', 'Jaca'],
                'Castille-et-León': ['Salamanque', 'Burgos', 'Valladolid', 'Léon', 'Soria', 'Avila'],
                'Castille-La Manche': ['Cuenca', 'Albacete', 'Ciudad Real', 'Guadalajara'],
                'Murcie': ['Murcie', 'Carthagène', 'Lorca'],
                'Estrémadure': ['Mérida', 'Cáceres', 'Badajoz', 'Trujillo'],
                'Asturies': ['Oviedo', 'Gijón', 'Avilés', 'Llanes'],
                'Cantabrie': ['Santander', 'Comillas', 'Santillana del Mar'],
                'La Rioja': ['Logroño', 'Haro', 'Calahorra'],
                'Navarre': ['Pampelune', 'Tudela', 'Olite']
            },
            excursions: {
                // Andalousie
                'Séville': {
                    'Alcázar et Giralda': [[37.3820, -5.9902], [37.3860, -5.9920], [37.3880, -5.9950]],
                    'Route de l\'Huile et des Haciendas': [[37.3500, -5.8500], [37.3200, -5.8000], [37.3000, -5.7500]]
                },
                'Grenade': { 'L\'Alhambra': [[37.1760, -3.5880], [37.1780, -3.5850], [37.1800, -3.5820]] },
                'Cordoue': { 'Mosquée-Cathédrale et Huiles de Cordoue': [[37.8790, -4.7790], [37.8810, -4.7820], [37.8850, -4.7860]] },
                'Malaga': { 'Musée Picasso et Alcazaba': [[36.7210, -4.4170], [36.7230, -4.4150], [36.7280, -4.4100]] },
                'Cadix': { 'Tapas dans l\'ancienne cité': [[36.5290, -6.2920], [36.5320, -6.2950], [36.5350, -6.3000]] },
                'Marbella': { 'Puerto Banús': [[36.4860, -4.9530], [36.4880, -4.9560], [36.4910, -4.9600]] },
                'Ronda': { 'Pont Neuf et Falaises': [[36.7400, -5.1660], [36.7420, -5.1680], [36.7450, -5.1720]] },
                'Almería': { 'Cabo de Gata': [[36.8340, -2.4630], [36.7800, -2.2500], [36.7400, -2.1800]] },
                'Jerez de la Frontera': { 'Bodegas et Chevaux Andalous': [[36.6850, -6.1360], [36.6820, -6.1380], [36.6800, -6.1420]] },
                'Jaén': { 'Mer d\'Oliviers': [[37.7690, -3.7890], [37.7720, -3.7920], [37.7750, -3.7960]] },

                // Catalogne
                'Barcelone': {
                    'Sagrada Família et Parc Güell': [[41.4036, 2.1744], [41.4140, 2.1520], [41.4180, 2.1550]],
                    'Dégustation Huile d\'olive et Vins (Penedès)': [[41.3500, 1.7000], [41.3800, 1.7200], [41.4000, 1.7500]]
                },
                'Gérone': { 'Quartier Juif et Muraille': [[41.9830, 2.8240], [41.9850, 2.8270], [41.9880, 2.8300]] },
                'Tarragone': { 'Amphithéâtre Romain': [[41.1140, 1.2590], [41.1160, 1.2550], [41.1180, 1.2500]] },
                'Sitges': { 'Plages et Palacios': [[41.2350, 1.8080], [41.2370, 1.8100], [41.2400, 1.8150]] },
                'Figueres': { 'Théâtre-Musée Dalí': [[42.2680, 2.9590], [42.2700, 2.9610], [42.2730, 2.9650]] },
                'Lleida': { 'La Seu Vella': [[41.6186, 0.6268], [41.6160, 0.6280], [41.6140, 0.6300]] },
                'Cadaqués': { 'Maison Dalí Portlligat': [[42.2889, 3.2750], [42.2930, 3.2860], [42.2960, 3.2900]] },

                // Madrid
                'Madrid': {
                    'Musée du Prado et Parc Retiro': [[40.4137, -3.6921], [40.4150, -3.6820], [40.4180, -3.6780]],
                    'Palais Royal': [[40.4170, -3.7140], [40.4190, -3.7160], [40.4220, -3.7200]]
                },
                'Tolède': { 'Cité des Trois Cultures et Huile de Tolède': [[39.8560, -4.0240], [39.8580, -4.0260], [39.8600, -4.0300]] },
                'Ségovie': { 'Aqueduc et Alcázar': [[40.9480, -4.1180], [40.9500, -4.1200], [40.9520, -4.1250]] },
                'Alcalá de Henares': { 'Ville Universitaire (Cervantès)': [[40.4819, -3.3638], [40.4840, -3.3650], [40.4860, -3.3680]] },
                'San Lorenzo de El Escorial': { 'Monastère Royal': [[40.5841, -4.1485], [40.5820, -4.1450], [40.5800, -4.1420]] },

                // Valence
                'Valence': { 'Cité des Arts et Paella': [[39.4530, -0.3470], [39.4550, -0.3500], [39.4580, -0.3550]] },
                'Alicante': { 'Château de Santa Bárbara': [[38.3490, -0.4780], [38.3510, -0.4810], [38.3540, -0.4850]] },
                'Benidorm': { 'Plages Levante': [[38.5380, -0.1260], [38.5400, -0.1220], [38.5430, -0.1180]] },
                'Elche': { 'Palmeraie d\'Elche': [[38.2669, -0.6984], [38.2680, -0.7020], [38.2700, -0.7060]] },

                // Galice
                'Saint-Jacques-de-Compostelle': { 'Cathédrale et Chemin': [[42.8800, -8.5440], [42.8820, -8.5460], [42.8850, -8.5500]] },
                'Vigo': { 'Îles Cíes': [[42.2320, -8.7220], [42.2220, -8.9000], [42.2200, -8.9100]] },
                'La Corogne': { 'Tour d\'Hercule': [[43.3850, -8.4060], [43.3880, -8.4100], [43.3900, -8.4150]] },
                'Ourense': { 'Sources Thermales': [[42.3360, -7.8640], [42.3380, -7.8680], [42.3400, -7.8720]] },

                // Pays Basque
                'Bilbao': { 'Guggenheim et Pintxos': [[43.2680, -2.9340], [43.2700, -2.9360], [43.2730, -2.9400]] },
                'Saint-Sébastien': { 'Plage de la Concha': [[43.3150, -1.9860], [43.3170, -1.9900], [43.3200, -1.9950]] },
                'Vitoria-Gasteiz': { 'Cité historique': [[42.8460, -2.6720], [42.8480, -2.6750], [42.8520, -2.6800]] },
                'Hondarribia': { 'Village de Pêcheurs (Pintxos)': [[43.3620, -1.7910], [43.3640, -1.7950], [43.3660, -1.7990]] },
                'Laguardia': { 'Huiles d\'Olives et Vignobles Rija Alavesa': [[42.5539, -2.5855], [42.5550, -2.5830], [42.5580, -2.5800]] },
                'Getaria': { 'Port de Pêche et Txakoli': [[43.3000, -2.2040], [43.3030, -2.2010], [43.3050, -2.1980]] },
                'Pasai Donibane': { 'Chemin côtier et Maison Victor Hugo': [[43.3250, -1.9210], [43.3270, -1.9180], [43.3300, -1.9150]] },
                'Eibar': { 'Histoire Industrielle et Armurerie': [[43.1840, -2.4730], [43.1860, -2.4700], [43.1890, -2.4670]] },
                'Bermeo': { 'Port Ancien et San Juan de Gaztelugatxe': [[43.4200, -2.7180], [43.4250, -2.7300], [43.4470, -2.7840]] },
                'Mundaka': { 'Réserve de Biosphère d\'Urdaibai et Surf': [[43.4070, -2.6970], [43.4050, -2.6930], [43.4000, -2.6900]] },
                'Lekeitio': { 'Basilique et Île Saint-Nicolas': [[43.3630, -2.5030], [43.3650, -2.5000], [43.3680, -2.4970]] },
                'Oñati': { 'Université Sanctuaire d\'Arantzazu': [[43.0330, -2.4140], [42.9790, -2.3980], [42.9750, -2.3950]] },
                'Tolosa': { 'Marché Traditionnel et Haricots': [[43.1360, -2.0740], [43.1380, -2.0710], [43.1400, -2.0680]] },
                'Gernika': { 'Arbre de Guernica et Maisons Juntas': [[43.3150, -2.6770], [43.3170, -2.6740], [43.3190, -2.6710]] },

                // Baléares
                'Palma de Majorque': { 'Cathédrale La Seu et Oliveraies de Majorque': [[39.5670, 2.6480], [39.5800, 2.6550], [39.6000, 2.6650]] },
                'Ibiza': { 'Dalt Vila': [[38.9060, 1.4320], [38.9080, 1.4350], [38.9120, 1.4400]] },
                'Minorque': { 'Cala Macarella': [[39.9370, 3.9350], [39.9390, 3.9400], [39.9420, 3.9450]] },
                'Formentera': { 'Plages Es Pujols': [[38.7230, 1.4550], [38.7200, 1.4580], [38.7180, 1.4600]] },

                // Canaries
                'Tenerife': { 'Volcan Teide': [[28.2720, -16.6420], [28.2700, -16.6450], [28.2680, -16.6500]] },
                'Lanzarote': { 'Parc National de Timanfaya': [[29.0060, -13.7550], [29.0040, -13.7600], [29.0000, -13.7650]] },
                'Grande Canarie': { 'Dunes de Maspalomas': [[27.7410, -15.5800], [27.7380, -15.5850], [27.7350, -15.5900]] },
                'Fuerteventura': { 'Plages de Corralejo': [[28.7300, -13.8680], [28.7280, -13.8650], [28.7250, -13.8620]] },

                // Aragon
                'Saragosse': { 'Basilique Notre-Dame-du-Pilier': [[41.6560, -0.8770], [41.6540, -0.8750], [41.6520, -0.8720]] },
                'Teruel': { 'Architecture Mudéjare': [[40.3440, -1.1060], [40.3420, -1.1080], [40.3400, -1.1100]] },
                'Huesca': { 'Cathédrale et Pyrinées': [[42.1400, -0.4080], [42.1420, -0.4050], [42.1450, -0.4020]] },

                // Castille-et-León
                'Salamanque': { 'Université de Salamanque et Plaza Mayor': [[40.9630, -5.6660], [40.9650, -5.6640], [40.9680, -5.6620]] },
                'Burgos': { 'Cathédrale de Burgos': [[42.3400, -3.7040], [42.3380, -3.7020], [42.3350, -3.7000]] },
                'Valladolid': { 'Musée National de la Sculpture': [[41.6520, -4.7230], [41.6500, -4.7250], [41.6480, -4.7280]] },
                'Léon': { 'Cathédrale et Tapas au Barrio Húmedo': [[42.5980, -5.5670], [42.5960, -5.5650], [42.5940, -5.5620]] },
                'Avila': { 'Muraille d\'Avila': [[40.6550, -4.7000], [40.6580, -4.6980], [40.6600, -4.6950]] },

                // Castille-La Manche
                'Cuenca': { 'Maisons Suspendues (Casas Colgadas)': [[40.0780, -2.1280], [40.0760, -2.1300], [40.0740, -2.1320]] },
                'Albacete': { 'Paseo de la Cuba et Couteaux': [[38.9950, -1.8560], [38.9970, -1.8580], [38.9990, -1.8600]] },

                // Murcie
                'Murcie': { 'Cathédrale et Vergers': [[37.9830, -1.1270], [37.9850, -1.1250], [37.9880, -1.1220]] },
                'Carthagène': { 'Théâtre Romain de Carthagène': [[37.5990, -0.9840], [37.6010, -0.9820], [37.6030, -0.9800]] },

                // Estrémadure
                'Mérida': { 'Théâtre et Amphithéâtre Romains': [[38.9160, -6.3380], [38.9180, -6.3400], [38.9200, -6.3420]] },
                'Cáceres': { 'Vieille Ville Monumentale (Jambon Ibérique)': [[39.4730, -6.3720], [39.4750, -6.3740], [39.4780, -6.3760]] },
                'Badajoz': { 'Alcazaba de Badajoz': [[38.8800, -6.9740], [38.8780, -6.9760], [38.8750, -6.9780]] },

                // Asturies
                'Oviedo': { 'Préroman Asturien (Santa Maria)': [[43.3600, -5.8440], [43.3620, -5.8460], [43.3650, -5.8480]] },
                'Gijón': { 'Quartier de Cimavilla et Plage': [[43.5450, -5.6600], [43.5470, -5.6620], [43.5500, -5.6650]] },

                // Cantabrie
                'Santander': { 'Palacio de la Magdalena': [[43.4680, -3.7670], [43.4700, -3.7650], [43.4720, -3.7620]] },
                'Santillana del Mar': { 'Grotte d\'Altamira': [[43.3880, -4.1160], [43.3900, -4.1180], [43.3920, -4.1200]] },

                // La Rioja
                'Logroño': { 'Calle Laurel (Tapas) et Vignobles': [[42.4660, -2.4450], [42.4680, -2.4470], [42.4700, -2.4500]] },
                'Haro': { 'Bodegas Historiques de la Rioja': [[42.5760, -2.8450], [42.5780, -2.8470], [42.5800, -2.8500]] },

                // Navarre
                'Pampelune': { 'Les Remparts et Fêtes de San Fermín': [[42.8160, -1.6430], [42.8180, -1.6450], [42.8200, -1.6480]] },
                'Olite': { 'Palais Royal des Rois de Navarre': [[42.4820, -1.6500], [42.4800, -1.6520], [42.4780, -1.6550]] },
                'Tudela': { 'Cathédrale de Tudela': [[42.0620, -1.6070], [42.0640, -1.6090], [42.0660, -1.6110]] },

                // Andalousie
                'Huelva': { 'Monument Christophe Colomb (La Rábida)': [[37.2100, -6.9440], [37.1840, -6.9030], [37.1500, -6.8900]] },

                // Catalogne
                'Reus': { 'Quartier Gaudí': [[41.1530, 1.1060], [41.1550, 1.1090], [41.1570, 1.1120]] },
                'Lloret de Mar': { 'Côte Brava et Jardins de Santa Clotilde': [[41.6990, 2.8440], [41.7010, 2.8460], [41.7030, 2.8490]] },

                // Madrid
                'Aranjuez': { 'Palais Royal et Jardins': [[40.0360, -3.6050], [40.0380, -3.6080], [40.0400, -3.6120]] },

                // Valence
                'Castellón de la Plana': { 'Plages et Vieille Ville': [[39.9865, -0.0510], [39.9840, -0.0480], [39.9820, -0.0450]] },
                'Torrevieja': { 'Lacs Salés Roses': [[37.9780, -0.6870], [37.9750, -0.6850], [37.9720, -0.6820]] },
                'Gandia': { 'Plage et Palais Borgia': [[38.9610, -0.1820], [38.9630, -0.1790], [38.9660, -0.1760]] },

                // Galice
                'Pontevedra': { 'Vieille Ville et Rías Baixas': [[42.4330, -8.6470], [42.4350, -8.6450], [42.4370, -8.6420]] },
                'Lugo': { 'Remparts Romains de Lugo': [[42.9990, -7.5560], [42.9980, -7.5580], [42.9960, -7.5610]] },

                // Pays Basque
                'Zarautz': { 'La Grande Plage de Zarautz': [[43.2840, -2.1680], [43.2860, -2.1710], [43.2880, -2.1750]] },

                // Baléares
                'Alcudia': { 'Vieille Ville et Plage d\'Alcudia': [[39.8490, 3.1200], [39.8520, 3.1240], [39.8560, 3.1300]] },

                // Canaries
                'La Palma': { 'Observatoire du Roque de Los Muchachos': [[28.7540, -17.8850], [28.7560, -17.8880], [28.7580, -17.8910]] },
                'La Gomera': { 'Forêt Laurisilva (Garajonay)': [[28.1240, -17.2320], [28.1260, -17.2350], [28.1280, -17.2390]] },
                'El Hierro': { 'La Restinga et Puits de la Peña': [[27.6440, -17.9870], [27.7250, -18.0150], [27.7580, -18.0330]] },

                // Aragon
                'Jaca': { 'Citadelle et Pyrénées': [[42.5680, -0.5500], [42.5700, -0.5470], [42.5730, -0.5440]] },

                // Castille-et-León
                'Soria': { 'Laguna Negra et Ermitage de San Juan de Duero': [[41.7640, -2.4680], [41.9310, -2.7270], [41.9360, -2.7300]] },

                // Castille-La Manche
                'Ciudad Real': { 'Moulins de Don Quichotte (Consuegra)': [[38.9840, -3.9280], [39.4680, -3.6070], [39.4700, -3.6040]] },
                'Guadalajara': { 'Palais des Ducs de l\'Infantado': [[40.6340, -3.1640], [40.6360, -3.1620], [40.6380, -3.1600]] },

                // Murcie
                'Lorca': { 'Forteresse du Soleil (Castillo de Lorca)': [[37.6700, -1.7020], [37.6720, -1.7050], [37.6750, -1.7090]] },

                // Estrémadure
                'Trujillo': { 'Château et Place Pizarro': [[39.4600, -5.8830], [39.4620, -5.8860], [39.4640, -5.8900]] },

                // Asturies
                'Avilés': { 'Centro Niemeyer et Vieille Ville': [[43.5550, -5.9240], [43.5570, -5.9260], [43.5600, -5.9290]] },
                'Llanes': { 'Les Bufones de Pría': [[43.4210, -4.7490], [43.4130, -4.7240], [43.3800, -4.6800]] },

                // Cantabrie
                'Comillas': { 'El Capricho de Gaudí': [[43.3870, -4.2940], [43.3890, -4.2960], [43.3910, -4.2990]] },

                // La Rioja
                'Calahorra': { 'Cathédrale et Musée de la Romanisation': [[42.3040, -1.9680], [42.3060, -1.9700], [42.3080, -1.9730]] }
            }
        },
        'germany': {
            regions: ['Bavière', 'Berlin', 'Bade-Wurtemberg', 'Rhénanie-du-Nord-Westphalie', 'Saxe', 'Hesse', 'Hambourg'],
            cities: {
                'Bavière': ['Munich', 'Nuremberg', 'Augsbourg', 'Ratisbonne', 'Wurtzbourg'],
                'Berlin': ['Berlin', 'Potsdam'],
                'Bade-Wurtemberg': ['Stuttgart', 'Heidelberg', 'Fribourg-en-Brisgau', 'Baden-Baden', 'Karlsruhe'],
                'Rhénanie-du-Nord-Westphalie': ['Cologne', 'Düsseldorf', 'Dortmund', 'Bonn', 'Aix-la-Chapelle'],
                'Saxe': ['Dresde', 'Leipzig', 'Chemnitz'],
                'Hesse': ['Francfort', 'Wiesbaden', 'Darmstadt'],
                'Hambourg': ['Hambourg', 'Lübeck', 'Bremen']
            },
            excursions: {
                'Munich': { 'Marienplatz et Bords de l\'Isar': [[48.1371, 11.5754], [48.1390, 11.5780], [48.1410, 11.5800]] },
                'Nuremberg': { 'Château Impérial': [[49.4580, 11.0770], [49.4590, 11.0790], [49.4610, 11.0820]] },
                'Berlin': { 'Porte de Brandebourg au Mur': [[52.5163, 13.3777], [52.5180, 13.3800], [52.5200, 13.3850]] },
                'Stuttgart': { 'Parcs et Musées': [[48.7830, 9.1830], [48.7850, 9.1850], [48.7870, 9.1880]] },
                'Heidelberg': { 'Château et Pont Ancien': [[49.4100, 8.7150], [49.4120, 8.7180], [49.4140, 8.7200]] },
                'Cologne': { 'Cathédrale et Rhin': [[50.9413, 6.9583], [50.9430, 6.9600], [50.9450, 6.9630]] },
                'Francfort': { 'Römerberg et Main': [[50.1105, 8.6821], [50.1120, 8.6850], [50.1150, 8.6880]] },
                'Hambourg': { 'Speicherstadt et Port': [[53.5430, 9.9880], [53.5450, 9.9900], [53.5480, 9.9930]] }
            }
        },
        'portugal': {
            regions: ['Lisbonne', 'Porto et Nord', 'Algarve', 'Centre', 'Alentejo', 'Madère', 'Açores'],
            cities: {
                'Lisbonne': ['Lisbonne', 'Sintra', 'Cascais', 'Estoril', 'Setúbal'],
                'Porto et Nord': ['Porto', 'Braga', 'Guimarães', 'Vallée du Douro', 'Viana do Castelo', 'Amarante'],
                'Algarve': ['Faro', 'Lagos', 'Albufeira', 'Tavira', 'Portimão', 'Sagres'],
                'Centre': ['Coimbra', 'Aveiro', 'Óbidos', 'Nazaré', 'Fátima', 'Tomar', 'Batalha'],
                'Alentejo': ['Évora', 'Beja', 'Elvas', 'Monsaraz', 'Mértola'],
                'Madère': ['Funchal', 'Machico', 'Câmara de Lobos'],
                'Açores': ['Ponta Delgada', 'Angra do Heroísmo', 'Horta']
            },
            excursions: {
                'Lisbonne': { 'Alfama et Belém': [[38.7130, -9.1330], [38.7150, -9.1300], [38.7180, -9.1280]] },
                'Sintra': { 'Palais de Pena': [[38.7870, -9.3900], [38.7900, -9.3930], [38.7920, -9.3960]] },
                'Porto': { 'Ribeira et Caves de Porto': [[41.1400, -8.6130], [41.1380, -8.6100], [41.1350, -8.6080]] },
                'Faro': { 'Vieille Ville et Ria Formosa': [[37.0160, -7.9350], [37.0140, -7.9320], [37.0120, -7.9300]] },
                'Coimbra': { 'Université de Coimbra': [[40.2070, -8.4260], [40.2090, -8.4280], [40.2110, -8.4300]] },
                'Évora': { 'Temple Romain et Chapelle': [[38.5720, -7.9070], [38.5740, -7.9050], [38.5760, -7.9030]] },
                'Funchal': { 'Jardins Botaniques': [[32.6500, -16.9080], [32.6520, -16.9050], [32.6540, -16.9030]] },
                'Ponta Delgada': { 'Lacs Sete Cidades': [[37.7400, -25.6600], [37.7420, -25.6620], [37.7450, -25.6650]] }
            }
        },
        'uk': {
            regions: ['Angleterre', 'Écosse', 'Pays de Galles', 'Irlande du Nord'],
            cities: {
                'Angleterre': ['Londres', 'Bath', 'Oxford', 'Cambridge', 'Manchester', 'Liverpool', 'York', 'Brighton', 'Bristol', 'Newcastle', 'Nottingham'],
                'Écosse': ['Édimbourg', 'Glasgow', 'Inverness', 'Île de Skye', 'Aberdeen', 'Dundee', 'Glencoe', 'St Andrews'],
                'Pays de Galles': ['Cardiff', 'Conwy', 'Swansea', 'Tenby', 'Caernarfon', 'Llandudno'],
                'Irlande du Nord': ['Belfast', 'Londonderry', 'Chaussée des Géants', 'Bushmills']
            },
            excursions: {
                'Londres': { 'Westminster, Tamise et Tower Bridge': [[51.5007, -0.1246], [51.5030, -0.1220], [51.5050, -0.1200]] },
                'Bath': { 'Bains Romains et Royal Crescent': [[51.3810, -2.3590], [51.3830, -2.3620], [51.3850, -2.3650]] },
                'Oxford': { 'Université et Collèges': [[51.7520, -1.2570], [51.7540, -1.2590], [51.7560, -1.2620]] },
                'Édimbourg': { 'Royal Mile au Château': [[55.9480, -3.1900], [55.9490, -3.1950], [55.9520, -3.1980]] },
                'Glasgow': { 'Architecture Mackintosh': [[55.8640, -4.2510], [55.8660, -4.2530], [55.8680, -4.2560]] },
                'Cardiff': { 'Château et Baie de Cardiff': [[51.4810, -3.1810], [51.4800, -3.1780], [51.4780, -3.1750]] },
                'Belfast': { 'Titanic Quartier': [[54.6080, -5.9080], [54.6100, -5.9050], [54.6120, -5.9020]] },
                'Chaussée des Géants': { 'Côte des Géants': [[55.2400, -6.5110], [55.2420, -6.5130], [55.2440, -6.5150]] }
            }
        },
        'switzerland': {
            regions: ['Canton de Genève', 'Canton de Vaud', 'Canton du Valais', 'Canton de Berne', 'Canton de Zurich', 'Canton de Lucerne', 'Canton du Tessin', 'Canton de Neuchâtel', 'Canton de Fribourg', 'Canton des Grisons'],
            cities: {
                'Canton de Genève': ['Genève', 'Carouge', 'Hermance'],
                'Canton de Vaud': ['Lausanne', 'Montreux', 'Vevey', 'Nyon', 'Yverdon-les-Bains'],
                'Canton du Valais': ['Zermatt', 'Sion', 'Martigny', 'Crans-Montana', 'Verbier', 'Saas-Fee'],
                'Canton de Berne': ['Berne', 'Interlaken', 'Thoune', 'Gstaad', 'Grindelwald', 'Brienz'],
                'Canton de Zurich': ['Zurich', 'Winterthour'],
                'Canton de Lucerne': ['Lucerne', 'Weggis'],
                'Canton du Tessin': ['Lugano', 'Locarno', 'Ascona', 'Bellinzone'],
                'Canton de Neuchâtel': ['Neuchâtel', 'La Chaux-de-Fonds'],
                'Canton de Fribourg': ['Fribourg', 'Gruyères'],
                'Canton des Grisons': ['Saint-Moritz', 'Coire', 'Davos', 'Arosa']
            },
            excursions: {
                'Genève': { 'Lac Léman et Vieille Ville': [[46.2040, 6.1430], [46.2060, 6.1460], [46.2080, 6.1490]] },
                'Lausanne': { 'Ouchy et Cathédrale': [[46.5080, 6.6280], [46.5100, 6.6310], [46.5120, 6.6340]] },
                'Montreux': { 'Château de Chillon': [[46.4140, 6.9270], [46.4160, 6.9290], [46.4180, 6.9320]] },
                'Zermatt': { 'Gornergrat et Cervin': [[46.0200, 7.7490], [46.0180, 7.7470], [46.0160, 7.7450]] },
                'Berne': { 'Cité Zähringen et Fosses aux Ours': [[46.9480, 7.4470], [46.9490, 7.4500], [46.9510, 7.4530]] },
                'Interlaken': { 'Jungfraujoch': [[46.6860, 7.8630], [46.6880, 7.8650], [46.6900, 7.8680]] },
                'Zurich': { 'Limmat et Lac': [[47.3760, 8.5410], [47.3780, 8.5440], [47.3800, 8.5470]] },
                'Lucerne': { 'Pont de la Chapelle': [[47.0500, 8.3090], [47.0520, 8.3120], [47.0540, 8.3150]] },
                'Lugano': { 'Lac de Lugano et Monte Brè': [[46.0030, 8.9510], [46.0050, 8.9540], [46.0070, 8.9570]] }
            }
        },
        'greece': {
            regions: ['Attique', 'Macédoine Centrale', 'Crète', 'Îles Ioniennes', 'Cyclades', 'Péloponnèse', 'Thessalie', 'Épire', 'Dodécanèse'],
            cities: {
                'Attique': ['Athènes', 'Le Pirée', 'Cap Sounion', 'Égine'],
                'Macédoine Centrale': ['Thessalonique', 'Kavala', 'Vergina'],
                'Crète': ['Héraklion', 'La Canée (Chania)', 'Réthymnon', 'Agios Nikolaos', 'Elounda', 'Matala'],
                'Îles Ioniennes': ['Corfou', 'Zante', 'Céphalonie', 'Ithaque'],
                'Cyclades': ['Santorin', 'Mykonos', 'Naxos', 'Paros', 'Milos', 'Amorgos'],
                'Péloponnèse': ['Nauplie', 'Sparte', 'Olympie', 'Mycènes', 'Epidaure', 'Monemvasia', 'Mystras'],
                'Thessalie': ['Météores', 'Volos'],
                'Épire': ['Ioannina', 'Parga', 'Metsovo'],
                'Dodécanèse': ['Rhodes', 'Kos', 'Patmos', 'Symi']
            },
            excursions: {
                'Athènes': { 'Acropole, Plaka et Agora': [[37.9710, 23.7260], [37.9730, 23.7280], [37.9750, 23.7310]] },
                'Thessalonique': { 'Tour Blanche et Front de Mer': [[40.6260, 22.9480], [40.6280, 22.9510], [40.6300, 22.9540]] },
                'Héraklion': { 'Palais de Cnossos et Musée Archéologique': [[35.2980, 25.1620], [35.2960, 25.1640], [35.2940, 25.1660]] },
                'La Canée (Chania)': { 'Vieux Port Vénitien': [[35.5160, 24.0180], [35.5180, 24.0200], [35.5200, 24.0220]] },
                'Corfou': { 'Vieille Ville et Palais Achilleion': [[39.6230, 19.9220], [39.6250, 19.9250], [39.6270, 19.9280]] },
                'Santorin': { 'Oia, Fira et Caldeira': [[36.4610, 25.3750], [36.4630, 25.3780], [36.4650, 25.3810]] },
                'Mykonos': { 'Petite Venise et Moulins': [[37.4460, 25.3280], [37.4480, 25.3300], [37.4500, 25.3320]] },
                'Olympie': { 'Site Archéologique': [[37.6380, 21.6250], [37.6400, 21.6280], [37.6420, 21.6310]] },
                'Météores': { 'Monastères Perchés': [[39.7120, 21.6270], [39.7140, 21.6300], [39.7160, 21.6330]] },
                'Rhodes': { 'Ville Médiévale et Lindos': [[36.4440, 28.2260], [36.4460, 28.2280], [36.4480, 28.2310]] }
            }
        },
        'usa': {
            regions: ['Californie', 'New York', 'Floride', 'Texas', 'Illinois', 'Nevada', 'Hawaï', 'Washington', 'Massachusetts', 'Louisiane', 'Colorado', 'Arizona'],
            cities: {
                'Californie': ['Los Angeles', 'San Francisco', 'San Diego', 'Santa Barbara', 'Sacramento', 'Palm Springs', 'Monterey'],
                'New York': ['New York City', 'Buffalo', 'Albany'],
                'Floride': ['Miami', 'Orlando', 'Key West', 'Tampa', 'Fort Lauderdale', 'St Augustine'],
                'Texas': ['Austin', 'Dallas', 'Houston', 'San Antonio', 'El Paso'],
                'Illinois': ['Chicago', 'Springfield'],
                'Nevada': ['Las Vegas', 'Reno'],
                'Hawaï': ['Honolulu', 'Maui', 'Hilo', 'Kailua-Kona'],
                'Washington': ['Seattle', 'Tacoma'],
                'Massachusetts': ['Boston', 'Cambridge', 'Salem'],
                'Louisiane': ['La Nouvelle-Orléans', 'Bâton-Rouge'],
                'Colorado': ['Denver', 'Boulder', 'Aspen'],
                'Arizona': ['Phoenix', 'Tucson', 'Sedona', 'Grand Canyon Village']
            },
            excursions: {
                'New York City': { 'Central Park à Times Square': [[40.7820, -73.9660], [40.7680, -73.9810], [40.7580, -73.9850]] },
                'Los Angeles': { 'Hollywood Blvd & Observatoire Griffith': [[34.1010, -118.3260], [34.1100, -118.3120], [34.1180, -118.3000]] },
                'San Francisco': { 'Golden Gate & Alcatraz': [[37.8190, -122.4780], [37.8260, -122.4200], [37.8080, -122.4090]] },
                'Miami': { 'South Beach Art Deco': [[25.7900, -80.1300], [25.7800, -80.1320], [25.7700, -80.1340]] },
                'Chicago': { 'Millennium Park et Architecture': [[41.8820, -87.6220], [41.8840, -87.6240], [41.8860, -87.6260]] },
                'Las Vegas': { 'Le Strip et Fontaines du Bellagio': [[36.1140, -115.1720], [36.1080, -115.1740], [36.1020, -115.1760]] },
                'Honolulu': { 'Waikiki et Diamond Head': [[21.2760, -157.8220], [21.2680, -157.8120], [21.2600, -157.8020]] },
                'Boston': { 'Freedom Trail': [[42.3580, -71.0580], [42.3600, -71.0550], [42.3620, -71.0520]] },
                'La Nouvelle-Orléans': { 'Vieux Carré (French Quarter)': [[29.9540, -90.0650], [29.9560, -90.0620], [29.9580, -90.0590]] },
                'Grand Canyon Village': { 'Rive Sud du Grand Canyon': [[36.0540, -112.1380], [36.0560, -112.1350], [36.0580, -112.1320]] }
            }
        },
        'japan': {
            regions: ['Kanto', 'Kansai', 'Hokkaido', 'Kyushu', 'Chubu', 'Chugoku', 'Shikoku', 'Tohoku', 'Okinawa'],
            cities: {
                'Kanto': ['Tokyo', 'Yokohama', 'Kamakura', 'Nikko', 'Hakone'],
                'Kansai': ['Kyoto', 'Osaka', 'Nara', 'Kobe', 'Himeji', 'Uji', 'Wakayama', 'Koyasan'],
                'Hokkaido': ['Sapporo', 'Otaru', 'Hakodate', 'Asahikawa', 'Furano'],
                'Kyushu': ['Fukuoka', 'Nagasaki', 'Beppu', 'Kumamoto', 'Kagoshima', 'Miyazaki'],
                'Chubu': ['Nagoya', 'Kanazawa', 'Takayama', 'Shirakawa-go', 'Matsumoto', 'Mont Fuji (Kawaguchiko)'],
                'Chugoku': ['Hiroshima', 'Miyajima', 'Okayama', 'Kurashiki', 'Matsue', 'Tottori'],
                'Shikoku': ['Takamatsu', 'Matsuyama', 'Kochi', 'Tokushima'],
                'Tohoku': ['Sendai', 'Aomori', 'Morioka', 'Akita', 'Yamagata'],
                'Okinawa': ['Naha', 'Miyakojima', 'Ishigaki']
            },
            excursions: {
                'Tokyo': { 'Shibuya, Harajuku et Meiji-jingu': [[35.6590, 139.7000], [35.6690, 139.6990], [35.6760, 139.6990]] },
                'Kyoto': { 'Kinkaku-ji, Ryoan-ji et Arashiyama': [[35.0390, 135.7290], [35.0340, 135.7180], [35.0310, 135.7120]] },
                'Osaka': { 'Dotonbori et Château d\'Osaka': [[34.6680, 135.5010], [34.6780, 135.5180], [34.6870, 135.5260]] },
                'Nara': { 'Parc de Nara et Todai-ji': [[34.6850, 135.8390], [34.6870, 135.8420], [34.6890, 135.8450]] },
                'Hiroshima': { 'Parc de la Paix et Dôme de Genbaku': [[34.3940, 132.4530], [34.3960, 132.4550], [34.3980, 132.4570]] },
                'Miyajima': { 'Sanctuaire Itsukushima et Torii Flottant': [[34.2950, 132.3190], [34.2970, 132.3210], [34.2990, 132.3230]] },
                'Sapporo': { 'Parc Odori et Tour de l\'Horloge': [[43.0610, 141.3540], [43.0630, 141.3570], [43.0650, 141.3600]] },
                'Kanazawa': { 'Jardin Kenroku-en et Quartier Higashi Chaya': [[36.5610, 136.6620], [36.5630, 136.6650], [36.5650, 136.6680]] },
                'Takayama': { 'Cité Historique Sanmachi Suji': [[36.1400, 137.2580], [36.1420, 137.2600], [36.1440, 137.2620]] },
                'Himeji': { 'Le Château du Héron Blanc': [[34.8390, 134.6930], [34.8410, 134.6950], [34.8430, 134.6980]] }
            }
        }
    };

    function populateSelectMap(selectElement, optionsObj, defaultText) {
        if (!selectElement) return;
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        if (optionsObj) {
            // Check if it's an array (regions/cities) or an object (excursions with coords)
            const keys = Array.isArray(optionsObj) ? optionsObj : Object.keys(optionsObj);

            if (keys && keys.length > 0) {
                keys.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    selectElement.appendChild(option);
                });
                selectElement.disabled = false;
                return;
            }
        }
        selectElement.disabled = true;
    }

    // --- Map Initialization (Leaflet) ---
    let map = null;
    let polyline = null;
    let markers = [];

    const mapContainer = document.getElementById('excursion-map');
    const mapPlaceholder = document.getElementById('map-placeholder');

    function initMap() {
        if (!mapContainer) return;

        // Make container visible so Leaflet can measure its size
        mapContainer.style.display = 'block';
        mapPlaceholder.style.display = 'none';

        // Use requestAnimationFrame to ensure the browser has measured the DOM
        requestAnimationFrame(() => {
            // Initial setup focusing on Europe
            map = L.map('excursion-map').setView([46.2276, 2.2137], 4);

            // Google Maps Satellite/Hybrid tiles
            L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
            }).addTo(map);

            map.invalidateSize();

            // Hide map initially — show placeholder
            mapContainer.style.display = 'none';
            mapPlaceholder.style.display = 'flex';
        });
    }

    function drawRoute(coordinates) {
        if (!map) return;
        
        const gmapsBtn = document.getElementById('btn-open-gmaps');
        const nearbyBtn = document.getElementById('btn-nearby-attractions');
        const restoBtn = document.getElementById('btn-nearby-restaurants');
        const hikeBtn = document.getElementById('btn-nearby-hikes');

        // Clear previous layers
        if (polyline) map.removeLayer(polyline);
        markers.forEach(m => map.removeLayer(m));
        markers = [];

        if (!coordinates || coordinates.length === 0) {
            mapContainer.style.display = 'none';
            mapPlaceholder.style.display = 'flex';
            if (gmapsBtn) gmapsBtn.style.display = 'none';
            if (nearbyBtn) nearbyBtn.style.display = 'none';
            if (restoBtn) restoBtn.style.display = 'none';
            if (hikeBtn) hikeBtn.style.display = 'none';
            return;
        }

        // Generate Google Maps URL
        if (gmapsBtn && coordinates.length >= 2) {
            const origin = `${coordinates[0][0]},${coordinates[0][1]}`;
            const destination = `${coordinates[coordinates.length - 1][0]},${coordinates[coordinates.length - 1][1]}`;
            let waypoints = '';
            
            if (coordinates.length > 2) {
                const wpArray = coordinates.slice(1, -1).map(c => `${c[0]},${c[1]}`);
                waypoints = `&waypoints=${wpArray.join('|')}`;
            }
            
            const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=walking`;
            gmapsBtn.href = gmapsUrl;
            gmapsBtn.style.display = 'flex'; // show the button
        }
        
        // Generate Google Maps Nearby Attractions URL
        if (nearbyBtn && coordinates.length > 0) {
            const cityEl = document.getElementById('city-select');
            const cityName = cityEl ? cityEl.value : "";
            // Standard search URL using Google Maps Intent
            const nearbyUrl = `https://www.google.com/maps/search/?api=1&query=sites+touristiques+dans+un+rayon+de+30km+autour+de+${encodeURIComponent(cityName)}`;
            nearbyBtn.href = nearbyUrl;
            nearbyBtn.style.display = 'flex'; // show the button
        }
        
        // Generate Google Maps High-end Restaurants URL
        if (restoBtn && coordinates.length > 0) {
            const cityEl = document.getElementById('city-select');
            const cityName = cityEl ? cityEl.value : "";
            // Standard search URL using Google Maps Intent for restaurants > 4 stars and high price level ($$$ and $$$$)
            const restoUrl = `https://www.google.com/maps/search/?api=1&query=restaurants+gastronomiques+exceptionnels+autour+de+${encodeURIComponent(cityName)}`;
            restoBtn.href = restoUrl;
            restoBtn.style.display = 'flex'; // show the button
        }
        
        // Generate Google Maps Easy/Medium Hikes URL
        if (hikeBtn && coordinates.length > 0) {
            const cityEl = document.getElementById('city-select');
            const cityName = cityEl ? cityEl.value : "";
            // Using "sentiers de randonnée" specifically triggers Google Maps "hiking trails" feature showing park lines and green paths
            const hikeUrl = `https://www.google.com/maps/search/?api=1&query=sentiers+de+randonnée+autour+de+${encodeURIComponent(cityName)}`;
            hikeBtn.href = hikeUrl;
            hikeBtn.style.display = 'flex'; // show the button
        }

        // Show map
        mapPlaceholder.style.display = 'none';
        mapContainer.style.display = 'block';

        // Force leaflet to recalculate its container size when it becomes visible
        map.invalidateSize();
        setTimeout(() => { map.invalidateSize(); }, 150);
        setTimeout(() => { map.invalidateSize(); }, 500);

        // Draw line
        polyline = L.polyline(coordinates, {
            color: 'var(--green-accent, #3f966b)',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(map);

        // Create bounds to fit all points
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });

        // Add markers for start and end (or all waypoints)
        coordinates.forEach((coord, index) => {
            let color = '#3f966b'; // path color
            if (index === 0) color = '#1a73e8'; // start
            if (index === coordinates.length - 1) color = '#d93025'; // end

            const circle = L.circleMarker(coord, {
                radius: 6,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(map);
            markers.push(circle);
        });
    }

    function updateKPIs() {
        let totalCountries = 0;
        let totalRegions = 0;
        let totalCities = 0;
        let totalExcursions = 0;

        for (const country in destData) {
            totalCountries++;
            if (destData[country].regions) {
                totalRegions += destData[country].regions.length;
            }
            if (destData[country].cities) {
                for (const region in destData[country].cities) {
                    totalCities += destData[country].cities[region].length;
                }
            }
            if (destData[country].excursions) {
                for (const city in destData[country].excursions) {
                    totalExcursions += Object.keys(destData[country].excursions[city]).length;
                }
            }
        }

        const kpiCountries = document.getElementById('kpi-countries');
        const kpiRegions = document.getElementById('kpi-regions');
        const kpiCities = document.getElementById('kpi-cities');
        const kpiExcursions = document.getElementById('kpi-excursions');

        if (kpiCountries) kpiCountries.textContent = totalCountries;
        if (kpiRegions) kpiRegions.textContent = totalRegions;
        if (kpiCities) kpiCities.textContent = totalCities;
        if (kpiExcursions) kpiExcursions.textContent = totalExcursions;
    }

    // Call init
    initMap();
    updateKPIs();

    // --- KPI Cards Interactive Map Plotting ---
    function plotItemsOnMap(kpiType) {
        if (!map) return;

        // Clear previous layers
        if (polyline) map.removeLayer(polyline);
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        polyline = null;

        // Show map
        mapContainer.style.display = 'block';
        mapPlaceholder.style.display = 'none';
        map.invalidateSize();
        setTimeout(() => { map.invalidateSize(); }, 300);

        let pointsToPlot = [];

        // Helper to get a single coordinate for a city
        const getCityCoord = (country, city) => {
            if (destData[country].excursions && destData[country].excursions[city]) {
                const excNames = Object.keys(destData[country].excursions[city]);
                if (excNames.length > 0) {
                    return destData[country].excursions[city][excNames[0]][0];
                }
            }
            return null;
        };

        for (const country in destData) {
            if (kpiType === 'countries') {
                let countryCoord = null;
                outer: for (const region in destData[country].cities || {}) {
                    for (const city of destData[country].cities[region] || []) {
                        countryCoord = getCityCoord(country, city);
                        if (countryCoord) break outer;
                    }
                }
                if (countryCoord) pointsToPlot.push({ coord: countryCoord, label: country, color: '#1a73e8' });
            }
            else if (kpiType === 'regions') {
                for (const region in destData[country].cities || {}) {
                    let regionCoord = null;
                    for (const city of destData[country].cities[region] || []) {
                        regionCoord = getCityCoord(country, city);
                        if (regionCoord) break;
                    }
                    if (regionCoord) pointsToPlot.push({ coord: regionCoord, label: region, color: '#fbbc05' });
                }
            }
            else if (kpiType === 'cities') {
                for (const region in destData[country].cities || {}) {
                    for (const city of destData[country].cities[region] || []) {
                        const cityCoord = getCityCoord(country, city);
                        if (cityCoord) pointsToPlot.push({ coord: cityCoord, label: city, color: '#34a853' });
                    }
                }
            }
            else if (kpiType === 'excursions') {
                for (const city in destData[country].excursions || {}) {
                    for (const exc in destData[country].excursions[city]) {
                        const excCoord = destData[country].excursions[city][exc][0];
                        if (excCoord) pointsToPlot.push({ coord: excCoord, label: exc, color: '#ea4335' });
                    }
                }
            }
        }

        if (pointsToPlot.length === 0) return;

        const bounds = L.latLngBounds(pointsToPlot.map(p => p.coord));

        pointsToPlot.forEach(point => {
            const circle = L.circleMarker(point.coord, {
                radius: kpiType === 'excursions' ? 4 : (kpiType === 'cities' ? 6 : (kpiType === 'regions' ? 8 : 10)),
                fillColor: point.color,
                color: '#fff',
                weight: 2,
                opacity: 0.9,
                fillOpacity: 0.9
            }).bindTooltip(point.label).addTo(map);
            markers.push(circle);
        });

        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    // Plot all cities of a given country
    function plotCountryCities(country) {
        if (!map || !destData[country]) return;
        if (polyline) map.removeLayer(polyline);
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        polyline = null;

        mapContainer.style.display = 'block';
        mapPlaceholder.style.display = 'none';
        map.invalidateSize();
        setTimeout(() => { map.invalidateSize(); }, 300);

        const points = [];
        for (const region in destData[country].cities || {}) {
            for (const city of destData[country].cities[region] || []) {
                if (destData[country].excursions && destData[country].excursions[city]) {
                    const excNames = Object.keys(destData[country].excursions[city]);
                    if (excNames.length > 0) {
                        const coord = destData[country].excursions[city][excNames[0]][0];
                        if (coord) points.push({ coord, label: city });
                    }
                }
            }
        }
        if (points.length === 0) return;
        const bounds = L.latLngBounds(points.map(p => p.coord));
        points.forEach(p => {
            const c = L.circleMarker(p.coord, { radius: 7, fillColor: '#34a853', color: '#fff', weight: 2, opacity: 0.9, fillOpacity: 0.9 })
                .bindTooltip(p.label).addTo(map);
            markers.push(c);
        });
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    // Plot cities of a specific region
    function plotRegionCities(country, region) {
        if (!map || !destData[country]) return;
        if (polyline) map.removeLayer(polyline);
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        polyline = null;

        mapContainer.style.display = 'block';
        mapPlaceholder.style.display = 'none';
        map.invalidateSize();
        setTimeout(() => { map.invalidateSize(); }, 300);

        const cities = (destData[country].cities || {})[region] || [];
        const points = [];
        for (const city of cities) {
            if (destData[country].excursions && destData[country].excursions[city]) {
                const excNames = Object.keys(destData[country].excursions[city]);
                if (excNames.length > 0) {
                    const coord = destData[country].excursions[city][excNames[0]][0];
                    if (coord) points.push({ coord, label: city });
                }
            }
        }
        if (points.length === 0) return;
        const bounds = L.latLngBounds(points.map(p => p.coord));
        points.forEach(p => {
            const c = L.circleMarker(p.coord, { radius: 7, fillColor: '#fbbc05', color: '#fff', weight: 2, opacity: 0.9, fillOpacity: 0.9 })
                .bindTooltip(p.label).addTo(map);
            markers.push(c);
        });
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    // Plot excursion start points for a city
    function plotCityExcursionPoints(country, city) {
        if (!map || !destData[country] || !destData[country].excursions || !destData[country].excursions[city]) return;
        if (polyline) map.removeLayer(polyline);
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        polyline = null;

        mapContainer.style.display = 'block';
        mapPlaceholder.style.display = 'none';
        map.invalidateSize();
        setTimeout(() => { map.invalidateSize(); }, 300);

        const excursions = destData[country].excursions[city];
        const points = [];
        for (const excName in excursions) {
            const coord = excursions[excName][0];
            if (coord) points.push({ coord, label: excName });
        }
        if (points.length === 0) return;
        const bounds = L.latLngBounds(points.map(p => p.coord));
        points.forEach(p => {
            const c = L.circleMarker(p.coord, { radius: 6, fillColor: '#ea4335', color: '#fff', weight: 2, opacity: 0.9, fillOpacity: 0.9 })
                .bindTooltip(p.label).addTo(map);
            markers.push(c);
        });
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    const kpiCards = document.querySelectorAll('.kpi-card');
    if (kpiCards.length > 0) {
        kpiCards.forEach(card => {
            card.addEventListener('click', () => {
                kpiCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const valueEl = card.querySelector('.kpi-value');
                if (valueEl) {
                    const id = valueEl.id;
                    if (id === 'kpi-countries') plotItemsOnMap('countries');
                    else if (id === 'kpi-regions') plotItemsOnMap('regions');
                    else if (id === 'kpi-cities') plotItemsOnMap('cities');
                    else if (id === 'kpi-excursions') plotItemsOnMap('excursions');
                }
            });
        });
    }

    if (countrySelect && regionSelect && citySelect && excursionSelect) {
        countrySelect.addEventListener('change', (e) => {
            const country = e.target.value;
            // Reset downstream selects
            populateSelectMap(regionSelect, null, "Sélectionnez d'abord un pays...");
            populateSelectMap(citySelect, null, "Sélectionnez d'abord une région...");
            populateSelectMap(excursionSelect, null, "Sélectionnez d'abord une ville...");

            if (country && destData[country] && destData[country].regions) {
                populateSelectMap(regionSelect, destData[country].regions, "Sélectionnez une région...");
                // Auto-plot all cities for this country on the map
                plotCountryCities(country);
            } else {
                drawRoute(null); // hide map if no country
            }
        });

        regionSelect.addEventListener('change', (e) => {
            const country = countrySelect.value;
            const region = e.target.value;
            // Reset downstream select
            populateSelectMap(citySelect, null, "Sélectionnez d'abord une région...");
            populateSelectMap(excursionSelect, null, "Sélectionnez d'abord une ville...");

            if (country && region && destData[country] && destData[country].cities && destData[country].cities[region]) {
                populateSelectMap(citySelect, destData[country].cities[region], "Sélectionnez une ville...");
                // Auto-plot cities of this region on the map
                plotRegionCities(country, region);
            } else if (region) {
                populateSelectMap(citySelect, null, "Aucune ville disponible pour cette région");
                drawRoute(null);
            }
        });

        citySelect.addEventListener('change', (e) => {
            const country = countrySelect.value;
            const city = e.target.value;

            populateSelectMap(excursionSelect, null, "Sélectionnez d'abord une ville...");

            if (country && city && destData[country] && destData[country].excursions && destData[country].excursions[city]) {
                populateSelectMap(excursionSelect, destData[country].excursions[city], "Sélectionnez une excursion...");
                // Auto-plot excursion points of this city on the map
                plotCityExcursionPoints(country, city);
            } else if (city) {
                populateSelectMap(excursionSelect, null, "Aucune excursion disponible pour cette ville");
                drawRoute(null);
            }
        });

        excursionSelect.addEventListener('change', (e) => {
            const country = countrySelect.value;
            let city = citySelect.value;
            const exc = e.target.value;

            // Note: If no city is required based on structure, this could be null, but our structure demands it.
            if (country && city && exc &&
                destData[country].excursions &&
                destData[country].excursions[city] &&
                destData[country].excursions[city][exc]) {

                const coordinates = destData[country].excursions[city][exc];
                drawRoute(coordinates);
            } else {
                drawRoute(null);
            }
        });
    }

    // --- Search Proximity Feature ---

    // 1. Haversine distance formula (returns distance in km)
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // 2. Proximity Search Logic
    const btnSearchCity = document.getElementById('btn-search-city');
    const inputCitySearch = document.getElementById('city-search');

    if (btnSearchCity && inputCitySearch) {
        btnSearchCity.addEventListener('click', async () => {
            const query = inputCitySearch.value.trim();
            if (!query) return;

            // Optional: Set button to loading state
            const originalIcon = btnSearchCity.innerHTML;
            btnSearchCity.innerHTML = '<i data-lucide="loader" class="spin"></i> Recherche...';
            lucide.createIcons();

            try {
                // Call Nominatim API
                const url = `https://nominatim.openstreetmap.org/search?format=json&country=France&city=${encodeURIComponent(query)}`;
                const response = await fetch(url, { headers: { 'User-Agent': 'VoyagesApp/1.0' } });
                const data = await response.json();

                if (!data || data.length === 0) {
                    alert("Désolé, ville non trouvée en France.");
                    btnSearchCity.innerHTML = originalIcon;
                    return;
                }

                // Get best match coordinates
                const searchLat = parseFloat(data[0].lat);
                const searchLon = parseFloat(data[0].lon);

                // Find closest excursion
                let closestDist = Infinity;
                let closestCity = null;
                let closestRegion = null;
                let closestExcursion = null;
                const country = 'france'; // We restricted the geocoding to France

                // Browse all France regions and cities
                if (destData[country].cities) {
                    for (const region in destData[country].cities) {
                        for (const city of destData[country].cities[region]) {
                            // Check if this city has excursions mapped
                            if (destData[country].excursions && destData[country].excursions[city]) {
                                const excs = destData[country].excursions[city];
                                for (const excName in excs) {
                                    const coords = excs[excName][0]; // Take start point
                                    if (coords) {
                                        const dist = getDistanceFromLatLonInKm(searchLat, searchLon, coords[0], coords[1]);
                                        if (dist < closestDist) {
                                            closestDist = dist;
                                            closestCity = city;
                                            closestRegion = region;
                                            closestExcursion = excName;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (closestCity) {
                    // Update selectors
                    countrySelect.value = country;
                    
                    // Manually trigger change to populate regions, then select region
                    countrySelect.dispatchEvent(new Event('change'));
                    regionSelect.value = closestRegion;
                    
                    // Trigger change to populate cities, then select city
                    regionSelect.dispatchEvent(new Event('change'));
                    citySelect.value = closestCity;
                    
                    // Trigger change to populate excursions, then select excursion
                    citySelect.dispatchEvent(new Event('change'));
                    excursionSelect.value = closestExcursion;
                    
                    // Delay final drawing and alert to allow DOM rendering
                    setTimeout(() => {
                        excursionSelect.dispatchEvent(new Event('change'));
                        
                        // Small delay before alert so the map is visible First
                        setTimeout(() => {
                            alert(`✅ Circuit le plus proche trouvé !\n\nVille : ${closestCity}\nDistance : ~${Math.round(closestDist)} km\nCircuit sélectionné : ${closestExcursion}`);
                        }, 500);
                    }, 50);
                } else {
                    alert("Aucune excursion trouvée pour cette zone.");
                }

            } catch (error) {
                console.error("Geocoding Error: ", error);
                alert("Erreur lors de la recherche de la ville.");
            } finally {
                // Restore button state
                btnSearchCity.innerHTML = originalIcon;
                // Add spin css dynamically just in case for lucide
            }
        });
        
        // Allow enter key press
        inputCitySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnSearchCity.click();
            }
        });
    }

});
