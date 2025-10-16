/**
 * Plays a notification sound using Web Audio API
 * Creates a pleasant "ding" sound effect
 */
export const playNotificationSound = () => {
  try {
    // Check if AudioContext is available
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      console.warn('Web Audio API not supported')
      return
    }

    const audioContext = new AudioContext()
    
    // Create oscillator for the main tone
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Configure the sound - pleasant notification tone
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // Higher pitch
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
    
    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    // Play the sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    // Clean up
    oscillator.onended = () => {
      audioContext.close()
    }
  } catch (error) {
    console.error('Error playing notification sound:', error)
  }
}

/**
 * Plays a double notification sound for new messages
 */
export const playMessageNotificationSound = () => {
  playNotificationSound()
  setTimeout(() => {
    playNotificationSound()
  }, 150)
}
