import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    title: 'Discover Amazing Deals',
    subtitle: 'Shop the best products at unbeatable prices'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    title: 'Sell with Confidence',
    subtitle: 'List your items and reach thousands of buyers'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=400&fit=crop',
    title: 'Electronics & More',
    subtitle: 'Find the latest tech and gadgets'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=400&fit=crop',
    title: 'Home & Living',
    subtitle: 'Transform your space with quality furniture'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop',
    title: 'Fashion Forward',
    subtitle: 'Explore trendy styles and accessories'
  }
]

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
        {/* Slides Container */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem]">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              {/* Image with Overlay */}
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                    <div className="max-w-xl">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 animate-fade-in">
                        {slide.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 animate-fade-in-delay">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentSlide
                  ? 'bg-white w-8 sm:w-10 h-2 sm:h-2.5'
                  : 'bg-white/50 hover:bg-white/75 w-2 sm:w-2.5 h-2 sm:h-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
          {currentSlide + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  )
}

export default ImageSlider
