class Alimentation:
    def __init__(self, regime_alimentaire, frequence_viande_rouge, frequence_viande_blanche,
                 frequence_poisson, frequence_produits_laitiers, origine_produits,
                 bio_conventionnel, gaspillage_alimentaire, restaurants_frequence,
                 plats_prepares_frequence):
        """
        Initialise un objet Alimentation
        
        Args:
            regime_alimentaire (str): 'omnivore', 'vegetarien', 'vegan'
            frequence_viande_rouge (str): 'quotidien', 'hebdomadaire', 'occasionnel', 'jamais'
            frequence_viande_blanche (str): 'quotidien', 'hebdomadaire', 'occasionnel', 'jamais'
            frequence_poisson (str): 'quotidien', 'hebdomadaire', 'occasionnel', 'jamais'
            frequence_produits_laitiers (str): 'quotidien', 'hebdomadaire', 'occasionnel', 'jamais'
            origine_produits (str): 'local', 'mixte', 'importe'
            bio_conventionnel (str): 'bio', 'mixte', 'conventionnel'
            gaspillage_alimentaire (str): 'faible', 'moyen', 'eleve'
            restaurants_frequence (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            plats_prepares_frequence (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
        """
        self.regime_alimentaire = regime_alimentaire
        self.frequence_viande_rouge = frequence_viande_rouge
        self.frequence_viande_blanche = frequence_viande_blanche
        self.frequence_poisson = frequence_poisson
        self.frequence_produits_laitiers = frequence_produits_laitiers
        self.origine_produits = origine_produits
        self.bio_conventionnel = bio_conventionnel
        self.gaspillage_alimentaire = gaspillage_alimentaire
        self.restaurants_frequence = restaurants_frequence
        self.plats_prepares_frequence = plats_prepares_frequence
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone de l'alimentation en tonnes CO2eq/an"""
        empreinte = 0
        
        # Base d'empreinte par régime (kg CO2eq/an)
        base_regime = {
            'omnivore': 2.0,
            'vegetarien': 1.4,
            'vegan': 1.0
        }
        empreinte = base_regime.get(self.regime_alimentaire, 2.0)
        
        # Impact de la viande rouge
        facteurs_viande_rouge = {
            'quotidien': 1.5,
            'hebdomadaire': 1.0,
            'occasionnel': 0.7,
            'jamais': 0.5
        }
        empreinte *= facteurs_viande_rouge.get(self.frequence_viande_rouge, 1.0)
        
        # Impact de la viande blanche
        facteurs_viande_blanche = {
            'quotidien': 1.2,
            'hebdomadaire': 1.0,
            'occasionnel': 0.8,
            'jamais': 0.6
        }
        empreinte *= facteurs_viande_blanche.get(self.frequence_viande_blanche, 1.0)
        
        # Impact du poisson
        facteurs_poisson = {
            'quotidien': 1.1,
            'hebdomadaire': 1.0,
            'occasionnel': 0.9,
            'jamais': 0.8
        }
        empreinte *= facteurs_poisson.get(self.frequence_poisson, 1.0)
        
        # Impact des produits laitiers
        facteurs_laitiers = {
            'quotidien': 1.1,
            'hebdomadaire': 1.0,
            'occasionnel': 0.9,
            'jamais': 0.8
        }
        empreinte *= facteurs_laitiers.get(self.frequence_produits_laitiers, 1.0)
        
        # Impact de l'origine des produits
        facteurs_origine = {
            'local': 0.8,
            'mixte': 1.0,
            'importe': 1.3
        }
        empreinte *= facteurs_origine.get(self.origine_produits, 1.0)
        
        # Impact bio vs conventionnel
        facteurs_bio = {
            'bio': 0.9,
            'mixte': 1.0,
            'conventionnel': 1.1
        }
        empreinte *= facteurs_bio.get(self.bio_conventionnel, 1.0)
        
        # Impact du gaspillage
        facteurs_gaspillage = {
            'faible': 0.8,
            'moyen': 1.0,
            'eleve': 1.3
        }
        empreinte *= facteurs_gaspillage.get(self.gaspillage_alimentaire, 1.0)
        
        # Impact des restaurants
        facteurs_restaurants = {
            'jamais': 0.9,
            'occasionnel': 1.0,
            'regulier': 1.2,
            'quotidien': 1.5
        }
        empreinte *= facteurs_restaurants.get(self.restaurants_frequence, 1.0)
        
        # Impact des plats préparés
        facteurs_plats_prepares = {
            'jamais': 0.9,
            'occasionnel': 1.0,
            'regulier': 1.1,
            'quotidien': 1.3
        }
        empreinte *= facteurs_plats_prepares.get(self.plats_prepares_frequence, 1.0)
        
        return empreinte 