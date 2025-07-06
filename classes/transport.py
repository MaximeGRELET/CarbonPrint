class Transport:
    def __init__(self, voiture_personnelle, type_carburant, km_voiture_an, 
                 covoiturage_frequence, transport_commun, km_bus_an, km_train_an, 
                 km_metro_an, velo_usage, marche_usage, avion_vols_domestiques, 
                 avion_vols_internationaux, moto_usage, km_moto_an):
        """
        Initialise un objet Transport
        
        Args:
            voiture_personnelle (bool): Possède une voiture personnelle
            type_carburant (str): 'essence', 'diesel', 'electrique', 'hybride', 'gpl'
            km_voiture_an (float): Kilométrage annuel en voiture
            covoiturage_frequence (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            transport_commun (bool): Utilise les transports en commun
            km_bus_an (float): Kilométrage annuel en bus
            km_train_an (float): Kilométrage annuel en train
            km_metro_an (float): Kilométrage annuel en métro/tram
            velo_usage (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            marche_usage (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            avion_vols_domestiques (int): Nombre de vols domestiques par an
            avion_vols_internationaux (int): Nombre de vols internationaux par an
            moto_usage (bool): Utilise une moto
            km_moto_an (float): Kilométrage annuel en moto
        """
        self.voiture_personnelle = voiture_personnelle
        self.type_carburant = type_carburant
        self.km_voiture_an = km_voiture_an
        self.covoiturage_frequence = covoiturage_frequence
        self.transport_commun = transport_commun
        self.km_bus_an = km_bus_an
        self.km_train_an = km_train_an
        self.km_metro_an = km_metro_an
        self.velo_usage = velo_usage
        self.marche_usage = marche_usage
        self.avion_vols_domestiques = avion_vols_domestiques
        self.avion_vols_internationaux = avion_vols_internationaux
        self.moto_usage = moto_usage
        self.km_moto_an = km_moto_an
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone du transport en tonnes CO2eq/an"""
        empreinte = 0
        
        # Facteurs d'émission (en kg CO2eq/km)
        facteurs_voiture = {
            'essence': 0.2,
            'diesel': 0.18,
            'electrique': 0.02,  # Mix électrique français
            'hybride': 0.12,
            'gpl': 0.15
        }
        
        facteurs_transport = {
            'bus': 0.08,
            'train': 0.03,
            'metro': 0.02,
            'moto': 0.12
        }
        
        # Calcul voiture personnelle
        if self.voiture_personnelle and self.km_voiture_an > 0:
            facteur_voiture = facteurs_voiture.get(self.type_carburant, 0.2)
            
            # Impact du covoiturage
            facteurs_covoiturage = {
                'jamais': 1.0,
                'occasionnel': 0.9,
                'regulier': 0.7,
                'quotidien': 0.5
            }
            facteur_covoiturage = facteurs_covoiturage.get(self.covoiturage_frequence, 1.0)
            
            empreinte += self.km_voiture_an * facteur_voiture * facteur_covoiturage
        
        # Calcul transports en commun
        if self.transport_commun:
            empreinte += self.km_bus_an * facteurs_transport['bus']
            empreinte += self.km_train_an * facteurs_transport['train']
            empreinte += self.km_metro_an * facteurs_transport['metro']
        
        # Calcul moto
        if self.moto_usage and self.km_moto_an > 0:
            empreinte += self.km_moto_an * facteurs_transport['moto']
        
        # Calcul avion
        # Vols domestiques (moyenne 500 km)
        empreinte += self.avion_vols_domestiques * 500 * 0.25  # 0.25 kg CO2eq/km
        
        # Vols internationaux (moyenne 2000 km)
        empreinte += self.avion_vols_internationaux * 2000 * 0.25
        
        # Impact des modes doux (réduction des autres modes)
        facteurs_modes_doux = {
            'jamais': 1.0,
            'occasionnel': 0.95,
            'regulier': 0.9,
            'quotidien': 0.8
        }
        
        facteur_velo = facteurs_modes_doux.get(self.velo_usage, 1.0)
        facteur_marche = facteurs_modes_doux.get(self.marche_usage, 1.0)
        
        # Application des réductions pour modes doux
        empreinte *= min(facteur_velo, facteur_marche)
        
        # Conversion en tonnes
        return empreinte / 1000 