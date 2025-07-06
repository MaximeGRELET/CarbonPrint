class Transport:
    def __init__(self, voitures=None, voiture_personnelle=None, type_carburant=None, km_voiture_an=None, 
                 covoiturage_frequence=None, transport_commun=None, km_bus_an=None, km_train_an=None, 
                 km_metro_an=None, velo_usage=None, marche_usage=None, vols_par_destination=None, 
                 moto_usage=None, km_moto_an=None):
        """
        Initialise un objet Transport
        
        Args:
            voitures (list): Liste de voitures (dictionnaires)
            voiture_personnelle (bool): Possède une voiture personnelle (rétrocompatibilité)
            type_carburant (str): 'essence', 'diesel', 'electrique', 'hybride', 'gpl' (rétrocompatibilité)
            km_voiture_an (float): Kilométrage annuel en voiture (rétrocompatibilité)
            covoiturage_frequence (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            transport_commun (bool): Utilise les transports en commun
            km_bus_an (float): Kilométrage annuel en bus
            km_train_an (float): Kilométrage annuel en train
            km_metro_an (float): Kilométrage annuel en métro/tram
            velo_usage (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            marche_usage (str): 'jamais', 'occasionnel', 'regulier', 'quotidien'
            vols_par_destination (dict): Nombre de vols par destination depuis Paris
            moto_usage (bool): Utilise une moto
            km_moto_an (float): Kilométrage annuel en moto
        """
        self.voitures = voitures or []
        self.voiture_personnelle = voiture_personnelle
        self.type_carburant = type_carburant
        self.km_voiture_an = km_voiture_an
        self.covoiturage_frequence = covoiturage_frequence
        self.transport_commun = transport_commun
        self.km_bus_an = km_bus_an or 0
        self.km_train_an = km_train_an or 0
        self.km_metro_an = km_metro_an or 0
        self.velo_usage = velo_usage
        self.marche_usage = marche_usage
        self.vols_par_destination = vols_par_destination or {}
        self.moto_usage = moto_usage
        self.km_moto_an = km_moto_an or 0
        
        # Base de données des destinations depuis Paris
        self.destinations_data = {
            # France métropolitaine
            'france_metropolitaine': {
                'distance_km': 500,
                'facteur_emission': 0.25,  # kg CO2eq/km
                'nom': 'France métropolitaine'
            },
            # Europe
            'europe_ouest': {
                'distance_km': 1000,
                'facteur_emission': 0.25,
                'nom': 'Europe de l\'Ouest'
            },
            'europe_est': {
                'distance_km': 1500,
                'facteur_emission': 0.25,
                'nom': 'Europe de l\'Est'
            },
            'europe_nord': {
                'distance_km': 1200,
                'facteur_emission': 0.25,
                'nom': 'Europe du Nord'
            },
            'europe_sud': {
                'distance_km': 1100,
                'facteur_emission': 0.25,
                'nom': 'Europe du Sud'
            },
            # Afrique
            'afrique_nord': {
                'distance_km': 2000,
                'facteur_emission': 0.25,
                'nom': 'Afrique du Nord'
            },
            'afrique_ouest': {
                'distance_km': 4500,
                'facteur_emission': 0.25,
                'nom': 'Afrique de l\'Ouest'
            },
            'afrique_est': {
                'distance_km': 7000,
                'facteur_emission': 0.25,
                'nom': 'Afrique de l\'Est'
            },
            'afrique_sud': {
                'distance_km': 9000,
                'facteur_emission': 0.25,
                'nom': 'Afrique du Sud'
            },
            # Amérique
            'amerique_nord': {
                'distance_km': 7000,
                'facteur_emission': 0.25,
                'nom': 'Amérique du Nord'
            },
            'amerique_sud': {
                'distance_km': 10000,
                'facteur_emission': 0.25,
                'nom': 'Amérique du Sud'
            },
            'amerique_centrale': {
                'distance_km': 8500,
                'facteur_emission': 0.25,
                'nom': 'Amérique centrale'
            },
            # Asie
            'asie_ouest': {
                'distance_km': 4000,
                'facteur_emission': 0.25,
                'nom': 'Asie de l\'Ouest'
            },
            'asie_est': {
                'distance_km': 9000,
                'facteur_emission': 0.25,
                'nom': 'Asie de l\'Est'
            },
            'asie_sud': {
                'distance_km': 7000,
                'facteur_emission': 0.25,
                'nom': 'Asie du Sud'
            },
            'asie_sud_est': {
                'distance_km': 11000,
                'facteur_emission': 0.25,
                'nom': 'Asie du Sud-Est'
            },
            # Océanie
            'oceanie': {
                'distance_km': 17000,
                'facteur_emission': 0.25,
                'nom': 'Océanie'
            }
        }
    
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
        
        # --- NOUVEAU : gestion de plusieurs voitures ---
        if self.voitures and len(self.voitures) > 0:
            for voiture in self.voitures:
                if not isinstance(voiture, dict):
                    continue
                type_carburant = str(voiture.get('type_carburant', 'essence'))
                km_voiture_an = float(voiture.get('km_voiture_an', 0))
                age_voiture = int(voiture.get('age_voiture', 5))
                type_voiture = str(voiture.get('type_voiture', 'citadine'))
                facteur_voiture = facteurs_voiture.get(type_carburant, 0.2)
                facteurs_covoiturage = {
                    'jamais': 1.0,
                    'occasionnel': 0.9,
                    'regulier': 0.7,
                    'quotidien': 0.5
                }
                cov_freq = str(self.covoiturage_frequence) if self.covoiturage_frequence else 'jamais'
                facteur_covoiturage = facteurs_covoiturage.get(cov_freq, 1.0)
                empreinte += km_voiture_an * facteur_voiture * facteur_covoiturage
        else:
            # Rétrocompatibilité : ancienne logique
            if self.voiture_personnelle and self.km_voiture_an and self.km_voiture_an > 0:
                facteur_voiture = facteurs_voiture.get(str(self.type_carburant), 0.2)
                facteurs_covoiturage = {
                    'jamais': 1.0,
                    'occasionnel': 0.9,
                    'regulier': 0.7,
                    'quotidien': 0.5
                }
                cov_freq = str(self.covoiturage_frequence) if self.covoiturage_frequence else 'jamais'
                facteur_covoiturage = facteurs_covoiturage.get(cov_freq, 1.0)
                empreinte += self.km_voiture_an * facteur_voiture * facteur_covoiturage
        
        # Calcul transports en commun
        if self.transport_commun:
            empreinte += self.km_bus_an * facteurs_transport['bus']
            empreinte += self.km_train_an * facteurs_transport['train']
            empreinte += self.km_metro_an * facteurs_transport['metro']
        
        # Calcul moto
        if self.moto_usage and self.km_moto_an > 0:
            empreinte += self.km_moto_an * facteurs_transport['moto']
        
        # Calcul avion par destination
        for destination, nb_vols in self.vols_par_destination.items():
            if destination in self.destinations_data and nb_vols > 0:
                dest_data = self.destinations_data[destination]
                distance = dest_data['distance_km']
                facteur = dest_data['facteur_emission']
                empreinte += nb_vols * distance * facteur
        
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
    
    def get_details_emissions_avion(self):
        """Retourne les détails des émissions par destination"""
        details = {}
        for destination, nb_vols in self.vols_par_destination.items():
            if isinstance(destination, str) and destination in self.destinations_data and nb_vols > 0:
                dest_data = self.destinations_data[destination]
                distance = dest_data['distance_km']
                facteur = dest_data['facteur_emission']
                emission_kg = nb_vols * distance * facteur
                details[dest_data['nom']] = {
                    'nb_vols': nb_vols,
                    'distance_km': distance,
                    'emission_kg': emission_kg,
                    'emission_tonnes': emission_kg / 1000
                }
        return details
    
    def get_destinations_disponibles(self):
        """Retourne la liste des destinations disponibles"""
        return {str(key): data['nom'] for key, data in self.destinations_data.items() if isinstance(data, dict)} 