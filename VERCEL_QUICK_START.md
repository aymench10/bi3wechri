# ⚡ Guide Rapide - Déploiement Vercel

## 🚀 Déploiement en 5 Minutes

### Étape 1️⃣ : Préparer votre code
```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Prêt pour le déploiement Vercel"
git push
```

### Étape 2️⃣ : Aller sur Vercel
1. Ouvrez https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Login"**
3. Connectez-vous avec votre compte GitHub

### Étape 3️⃣ : Importer le projet
1. Cliquez sur **"Add New Project"**
2. Sélectionnez votre repository **"bi3wechri"**
3. Cliquez sur **"Import"**

### Étape 4️⃣ : Configurer les variables d'environnement
**⚠️ TRÈS IMPORTANT - Ne sautez pas cette étape !**

Dans la section **"Environment Variables"**, ajoutez ces 2 variables :

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://uehqemljqehbcfpxyfma.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaHFlbWxqcWVoYmNmcHh5Zm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyNTEsImV4cCI6MjA3NjExMjI1MX0.aFS-R5Vm88DSUeusNAlQrb3G1Vi4sYQhpreMJLKOeMk` |

### Étape 5️⃣ : Déployer
1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes ⏳
3. **C'est fait ! 🎉**

Votre site sera disponible à une URL comme : `https://bi3wechri.vercel.app`

---

## 🔧 Si vous avez des erreurs

### ❌ Erreur : "Missing environment variables"
**Solution** : Retournez dans Project Settings → Environment Variables et ajoutez les variables ci-dessus.

### ❌ Erreur : Build failed
**Solution** : 
1. Vérifiez les logs dans Vercel Dashboard
2. Testez localement : `npm run build`
3. Assurez-vous que `vercel.json` est présent

### ❌ Erreur 404 sur les pages
**Solution** : Le fichier `vercel.json` devrait résoudre ce problème. S'il persiste, vérifiez qu'il est bien commité dans Git.

---

## 📝 Après le déploiement

### Mises à jour automatiques
Chaque fois que vous faites un `git push`, Vercel redéploiera automatiquement ! 🔄

### Voir les logs
1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet
3. Onglet "Deployments" pour voir l'historique

### Domaine personnalisé (optionnel)
1. Project Settings → Domains
2. Ajoutez votre domaine (ex: bi3wechri.tn)

---

## ✅ Checklist Finale

Avant de déployer, vérifiez :
- [ ] Code poussé sur GitHub
- [ ] `vercel.json` présent dans le projet
- [ ] Variables d'environnement prêtes à être copiées
- [ ] Build local réussi (`npm run build` ✓)

---

**🎯 Vous êtes prêt ! Suivez les 5 étapes ci-dessus et votre site sera en ligne en quelques minutes.**

Pour plus de détails, consultez `DEPLOYMENT.md`
