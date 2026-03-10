import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOwnProfile } from '../../hooks/useCommunity'

// Username validation: lowercase, alphanumeric + underscores, 3-30 chars
const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/

export function ProfileEdit() {
  const navigate = useNavigate()
  const { profile, loading, updateProfile } = useOwnProfile()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [starterName, setStarterName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setBio(profile.bio || '')
      setStarterName(profile.starter_name || '')
      setIsPublic(profile.is_public)
    }
  }, [profile])

  const handleSave = async () => {
    setError('')
    setSuccess(false)

    if (!username.trim()) {
      setError('Username is required.')
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      setError('Username must be 3-30 characters, lowercase letters, numbers, and underscores only.')
      return
    }

    setSaving(true)
    const result = await updateProfile({
      username,
      bio: bio || null,
      starter_name: starterName || null,
      is_public: isPublic,
    })

    if (result === true) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-lg mx-auto">
        <p className="text-ash">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <h1 className="font-heading text-2xl font-bold text-char mb-6">Edit Profile</h1>

      {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 dark:text-green-400 text-sm mb-4">Profile updated!</p>}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-char mb-1">Username</label>
          <div className="flex items-center gap-1">
            <span className="text-ash text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="your_username"
              maxLength={30}
              className="flex-1 rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50"
            />
          </div>
          <p className="text-xs text-ash-muted mt-1">3-30 characters. Letters, numbers, underscores.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-char mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell other bakers about yourself..."
            rows={3}
            maxLength={200}
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-char mb-1">Starter Name</label>
          <input
            type="text"
            value={starterName}
            onChange={(e) => setStarterName(e.target.value)}
            placeholder="What do you call your starter?"
            maxLength={50}
            className="w-full rounded-lg border border-dough bg-steam px-3 py-2 text-char placeholder:text-ash/50 focus:outline-none focus:ring-2 focus:ring-wheat/50"
          />
          <p className="text-xs text-ash-muted mt-1">Every great starter has a name.</p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-dough">
          <div>
            <p className="text-sm font-medium text-char">Public Profile</p>
            <p className="text-xs text-ash">Let other bakers find you</p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isPublic ? 'bg-crust' : 'bg-dough'
            }`}
            role="switch"
            aria-checked={isPublic}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-steam transition-transform shadow-sm ${
                isPublic ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-crust text-steam py-3 rounded-xl font-medium hover:bg-crust/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full text-ash py-3 rounded-xl font-medium hover:text-char transition-colors"
        >
          Cancel
        </button>
      </div>

      {profile?.username && isPublic && (
        <p className="text-xs text-ash-muted text-center mt-4">
          Your profile: breadbook.app/@{profile.username}
        </p>
      )}
    </div>
  )
}
