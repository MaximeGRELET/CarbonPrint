class Finance:
    def __init__(self, epargne_montant, type_placement, banque_type, assurance_type, investissements_durables):
        self.epargne_montant = epargne_montant
        self.type_placement = type_placement
        self.banque_type = banque_type
        self.assurance_type = assurance_type
        self.investissements_durables = investissements_durables
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone de la finance en tonnes CO2eq/an"""
        base = 0.3  # tonnes CO2eq/an
        
        # Impact de l'épargne (kg CO2eq/€/an)
        facteurs_placement = {
            'livret': 0.1,
            'assurance_vie': 0.3,
            'pea': 0.2,
            'actions': 0.5,
            'immobilier': 0.4
        }
        
        empreinte_epargne = (self.epargne_montant / 1000) * facteurs_placement.get(self.type_placement, 0.3)
        
        # Impact du type de banque
        facteurs_banque = {
            'traditionnelle': 1.0,
            'en_ligne': 0.8,
            'ethique': 0.6
        }
        
        # Impact du type d'assurance
        facteurs_assurance = {
            'standard': 1.0,
            'eco_responsable': 0.8
        }
        
        # Impact des investissements durables
        facteur_durable = 0.7 if self.investissements_durables else 1.0
        
        empreinte = (base + empreinte_epargne) * facteurs_banque.get(self.banque_type, 1.0) * facteurs_assurance.get(self.assurance_type, 1.0) * facteur_durable
        
        return empreinte 