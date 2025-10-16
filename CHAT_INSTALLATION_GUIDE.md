# 🚀 Guide d'Installation - Système de Chat

## Étape 1: Exécuter la Migration SQL ✅

### Dans Supabase Dashboard:

1. **Allez sur:** https://supabase.com/dashboard
2. **Sélectionnez votre projet**
3. **Cliquez sur "SQL Editor"** (dans le menu gauche)
4. **Cliquez "New Query"**
5. **Copiez tout le contenu de:** `supabase_migrations/03_chat_system.sql`
6. **Collez dans l'éditeur**
7. **Cliquez "Run"** (ou F5)

### ✅ Vérification:
```sql
-- Vérifier que la table existe
SELECT * FROM messages LIMIT 1;

-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'messages';
```

---

## Étape 2: Vérifier les Fichiers Créés ✅

### Composants:
- ✅ `src/components/ChatWindow.jsx`
- ✅ `src/components/MessageNotification.jsx`

### Pages:
- ✅ `src/pages/Messages.jsx`

### Modifications:
- ✅ `src/pages/AdDetail.jsx` (bouton chat ajouté)
- ✅ `src/components/Navbar.jsx` (notification ajoutée)
- ✅ `src/App.jsx` (route /messages ajoutée)

---

## Étape 3: Tester le Système 🧪

### Test 1: Envoyer un Message

1. **Connectez-vous** avec un compte
2. **Visitez une annonce** d'un autre utilisateur
3. **Cliquez** "Chat with Seller"
4. **Tapez un message** et envoyez
5. **✅ Le message apparaît dans le chat**

### Test 2: Recevoir une Notification

1. **Ouvrez un autre navigateur** (mode incognito)
2. **Connectez-vous** avec un autre compte
3. **Allez sur "Messages"** dans la navbar
4. **✅ Badge rouge avec le nombre de messages**
5. **Cliquez** pour voir la conversation

### Test 3: Temps Réel

1. **Gardez les 2 navigateurs ouverts**
2. **Envoyez un message** depuis le premier
3. **✅ Le message apparaît instantanément** dans le second
4. **Répondez** depuis le second
5. **✅ La réponse apparaît instantanément** dans le premier

---

## Étape 4: Vérifier l'Interface 👀

### Dans la Navbar:
```
[Logo] [Search] [My Ads] [Favorites] [Messages (2)] [Notifications] [Profile]
                                          ↑
                                    Badge rouge avec nombre
```

### Page Messages (/messages):
```
💬 Messages
Your conversations with buyers and sellers

[Image] John Doe                    2m ago
        PC de bureau i5
        Hi, I'm interested            [2]

[Image] Jane Smith                  1h ago
        iPhone 13 Pro
        Is it still available?
```

### Fenêtre de Chat:
```
┌─────────────────────────────┐
│ John Doe                [X] │
│ PC de bureau i5             │
├─────────────────────────────┤
│ Messages ici...             │
├─────────────────────────────┤
│ [Type a message...] [Send]  │
└─────────────────────────────┘
```

---

## 🎯 Fonctionnalités à Tester

### ✅ Chat en Temps Réel
- [ ] Envoyer un message
- [ ] Recevoir un message instantanément
- [ ] Scroll automatique vers le bas
- [ ] Timestamps corrects

### ✅ Notifications
- [ ] Badge apparaît avec nouveau message
- [ ] Nombre correct de messages non lus
- [ ] Badge disparaît après lecture
- [ ] Animation pulse du badge

### ✅ Liste des Conversations
- [ ] Toutes les conversations affichées
- [ ] Tri par date (plus récent en premier)
- [ ] Aperçu du dernier message
- [ ] Badge sur conversations non lues

### ✅ Intégration Annonces
- [ ] Bouton "Chat with Seller" visible
- [ ] Chat s'ouvre avec contexte correct
- [ ] Titre de l'annonce affiché
- [ ] Alternative WhatsApp disponible

---

## 🔧 Dépannage

### Problème: Messages ne s'affichent pas

**Solution:**
```sql
-- Vérifier les policies RLS
SELECT * FROM pg_policies WHERE tablename = 'messages';

-- Tester manuellement
INSERT INTO messages (ad_id, sender_id, receiver_id, content)
VALUES (
  'votre-ad-id',
  auth.uid(),
  'autre-user-id',
  'Test message'
);
```

### Problème: Badge ne se met pas à jour

**Solution:**
1. Vérifier que Supabase Realtime est activé
2. Ouvrir la console browser (F12)
3. Chercher erreurs de subscription
4. Vérifier que `receiver_id` est correct

### Problème: Chat ne s'ouvre pas

**Solution:**
1. Vérifier que `showChat` state fonctionne
2. Vérifier que `seller` existe
3. Ouvrir console pour voir erreurs
4. Vérifier import de `ChatWindow`

---

## 📊 Vérification Base de Données

### Voir tous les messages:
```sql
SELECT 
  m.id,
  m.content,
  m.is_read,
  m.created_at,
  sender.full_name as sender_name,
  receiver.full_name as receiver_name,
  a.title as ad_title
FROM messages m
JOIN profiles sender ON m.sender_id = sender.id
JOIN profiles receiver ON m.receiver_id = receiver.id
JOIN ads a ON m.ad_id = a.id
ORDER BY m.created_at DESC
LIMIT 10;
```

### Compter messages non lus par utilisateur:
```sql
SELECT 
  receiver_id,
  COUNT(*) as unread_count
FROM messages
WHERE is_read = FALSE
GROUP BY receiver_id;
```

### Voir les conversations:
```sql
SELECT * FROM conversations
ORDER BY last_message_at DESC;
```

---

## ✅ Checklist Finale

### Base de Données:
- [ ] Table `messages` créée
- [ ] Vue `conversations` créée
- [ ] RLS policies activées
- [ ] Indexes créés
- [ ] Fonctions helper créées

### Frontend:
- [ ] ChatWindow fonctionne
- [ ] MessageNotification affiche badge
- [ ] Page Messages liste conversations
- [ ] Bouton "Chat with Seller" visible
- [ ] Route /messages accessible

### Fonctionnalités:
- [ ] Envoi de messages
- [ ] Réception en temps réel
- [ ] Notifications
- [ ] Marquage comme lu
- [ ] Liste des conversations

### Tests:
- [ ] Chat entre 2 utilisateurs
- [ ] Badge de notification
- [ ] Temps réel vérifié
- [ ] Mobile responsive
- [ ] Pas d'erreurs console

---

## 🎉 Félicitations!

Si tous les tests passent, votre système de chat est **100% fonctionnel**!

### Vous avez maintenant:
✅ Chat en temps réel entre acheteurs et vendeurs  
✅ Notifications de nouveaux messages  
✅ Liste complète des conversations  
✅ Interface moderne et intuitive  
✅ Sécurité avec RLS  
✅ Performance optimisée  

**Votre marketplace est maintenant complète avec un système de messagerie professionnel!** 💬🚀

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez la console browser (F12)
2. Vérifiez les logs Supabase
3. Consultez `CHAT_SYSTEM_COMPLETE.md`
4. Testez les requêtes SQL manuellement

**Bon chat!** 💬✨
