-------- CHESSGAME --------
---------------------------

1. Créer les fichiers :

                      - index.html (Accueil)
                      - matchList.html (Liste de match)
                      - game.html (Plateau de jeu)
                      - results.html (Fin du jeux)

                      1.1 :
                      - singin.html (Création du compte)
                      - change.html (Changement de mot de passe)
                      - profile.html (Profil)
                      - newMatch.html (Nouveau Match)

                      1.2 :   
                      - Créer un CSS global avec une création du doissier assets.
                      - Format mobile.
                      - Créer un main.js.

-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------

2. Navigation JS Principal :

                (2) : Création de la constante - connexion (Dans la page index).
                      Création de la constante - startGame (Dans la page matchList).

                SI (l'index ramene à listMatch) {
                    connexion = true
                } SINON{
                    RETOUR à singin
                };

                SI (index + connexion = false || singin = false) {
                    RETOUR à change
                } SINON{
                    RETOUR à index
                };

                SI (startGame = true) {
                    matchList REVOIE à game
                } SINON {
                    matchListe RENVOIE à newMatch
                };    

    2.1 Navigation JS secondaire :

        SI (p1 = victoire OU p1 = défaite ou p1 = abandon) {
            relsuts = matchList
            RETOURNE à results
        }SINON {
            results RETOURNE à index
        }

        SI ( clicker sur btnProfil = true) {
            btnProfil RETOURNE à profils
        }SINON {
            return ne fais rien 
        }

-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------
