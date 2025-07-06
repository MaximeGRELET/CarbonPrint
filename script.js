// Variables globales
let currentQuestion = 0;
let userAnswers = {};
let chart = null;

// Configuration des questions par catégorie
const questions = [
    {
        id: 'logement',
        icon: 'fas fa-home',
        title: 'Votre Logement',
        subtitle: 'Caractéristiques de votre habitat et consommation énergétique',
        fields: [
            {
                name: 'type_logement',
                label: 'Type de logement',
                type: 'select',
                options: [
                    { value: 'appartement', label: 'Appartement' },
                    { value: 'maison', label: 'Maison individuelle' }
                ]
            },
            {
                name: 'surface',
                label: 'Surface habitable (m²)',
                type: 'number',
                placeholder: 'Ex: 70',
                help: 'Surface totale de votre logement'
            },
            {
                name: 'nb_personnes',
                label: 'Nombre de personnes dans le logement',
                type: 'number',
                placeholder: 'Ex: 2',
                help: 'Incluant vous-même'
            },
            {
                name: 'annee_construction',
                label: 'Année de construction',
                type: 'select',
                options: [
                    { value: 'avant_1975', label: 'Avant 1975' },
                    { value: '1975_1990', label: '1975 - 1990' },
                    { value: '1990_2005', label: '1990 - 2005' },
                    { value: '2005_2012', label: '2005 - 2012' },
                    { value: 'apres_2012', label: 'Après 2012' }
                ],
                help: 'Influence la qualité de l\'isolation'
            },
            {
                name: 'energie_chauffage',
                label: 'Énergie principale de chauffage',
                type: 'select',
                options: [
                    { value: 'electricite', label: 'Électricité (radiateurs)' },
                    { value: 'gaz', label: 'Gaz naturel' },
                    { value: 'fioul', label: 'Fioul domestique' },
                    { value: 'bois', label: 'Bois/granulés' },
                    { value: 'pompe_chaleur', label: 'Pompe à chaleur' },
                    { value: 'chauffage_urbain', label: 'Chauffage urbain' }
                ]
            },
            {
                name: 'isolation_qualite',
                label: 'Qualité de l\'isolation',
                type: 'select',
                options: [
                    { value: 'excellente', label: 'Excellente (RT 2012 ou mieux)' },
                    { value: 'bonne', label: 'Bonne (isolation récente)' },
                    { value: 'moyenne', label: 'Moyenne (isolation partielle)' },
                    { value: 'mauvaise', label: 'Mauvaise (pas d\'isolation)' }
                ],
                help: 'Basée sur les travaux d\'isolation effectués'
            },
            {
                name: 'climatisation',
                label: 'Utilisez-vous la climatisation ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui, régulièrement' },
                    { value: false, label: 'Non, jamais' }
                ]
            },
            {
                name: 'electromenager_efficacite',
                label: 'Classe énergétique de vos équipements',
                type: 'select',
                options: [
                    { value: 'A+++', label: 'A+++ (Très efficace)' },
                    { value: 'A++', label: 'A++ (Très efficace)' },
                    { value: 'A+', label: 'A+ (Efficace)' },
                    { value: 'A', label: 'A (Efficace)' },
                    { value: 'B', label: 'B (Moyen)' },
                    { value: 'C', label: 'C (Peu efficace)' },
                    { value: 'D', label: 'D (Très peu efficace)' }
                ],
                help: 'Classe énergétique de vos appareils électroménagers'
            }
        ]
    },
    {
        id: 'transport',
        icon: 'fas fa-car',
        title: 'Vos Déplacements',
        subtitle: 'Modes de transport utilisés au quotidien et pour les voyages',
        fields: [
            {
                name: 'voiture_personnelle',
                label: 'Possédez-vous une voiture personnelle ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui, je possède une voiture' },
                    { value: false, label: 'Non, je n\'ai pas de voiture' }
                ]
            },
            {
                name: 'type_carburant',
                label: 'Type de carburant de votre voiture',
                type: 'select',
                options: [
                    { value: 'essence', label: 'Essence' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'electrique', label: 'Électrique' },
                    { value: 'hybride', label: 'Hybride rechargeable' },
                    { value: 'gpl', label: 'GPL' }
                ],
                dependsOn: { field: 'voiture_personnelle', value: true }
            },
            {
                name: 'km_voiture_an',
                label: 'Kilométrage annuel en voiture (km)',
                type: 'number',
                placeholder: 'Ex: 8000',
                help: 'Distance totale parcourue en voiture par an',
                dependsOn: { field: 'voiture_personnelle', value: true }
            },
            {
                name: 'covoiturage_frequence',
                label: 'Fréquence de covoiturage',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel (quelques fois par mois)' },
                    { value: 'regulier', label: 'Régulier (quelques fois par semaine)' },
                    { value: 'quotidien', label: 'Quotidien' }
                ],
                dependsOn: { field: 'voiture_personnelle', value: true }
            },
            {
                name: 'transport_commun',
                label: 'Utilisez-vous les transports en commun ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui, régulièrement' },
                    { value: false, label: 'Non, jamais' }
                ]
            },
            {
                name: 'km_bus_an',
                label: 'Kilométrage annuel en bus/tram (km)',
                type: 'number',
                placeholder: 'Ex: 500',
                dependsOn: { field: 'transport_commun', value: true }
            },
            {
                name: 'km_train_an',
                label: 'Kilométrage annuel en train (km)',
                type: 'number',
                placeholder: 'Ex: 2000',
                dependsOn: { field: 'transport_commun', value: true }
            },
            {
                name: 'km_metro_an',
                label: 'Kilométrage annuel en métro (km)',
                type: 'number',
                placeholder: 'Ex: 1000',
                dependsOn: { field: 'transport_commun', value: true }
            },
            {
                name: 'velo_usage',
                label: 'Fréquence d\'utilisation du vélo',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel (loisirs)' },
                    { value: 'regulier', label: 'Régulier (quelques trajets par semaine)' },
                    { value: 'quotidien', label: 'Quotidien (déplacements réguliers)' }
                ]
            },
            {
                name: 'marche_usage',
                label: 'Fréquence de marche à pied',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier (quelques trajets par semaine)' },
                    { value: 'quotidien', label: 'Quotidien (déplacements réguliers)' }
                ]
            },
            {
                name: 'avion_vols_domestiques',
                label: 'Nombre de vols domestiques par an',
                type: 'number',
                placeholder: 'Ex: 2',
                help: 'Vols en France métropolitaine'
            },
            {
                name: 'avion_vols_internationaux',
                label: 'Nombre de vols internationaux par an',
                type: 'number',
                placeholder: 'Ex: 1',
                help: 'Vols vers l\'étranger'
            },
            {
                name: 'moto_usage',
                label: 'Utilisez-vous une moto ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui, régulièrement' },
                    { value: false, label: 'Non, jamais' }
                ]
            },
            {
                name: 'km_moto_an',
                label: 'Kilométrage annuel en moto (km)',
                type: 'number',
                placeholder: 'Ex: 1000',
                dependsOn: { field: 'moto_usage', value: true }
            }
        ]
    },
    {
        id: 'alimentation',
        icon: 'fas fa-utensils',
        title: 'Votre Alimentation',
        subtitle: 'Habitudes alimentaires et choix de consommation',
        fields: [
            {
                name: 'regime_alimentaire',
                label: 'Régime alimentaire principal',
                type: 'select',
                options: [
                    { value: 'omnivore', label: 'Omnivore (viande et végétaux)' },
                    { value: 'vegetarien', label: 'Végétarien (pas de viande)' },
                    { value: 'vegan', label: 'Végétalien (pas de produits animaux)' }
                ]
            },
            {
                name: 'frequence_viande_rouge',
                label: 'Fréquence de consommation de viande rouge',
                type: 'select',
                options: [
                    { value: 'quotidien', label: 'Quotidienne' },
                    { value: 'hebdomadaire', label: 'Hebdomadaire' },
                    { value: 'occasionnel', label: 'Occasionnelle' },
                    { value: 'jamais', label: 'Jamais' }
                ]
            },
            {
                name: 'frequence_viande_blanche',
                label: 'Fréquence de consommation de viande blanche',
                type: 'select',
                options: [
                    { value: 'quotidien', label: 'Quotidienne' },
                    { value: 'hebdomadaire', label: 'Hebdomadaire' },
                    { value: 'occasionnel', label: 'Occasionnelle' },
                    { value: 'jamais', label: 'Jamais' }
                ]
            },
            {
                name: 'frequence_poisson',
                label: 'Fréquence de consommation de poisson',
                type: 'select',
                options: [
                    { value: 'quotidien', label: 'Quotidienne' },
                    { value: 'hebdomadaire', label: 'Hebdomadaire' },
                    { value: 'occasionnel', label: 'Occasionnelle' },
                    { value: 'jamais', label: 'Jamais' }
                ]
            },
            {
                name: 'frequence_produits_laitiers',
                label: 'Fréquence de consommation de produits laitiers',
                type: 'select',
                options: [
                    { value: 'quotidien', label: 'Quotidienne' },
                    { value: 'hebdomadaire', label: 'Hebdomadaire' },
                    { value: 'occasionnel', label: 'Occasionnelle' },
                    { value: 'jamais', label: 'Jamais' }
                ]
            },
            {
                name: 'origine_produits',
                label: 'Origine des produits alimentaires',
                type: 'select',
                options: [
                    { value: 'local', label: 'Principalement locaux' },
                    { value: 'mixte', label: 'Mixte (local et importé)' },
                    { value: 'importe', label: 'Principalement importés' }
                ]
            },
            {
                name: 'bio_conventionnel',
                label: 'Préférence bio vs conventionnel',
                type: 'select',
                options: [
                    { value: 'bio', label: 'Principalement bio' },
                    { value: 'mixte', label: 'Mixte' },
                    { value: 'conventionnel', label: 'Principalement conventionnel' }
                ]
            },
            {
                name: 'gaspillage_alimentaire',
                label: 'Niveau de gaspillage alimentaire',
                type: 'select',
                options: [
                    { value: 'faible', label: 'Faible (moins de 10%)' },
                    { value: 'moyen', label: 'Moyen (10-20%)' },
                    { value: 'eleve', label: 'Élevé (plus de 20%)' }
                ]
            },
            {
                name: 'restaurants_frequence',
                label: 'Fréquence de repas au restaurant',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel (quelques fois par mois)' },
                    { value: 'regulier', label: 'Régulier (quelques fois par semaine)' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            },
            {
                name: 'plats_prepares_frequence',
                label: 'Fréquence de plats préparés',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            }
        ]
    },
    {
        id: 'consommation',
        icon: 'fas fa-shopping-bag',
        title: 'Votre Consommation',
        subtitle: 'Achats et habitudes de consommation',
        fields: [
            {
                name: 'vetements_frequence',
                label: 'Fréquence d\'achat de vêtements',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'vetements_qualite',
                label: 'Qualité des vêtements achetés',
                type: 'select',
                options: [
                    { value: 'haute', label: 'Haute qualité (durable)' },
                    { value: 'moyenne', label: 'Qualité moyenne' },
                    { value: 'basse', label: 'Bas de gamme' }
                ]
            },
            {
                name: 'electronique_frequence',
                label: 'Fréquence de renouvellement d\'équipements électroniques',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'smartphone_age',
                label: 'Âge de votre smartphone (années)',
                type: 'number',
                placeholder: 'Ex: 3',
                help: 'Depuis combien d\'années avez-vous votre smartphone actuel ?'
            },
            {
                name: 'ordinateur_age',
                label: 'Âge de votre ordinateur (années)',
                type: 'number',
                placeholder: 'Ex: 4',
                help: 'Depuis combien d\'années avez-vous votre ordinateur actuel ?'
            },
            {
                name: 'electromenager_age',
                label: 'Âge moyen de vos équipements électroménagers (années)',
                type: 'number',
                placeholder: 'Ex: 5',
                help: 'Âge moyen de vos appareils (lave-linge, réfrigérateur, etc.)'
            },
            {
                name: 'meubles_frequence',
                label: 'Fréquence d\'achat de meubles',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'livres_frequence',
                label: 'Fréquence d\'achat de livres',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'jeux_frequence',
                label: 'Fréquence d\'achat de jeux/loisirs',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'sorties_frequence',
                label: 'Fréquence de sorties culturelles/loisirs',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Très fréquent' }
                ]
            },
            {
                name: 'services_telecom',
                label: 'Type de services télécom',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'minimal', label: 'Minimal' }
                ]
            },
            {
                name: 'services_banque',
                label: 'Type de services bancaires',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'minimal', label: 'Minimal' }
                ]
            },
            {
                name: 'services_assurance',
                label: 'Type de services d\'assurance',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'minimal', label: 'Minimal' }
                ]
            }
        ]
    },
    {
        id: 'sante',
        icon: 'fas fa-heartbeat',
        title: 'Votre Santé',
        subtitle: 'Soins et produits de santé',
        fields: [
            {
                name: 'medicaments_frequence',
                label: 'Fréquence de prise de médicaments',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            },
            {
                name: 'soins_medicaux_frequence',
                label: 'Fréquence de soins médicaux',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            },
            {
                name: 'produits_hygiene_frequence',
                label: 'Fréquence d\'achat de produits d\'hygiène',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'eleve', label: 'Élevée' },
                    { value: 'minimal', label: 'Minimale' }
                ]
            },
            {
                name: 'cosmetiques_frequence',
                label: 'Fréquence d\'achat de cosmétiques',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            },
            {
                name: 'equipements_medicaux',
                label: 'Utilisez-vous des équipements médicaux ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'consultations_frequence',
                label: 'Fréquence de consultations médicales',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            }
        ]
    },
    {
        id: 'travail',
        icon: 'fas fa-briefcase',
        title: 'Votre Travail',
        subtitle: 'Activité professionnelle et conditions de travail',
        fields: [
            {
                name: 'teletravail_pourcentage',
                label: 'Pourcentage de télétravail',
                type: 'number',
                placeholder: 'Ex: 50',
                help: 'Pourcentage de jours travaillés en télétravail (0-100)'
            },
            {
                name: 'deplacements_professionnels_frequence',
                label: 'Fréquence de déplacements professionnels',
                type: 'select',
                options: [
                    { value: 'jamais', label: 'Jamais' },
                    { value: 'occasionnel', label: 'Occasionnel' },
                    { value: 'regulier', label: 'Régulier' },
                    { value: 'quotidien', label: 'Quotidien' }
                ]
            },
            {
                name: 'km_deplacements_pro',
                label: 'Kilométrage annuel pour déplacements professionnels (km)',
                type: 'number',
                placeholder: 'Ex: 1000',
                help: 'Distance totale pour déplacements professionnels'
            },
            {
                name: 'equipements_bureau',
                label: 'Équipements de bureau utilisés',
                type: 'select',
                options: [
                    { value: 'minimal', label: 'Minimal' },
                    { value: 'standard', label: 'Standard' },
                    { value: 'important', label: 'Important' }
                ]
            },
            {
                name: 'services_publics_utilises',
                label: 'Services publics utilisés dans le cadre professionnel',
                type: 'checkbox',
                options: [
                    { value: 'education', label: 'Éducation' },
                    { value: 'sante', label: 'Santé' },
                    { value: 'transport', label: 'Transport public' },
                    { value: 'administration', label: 'Administration' },
                    { value: 'defense', label: 'Défense' },
                    { value: 'infrastructure', label: 'Infrastructures' }
                ]
            }
        ]
    },
    {
        id: 'dechets',
        icon: 'fas fa-recycle',
        title: 'Vos Déchets',
        subtitle: 'Gestion des déchets et recyclage',
        fields: [
            {
                name: 'tri_recyclage',
                label: 'Niveau de tri et recyclage',
                type: 'select',
                options: [
                    { value: 'aucun', label: 'Aucun tri' },
                    { value: 'basique', label: 'Tri basique' },
                    { value: 'avance', label: 'Tri avancé' },
                    { value: 'excellent', label: 'Tri excellent' }
                ]
            },
            {
                name: 'compostage',
                label: 'Faites-vous du compostage ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'reduction_dechets',
                label: 'Niveau de réduction des déchets',
                type: 'select',
                options: [
                    { value: 'aucune', label: 'Aucune réduction' },
                    { value: 'faible', label: 'Réduction faible' },
                    { value: 'moyenne', label: 'Réduction moyenne' },
                    { value: 'importante', label: 'Réduction importante' }
                ]
            },
            {
                name: 'dechets_organiques_kg_an',
                label: 'Déchets organiques produits par an (kg)',
                type: 'number',
                placeholder: 'Ex: 150',
                help: 'Déchets alimentaires, jardinage, etc.'
            },
            {
                name: 'dechets_papier_kg_an',
                label: 'Déchets papier produits par an (kg)',
                type: 'number',
                placeholder: 'Ex: 100',
                help: 'Papier, carton, etc.'
            },
            {
                name: 'dechets_plastique_kg_an',
                label: 'Déchets plastique produits par an (kg)',
                type: 'number',
                placeholder: 'Ex: 50',
                help: 'Emballages plastique, etc.'
            },
            {
                name: 'dechets_verre_kg_an',
                label: 'Déchets verre produits par an (kg)',
                type: 'number',
                placeholder: 'Ex: 30',
                help: 'Bouteilles, pots, etc.'
            },
            {
                name: 'dechets_metal_kg_an',
                label: 'Déchets métal produits par an (kg)',
                type: 'number',
                placeholder: 'Ex: 20',
                help: 'Canettes, boîtes, etc.'
            }
        ]
    },
    {
        id: 'finance',
        icon: 'fas fa-chart-line',
        title: 'Votre Finance',
        subtitle: 'Épargne et placements financiers',
        fields: [
            {
                name: 'epargne_montant',
                label: 'Montant d\'épargne annuel (€)',
                type: 'number',
                placeholder: 'Ex: 5000',
                help: 'Montant épargné par an'
            },
            {
                name: 'type_placement',
                label: 'Type de placement principal',
                type: 'select',
                options: [
                    { value: 'livret', label: 'Livret d\'épargne' },
                    { value: 'assurance_vie', label: 'Assurance vie' },
                    { value: 'pea', label: 'PEA' },
                    { value: 'actions', label: 'Actions' },
                    { value: 'immobilier', label: 'Immobilier' }
                ]
            },
            {
                name: 'banque_type',
                label: 'Type de banque',
                type: 'select',
                options: [
                    { value: 'traditionnelle', label: 'Banque traditionnelle' },
                    { value: 'en_ligne', label: 'Banque en ligne' },
                    { value: 'ethique', label: 'Banque éthique' }
                ]
            },
            {
                name: 'assurance_type',
                label: 'Type d\'assurance',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard' },
                    { value: 'eco_responsable', label: 'Éco-responsable' }
                ]
            },
            {
                name: 'investissements_durables',
                label: 'Investissez-vous dans des placements durables ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            }
        ]
    },
    {
        id: 'services_publics',
        icon: 'fas fa-building',
        title: 'Services Publics',
        subtitle: 'Utilisation des services publics',
        fields: [
            {
                name: 'utilisation_education',
                label: 'Utilisez-vous les services d\'éducation ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'utilisation_sante',
                label: 'Utilisez-vous les services de santé publique ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'utilisation_transport_public',
                label: 'Utilisez-vous les transports publics ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'utilisation_administration',
                label: 'Utilisez-vous les services administratifs ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'utilisation_defense',
                label: 'Bénéficiez-vous des services de défense ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            },
            {
                name: 'utilisation_infrastructure',
                label: 'Utilisez-vous les infrastructures publiques ?',
                type: 'radio',
                options: [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' }
                ]
            }
        ]
    }
];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Fonction d'initialisation
function initializeApp() {
    showQuestion(0);
    updateProgress();
    updateNavigationButtons();
}

// Fonction pour afficher une question
function showQuestion(questionIndex) {
    const question = questions[questionIndex];
    const form = document.getElementById('questionnaireForm');
    
    // Vider le formulaire
    form.innerHTML = '';
    
    // Créer le conteneur de la question
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    
    // Créer l'en-tête de la question
    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';
    questionHeader.innerHTML = `
        <i class="${question.icon}"></i>
        <h2>${question.title}</h2>
        <p>${question.subtitle}</p>
    `;
    
    // Créer les champs
    const questionFields = document.createElement('div');
    questionFields.className = 'question-fields';
    
    question.fields.forEach(field => {
        // Vérifier les dépendances
        if (field.dependsOn) {
            const dependentValue = userAnswers[field.dependsOn.field];
            if (dependentValue !== field.dependsOn.value) {
                return; // Ne pas afficher ce champ
            }
        }
        
        const fieldGroup = createFieldGroup(field);
        questionFields.appendChild(fieldGroup);
    });
    
    questionContainer.appendChild(questionHeader);
    questionContainer.appendChild(questionFields);
    form.appendChild(questionContainer);
    
    // Restaurer les valeurs précédentes
    restoreFieldValues(questionIndex);
}

// Fonction pour créer un groupe de champs
function createFieldGroup(field) {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'field-group';
    
    const label = document.createElement('label');
    label.textContent = field.label;
    fieldGroup.appendChild(label);
    
    if (field.help) {
        const helpText = document.createElement('small');
        helpText.textContent = field.help;
        helpText.style.color = '#7f8c8d';
        helpText.style.fontSize = '0.9rem';
        fieldGroup.appendChild(helpText);
    }
    
    switch (field.type) {
        case 'select':
            fieldGroup.appendChild(createSelectField(field));
            break;
        case 'number':
            fieldGroup.appendChild(createNumberField(field));
            break;
        case 'radio':
            fieldGroup.appendChild(createRadioGroup(field));
            break;
        case 'checkbox':
            fieldGroup.appendChild(createCheckboxGroup(field));
            break;
    }
    
    return fieldGroup;
}

// Fonction pour créer un champ select
function createSelectField(field) {
    const select = document.createElement('select');
    select.name = field.name;
    select.id = field.name;
    
    // Option par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sélectionnez une option...';
    select.appendChild(defaultOption);
    
    // Options du champ
    field.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });
    
    select.addEventListener('change', function() {
        userAnswers[field.name] = this.value;
        saveAnswers();
    });
    
    return select;
}

// Fonction pour créer un champ number
function createNumberField(field) {
    const input = document.createElement('input');
    input.type = 'number';
    input.name = field.name;
    input.id = field.name;
    input.placeholder = field.placeholder || '';
    input.min = '0';
    
    input.addEventListener('input', function() {
        userAnswers[field.name] = parseFloat(this.value) || 0;
        saveAnswers();
    });
    
    return input;
}

// Fonction pour créer un groupe de boutons radio
function createRadioGroup(field) {
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    
    field.options.forEach(option => {
        const radioOption = document.createElement('div');
        radioOption.className = 'radio-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = field.name;
        radio.value = option.value;
        radio.id = `${field.name}_${option.value}`;
        
        const label = document.createElement('label');
        label.htmlFor = `${field.name}_${option.value}`;
        label.innerHTML = `<span>${option.label}</span>`;
        
        radioOption.appendChild(radio);
        radioOption.appendChild(label);
        
        radio.addEventListener('change', function() {
            userAnswers[field.name] = this.value === 'true' ? true : this.value === 'false' ? false : this.value;
            saveAnswers();
        });
        
        radioOption.addEventListener('click', function() {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        });
        
        radioGroup.appendChild(radioOption);
    });
    
    return radioGroup;
}

// Fonction pour créer un groupe de checkboxes
function createCheckboxGroup(field) {
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';
    
    // Initialiser le tableau pour les valeurs multiples
    userAnswers[field.name] = [];
    
    field.options.forEach(option => {
        const checkboxOption = document.createElement('div');
        checkboxOption.className = 'checkbox-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option.value;
        checkbox.id = `${field.name}_${option.value}`;
        
        const label = document.createElement('label');
        label.htmlFor = `${field.name}_${option.value}`;
        label.innerHTML = `<span>${option.label}</span>`;
        
        checkboxOption.appendChild(checkbox);
        checkboxOption.appendChild(label);
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (!userAnswers[field.name].includes(this.value)) {
                    userAnswers[field.name].push(this.value);
                }
            } else {
                const index = userAnswers[field.name].indexOf(this.value);
                if (index > -1) {
                    userAnswers[field.name].splice(index, 1);
                }
            }
            saveAnswers();
        });
        
        checkboxOption.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        checkboxGroup.appendChild(checkboxOption);
    });
    
    return checkboxGroup;
}

// Fonction pour restaurer les valeurs des champs
function restoreFieldValues(questionIndex) {
    const question = questions[questionIndex];
    
    question.fields.forEach(field => {
        const savedValue = userAnswers[field.name];
        if (savedValue !== undefined) {
            const element = document.getElementById(field.name);
            if (element) {
                if (field.type === 'radio') {
                    const radio = document.querySelector(`input[name="${field.name}"][value="${savedValue}"]`);
                    if (radio) radio.checked = true;
                } else if (field.type === 'checkbox') {
                    savedValue.forEach(value => {
                        const checkbox = document.querySelector(`input[name="${field.name}"][value="${value}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                } else {
                    element.value = savedValue;
                }
            }
        }
    });
}

// Fonction pour sauvegarder les réponses
function saveAnswers() {
    localStorage.setItem('carbonPrintAnswers', JSON.stringify(userAnswers));
}

// Fonction pour charger les réponses sauvegardées
function loadAnswers() {
    const saved = localStorage.getItem('carbonPrintAnswers');
    if (saved) {
        userAnswers = JSON.parse(saved);
    }
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgress();
        updateNavigationButtons();
    } else {
        calculateResults();
    }
}

// Fonction pour passer à la question précédente
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateProgress();
        updateNavigationButtons();
    }
}

// Fonction pour mettre à jour la barre de progression
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressPercentage = document.getElementById('progressPercentage');
    
    progressBar.style.width = progress + '%';
    progressText.textContent = `Étape ${currentQuestion + 1} sur ${questions.length}`;
    progressPercentage.textContent = Math.round(progress) + '%';
}

// Fonction pour mettre à jour les boutons de navigation
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.display = currentQuestion === 0 ? 'none' : 'flex';
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.innerHTML = '<span>Calculer</span><i class="fas fa-calculator"></i>';
    } else {
        nextBtn.innerHTML = '<span>Suivant</span><i class="fas fa-arrow-right"></i>';
    }
}

// Fonction pour calculer les résultats
function calculateResults() {
    // Préparer les données pour l'envoi au serveur
    const userData = prepareUserDataForServer();
    
    // Afficher un indicateur de chargement
    showLoadingIndicator();
    
    // Envoyer les données au serveur Python
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingIndicator();
        if (data.success) {
            showResults(data);
        } else {
            showError('Erreur lors du calcul: ' + data.error);
        }
    })
    .catch(error => {
        hideLoadingIndicator();
        console.error('Erreur de communication:', error);
        showError('Erreur de communication avec le serveur. Vérifiez que le serveur Python est démarré.');
    });
}

// Fonction pour préparer les données pour le serveur
function prepareUserDataForServer() {
    const userData = {};
    
    questions.forEach(question => {
        userData[question.id] = {};
        question.fields.forEach(field => {
            if (userAnswers[field.name] !== undefined) {
                userData[question.id][field.name] = userAnswers[field.name];
            }
        });
    });
    
    return userData;
}

// Fonction pour afficher les résultats
function showResults(data) {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    
    const resultsHTML = `
        <div class="results-header">
            <h2>Votre Empreinte Carbone</h2>
        </div>
        
        <div class="total-empreinte text-center">
            <span class="big-number">${data.empreinte_totale}</span>
            <span class="unit">tonnes CO2eq/an</span>
        </div>
        
        <div class="comparison">
            <p>Comparaison avec la moyenne française (${data.moyenne_francaise} tonnes CO2eq/an) :</p>
            <div class="comparison-bar">
                <div class="your-bar" style="width: ${Math.min((data.empreinte_totale / data.moyenne_francaise) * 100, 100)}%"></div>
            </div>
            <p style="margin-top: 10px; font-size: 0.9rem; color: #7f8c8d;">
                ${data.empreinte_totale < data.moyenne_francaise ? 
                    `Vous êtes ${((data.moyenne_francaise - data.empreinte_totale) / data.moyenne_francaise * 100).toFixed(1)}% en dessous de la moyenne française !` :
                    `Vous êtes ${((data.empreinte_totale - data.moyenne_francaise) / data.moyenne_francaise * 100).toFixed(1)}% au-dessus de la moyenne française.`
                }
            </p>
        </div>
        
        <div class="repartition">
            <h3>Répartition par catégorie</h3>
            <div class="categories">
                ${Object.entries(data.repartition).map(([category, percentage]) => `
                    <div class="category">
                        <div class="category-name">${category}</div>
                        <div class="category-bar">
                            <div class="category-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="category-percentage">${percentage.toFixed(1)}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="actions">
            <button onclick="restartQuestionnaire()" class="btn btn-secondary">
                <i class="fas fa-redo"></i>
                <span>Recommencer</span>
            </button>
            <button onclick="downloadResults()" class="btn btn-primary">
                <i class="fas fa-download"></i>
                <span>Télécharger</span>
            </button>
        </div>
    `;
    
    modalContent.innerHTML = resultsHTML;
    modal.style.display = 'block';
}

// Fonction pour afficher un indicateur de chargement
function showLoadingIndicator() {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="text-center">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #4CAF50; margin-bottom: 20px;"></i>
            <h3>Calcul en cours...</h3>
            <p>Veuillez patienter pendant que nous calculons votre empreinte carbone.</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Fonction pour masquer l'indicateur de chargement
function hideLoadingIndicator() {
    // L'indicateur sera remplacé par les résultats
}

// Fonction pour afficher une erreur
function showError(message) {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="text-center">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
            <h3>Erreur</h3>
            <p>${message}</p>
            <button onclick="closeModal()" class="btn btn-primary" style="margin-top: 20px;">
                <i class="fas fa-times"></i>
                <span>Fermer</span>
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Fonction pour fermer la modal
function closeModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

// Fonction pour redémarrer le questionnaire
function restartQuestionnaire() {
    userAnswers = {};
    localStorage.removeItem('carbonPrintAnswers');
    currentQuestion = 0;
    showQuestion(0);
    updateProgress();
    updateNavigationButtons();
    closeModal();
}

// Fonction pour télécharger les résultats
function downloadResults() {
    const data = {
        empreinte_totale: userAnswers.empreinte_totale,
        date: new Date().toLocaleDateString('fr-FR'),
        reponses: userAnswers
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'empreinte-carbone.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction pour afficher les informations
function showInfo() {
    document.getElementById('infoModal').style.display = 'block';
}

// Fonction pour fermer la modal d'information
function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// Fonction pour afficher les sources
function showSources() {
    alert('Sources des facteurs d\'émission :\n\n- ADEME (Agence de l\'Environnement et de la Maîtrise de l\'Énergie)\n- Base Carbone®\n- GIEC (Groupe d\'experts intergouvernemental sur l\'évolution du climat)\n- Données françaises et internationales');
}

// Charger les réponses sauvegardées au démarrage
loadAnswers(); 