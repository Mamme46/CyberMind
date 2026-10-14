# CyberMind

## Lancer avec Docker Compose

Après avoir cloné le dépôt, depuis la racine du projet :

```sh
docker compose up --build
```

C'est tout, aucune configuration ni installation supplémentaire n'est
nécessaire (Docker suffit). Ensuite :

- Application : http://localhost:5173
- API : http://localhost:3000

**Premier lancement :** le modèle d'IA (Llama 3, environ 4,7 Go) est
téléchargé automatiquement, ce qui peut prendre longtemps selon la connexion.
Il est ensuite conservé dans un volume Docker et ne sera plus retéléchargé.
L'IA tourne dans Docker (service `ollama`) : aucun Ollama n'est requis sur la
machine.

**Machine peu puissante :** Llama 3 demande environ 8 Go de RAM libres pour
Docker. Sur une machine plus modeste, créez un fichier `.env` à la racine
(ignoré par git) avec un modèle plus léger :

```env
OLLAMA_MODEL=qwen2.5:3b
```

Un mot de passe PostgreSQL et une clé JWT aléatoires sont aussi générés au
premier lancement et stockés dans un volume Docker (`secrets_data`). Chaque
installation a donc ses propres secrets, qui ne sont jamais dans le code ni dans
git. La base de données n'est pas exposée en dehors de Docker.

Pour tout réinitialiser (base, fichiers uploadés, modèle d'IA **et** secrets) :

```sh
docker compose down -v
```
