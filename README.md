# Epytodo
Manipulation of an SQL table using NodeJS

L'idée du projet est de créer une liste de tâches.  
Nous nous concentrerons principalement sur le côté « backend » du projet.

Dans ce projet il y a :
- une database SQL
- un serveur utilisant Node.js

Voici l'architecture des fichiers mis en place pour le projet  

<p align="center">
  <img src="https://github.com/MikaelVallenet/EpyTodo/raw/main/assets/archi.png" alt="achitecture de fichiers">
</p>

Voici une liste de toutes les routes que ce projet contient.  
route | method | protection | description
------|--------|------------|------------
/register|POST|non|enregistrer un nouvel utilisateur
/login|POST|non|connecte un utilisateur
/user|GET|oui|affiche toutes les informations d'un utilisateur
/user/todos|GET|oui|affiche toutes les tâches utilisateur
/users/:id ou :email|GET|oui|affiche les informations d'un utilisateur
/users/:id|PUT|oui|mets à jour les informations d'un utilisateur
/users/:id|DELETE|oui|supprime l'utilisateur
/todos|GET|oui|affiche toutes les tâches
/todos/:id|GET|oui|affiche la tache
/todos|POST|oui|crée une tâche
/todos/:id|PUT|oui|mets à jour une tâche
/todos/:id|DELETE|oui|supprime une tâche

Dans ce projet, les routes sont protéjéent et accessible uniquement aux utilisateurs connectés.  
Pour ce faire, les routes protégées recevent un JWT (JSON Web Token) valide dans l'en-tête.
