class Dechets:
    def __init__(self, tri_recyclage, compostage, reduction_dechets, dechets_organiques_kg_an,
                 dechets_papier_kg_an, dechets_plastique_kg_an, dechets_verre_kg_an, dechets_metal_kg_an):
        self.tri_recyclage = tri_recyclage
        self.compostage = compostage
        self.reduction_dechets = reduction_dechets
        self.dechets_organiques_kg_an = dechets_organiques_kg_an
        self.dechets_papier_kg_an = dechets_papier_kg_an
        self.dechets_plastique_kg_an = dechets_plastique_kg_an
        self.dechets_verre_kg_an = dechets_verre_kg_an
        self.dechets_metal_kg_an = dechets_metal_kg_an
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone des déchets en tonnes CO2eq/an"""
        # Base d'empreinte pour les déchets (kg CO2eq/kg de déchet)
        facteurs_dechets = {
            'organiques': 0.5,
            'papier': 0.8,
            'plastique': 2.5,
            'verre': 0.3,
            'metal': 1.2
        }
        
        empreinte = 0
        
        # Calcul par type de déchet
        empreinte += self.dechets_organiques_kg_an * facteurs_dechets['organiques']
        empreinte += self.dechets_papier_kg_an * facteurs_dechets['papier']
        empreinte += self.dechets_plastique_kg_an * facteurs_dechets['plastique']
        empreinte += self.dechets_verre_kg_an * facteurs_dechets['verre']
        empreinte += self.dechets_metal_kg_an * facteurs_dechets['metal']
        
        # Impact du tri et recyclage
        facteurs_tri = {
            'aucun': 1.0,
            'basique': 0.8,
            'avance': 0.6,
            'excellent': 0.4
        }
        empreinte *= facteurs_tri.get(self.tri_recyclage, 1.0)
        
        # Impact du compostage
        if self.compostage:
            empreinte *= 0.9
        
        # Impact de la réduction des déchets
        facteurs_reduction = {
            'aucune': 1.0,
            'faible': 0.9,
            'moyenne': 0.8,
            'importante': 0.6
        }
        empreinte *= facteurs_reduction.get(self.reduction_dechets, 1.0)
        
        return empreinte / 1000  # Conversion en tonnes 