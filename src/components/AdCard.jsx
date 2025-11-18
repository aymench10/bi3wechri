import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const AdCard = ({ ad }) => {
  const imageUrl = ad.images && ad.images.length > 0 
    ? ad.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image'

  return (
    <Link 
      to={`/ads/${ad.id}`} 
      className="group card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <img 
          src={imageUrl} 
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
        {/* Category Badge - Premium Style */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center space-x-1 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 hover:bg-white transition-colors">
            <Tag size={12} />
            <span>{ad.category}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
          {ad.title}
        </h3>

        {/* Price - Enhanced Gradient */}
        <div className="mb-3 sm:mb-4">
          <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 bg-clip-text text-transparent">
            {ad.price.toLocaleString()} TND
          </p>
        </div>

        {/* Location & Time - Improved Layout */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 font-medium">
            <div className="icon-container-neutral mr-2.5 flex-shrink-0">
              <MapPin size={14} />
            </div>
            <span className="truncate">{ad.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 font-medium">
            <div className="icon-container-neutral mr-2.5 flex-shrink-0">
              <Calendar size={14} />
            </div>
            <span className="truncate">{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AdCard
