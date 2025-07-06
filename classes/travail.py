class Travail:
    def __init__(self, teletravail_pourcentage, deplacements_professionnels_frequence,
                 km_deplacements_pro, equipements_bureau, services_publics_utilises):
        self.teletravail_pourcentage = teletravail_pourcentage
        self.deplacements_professionnels_frequence = deplacements_professionnels_frequence
        self.km_deplacements_pro = km_deplacements_pro
        self.equipements_bureau = equipements_bureau
        self.services_publics_utilises = services_publics_utilises
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone du travail en tonnes CO2eq/an"""
        base = 0.8  # tonnes CO2eq/an
        
        # Impact du télétravail (réduction des déplacements)
        facteur_teletravail = 1.0 - (self.teletravail_pourcentage / 100) * 0.3
        
        # Impact des déplacements professionnels
        facteurs_deplacements = {
            'jamais': 0.8,
            'occasionnel': 1.0,
            'regulier': 1.3,
            'quotidien': 1.8
        }
        facteur_deplacements = facteurs_deplacements.get(self.deplacements_professionnels_frequence, 1.0)
        
        # Impact des équipements de bureau
        facteurs_equipements = {
            'minimal': 0.8,
            'standard': 1.0,
            'important': 1.3
        }
        facteur_equipements = facteurs_equipements.get(self.equipements_bureau, 1.0)
        
        empreinte = base * facteur_teletravail * facteur_deplacements * facteur_equipements
        
        return empreinte 