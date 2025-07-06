class Sante:
    def __init__(self, medicaments_frequence, soins_medicaux_frequence, produits_hygiene_frequence,
                 cosmetiques_frequence, equipements_medicaux, consultations_frequence):
        self.medicaments_frequence = medicaments_frequence
        self.soins_medicaux_frequence = soins_medicaux_frequence
        self.produits_hygiene_frequence = produits_hygiene_frequence
        self.cosmetiques_frequence = cosmetiques_frequence
        self.equipements_medicaux = equipements_medicaux
        self.consultations_frequence = consultations_frequence
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone de la santé en tonnes CO2eq/an"""
        base = 0.5  # tonnes CO2eq/an
        
        facteurs_frequence = {
            'jamais': 0.3,
            'occasionnel': 0.7,
            'regulier': 1.0,
            'quotidien': 1.5
        }
        
        facteur_medicaments = facteurs_frequence.get(self.medicaments_frequence, 1.0)
        facteur_soins = facteurs_frequence.get(self.soins_medicaux_frequence, 1.0)
        facteur_hygiene = facteurs_frequence.get(self.produits_hygiene_frequence, 1.0)
        facteur_cosmetiques = facteurs_frequence.get(self.cosmetiques_frequence, 1.0)
        facteur_consultations = facteurs_frequence.get(self.consultations_frequence, 1.0)
        
        # Impact des équipements médicaux
        facteur_equipements = 1.3 if self.equipements_medicaux else 1.0
        
        empreinte = base * facteur_medicaments * facteur_soins * facteur_hygiene * facteur_cosmetiques * facteur_consultations * facteur_equipements
        
        return empreinte 