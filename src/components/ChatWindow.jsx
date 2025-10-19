import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Send, X, Loader } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { playMessageNotificationSound } from '../lib/notificationSound'

const ChatWindow = ({ adId, otherUserId, otherUserName, adTitle, onClose }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const channelRef = useRef(null)

  useEffect(() => {
    if (adId && otherUserId) {
      fetchMessages()
      markMessagesAsRead()
      
      // Create and store channel reference
      const channelName = `chat:${adId}:${Math.min(user.id, otherUserId)}:${Math.max(user.id, otherUserId)}`
      channelRef.current = supabase.channel(channelName)
      
      // Subscribe to new messages and typing status
      channelRef.current
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `ad_id=eq.${adId}`
          },
          (payload) => {
            const newMsg = payload.new
            if (
              (newMsg.sender_id === user.id && newMsg.receiver_id === otherUserId) ||
              (newMsg.sender_id === otherUserId && newMsg.receiver_id === user.id)
            ) {
              // Only add if not already in the list (avoid duplicates from optimistic updates)
              setMessages(prev => {
                const exists = prev.some(msg => 
                  msg.id === newMsg.id || 
                  (msg.content === newMsg.content && 
                   msg.sender_id === newMsg.sender_id && 
                   Math.abs(new Date(msg.created_at) - new Date(newMsg.created_at)) < 2000)
                )
                if (exists) return prev
                
                // Play notification sound for incoming messages only
                if (newMsg.sender_id === otherUserId) {
                  playMessageNotificationSound()
                }
                
                return [...prev, newMsg]
              })
              
              if (newMsg.receiver_id === user.id) {
                markMessageAsRead(newMsg.id)
              }
            }
          }
        )
        .on('broadcast', { event: 'typing' }, (payload) => {
          if (payload.payload.userId === otherUserId) {
            setIsOtherUserTyping(payload.payload.isTyping)
            
            // Auto-hide typing indicator after 3 seconds
            if (payload.payload.isTyping) {
              setTimeout(() => setIsOtherUserTyping(false), 3000)
            }
          }
        })
        .subscribe()

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe()
        }
      }
    }
  }, [adId, otherUserId, user.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOtherUserTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('ad_id', adId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('ad_id', adId)
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', user.id)
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    // Send typing indicator using stored channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: e.target.value.length > 0 }
      })
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Stop typing indicator after 1 second of no typing
      typingTimeoutRef.current = setTimeout(() => {
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: user.id, isTyping: false }
          })
        }
      }, 1000)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    // Stop typing indicator using stored channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: false }
      })
    }

    const messageContent = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    
    // Optimistic UI update - add message immediately
    const optimisticMessage = {
      id: tempId,
      ad_id: adId,
      sender_id: user.id,
      receiver_id: otherUserId,
      content: messageContent,
      is_read: false,
      created_at: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      setSending(true)
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ad_id: adId,
          sender_id: user.id,
          receiver_id: otherUserId,
          content: messageContent
        })
        .select()
        .single()

      if (error) throw error
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? data : msg)
      )
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
      alert('Failed to send message. Please try again.')
      setNewMessage(messageContent) // Restore message
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-80 md:w-96 h-[85vh] sm:h-[500px] md:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 sm:p-4 sm:rounded-t-2xl flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{otherUserName}</h3>
          {isOtherUserTyping ? (
            <p className="text-xs text-green-300 flex items-center space-x-1">
              <span className="inline-block w-1 h-1 bg-green-300 rounded-full animate-pulse"></span>
              <span className="font-medium">typing...</span>
            </p>
          ) : (
            <p className="text-xs text-blue-100 truncate">{adTitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="animate-spin text-primary-600" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center">No messages yet</p>
            <p className="text-sm text-center mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSender = message.sender_id === user.id
            return (
              <div
                key={message.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 ${
                    isSender
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isSender ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        
        {/* Typing Indicator */}
        {isOtherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t bg-white sm:rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {sending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow
