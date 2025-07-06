class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.logement = None
        self.transport = None
        self.alimentation = None
        self.consommation = None
        self.sante = None
        self.travail = None
        self.dechets = None
        self.finance = None
        self.services_publics = None
    
    def set_logement(self, logement):
        self.logement = logement
    
    def set_transport(self, transport):
        self.transport = transport
    
    def set_alimentation(self, alimentation):
        self.alimentation = alimentation
    
    def set_consommation(self, consommation):
        self.consommation = consommation
    
    def set_sante(self, sante):
        self.sante = sante
    
    def set_travail(self, travail):
        self.travail = travail
    
    def set_dechets(self, dechets):
        self.dechets = dechets
    
    def set_finance(self, finance):
        self.finance = finance
    
    def set_services_publics(self, services_publics):
        self.services_publics = services_publics
    
    def calculer_empreinte_totale(self):
        """Calcule l'empreinte carbone totale en tonnes CO2eq/an"""
        total = 0
        
        if self.logement:
            total += self.logement.calculer_empreinte()
        
        if self.transport:
            total += self.transport.calculer_empreinte()
        
        if self.alimentation:
            total += self.alimentation.calculer_empreinte()
        
        if self.consommation:
            total += self.consommation.calculer_empreinte()
        
        if self.sante:
            total += self.sante.calculer_empreinte()
        
        if self.travail:
            total += self.travail.calculer_empreinte()
        
        if self.dechets:
            total += self.dechets.calculer_empreinte()
        
        if self.finance:
            total += self.finance.calculer_empreinte()
        
        if self.services_publics:
            total += self.services_publics.calculer_empreinte()
        
        return total
    
    def get_repartition_empreinte(self):
        """Retourne la répartition de l'empreinte carbone par catégorie"""
        repartition = {}
        total = self.calculer_empreinte_totale()
        
        if total == 0:
            return repartition
        
        if self.logement:
            repartition['Logement'] = (self.logement.calculer_empreinte() / total) * 100
        
        if self.transport:
            repartition['Transport'] = (self.transport.calculer_empreinte() / total) * 100
        
        if self.alimentation:
            repartition['Alimentation'] = (self.alimentation.calculer_empreinte() / total) * 100
        
        if self.consommation:
            repartition['Consommation'] = (self.consommation.calculer_empreinte() / total) * 100
        
        if self.sante:
            repartition['Santé'] = (self.sante.calculer_empreinte() / total) * 100
        
        if self.travail:
            repartition['Travail'] = (self.travail.calculer_empreinte() / total) * 100
        
        if self.dechets:
            repartition['Déchets'] = (self.dechets.calculer_empreinte() / total) * 100
        
        if self.finance:
            repartition['Finance'] = (self.finance.calculer_empreinte() / total) * 100
        
        if self.services_publics:
            repartition['Services Publics'] = (self.services_publics.calculer_empreinte() / total) * 100
        
        return repartition 