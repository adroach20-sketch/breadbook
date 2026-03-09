import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

interface PhotoUploadProps {
  photoUrls: string[]
  onPhotosChange: (urls: string[]) => void
  maxPhotos?: number
}

export function PhotoUpload({ photoUrls, onPhotosChange, maxPhotos = 3 }: PhotoUploadProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !user) return

    const remaining = maxPhotos - photoUrls.length
    const filesToUpload = Array.from(files).slice(0, remaining)
    if (filesToUpload.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of filesToUpload) {
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage
        .from('breadbook-photos')
        .upload(filePath, file)

      if (error) {
        console.error('Photo upload failed:', error)
        continue
      }

      const { data } = supabase.storage
        .from('breadbook-photos')
        .getPublicUrl(filePath)

      newUrls.push(data.publicUrl)
    }

    onPhotosChange([...photoUrls, ...newUrls])
    setUploading(false)

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemove = (index: number) => {
    onPhotosChange(photoUrls.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Thumbnail grid */}
      {photoUrls.length > 0 && (
        <div className="flex gap-3 mb-3 flex-wrap">
          {photoUrls.map((url, i) => (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-dough">
              <img src={url} alt={`Bake photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-char/70 text-steam w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-char transition-colors"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {photoUrls.length < maxPhotos && (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-crust font-medium hover:text-crust/80 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : `+ Add photo${photoUrls.length > 0 ? '' : 's'} (${photoUrls.length}/${maxPhotos})`}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  )
}
