#!/usr/bin/env python3
"""
Serveur web pour le calculateur d'empreinte carbone
Utilise les classes Python pour effectuer les calculs
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import sys
from urllib.parse import parse_qs, urlparse
from classes import *

class CarbonPrintHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        """Gère les requêtes GET pour servir les fichiers statiques"""
        if self.path == '/':
            self.path = '/index.html'
        return SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        """Gère les requêtes POST pour les calculs"""
        if self.path == '/calculate':
            self.handle_calculate()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_calculate(self):
        """Gère le calcul de l'empreinte carbone"""
        try:
            # Lire les données JSON
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            user_data = json.loads(post_data.decode('utf-8'))
            
            # Calculer l'empreinte carbone
            result = self.calculate_carbon_footprint(user_data)
            
            # Envoyer la réponse
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            print(f"Erreur lors du calcul: {e}")
            error_response = {
                'success': False,
                'error': str(e)
            }
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Gère les requêtes OPTIONS pour CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def calculate_carbon_footprint(self, user_data):
        """Calcule l'empreinte carbone en utilisant les classes Python"""
        try:
            # Créer un utilisateur
            user = User("Utilisateur", "user@example.com", "password")
            
            # Créer les objets pour chaque catégorie
            if 'logement' in user_data:
                logement_data = user_data['logement']
                try:
                    logement = Logement(
                        type_logement=logement_data.get('type_logement', 'appartement'),
                        surface=float(logement_data.get('surface', 70)),
                        nb_personnes=int(logement_data.get('nb_personnes', 2)),
                        energie_chauffage=logement_data.get('energie_chauffage', 'gaz'),
                        isolation_qualite=logement_data.get('isolation_qualite', 'moyenne'),
                        climatisation=logement_data.get('climatisation', False),
                        electromenager_efficacite=logement_data.get('electromenager_efficacite', 'A'),
                        annee_construction=logement_data.get('annee_construction', '1990_2005')
                    )
                    user.set_logement(logement)
                except Exception as e:
                    print(f"Erreur lors de la création du logement: {e}")
                    # Créer un logement par défaut
                    logement = Logement(
                        type_logement='appartement',
                        surface=70.0,
                        nb_personnes=2,
                        energie_chauffage='gaz',
                        isolation_qualite='moyenne',
                        climatisation=False,
                        electromenager_efficacite='A',
                        annee_construction='1990_2005'
                    )
                    user.set_logement(logement)
            
            if 'transport' in user_data:
                transport_data = user_data['transport']
                try:
                    # Nouvelle logique avec voitures multiples
                    voitures = transport_data.get('voitures', [])
                    if not voitures and transport_data.get('voiture_personnelle', False):
                        # Rétrocompatibilité : convertir ancienne structure
                        voitures = [{
                            'type_voiture': 'citadine',
                            'type_carburant': transport_data.get('type_carburant', 'essence'),
                            'age_voiture': 5,
                            'km_voiture_an': float(transport_data.get('km_voiture_an', 0))
                        }]
                    
                    transport = Transport(
                        voitures=voitures,
                        covoiturage_frequence=transport_data.get('covoiturage_frequence', 'jamais'),
                        transport_commun=transport_data.get('transport_commun', False),
                        km_bus_an=float(transport_data.get('km_bus_an', 0)),
                        km_train_an=float(transport_data.get('km_train_an', 0)),
                        km_metro_an=float(transport_data.get('km_metro_an', 0)),
                        velo_usage=transport_data.get('velo_usage', 'jamais'),
                        marche_usage=transport_data.get('marche_usage', 'jamais'),
                        vols_par_destination=transport_data.get('vols_par_destination', {}),
                        moto_usage=transport_data.get('moto_usage', False),
                        km_moto_an=float(transport_data.get('km_moto_an', 0))
                    )
                    user.set_transport(transport)
                except Exception as e:
                    print(f"Erreur lors de la création du transport: {e}")
                    # Créer un transport par défaut
                    transport = Transport(
                        voitures=[],
                        covoiturage_frequence='jamais',
                        transport_commun=False,
                        km_bus_an=0.0,
                        km_train_an=0.0,
                        km_metro_an=0.0,
                        velo_usage='jamais',
                        marche_usage='jamais',
                        vols_par_destination={},
                        moto_usage=False,
                        km_moto_an=0.0
                    )
                    user.set_transport(transport)
            
            if 'alimentation' in user_data:
                alimentation_data = user_data['alimentation']
                try:
                    alimentation = Alimentation(
                        regime_alimentaire=alimentation_data.get('regime_alimentaire', 'omnivore'),
                        frequence_viande_rouge=alimentation_data.get('frequence_viande_rouge', 'hebdomadaire'),
                        frequence_viande_blanche=alimentation_data.get('frequence_viande_blanche', 'hebdomadaire'),
                        frequence_poisson=alimentation_data.get('frequence_poisson', 'occasionnel'),
                        frequence_produits_laitiers=alimentation_data.get('frequence_produits_laitiers', 'quotidien'),
                        origine_produits=alimentation_data.get('origine_produits', 'mixte'),
                        bio_conventionnel=alimentation_data.get('bio_conventionnel', 'mixte'),
                        gaspillage_alimentaire=alimentation_data.get('gaspillage_alimentaire', 'moyen'),
                        restaurants_frequence=alimentation_data.get('restaurants_frequence', 'occasionnel'),
                        plats_prepares_frequence=alimentation_data.get('plats_prepares_frequence', 'occasionnel')
                    )
                    user.set_alimentation(alimentation)
                except Exception as e:
                    print(f"Erreur lors de la création de l'alimentation: {e}")
                    # Créer une alimentation par défaut
                    alimentation = Alimentation(
                        regime_alimentaire='omnivore',
                        frequence_viande_rouge='hebdomadaire',
                        frequence_viande_blanche='hebdomadaire',
                        frequence_poisson='occasionnel',
                        frequence_produits_laitiers='quotidien',
                        origine_produits='mixte',
                        bio_conventionnel='mixte',
                        gaspillage_alimentaire='moyen',
                        restaurants_frequence='occasionnel',
                        plats_prepares_frequence='occasionnel'
                    )
                    user.set_alimentation(alimentation)
            
            if 'consommation' in user_data:
                consommation_data = user_data['consommation']
                try:
                    consommation = Consommation(
                        vetements_frequence=consommation_data.get('vetements_frequence', 'occasionnel'),
                        vetements_qualite=consommation_data.get('vetements_qualite', 'moyenne'),
                        electronique_frequence=consommation_data.get('electronique_frequence', 'occasionnel'),
                        smartphone_age=float(consommation_data.get('smartphone_age', 3)),
                        ordinateur_age=float(consommation_data.get('ordinateur_age', 4)),
                        electromenager_age=float(consommation_data.get('electromenager_age', 5)),
                        meubles_frequence=consommation_data.get('meubles_frequence', 'occasionnel'),
                        livres_frequence=consommation_data.get('livres_frequence', 'occasionnel'),
                        jeux_frequence=consommation_data.get('jeux_frequence', 'occasionnel'),
                        sorties_frequence=consommation_data.get('sorties_frequence', 'occasionnel'),
                        services_telecom=consommation_data.get('services_telecom', 'standard'),
                        services_banque=consommation_data.get('services_banque', 'standard'),
                        services_assurance=consommation_data.get('services_assurance', 'standard')
                    )
                    user.set_consommation(consommation)
                except Exception as e:
                    print(f"Erreur lors de la création de la consommation: {e}")
                    # Créer une consommation par défaut
                    consommation = Consommation(
                        vetements_frequence='occasionnel',
                        vetements_qualite='moyenne',
                        electronique_frequence='occasionnel',
                        smartphone_age=3.0,
                        ordinateur_age=4.0,
                        electromenager_age=5.0,
                        meubles_frequence='occasionnel',
                        livres_frequence='occasionnel',
                        jeux_frequence='occasionnel',
                        sorties_frequence='occasionnel',
                        services_telecom='standard',
                        services_banque='standard',
                        services_assurance='standard'
                    )
                    user.set_consommation(consommation)
            
            if 'sante' in user_data:
                sante_data = user_data['sante']
                try:
                    sante = Sante(
                        medicaments_frequence=sante_data.get('medicaments_frequence', 'occasionnel'),
                        soins_medicaux_frequence=sante_data.get('soins_medicaux_frequence', 'occasionnel'),
                        produits_hygiene_frequence=sante_data.get('produits_hygiene_frequence', 'standard'),
                        cosmetiques_frequence=sante_data.get('cosmetiques_frequence', 'occasionnel'),
                        equipements_medicaux=sante_data.get('equipements_medicaux', False),
                        consultations_frequence=sante_data.get('consultations_frequence', 'occasionnel')
                    )
                    user.set_sante(sante)
                except Exception as e:
                    print(f"Erreur lors de la création de la santé: {e}")
                    # Créer une santé par défaut
                    sante = Sante(
                        medicaments_frequence='occasionnel',
                        soins_medicaux_frequence='occasionnel',
                        produits_hygiene_frequence='standard',
                        cosmetiques_frequence='occasionnel',
                        equipements_medicaux=False,
                        consultations_frequence='occasionnel'
                    )
                    user.set_sante(sante)
            
            if 'travail' in user_data:
                travail_data = user_data['travail']
                try:
                    travail = Travail(
                        teletravail_pourcentage=float(travail_data.get('teletravail_pourcentage', 0)),
                        deplacements_professionnels_frequence=travail_data.get('deplacements_professionnels_frequence', 'jamais'),
                        km_deplacements_pro=float(travail_data.get('km_deplacements_pro', 0)),
                        equipements_bureau=travail_data.get('equipements_bureau', 'standard'),
                        services_publics_utilises=travail_data.get('services_publics_utilises', [])
                    )
                    user.set_travail(travail)
                except Exception as e:
                    print(f"Erreur lors de la création du travail: {e}")
                    # Créer un travail par défaut
                    travail = Travail(
                        teletravail_pourcentage=0.0,
                        deplacements_professionnels_frequence='jamais',
                        km_deplacements_pro=0.0,
                        equipements_bureau='standard',
                        services_publics_utilises=[]
                    )
                    user.set_travail(travail)
            
            if 'dechets' in user_data:
                dechets_data = user_data['dechets']
                try:
                    dechets = Dechets(
                        tri_recyclage=dechets_data.get('tri_recyclage', 'basique'),
                        compostage=dechets_data.get('compostage', False),
                        reduction_dechets=dechets_data.get('reduction_dechets', 'aucune'),
                        dechets_organiques_kg_an=float(dechets_data.get('dechets_organiques_kg_an', 150)),
                        dechets_papier_kg_an=float(dechets_data.get('dechets_papier_kg_an', 100)),
                        dechets_plastique_kg_an=float(dechets_data.get('dechets_plastique_kg_an', 50)),
                        dechets_verre_kg_an=float(dechets_data.get('dechets_verre_kg_an', 30)),
                        dechets_metal_kg_an=float(dechets_data.get('dechets_metal_kg_an', 20))
                    )
                    user.set_dechets(dechets)
                except Exception as e:
                    print(f"Erreur lors de la création des déchets: {e}")
                    # Créer des déchets par défaut
                    dechets = Dechets(
                        tri_recyclage='basique',
                        compostage=False,
                        reduction_dechets='aucune',
                        dechets_organiques_kg_an=150.0,
                        dechets_papier_kg_an=100.0,
                        dechets_plastique_kg_an=50.0,
                        dechets_verre_kg_an=30.0,
                        dechets_metal_kg_an=20.0
                    )
                    user.set_dechets(dechets)
            
            if 'finance' in user_data:
                finance_data = user_data['finance']
                try:
                    finance = Finance(
                        epargne_montant=float(finance_data.get('epargne_montant', 0)),
                        type_placement=finance_data.get('type_placement', 'livret'),
                        banque_type=finance_data.get('banque_type', 'traditionnelle'),
                        assurance_type=finance_data.get('assurance_type', 'standard'),
                        investissements_durables=finance_data.get('investissements_durables', False)
                    )
                    user.set_finance(finance)
                except Exception as e:
                    print(f"Erreur lors de la création de la finance: {e}")
                    # Créer une finance par défaut
                    finance = Finance(
                        epargne_montant=0.0,
                        type_placement='livret',
                        banque_type='traditionnelle',
                        assurance_type='standard',
                        investissements_durables=False
                    )
                    user.set_finance(finance)
            
            if 'services_publics' in user_data:
                services_data = user_data['services_publics']
                try:
                    services_publics = ServicesPublics(
                        utilisation_education=services_data.get('utilisation_education', True),
                        utilisation_sante=services_data.get('utilisation_sante', True),
                        utilisation_transport_public=services_data.get('utilisation_transport_public', False),
                        utilisation_administration=services_data.get('utilisation_administration', True),
                        utilisation_defense=services_data.get('utilisation_defense', True),
                        utilisation_infrastructure=services_data.get('utilisation_infrastructure', True)
                    )
                    user.set_services_publics(services_publics)
                except Exception as e:
                    print(f"Erreur lors de la création des services publics: {e}")
                    # Créer des services publics par défaut
                    services_publics = ServicesPublics(
                        utilisation_education=True,
                        utilisation_sante=True,
                        utilisation_transport_public=False,
                        utilisation_administration=True,
                        utilisation_defense=True,
                        utilisation_infrastructure=True
                    )
                    user.set_services_publics(services_publics)
            
            # Calculer l'empreinte totale
            empreinte_totale = user.calculer_empreinte_totale()
            repartition = user.get_repartition_empreinte()
            
            # Vérifier que le calcul a donné un résultat valide
            if empreinte_totale <= 0 or not isinstance(empreinte_totale, (int, float)) or empreinte_totale != empreinte_totale:  # NaN check
                print(f"Empreinte totale invalide: {empreinte_totale}")
                return {
                    'success': False,
                    'error': 'Calcul invalide - veuillez vérifier vos réponses'
                }
            
            # Récupérer les détails des vols si disponibles
            details_vols = {}
            if hasattr(user, 'transport') and user.transport:
                details_vols = user.transport.get_details_emissions_avion()
            
            # Inclure le détail des voitures dans la réponse
            voitures = []
            if hasattr(user, 'transport') and user.transport:
                if hasattr(user.transport, 'voitures') and user.transport.voitures:
                    voitures = user.transport.voitures
            
            # Inclure les données utilisateur brutes pour chaque catégorie
            return {
                'success': True,
                'empreinte_totale': round(empreinte_totale, 2),
                'repartition': {k: round(v, 1) for k, v in repartition.items()},
                'moyenne_francaise': 9.9,
                'details_vols': details_vols,
                'voitures': voitures,
                'logement': user_data.get('logement', {}),
                'transport': user_data.get('transport', {}),
                'alimentation': user_data.get('alimentation', {}),
                'consommation': user_data.get('consommation', {}),
                'sante': user_data.get('sante', {}),
                'travail': user_data.get('travail', {}),
                'dechets': user_data.get('dechets', {}),
                'finance': user_data.get('finance', {}),
                'services_publics': user_data.get('services_publics', {})
            }
            
        except Exception as e:
            print(f"Erreur générale lors du calcul: {e}")
            return {
                'success': False,
                'error': f'Erreur lors du calcul: {str(e)}'
            }

def run_server(port=8000):
    """Lance le serveur web"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, CarbonPrintHandler)
    print(f"🌱 Serveur CarbonPrint démarré sur http://localhost:{port}")
    print("📱 Ouvrez votre navigateur et allez sur l'URL ci-dessus")
    print("⏹️  Appuyez sur Ctrl+C pour arrêter le serveur")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
        httpd.server_close()

if __name__ == '__main__':
    run_server() 