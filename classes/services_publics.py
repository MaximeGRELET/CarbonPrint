class ServicesPublics:
    def __init__(self, utilisation_education, utilisation_sante, utilisation_transport_public,
                 utilisation_administration, utilisation_defense, utilisation_infrastructure):
        self.utilisation_education = utilisation_education
        self.utilisation_sante = utilisation_sante
        self.utilisation_transport_public = utilisation_transport_public
        self.utilisation_administration = utilisation_administration
        self.utilisation_defense = utilisation_defense
        self.utilisation_infrastructure = utilisation_infrastructure
    
    def calculer_empreinte(self):
        """Calcule l'empreinte carbone des services publics en tonnes CO2eq/an"""
        # Répartition de l'empreinte des services publics par citoyen
        empreinte_par_service = {
            'education': 0.2,
            'sante': 0.3,
            'transport_public': 0.1,
            'administration': 0.1,
            'defense': 0.2,
            'infrastructure': 0.1
        }
        
        empreinte = 0
        
        # Calcul basé sur l'utilisation des services
        if self.utilisation_education:
            empreinte += empreinte_par_service['education']
        if self.utilisation_sante:
            empreinte += empreinte_par_service['sante']
        if self.utilisation_transport_public:
            empreinte += empreinte_par_service['transport_public']
        if self.utilisation_administration:
            empreinte += empreinte_par_service['administration']
        if self.utilisation_defense:
            empreinte += empreinte_par_service['defense']
        if self.utilisation_infrastructure:
            empreinte += empreinte_par_service['infrastructure']
        
        # Si aucun service n'est utilisé, on attribue une part minimale
        if empreinte == 0:
            empreinte = 0.3  # Part minimale des services publics
        
        return empreinte 