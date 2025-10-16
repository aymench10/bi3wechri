# 🚀 Guide de Déploiement sur Vercel

## Prérequis
- Un compte Vercel (gratuit) : https://vercel.com
- Git installé sur votre machine
- Votre projet poussé sur GitHub, GitLab ou Bitbucket

## 📋 Étapes de Déploiement

### Option 1 : Déploiement via l'Interface Web Vercel (Recommandé)

1. **Connectez-vous à Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec votre compte GitHub/GitLab/Bitbucket

2. **Importez votre projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez votre repository `bi3wechri`
   - Cliquez sur "Import"

3. **Configurez les variables d'environnement**
   - Dans la section "Environment Variables", ajoutez :
     ```
     VITE_SUPABASE_URL=https://uehqemljqehbcfpxyfma.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaHFlbWxqcWVoYmNmcHh5Zm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyNTEsImV4cCI6MjA3NjExMjI1MX0.aFS-R5Vm88DSUeusNAlQrb3G1Vi4sYQhpreMJLKOeMk
     ```

4. **Déployez**
   - Vercel détectera automatiquement que c'est un projet Vite
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes pour le build

5. **Votre site est en ligne ! 🎉**
   - Vous recevrez une URL comme : `https://bi3wechri.vercel.app`

### Option 2 : Déploiement via CLI Vercel

1. **Installez Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous**
   ```bash
   vercel login
   ```

3. **Déployez depuis le dossier du projet**
   ```bash
   cd "c:\Users\Chebili\Documents\Nouveau dossier\bi3wechri"
   vercel
   ```

4. **Suivez les instructions**
   - Confirmez le nom du projet
   - Confirmez les paramètres
   - Vercel déploiera automatiquement

5. **Ajoutez les variables d'environnement**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

6. **Redéployez avec les variables**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Automatique

Le fichier `vercel.json` est déjà configuré avec :
- ✅ Build command : `npm run build`
- ✅ Output directory : `dist`
- ✅ Framework : Vite
- ✅ Rewrites pour React Router (SPA)
- ✅ Cache optimisé pour les assets

## ⚠️ Points Importants

### Variables d'Environnement
**IMPORTANT** : N'oubliez pas d'ajouter vos variables d'environnement dans Vercel :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Sans ces variables, votre application ne pourra pas se connecter à Supabase !

### Domaine Personnalisé (Optionnel)
1. Allez dans les paramètres de votre projet sur Vercel
2. Section "Domains"
3. Ajoutez votre domaine personnalisé

## 🐛 Résolution des Problèmes Courants

### Erreur : "Missing Supabase environment variables"
**Solution** : Ajoutez les variables d'environnement dans Vercel Dashboard
- Project Settings → Environment Variables
- Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Redéployez

### Erreur 404 sur les routes
**Solution** : Le fichier `vercel.json` contient déjà les rewrites nécessaires.
Si le problème persiste, vérifiez que le fichier est bien présent.

### Build échoue
**Solution** :
1. Vérifiez que `package.json` contient bien le script `build`
2. Testez localement : `npm run build`
3. Vérifiez les logs d'erreur dans Vercel Dashboard

### Erreurs de dépendances
**Solution** :
```bash
# Supprimez node_modules et package-lock.json
rm -rf node_modules package-lock.json
# Réinstallez
npm install
# Testez le build
npm run build
```

## 📱 Déploiements Automatiques

Une fois configuré, Vercel redéploiera automatiquement votre site à chaque :
- Push sur la branche `main` (production)
- Push sur d'autres branches (preview deployments)

## 🔗 Liens Utiles

- Documentation Vercel : https://vercel.com/docs
- Documentation Vite : https://vitejs.dev/guide/
- Support Vercel : https://vercel.com/support

## ✅ Checklist Avant Déploiement

- [ ] Code poussé sur Git (GitHub/GitLab/Bitbucket)
- [ ] Fichier `vercel.json` présent
- [ ] Variables d'environnement notées
- [ ] Build local réussi (`npm run build`)
- [ ] Compte Vercel créé

---

**Besoin d'aide ?** Consultez les logs de build dans le Vercel Dashboard pour plus de détails sur les erreurs.
