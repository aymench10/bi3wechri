import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, Loader } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ChatWindow from '../components/ChatWindow'

const Messages = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [profiles, setProfiles] = useState({})

  useEffect(() => {
    fetchConversations()
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user.id])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      
      // Get all messages involving the user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, ads(title, images, price)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (messagesError) throw messagesError

      // Group messages by conversation (ad_id + other user)
      const conversationsMap = new Map()
      const userIds = new Set()

      messagesData.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        const key = `${msg.ad_id}-${otherUserId}`
        
        userIds.add(otherUserId)
        
        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            ad_id: msg.ad_id,
            ad_title: msg.ads?.title,
            ad_images: msg.ads?.images,
            ad_price: msg.ads?.price,
            other_user_id: otherUserId,
            last_message: msg.content,
            last_message_at: msg.created_at,
            is_read: msg.receiver_id === user.id ? msg.is_read : true,
            unread_count: msg.receiver_id === user.id && !msg.is_read ? 1 : 0
          })
        } else {
          const conv = conversationsMap.get(key)
          if (msg.receiver_id === user.id && !msg.is_read) {
            conv.unread_count++
          }
        }
      })

      // Fetch profiles for all other users
      if (userIds.size > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', Array.from(userIds))

        if (profilesError) throw profilesError

        const profilesMap = {}
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile
        })
        setProfiles(profilesMap)
      }

      setConversations(Array.from(conversationsMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const openChat = (conversation) => {
    setSelectedChat({
      adId: conversation.ad_id,
      otherUserId: conversation.other_user_id,
      otherUserName: profiles[conversation.other_user_id]?.full_name || 'User',
      adTitle: conversation.ad_title
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <MessageCircle className="text-primary-600" size={32} />
            <span>Messages</span>
          </h1>
          <p className="text-gray-600 mt-2">Your conversations with buyers and sellers</p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">
              When you contact sellers or receive messages, they'll appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {conversations.map((conversation, index) => {
              const otherUser = profiles[conversation.other_user_id]
              const adImage = conversation.ad_images?.[0] || 'https://via.placeholder.com/100'
              
              return (
                <div
                  key={`${conversation.ad_id}-${conversation.other_user_id}`}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    index !== conversations.length - 1 ? 'border-b' : ''
                  } ${conversation.unread_count > 0 ? 'bg-blue-50' : ''}`}
                  onClick={() => openChat(conversation)}
                >
                  <div className="flex space-x-4">
                    {/* Ad Image */}
                    <img
                      src={adImage}
                      alt={conversation.ad_title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherUser?.full_name || 'User'}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(conversation.last_message_at), {
                            addSuffix: true
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.ad_title}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${
                          conversation.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                        }`}>
                          {conversation.last_message}
                        </p>
                        
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 bg-primary-600 text-white text-xs font-bold rounded-full px-2 py-1 flex-shrink-0">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {selectedChat && (
        <ChatWindow
          adId={selectedChat.adId}
          otherUserId={selectedChat.otherUserId}
          otherUserName={selectedChat.otherUserName}
          adTitle={selectedChat.adTitle}
          onClose={() => {
            setSelectedChat(null)
            fetchConversations() // Refresh to update unread counts
          }}
        />
      )}
    </div>
  )
}

export default Messages
