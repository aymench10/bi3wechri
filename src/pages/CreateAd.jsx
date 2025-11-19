import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Upload, X, ChevronLeft, ChevronRight, Check, FileText, Image, MapPin, DollarSign } from 'lucide-react'

const CATEGORIES = [
  'Informatique et Multimedia',
  'Vehicles',
  'Immobilier',
  'Furniture',
  'Fashion',
  'Jobs',
  'Services',
  'Other'
]

const LOCATIONS = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Medenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili'
]

const CreateAd = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    location: LOCATIONS[0],
  })

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Images', icon: Image },
    { number: 4, title: 'Review', icon: Check }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      
      if (!isValidType) {
        setError('Only image files are allowed')
        return false
      }
      if (!isValidSize) {
        setError('Image size must be less than 5MB')
        return false
      }
      return true
    })

    if (imageFiles.length + validFiles.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    setImageFiles(prev => [...prev, ...validFiles])
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateStep = (step) => {
    setError('')
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          setError('Title is required')
          return false
        }
        if (formData.title.length < 5) {
          setError('Title must be at least 5 characters')
          return false
        }
        return true
      
      case 2:
        if (!formData.description.trim()) {
          setError('Description is required')
          return false
        }
        if (formData.description.length < 20) {
          setError('Description must be at least 20 characters')
          return false
        }
        if (!formData.price || formData.price <= 0) {
          setError('Please enter a valid price')
          return false
        }
        return true
      
      case 3:
        if (imageFiles.length === 0) {
          setError('Please add at least one image')
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    try {
      setLoading(true)
      setError('')

      // Upload images to Supabase Storage
      const imageUrls = []
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        console.log('Uploading image:', filePath)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('ad-images')
          .getPublicUrl(filePath)

        console.log('Image uploaded:', publicUrl)
        imageUrls.push(publicUrl)
      }

      console.log('All images uploaded:', imageUrls)

      // Create ad in database with 'pending' status for admin approval
      const { data, error: insertError } = await supabase
        .from('ads')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            location: formData.location,
            images: imageUrls,
            status: 'pending'
          }
        ])
        .select()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Failed to create ad: ${insertError.message}`)
      }

      console.log('Ad created successfully:', data)
      // Show success message and redirect
      alert('Ad published successfully! It will appear after admin approval.')
      navigate('/my-ads')
    } catch (error) {
      console.error('Error creating ad:', error)
      setError(error.message || 'Failed to create ad. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">Create New Ad</h1>
          <p className="text-gray-600 font-medium text-lg">Follow the steps to list your item</p>
        </div>

        {/* Progress Steps - Modern Design */}
        <div className="card p-6 sm:p-8 mb-8 sm:mb-10 bg-gradient-to-r from-white to-gray-50 border-b-4 border-primary-600">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 shadow-md ${
                      currentStep > step.number
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-110'
                        : currentStep === step.number
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check size={24} />
                    ) : (
                      <step.icon size={24} />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-xs sm:text-sm font-bold transition-colors ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden text-lg">{step.number}</span>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1.5 flex-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message - Modern Style */}
        {error && (
          <div className="mb-8 p-4 sm:p-5 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-xl font-bold shadow-md">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="card p-8 sm:p-10 mb-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600 font-medium text-lg">Let's start with the basics of your ad</p>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3">
                  Ad Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 13 Pro Max 256GB"
                  className="input-field"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Details & Pricing</h2>
                <p className="text-gray-600 font-medium text-lg">Provide more details about your item</p>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Describe your item in detail..."
                  className="input-field"
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (TND) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Add Images</h2>
                <p className="text-gray-600 font-medium text-lg">Upload up to 5 images of your item</p>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-4">
                  Images * (Max 5, up to 5MB each)
                </label>
                
                {/* Upload Area - Modern Design */}
                <div className="border-2 border-dashed border-primary-300 rounded-2xl p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 bg-gradient-to-br from-primary-50/50 to-transparent">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                    disabled={imageFiles.length >= 5}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer block ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-4">
                      <Upload className="text-primary-600" size={32} />
                    </div>
                    <p className="text-gray-900 font-bold text-lg mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>

                {/* Image Previews - Modern Cards */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        >
                          <X size={18} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Review Your Ad</h2>
                <p className="text-gray-600 font-medium text-lg">Make sure everything looks good before publishing</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 space-y-6 border border-gray-100">
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider">Title</h3>
                  <p className="text-2xl font-black text-gray-900">{formData.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                  <div>
                    <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider">Category</h3>
                    <p className="text-lg font-bold text-primary-600">{formData.category}</p>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider">Location</h3>
                    <p className="text-lg font-bold text-primary-600">{formData.location}</p>
                  </div>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider">Description</h3>
                  <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{formData.description}</p>
                </div>

                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wider">Price</h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{formData.price} TND</p>
                </div>

                <div>
                  <h3 className="font-black text-gray-700 mb-4 text-sm uppercase tracking-wider">Images ({imageFiles.length})</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Modern Design */}
        <div className="flex justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all"
          >
            <ChevronLeft size={22} />
            <span>Previous</span>
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="btn-primary flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              <span>Next</span>
              <ChevronRight size={22} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check size={22} />
                  <span>Publish Ad</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateAd
