# QuizDevOps

1. Comment définiriez-vous le Devops ?
DevOps est une philosophie, il permet d'automatiser des tests et la mise en production d'un projet.
Il permet la collaboration entre les développeur et les infra.

2. Qu’impose le Devops ?
Le DevOps impose d'automatiser le maximum de processus de développement possible, comme les test le déploiement etc.

3. Quels sont les inconvénients ou les faiblesses du Devops ?
Une démarche DevOps peux être compliqué à mettre en place au début, avec également la complexité des outils a la première utilisation

4. Quel est votre avis sur le Devops ?
Je trouve que DevOps est une bonne approche, ça permet une meilleurs communication entre les équipe de développemet et les équipe d'infra.
Ca permet également un rendu plus fiable et plus rapide.

5. Quels sont les tests primordiaux pour toute application ?
Les test primordiaux pour une application sont :
- Les tests unitaire
- Les test fonctionnel
- Les test d'intégration
- Tests de régression
- Tests de sécurité

Requête API (Les principal):

Créer un Quiz (http://localhost:8080/api/quiz) POST:
{
  "theme": "Histoire",
  "questions": [
    {
      "questionText": "Qui a découvert l'Amérique ?",
      "options": [
        { "text": "Christophe Colomb", "isCorrect": true },
        { "text": "Napoléon", "isCorrect": false },
        { "text": "Jules César", "isCorrect": false }
      ]
    },
    {
      "questionText": "En quelle année la Révolution française a-t-elle commencé ?",
      "options": [
        { "text": "1789", "isCorrect": true },
        { "text": "1492", "isCorrect": false },
        { "text": "1914", "isCorrect": false }
      ]
    }, 
     {
      "questionText": "En quelle année la Révolution française a-t-elle commencé ?",
      "options": [
        { "text": "1789", "isCorrect": true },
        { "text": "1492", "isCorrect": false },
        { "text": "1914", "isCorrect": false }
      ]
    }
  ]
}

Répondre à un quiz (http://localhost:8080/api/quiz/1/submit) POST :
Change les id des question ID seulont leurs numéro et selon le formulaire
{
  "answers": [
    { "questionId": 1, "selectedOption": "Christophe Colomb" },
    { "questionId": 2, "selectedOption": "1789" },
    { "questionId": 3, "selectedOption": "1492" }
  ]
}

POST : Créer un user (http://localhost:8080/api/users/) :
{
  "username": "admin_jane",
  "email": "jane@example.com",
  "password": "adminPass456",
  "role": "administrateur"
}

GET : Nombre de fois ou le quiz a été fait (http://localhost:8080/api/attempts/quiz/1)

Ce que j'ai pu faire :
Création back des quiz avec persistance
Création back pour répondre aux quiz
Calcul automatique de la note du quiz
Mise en production sur DockerHub (CD ici)
Ajout des utilisateurs créateur de quiz (pass non chiffré) Par role
Ajout de l’administrateur (pass non chiffré) Par role
Ajout des joueurs aux quiz (pass non chiffré) Par role
Suivi des réponse par quiz mais pas par utilisateur
