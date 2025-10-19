# Enable Realtime for Messages

## Problem
Messages are not appearing in real-time when the other user sends them. The typing indicator works but messages don't sync.

## Solution
You need to enable Realtime replication for the `messages` table in Supabase.

### Steps to Enable Realtime:

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard

2. **Navigate to Database > Replication**
   - Click on "Database" in the left sidebar
   - Click on "Replication"

3. **Enable Realtime for messages table**
   - Find the `messages` table in the list
   - Toggle the switch to **ON** for the `messages` table
   - This enables real-time updates for INSERT, UPDATE, and DELETE operations

4. **Alternative: Using SQL**
   If you prefer SQL, run this in the SQL Editor:
   ```sql
   -- Enable realtime for messages table
   alter publication supabase_realtime add table messages;
   ```

5. **Verify**
   - After enabling, refresh your application
   - Open two browser windows/tabs with different users
   - Send a message from one user
   - The message should appear instantly in the other user's chat

### What This Does:
- Enables PostgreSQL's logical replication for the `messages` table
- Allows Supabase Realtime to broadcast INSERT events
- Makes messages appear instantly without page refresh

### Current Status:
- ✅ Typing indicator works (uses broadcast channel)
- ❌ Messages not syncing in real-time (needs replication enabled)
- ✅ Messages appear after page refresh (database working)

### After Enabling:
Both users will see:
1. Real-time typing indicator ("typing...")
2. Messages appearing instantly when sent
3. No need to refresh the page
