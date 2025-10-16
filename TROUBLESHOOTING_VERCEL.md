# 🔧 Résolution des Problèmes Vercel

## Problèmes Courants et Solutions

### 🚨 Erreur : "Missing Supabase environment variables"

**Symptôme** : Le site se charge mais affiche une erreur ou une page blanche.

**Cause** : Les variables d'environnement ne sont pas configurées dans Vercel.

**Solution** :
1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet
3. Settings → Environment Variables
4. Ajoutez :
   - `VITE_SUPABASE_URL` = `https://uehqemljqehbcfpxyfma.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (voir `.env.example`)
5. Cliquez sur "Redeploy" dans l'onglet Deployments

---

### 🚨 Erreur : Build Failed

**Symptôme** : Le déploiement échoue avec une erreur de build.

**Solutions** :

#### Solution 1 : Vérifier localement
```bash
# Testez le build localement
npm run build

# Si ça échoue, corrigez les erreurs
# Si ça marche, le problème vient de Vercel
```

#### Solution 2 : Vérifier les dépendances
```bash
# Nettoyez et réinstallez
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Solution 3 : Vérifier les logs Vercel
1. Allez dans Deployments
2. Cliquez sur le déploiement qui a échoué
3. Lisez les logs d'erreur
4. Cherchez la ligne avec "ERROR" ou "Failed"

---

### 🚨 Erreur 404 sur les routes (ex: /messages, /post-ad)

**Symptôme** : La page d'accueil fonctionne mais les autres pages donnent une erreur 404.

**Cause** : Vercel ne sait pas comment gérer les routes React Router.

**Solution** :
1. Vérifiez que `vercel.json` existe dans votre projet
2. Vérifiez qu'il contient :
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Commitez et poussez le fichier :
   ```bash
   git add vercel.json
   git commit -m "Fix: Add vercel.json for SPA routing"
   git push
   ```

---

### 🚨 Erreur : "Command not found: vite"

**Symptôme** : Build échoue avec "vite: command not found".

**Solution** :
1. Vérifiez que `vite` est dans `devDependencies` de `package.json`
2. Si absent, ajoutez-le :
   ```bash
   npm install --save-dev vite
   git add package.json package-lock.json
   git commit -m "Add vite to devDependencies"
   git push
   ```

---

### 🚨 Page blanche après déploiement

**Symptôme** : Le site se déploie sans erreur mais affiche une page blanche.

**Solutions** :

#### Solution 1 : Vérifier la console du navigateur
1. Ouvrez votre site déployé
2. Appuyez sur F12 (DevTools)
3. Allez dans l'onglet Console
4. Cherchez les erreurs en rouge

#### Solution 2 : Vérifier les variables d'environnement
- Assurez-vous que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont bien configurées

#### Solution 3 : Vérifier le chemin de base
Dans `vite.config.js`, vérifiez qu'il n'y a pas de `base` configuré incorrectement :
```javascript
export default defineConfig({
  plugins: [react()],
  // Ne devrait PAS avoir de base: '/something/'
})
```

---

### 🚨 Erreur : "Failed to fetch" ou erreurs réseau

**Symptôme** : Erreurs de connexion à Supabase.

**Solutions** :

#### Solution 1 : Vérifier les variables d'environnement
```bash
# Dans Vercel Dashboard, vérifiez que les variables sont bien définies
# Elles doivent commencer par VITE_ pour être accessibles côté client
```

#### Solution 2 : Vérifier les CORS Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Settings → API
4. Vérifiez que l'URL de votre site Vercel est autorisée

---

### 🚨 Erreur : "Too many requests" ou Rate Limiting

**Symptôme** : Le site fonctionne puis s'arrête après plusieurs requêtes.

**Cause** : Vous avez atteint les limites du plan gratuit Supabase.

**Solution** :
1. Vérifiez votre usage sur Supabase Dashboard
2. Optimisez vos requêtes (ajoutez du caching)
3. Considérez un upgrade si nécessaire

---

### 🚨 Images ne se chargent pas

**Symptôme** : Les images des annonces ne s'affichent pas.

**Solutions** :

#### Solution 1 : Vérifier les URLs des images
- Les images doivent être des URLs complètes (https://...)
- Pas de chemins relatifs pour les images externes

#### Solution 2 : Vérifier Supabase Storage
1. Allez sur Supabase Dashboard → Storage
2. Vérifiez que le bucket est public
3. Vérifiez les permissions RLS

---

### 🚨 Déploiement très lent

**Symptôme** : Le build prend plus de 5 minutes.

**Solutions** :

#### Solution 1 : Vérifier la taille de node_modules
```bash
# Ajoutez un .vercelignore si pas déjà fait
# Il devrait contenir :
node_modules
*.test.js
*.spec.js
```

#### Solution 2 : Optimiser les dépendances
- Supprimez les dépendances inutilisées
- Utilisez des imports spécifiques au lieu de tout importer

---

### 🚨 Erreur : "Function execution timed out"

**Symptôme** : Certaines pages prennent trop de temps à charger.

**Solution** :
- Vercel Free a une limite de 10 secondes pour les Serverless Functions
- Optimisez vos requêtes Supabase
- Ajoutez de la pagination
- Utilisez des index dans votre base de données

---

## 🔍 Commandes de Diagnostic

### Vérifier la configuration
```bash
npm run deploy-check
```

### Tester le build localement
```bash
npm run build
npm run preview
```

### Voir les logs Vercel
```bash
vercel logs [deployment-url]
```

---

## 📞 Obtenir de l'Aide

### Logs Vercel
1. Dashboard → Votre Projet → Deployments
2. Cliquez sur le déploiement
3. Onglet "Build Logs" ou "Function Logs"

### Console du Navigateur
1. F12 sur votre site
2. Onglet Console
3. Cherchez les erreurs en rouge

### Supabase Logs
1. Supabase Dashboard → Logs
2. Filtrez par erreurs

---

## ✅ Checklist de Dépannage

Quand quelque chose ne marche pas :

- [ ] Le build local fonctionne ? (`npm run build`)
- [ ] Les variables d'environnement sont configurées dans Vercel ?
- [ ] Le fichier `vercel.json` est présent et commité ?
- [ ] Les logs Vercel montrent des erreurs ?
- [ ] La console du navigateur montre des erreurs ?
- [ ] Supabase est accessible et configuré correctement ?
- [ ] Les permissions RLS sont correctes ?

---

## 🆘 Dernier Recours

Si rien ne fonctionne :

1. **Supprimez le projet de Vercel**
2. **Nettoyez votre projet local** :
   ```bash
   rm -rf node_modules dist .vercel
   npm install
   npm run build
   ```
3. **Recommencez le déploiement** en suivant `VERCEL_QUICK_START.md`

---

**💡 Astuce** : La plupart des problèmes viennent des variables d'environnement manquantes ou du fichier `vercel.json` absent !
