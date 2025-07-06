# 🌱 CarbonPrint - Calculateur d'Empreinte Carbone

Une application web complète pour calculer votre empreinte carbone annuelle basée sur vos habitudes de vie.

## 🎯 Fonctionnalités

- **9 catégories d'émissions** couvrant tous les aspects de la vie quotidienne
- **Calculs scientifiques** basés sur des facteurs d'émission français et internationaux
- **Interface moderne** et responsive avec design professionnel
- **Questionnaire interactif** avec progression en temps réel
- **Résultats détaillés** avec comparaison à la moyenne française
- **Sauvegarde automatique** des réponses
- **Export des résultats** en format JSON

## 📊 Catégories d'émissions

### 1. 🏠 **Logement**
- Type de logement (appartement/maison)
- Surface habitable et nombre de personnes
- Énergie de chauffage et qualité d'isolation
- Équipements électroménagers et climatisation

### 2. 🚗 **Transport**
- Voiture personnelle (type de carburant, kilométrage)
- Transports en commun (bus, train, métro)
- Modes doux (vélo, marche)
- Avion (vols domestiques et internationaux)
- Covoiturage et moto

### 3. 🍽️ **Alimentation**
- Régime alimentaire (omnivore, végétarien, végan)
- Fréquence de consommation de viande, poisson, produits laitiers
- Origine des produits (local vs importé)
- Bio vs conventionnel
- Gaspillage alimentaire et restaurants

### 4. 🛍️ **Consommation**
- Vêtements et textiles
- Électronique et informatique
- Meubles et décoration
- Loisirs et sorties
- Services (télécom, banque, assurance)

### 5. 🏥 **Santé**
- Médicaments et soins médicaux
- Produits d'hygiène et cosmétiques
- Équipements médicaux
- Consultations médicales

### 6. 💼 **Travail**
- Télétravail vs bureau
- Déplacements professionnels
- Équipements de bureau
- Services publics utilisés

### 7. 🗑️ **Déchets**
- Tri et recyclage
- Compostage
- Réduction des déchets
- Types de déchets produits

### 8. 💰 **Finance**
- Épargne et placements
- Type de banque
- Assurance
- Investissements durables

### 9. 🏛️ **Services Publics**
- Éducation
- Santé publique
- Transport public
- Administration et défense
- Infrastructures

## 🚀 Installation et utilisation

### Prérequis
- Python 3.7 ou supérieur
- Navigateur web moderne

### Installation

1. **Cloner ou télécharger le projet**
```bash
git clone <url-du-repo>
cd CarbonPrint
```

2. **Lancer le serveur**
```bash
python server.py
```

3. **Ouvrir l'application**
- Ouvrez votre navigateur
- Allez sur `http://localhost:8000`

### Utilisation

1. **Remplir le questionnaire** : Répondez aux questions pour chaque catégorie
2. **Suivre la progression** : La barre de progression indique votre avancement
3. **Calculer** : Cliquez sur "Calculer" à la fin pour obtenir vos résultats
4. **Consulter les résultats** : Votre empreinte carbone totale et la répartition par catégorie
5. **Comparer** : Comparaison avec la moyenne française (9.9 tonnes CO2eq/an)

## 🏗️ Architecture technique

### Structure du projet
```
CarbonPrint/
├── classes/                 # Classes Python pour les calculs
│   ├── __init__.py
│   ├── user.py             # Classe principale User
│   ├── logement.py         # Calculs logement
│   ├── transport.py        # Calculs transport
│   ├── alimentation.py     # Calculs alimentation
│   ├── consommation.py     # Calculs consommation
│   ├── sante.py           # Calculs santé
│   ├── travail.py         # Calculs travail
│   ├── dechets.py         # Calculs déchets
│   ├── finance.py         # Calculs finance
│   └── services_publics.py # Calculs services publics
├── index.html              # Interface utilisateur
├── styles.css              # Styles CSS
├── script.js               # Logique JavaScript
├── server.py               # Serveur Python
└── README.md               # Documentation
```

### Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Backend** : Python 3, HTTP Server
- **Calculs** : Classes Python avec facteurs d'émission scientifiques
- **Design** : CSS Grid, Flexbox, animations CSS
- **Icons** : Font Awesome
- **Fonts** : Inter (Google Fonts)

## 📈 Facteurs d'émission

Les calculs sont basés sur des sources scientifiques reconnues :

- **ADEME** (Agence de l'Environnement et de la Maîtrise de l'Énergie)
- **Base Carbone®** - Base de données française
- **GIEC** (Groupe d'experts intergouvernemental sur l'évolution du climat)
- **Données françaises et internationales**

### Exemples de facteurs utilisés

- **Électricité française** : 0.085 kg CO2eq/kWh
- **Gaz naturel** : 0.202 kg CO2eq/kWh
- **Voiture essence** : 0.2 kg CO2eq/km
- **Train** : 0.03 kg CO2eq/km
- **Avion** : 0.25 kg CO2eq/km

## 🎨 Fonctionnalités de l'interface

### Design moderne
- Interface épurée et professionnelle
- Animations fluides et transitions
- Design responsive (mobile, tablette, desktop)
- Palette de couleurs cohérente

### Expérience utilisateur
- Navigation intuitive avec boutons précédent/suivant
- Barre de progression en temps réel
- Sauvegarde automatique des réponses
- Validation des données en temps réel
- Messages d'aide contextuels

### Résultats visuels
- Affichage du score total en grand
- Comparaison avec la moyenne française
- Graphiques de répartition par catégorie
- Export des résultats

## 🔧 Personnalisation

### Modifier les facteurs d'émission
Les facteurs d'émission sont définis dans chaque classe Python dans le dossier `classes/`. Vous pouvez les ajuster selon vos besoins.

### Ajouter de nouvelles questions
1. Modifier le tableau `questions` dans `script.js`
2. Ajouter les champs correspondants dans les classes Python
3. Mettre à jour la logique de calcul

### Personnaliser le design
Le fichier `styles.css` contient toutes les règles de style. Vous pouvez modifier les couleurs, polices, et animations.

## 📝 Licence

Ce projet est open source et peut être utilisé librement pour des projets éducatifs et personnels.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités
- Améliorer la documentation

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez que le serveur Python est bien démarré
3. Ouvrez la console du navigateur pour voir les erreurs JavaScript
4. Vérifiez les logs du serveur Python

---

**🌱 Ensemble, calculons et réduisons notre empreinte carbone !** 