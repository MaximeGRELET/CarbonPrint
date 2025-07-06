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
                name: 'nb_voitures',
                label: 'Combien de voitures possédez-vous ?',
                type: 'number',
                min: 0,
                max: 5,
                placeholder: 'Ex: 1',
                help: 'Indiquez le nombre total de voitures dans votre foyer'
            },
            {
                name: 'voitures_details',
                label: 'Détail de chaque voiture',
                type: 'voitures_dynamiques',
                help: 'Pour chaque voiture, précisez le type, le carburant, l\'âge et le kilométrage annuel',
                dependsOn: { field: 'nb_voitures', value: '>0' }
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
                name: 'nb_vols_an',
                label: 'Nombre total de vols par an',
                type: 'number',
                placeholder: 'Ex: 3',
                help: 'Indiquez le nombre total de vols que vous prenez par an',
                min: 0,
                max: 50
            },
            {
                name: 'vols_details',
                label: 'Détails des vols',
                type: 'vols_dynamiques',
                help: 'Sélectionnez la destination pour chaque vol',
                dependsOn: { field: 'nb_vols_an', value: '>0' }
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
        // Affichage spécial pour le champ dynamique des voitures
        if (field.type === 'voitures_dynamiques') {
            if (parseInt(userAnswers['nb_voitures']) > 0) {
                const fieldGroup = createFieldGroup(field);
                questionFields.appendChild(fieldGroup);
            }
            return;
        }
        // Affichage spécial pour le champ dynamique des vols
        if (field.type === 'vols_dynamiques') {
            if (parseInt(userAnswers['nb_vols_an']) > 0) {
                const fieldGroup = createFieldGroup(field);
                questionFields.appendChild(fieldGroup);
            }
            return;
        }
        // Vérifier les dépendances classiques
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
        case 'vols_dynamiques':
            fieldGroup.appendChild(createVolsDynamiques(field));
            break;
        case 'voitures_dynamiques':
            fieldGroup.appendChild(createVoituresDynamiques(field));
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
        
        // Si c'est le champ nb_vols_an, mettre à jour les champs de vols
        if (field.name === 'nb_vols_an') {
            const volsContainer = document.getElementById('vols-dynamiques-container');
            if (volsContainer) {
                updateVolsFields();
            }
        }
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

// Destinations disponibles pour les vols
const destinationsVols = [
    { value: 'france_metropolitaine', label: 'France métropolitaine' },
    { value: 'europe_ouest', label: 'Europe de l\'Ouest (Allemagne, Benelux, Suisse...)' },
    { value: 'europe_est', label: 'Europe de l\'Est (Pologne, République tchèque, Hongrie...)' },
    { value: 'europe_nord', label: 'Europe du Nord (Scandinavie, Pays baltes...)' },
    { value: 'europe_sud', label: 'Europe du Sud (Espagne, Portugal, Italie, Grèce...)' },
    { value: 'afrique_nord', label: 'Afrique du Nord (Maroc, Algérie, Tunisie...)' },
    { value: 'afrique_ouest', label: 'Afrique de l\'Ouest (Sénégal, Côte d\'Ivoire...)' },
    { value: 'afrique_est', label: 'Afrique de l\'Est (Kenya, Tanzanie, Éthiopie...)' },
    { value: 'afrique_sud', label: 'Afrique du Sud (Afrique du Sud, Namibie...)' },
    { value: 'amerique_nord', label: 'Amérique du Nord (États-Unis, Canada...)' },
    { value: 'amerique_sud', label: 'Amérique du Sud (Brésil, Argentine, Chili...)' },
    { value: 'amerique_centrale', label: 'Amérique centrale (Mexique, Costa Rica...)' },
    { value: 'asie_ouest', label: 'Asie de l\'Ouest (Turquie, Israël, Émirats arabes unis...)' },
    { value: 'asie_est', label: 'Asie de l\'Est (Japon, Corée du Sud, Chine...)' },
    { value: 'asie_sud', label: 'Asie du Sud (Inde, Pakistan, Bangladesh...)' },
    { value: 'asie_sud_est', label: 'Asie du Sud-Est (Thaïlande, Vietnam, Indonésie...)' },
    { value: 'oceanie', label: 'Océanie (Australie, Nouvelle-Zélande...)' }
];

// Fonction globale pour mettre à jour les champs de vols
function updateVolsFields() {
    const container = document.getElementById('vols-dynamiques-container');
    if (!container) return;
    
    const nbVols = parseInt(userAnswers['nb_vols_an']) || 0;
    container.innerHTML = '';
    
    if (nbVols > 0) {
        for (let i = 0; i < nbVols; i++) {
            const volField = createVolField(i);
            container.appendChild(volField);
            
            // Restaurer la valeur si elle existe
            if (userAnswers['vols_details'] && userAnswers['vols_details'][i]) {
                volField.querySelector('select').value = userAnswers['vols_details'][i];
            }
        }
    }
}

// Fonction pour créer un champ de destination pour un vol
function createVolField(volIndex) {
    const volContainer = document.createElement('div');
    volContainer.className = 'vol-field';
    volContainer.id = `vol-${volIndex}`;
    
    const label = document.createElement('label');
    label.textContent = `Vol ${volIndex + 1} :`;
    label.className = 'vol-label';
    
    const select = document.createElement('select');
    select.name = `vol_destination_${volIndex}`;
    select.id = `vol_destination_${volIndex}`;
    select.className = 'vol-select';
    
    // Option par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sélectionnez la destination...';
    select.appendChild(defaultOption);
    
    // Options des destinations
    destinationsVols.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.value;
        option.textContent = dest.label;
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        if (!userAnswers['vols_details']) {
            userAnswers['vols_details'] = [];
        }
        if (this.value) {
            userAnswers['vols_details'][volIndex] = this.value;
        } else {
            userAnswers['vols_details'][volIndex] = null;
        }
        saveAnswers();
    });
    
    volContainer.appendChild(label);
    volContainer.appendChild(select);
    
    return volContainer;
}

// Fonction pour créer les champs dynamiques des vols
function createVolsDynamiques(field) {
    const container = document.createElement('div');
    container.className = 'vols-dynamiques-container';
    container.id = 'vols-dynamiques-container';
    
    // Initialiser le tableau des vols
    if (!userAnswers[field.name]) {
        userAnswers[field.name] = [];
    }
    
    // Initialiser les champs
    updateVolsFields();
    
    return container;
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
                } else if (field.type === 'vols_dynamiques') {
                    // Les champs dynamiques se restaurent automatiquement dans createVolsDynamiques
                } else {
                    element.value = savedValue;
                }
            }
        }
    });
    
    // Mettre à jour les champs dynamiques des vols si nécessaire
    const volsContainer = document.getElementById('vols-dynamiques-container');
    if (volsContainer) {
        const nbVols = parseInt(userAnswers['nb_vols_an']) || 0;
        if (nbVols > 0) {
            // Forcer la mise à jour des champs
            setTimeout(() => {
                const event = new Event('input');
                const nbVolsInput = document.getElementById('nb_vols_an');
                if (nbVolsInput) {
                    nbVolsInput.dispatchEvent(event);
                }
            }, 100);
        }
    }
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
    const userData = prepareUserDataForServer();
    // DEBUG : Affiche le JSON envoyé au backend
    console.log('Données envoyées au backend :', JSON.stringify(userData, null, 2));
    
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
    
    // Traitement spécial pour les vols par destination
    if (userData.transport && userData.transport.vols_details) {
        const vols_par_destination = {};
        
        // Compter les vols par destination
        userData.transport.vols_details.forEach(destination => {
            if (destination && destination !== '') {
                if (vols_par_destination[destination]) {
                    vols_par_destination[destination]++;
                } else {
                    vols_par_destination[destination] = 1;
                }
            }
        });
        
        // Remplacer les détails par le dictionnaire compté
        userData.transport.vols_par_destination = vols_par_destination;
        delete userData.transport.vols_details;
    }
    
    // Adapter prepareUserDataForServer pour regrouper les voitures
    if (userData.transport && userData.transport.voitures_details) {
        userData.transport.voitures = userData.transport.voitures_details;
        delete userData.transport.voitures_details;
    }
    
    return userData;
}

// Variable globale temporaire pour stocker les données du dernier calcul
let lastResultsData = null;

// Fonction pour afficher les résultats
function showResults(data) {
    lastResultsData = data; // Stocke les données globalement pour les détails
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    
    // Plus d'affichage du tableau des vols ici !
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
            <p class="category-instructions">Cliquez sur une catégorie pour voir le détail de vos émissions</p>
            <div class="categories">
                ${Object.entries(data.repartition).map(([category, percentage]) => `
                    <div class="category clickable" onclick="showCategoryDetails('${category}', ${data.empreinte_totale}, ${percentage})">
                        <div class="category-name">${category}</div>
                        <div class="category-bar">
                            <div class="category-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="category-percentage">${percentage.toFixed(1)}%</div>
                        <div class="category-emission">${((data.empreinte_totale * percentage) / 100).toFixed(1)} t CO₂eq</div>
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

// Fonction pour afficher les détails d'une catégorie
function showCategoryDetails(category, empreinteTotale, percentage) {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    
    const emissionCategory = (empreinteTotale * percentage) / 100;
    const userData = lastResultsData; // Utilise la variable globale
    
    let detailsHTML = '';
    
    switch(category) {
        case 'Transport':
            detailsHTML = generateTransportDetails(userData, emissionCategory);
            break;
        case 'Logement':
            detailsHTML = generateLogementDetails(userData, emissionCategory);
            break;
        case 'Alimentation':
            detailsHTML = generateAlimentationDetails(userData, emissionCategory);
            break;
        case 'Consommation':
            detailsHTML = generateConsommationDetails(userData, emissionCategory);
            break;
        case 'Santé':
            detailsHTML = generateSanteDetails(userData, emissionCategory);
            break;
        case 'Travail':
            detailsHTML = generateTravailDetails(userData, emissionCategory);
            break;
        case 'Déchets':
            detailsHTML = generateDechetsDetails(userData, emissionCategory);
            break;
        case 'Finance':
            detailsHTML = generateFinanceDetails(userData, emissionCategory);
            break;
        case 'Services Publics':
            detailsHTML = generateServicesPublicsDetails(userData, emissionCategory);
            break;
        default:
            detailsHTML = '<p>Aucun détail disponible pour cette catégorie.</p>';
    }
    
    const categoryModalHTML = `
        <div class="category-details-header">
            <button onclick="showResults(lastResultsData)" class="btn-back">
                <i class="fas fa-arrow-left"></i>
                <span>Retour aux résultats</span>
            </button>
            <h2>Détails - ${category}</h2>
            <div class="category-summary">
                <span class="category-emission-total">${emissionCategory.toFixed(1)} tonnes CO₂eq/an</span>
                <span class="category-percentage">(${percentage.toFixed(1)}% de votre empreinte totale)</span>
            </div>
        </div>
        <div class="category-details-content">
            ${detailsHTML}
        </div>
        <div class="category-details-actions">
            <button onclick="showResults(lastResultsData)" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i>
                <span>Retour</span>
            </button>
        </div>
    `;
    
    modalContent.innerHTML = categoryModalHTML;
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

// Ajout de la fonction createVoituresDynamiques
function createVoituresDynamiques(field) {
    const container = document.createElement('div');
    container.className = 'voitures-dynamiques-container';
    container.id = 'voitures-dynamiques-container';
    if (!userAnswers[field.name]) userAnswers[field.name] = [];
    const nbVoitures = parseInt(userAnswers['nb_voitures']) || 0;
    container.innerHTML = '';
    for (let i = 0; i < nbVoitures; i++) {
        const bloc = document.createElement('div');
        bloc.className = 'voiture-bloc';
        bloc.innerHTML = `<div class='voiture-titre'>Voiture ${i+1}</div>`;
        // Type
        const typeSelect = document.createElement('select');
        typeSelect.className = 'voiture-type';
        typeSelect.innerHTML = `<option value=''>Type de voiture...</option>
            <option value='citadine'>Citadine</option>
            <option value='berline'>Berline</option>
            <option value='suv'>SUV</option>
            <option value='utilitaire'>Utilitaire</option>`;
        typeSelect.value = userAnswers[field.name][i]?.type_voiture || '';
        typeSelect.onchange = e => {
            if (!userAnswers[field.name][i]) userAnswers[field.name][i] = {};
            userAnswers[field.name][i].type_voiture = e.target.value;
            saveAnswers();
        };
        bloc.appendChild(typeSelect);
        // Carburant
        const carbSelect = document.createElement('select');
        carbSelect.className = 'voiture-carburant';
        carbSelect.innerHTML = `<option value=''>Type de carburant...</option>
            <option value='essence'>Essence</option>
            <option value='diesel'>Diesel</option>
            <option value='electrique'>Électrique</option>
            <option value='hybride'>Hybride rechargeable</option>
            <option value='gpl'>GPL</option>`;
        carbSelect.value = userAnswers[field.name][i]?.type_carburant || '';
        carbSelect.onchange = e => {
            if (!userAnswers[field.name][i]) userAnswers[field.name][i] = {};
            userAnswers[field.name][i].type_carburant = e.target.value;
            saveAnswers();
        };
        bloc.appendChild(carbSelect);
        // Âge
        const ageInput = document.createElement('input');
        ageInput.type = 'number';
        ageInput.className = 'voiture-age';
        ageInput.placeholder = 'Âge (années)';
        ageInput.min = 0;
        ageInput.max = 50;
        ageInput.value = userAnswers[field.name][i]?.age_voiture || '';
        ageInput.oninput = e => {
            if (!userAnswers[field.name][i]) userAnswers[field.name][i] = {};
            userAnswers[field.name][i].age_voiture = parseInt(e.target.value) || 0;
            saveAnswers();
        };
        bloc.appendChild(ageInput);
        // Km/an
        const kmInput = document.createElement('input');
        kmInput.type = 'number';
        kmInput.className = 'voiture-km';
        kmInput.placeholder = 'Km/an';
        kmInput.min = 0;
        kmInput.max = 100000;
        kmInput.value = userAnswers[field.name][i]?.km_voiture_an || '';
        kmInput.oninput = e => {
            if (!userAnswers[field.name][i]) userAnswers[field.name][i] = {};
            userAnswers[field.name][i].km_voiture_an = parseInt(e.target.value) || 0;
            saveAnswers();
        };
        bloc.appendChild(kmInput);
        container.appendChild(bloc);
    }
    return container;
}

// Après la fonction showQuestion
// Ajout d'un écouteur dynamique pour nb_voitures
(function() {
    const form = document.getElementById('questionnaireForm');
    if (!form) return;
    form.addEventListener('input', function(e) {
        if (e.target && e.target.name === 'nb_voitures') {
            // Retrouver l'index de la question courante
            const questionIndex = questions.findIndex(q => q.id === 'transport');
            if (questionIndex !== -1) {
                showQuestion(questionIndex);
            }
        }
    });
})();

// Fonction pour générer les détails du transport
function generateTransportDetails(userData, emissionCategory) {
    let detailsHTML = '<div class="transport-details">';
    // Détails des voitures
    const voitures = userData.voitures || [];
    if (voitures.length > 0) {
        const facteurs_voiture = {
            'essence': 0.2,
            'diesel': 0.18,
            'electrique': 0.02,
            'hybride': 0.12,
            'gpl': 0.15
        };
        const facteurs_covoiturage = {
            'jamais': 1.0,
            'occasionnel': 0.9,
            'regulier': 0.7,
            'quotidien': 0.5
        };
        const covoiturage = userData.covoiturage_frequence || 'jamais';
        detailsHTML += `
            <div class="detail-section">
                <h3><i class="fas fa-car"></i> Détail de vos voitures</h3>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Carburant</th>
                            <th>Âge</th>
                            <th>Km/an</th>
                            <th>Émissions (t CO₂eq/an)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        let totalVoituresEmission = 0;
        voitures.forEach((v, i) => {
            const facteur = facteurs_voiture[v.type_carburant] || 0.2;
            const cov = facteurs_covoiturage[covoiturage] || 1.0;
            const km = v.km_voiture_an || 0;
            const emission = (km * facteur * cov) / 1000;
            totalVoituresEmission += emission;
            detailsHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${v.type_voiture || 'Non spécifié'}</td>
                    <td>${v.type_carburant || 'Non spécifié'}</td>
                    <td>${v.age_voiture || 'Non spécifié'} ans</td>
                    <td>${km.toLocaleString()} km</td>
                    <td>${emission.toFixed(2)}</td>
                </tr>
            `;
        });
        detailsHTML += `
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="5"><strong>Total voitures</strong></td>
                            <td><strong>${totalVoituresEmission.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    // Détails des vols
    const detailsVols = userData.details_vols || {};
    if (Object.keys(detailsVols).length > 0) {
        detailsHTML += `
            <div class="detail-section">
                <h3><i class="fas fa-plane"></i> Détail de vos vols</h3>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Destination</th>
                            <th>Nombre de vols</th>
                            <th>Distance (km)</th>
                            <th>Émissions (t CO₂eq)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        let totalVolsEmission = 0;
        Object.entries(detailsVols).forEach(([destination, details]) => {
            totalVolsEmission += details.emission_tonnes;
            detailsHTML += `
                <tr>
                    <td>${destination}</td>
                    <td>${details.nb_vols}</td>
                    <td>${details.distance_km}</td>
                    <td>${details.emission_tonnes.toFixed(2)}</td>
                </tr>
            `;
        });
        detailsHTML += `
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3"><strong>Total vols</strong></td>
                            <td><strong>${totalVolsEmission.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }
    detailsHTML += '</div>';
    return detailsHTML;
}

// Les autres fonctions de détail doivent utiliser userData (backend) et non userAnswers
function generateLogementDetails(userData, emissionCategory) {
    const logementData = userData.logement || {};
    let detailsHTML = `
        <div class="logement-details">
            <div class="detail-section">
                <h3><i class="fas fa-home"></i> Caractéristiques de votre logement</h3>
                <table class="detail-table">
                    <tbody>
                        <tr>
                            <td><strong>Type de logement</strong></td>
                            <td>${logementData.type_logement || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Surface</strong></td>
                            <td>${logementData.surface || 'Non spécifié'} m²</td>
                        </tr>
                        <tr>
                            <td><strong>Nombre de personnes</strong></td>
                            <td>${logementData.nb_personnes || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Énergie de chauffage</strong></td>
                            <td>${logementData.energie_chauffage || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Qualité d'isolation</strong></td>
                            <td>${logementData.isolation_qualite || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Climatisation</strong></td>
                            <td>${logementData.climatisation ? 'Oui' : 'Non'}</td>
                        </tr>
                        <tr>
                            <td><strong>Classe énergétique électroménager</strong></td>
                            <td>${logementData.electromenager_efficacite || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Année de construction</strong></td>
                            <td>${logementData.annee_construction || 'Non spécifié'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-chart-pie"></i> Répartition des émissions</h3>
                <p>Vos émissions de logement représentent <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong>.</p>
                <p>Cette catégorie inclut :</p>
                <ul>
                    <li>Chauffage et climatisation</li>
                    <li>Électricité et éclairage</li>
                    <li>Électroménager</li>
                    <li>Construction et entretien</li>
                </ul>
            </div>
        </div>
    `;
    return detailsHTML;
}
function generateAlimentationDetails(userData, emissionCategory) {
    const alimentationData = userData.alimentation || {};
    let detailsHTML = `
        <div class="alimentation-details">
            <div class="detail-section">
                <h3><i class="fas fa-utensils"></i> Vos habitudes alimentaires</h3>
                <table class="detail-table">
                    <tbody>
                        <tr>
                            <td><strong>Régime alimentaire</strong></td>
                            <td>${alimentationData.regime_alimentaire || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence viande rouge</strong></td>
                            <td>${alimentationData.frequence_viande_rouge || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence viande blanche</strong></td>
                            <td>${alimentationData.frequence_viande_blanche || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence poisson</strong></td>
                            <td>${alimentationData.frequence_poisson || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence produits laitiers</strong></td>
                            <td>${alimentationData.frequence_produits_laitiers || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Origine des produits</strong></td>
                            <td>${alimentationData.origine_produits || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Bio vs conventionnel</strong></td>
                            <td>${alimentationData.bio_conventionnel || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Gaspillage alimentaire</strong></td>
                            <td>${alimentationData.gaspillage_alimentaire || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence restaurants</strong></td>
                            <td>${alimentationData.restaurants_frequence || 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <td><strong>Fréquence plats préparés</strong></td>
                            <td>${alimentationData.plats_prepares_frequence || 'Non spécifié'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-chart-pie"></i> Impact de vos choix</h3>
                <p>Vos émissions alimentaires représentent <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong>.</p>
                <p>Cette catégorie inclut :</p>
                <ul>
                    <li>Production agricole</li>
                    <li>Transport des aliments</li>
                    <li>Transformation et emballage</li>
                    <li>Gaspillage alimentaire</li>
                </ul>
            </div>
        </div>
    `;
    return detailsHTML;
}
function generateConsommationDetails(userData, emissionCategory) {
    return `
        <div class="consommation-details">
            <div class="detail-section">
                <h3><i class="fas fa-shopping-bag"></i> Vos habitudes de consommation</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : vêtements, électronique, meubles, loisirs, etc.</p>
            </div>
        </div>
    `;
}
function generateSanteDetails(userData, emissionCategory) {
    return `
        <div class="sante-details">
            <div class="detail-section">
                <h3><i class="fas fa-heartbeat"></i> Santé et bien-être</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : médicaments, soins médicaux, produits d'hygiène, etc.</p>
            </div>
        </div>
    `;
}
function generateTravailDetails(userData, emissionCategory) {
    return `
        <div class="travail-details">
            <div class="detail-section">
                <h3><i class="fas fa-briefcase"></i> Activité professionnelle</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : déplacements professionnels, équipements de bureau, etc.</p>
            </div>
        </div>
    `;
}
function generateDechetsDetails(userData, emissionCategory) {
    return `
        <div class="dechets-details">
            <div class="detail-section">
                <h3><i class="fas fa-recycle"></i> Gestion des déchets</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : traitement des déchets, recyclage, compostage, etc.</p>
            </div>
        </div>
    `;
}
function generateFinanceDetails(userData, emissionCategory) {
    return `
        <div class="finance-details">
            <div class="detail-section">
                <h3><i class="fas fa-piggy-bank"></i> Services financiers</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : épargne, investissements, services bancaires, etc.</p>
            </div>
        </div>
    `;
}
function generateServicesPublicsDetails(userData, emissionCategory) {
    return `
        <div class="services-publics-details">
            <div class="detail-section">
                <h3><i class="fas fa-building"></i> Services publics</h3>
                <p>Émissions totales : <strong>${emissionCategory.toFixed(1)} tonnes CO₂eq/an</strong></p>
                <p>Cette catégorie inclut : éducation, santé, administration, défense, infrastructures, etc.</p>
            </div>
        </div>
    `;
} 