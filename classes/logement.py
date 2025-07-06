class Logement:
    def __init__(self, type_logement, surface, nb_personnes, energie_chauffage, 
                 isolation_qualite, climatisation, electromenager_efficacite, annee_construction):
        """
        Initialise un objet Logement
        
        Args:
            type_logement (str): 'maison' ou 'appartement'
            surface (float): Surface en m²
            nb_personnes (int): Nombre de personnes dans le logement
            energie_chauffage (str): Type d'énergie principale ('electricite', 'gaz', 'fioul', 'bois', 'pompe_chaleur')
            isolation_qualite (str): 'excellente', 'bonne', 'moyenne', 'mauvaise'
            climatisation (bool): Présence de climatisation
            electromenager_efficacite (str): 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'
            annee_construction (str): Période de construction
        """
        self.type_logement = type_logement
        self.surface = surface
        self.nb_personnes = nb_personnes
        self.energie_chauffage = energie_chauffage
        self.isolation_qualite = isolation_qualite
        self.climatisation = climatisation
        self.electromenager_efficacite = electromenager_efficacite
        self.annee_construction = annee_construction
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone du logement en tonnes CO2eq/an/personne"""
        empreinte = 0
        
        # Calcul de la consommation de chauffage basée sur les caractéristiques
        consommation_chauffage = self._calculer_consommation_chauffage()
        consommation_electrique = self._calculer_consommation_electrique()
        
        # Facteurs d'émission (en kg CO2eq/kWh)
        facteurs = {
            'electricite': 0.085,  # Mix électrique français
            'gaz': 0.202,
            'fioul': 2.68,
            'bois': 0.0,  # Neutre en carbone si renouvelable
            'pompe_chaleur': 0.085,  # Électricité
            'chauffage_urbain': 0.15
        }
        
        # Calcul empreinte chauffage
        facteur_chauffage = facteurs.get(self.energie_chauffage, 0.202)
        empreinte += consommation_chauffage * facteur_chauffage
        
        # Calcul empreinte électricité
        empreinte += consommation_electrique * facteurs['electricite']
        
        # Division par le nombre de personnes pour avoir l'empreinte par personne
        if self.nb_personnes > 0:
            empreinte /= self.nb_personnes
        
        # Conversion en tonnes
        return empreinte / 1000
    
    def _calculer_consommation_chauffage(self):
        """Calcule la consommation de chauffage basée sur les caractéristiques"""
        # Consommation de base par m² selon l'âge du bâtiment (kWh/m²/an)
        consommation_base = {
            'avant_1975': 300,
            '1975_1990': 250,
            '1990_2005': 200,
            '2005_2012': 150,
            'apres_2012': 100
        }
        
        base = consommation_base.get(self.annee_construction, 200)
        
        # Facteurs de correction selon le type de logement
        if self.type_logement == 'maison':
            base *= 1.2  # Maison plus consommatrice
        
        # Facteurs de correction selon l'isolation
        facteurs_isolation = {
            'excellente': 0.6,
            'bonne': 0.8,
            'moyenne': 1.0,
            'mauvaise': 1.4
        }
        base *= facteurs_isolation.get(self.isolation_qualite, 1.0)
        
        # Facteurs selon l'énergie
        facteurs_energie = {
            'electricite': 1.0,
            'gaz': 1.0,
            'fioul': 1.1,
            'bois': 1.0,
            'pompe_chaleur': 0.4,  # Plus efficace
            'chauffage_urbain': 0.9
        }
        base *= facteurs_energie.get(self.energie_chauffage, 1.0)
        
        return base * self.surface
    
    def _calculer_consommation_electrique(self):
        """Calcule la consommation électrique basée sur les caractéristiques"""
        # Consommation de base par personne (kWh/an)
        base = 1000 * self.nb_personnes
        
        # Consommation selon la surface (éclairage, etc.)
        base += self.surface * 10
        
        # Impact de l'efficacité électroménager
        facteurs_electromenager = {
            'A+++': 0.8,
            'A++': 0.85,
            'A+': 0.9,
            'A': 1.0,
            'B': 1.2,
            'C': 1.5,
            'D': 2.0
        }
        base *= facteurs_electromenager.get(self.electromenager_efficacite, 1.0)
        
        # Impact climatisation
        if self.climatisation:
            base += 500  # 500 kWh/an pour climatisation
        
        return base 