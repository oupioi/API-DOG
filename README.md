# PROJET 3 - DOG APP

Projet de fin d'études (Concépteur & Développeur de Nouvelles Technologies) fait par Maxence OPIGEZ, Florian DESMARCHELIER et Théo FOLQUIN.

### Commandes passées pour créer le projet

Pour faire le package.json:
```
npm init -y
```

Pour installer typescript:
```
npm install -D typescript
```
```
npm install -D ts-node
```
Pour installer nodemon (qui va rebuil l'api à chaque modif):
```
npm install -D nodemon
```

## Fonctionnement

Commande pour lancer l'api (exécutée automatiquement au lancement du docker):
```
npm start
```

## Vérifier que la connexion à la base de données fonctionne correctement

```http
POST http://localhost:3000/sex
```

```json
{
    "name": "Homme"
}
```
Normalement vous avez un response code de "201 Created" et si vous verifiez la table Sex, il sera créé.
