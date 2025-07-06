class Consommation:
    def __init__(self, vetements_frequence, vetements_qualite, electronique_frequence,
                 smartphone_age, ordinateur_age, electromenager_age, meubles_frequence,
                 livres_frequence, jeux_frequence, sorties_frequence, services_telecom,
                 services_banque, services_assurance):
        self.vetements_frequence = vetements_frequence
        self.vetements_qualite = vetements_qualite
        self.electronique_frequence = electronique_frequence
        self.smartphone_age = smartphone_age
        self.ordinateur_age = ordinateur_age
        self.electromenager_age = electromenager_age
        self.meubles_frequence = meubles_frequence
        self.livres_frequence = livres_frequence
        self.jeux_frequence = jeux_frequence
        self.sorties_frequence = sorties_frequence
        self.services_telecom = services_telecom
        self.services_banque = services_banque
        self.services_assurance = services_assurance
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone de la consommation en tonnes CO2eq/an"""
        empreinte = 0
        
        # Base d'empreinte pour la consommation
        base = 1.5  # tonnes CO2eq/an
        
        # Facteurs de fréquence d'achat
        facteurs_frequence = {
            'jamais': 0.5,
            'occasionnel': 0.8,
            'regulier': 1.0,
            'quotidien': 1.5
        }
        
        # Impact des vêtements
        facteur_vetements = facteurs_frequence.get(self.vetements_frequence, 1.0)
        if self.vetements_qualite == 'haute':
            facteur_vetements *= 1.2
        elif self.vetements_qualite == 'moyenne':
            facteur_vetements *= 1.0
        else:  # basse
            facteur_vetements *= 0.8
        
        # Impact de l'électronique
        facteur_electronique = facteurs_frequence.get(self.electronique_frequence, 1.0)
        
        # Impact de l'âge des équipements
        facteur_age = 1.0
        if self.smartphone_age < 2:
            facteur_age *= 1.3
        if self.ordinateur_age < 3:
            facteur_age *= 1.2
        if self.electromenager_age < 5:
            facteur_age *= 1.1
        
        # Impact des sorties
        facteur_sorties = facteurs_frequence.get(self.sorties_frequence, 1.0)
        
        # Calcul final
        empreinte = base * facteur_vetements * facteur_electronique * facteur_age * facteur_sorties
        
        return empreinte 