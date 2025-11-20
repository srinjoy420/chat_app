import React, { useRef, useState } from 'react'
import useKeyBoardSound from '../hooks/useKeyboardsound'
import { useChatStore } from '../store/useChatStore'
import toast from 'react-hot-toast'
import { ImageIcon, XIcon } from 'lucide-react'

const MessaGeInput = () => {
  const { playRandomKeystrokeSound } = useKeyBoardSound()
  const [text, settext] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { isSoundEnabled, sendMessage, selectedUser } = useChatStore()

  const handelSendMessage = async (e) => {
    e.preventDefault()
    if (!selectedUser) {
      toast.error("Please select a user to send message")
      return
    }
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeystrokeSound()

    await sendMessage({
      text: text.trim(),
      image: imagePreview
    })
    settext("")
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""



  };
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file)
  }
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }
  const isDisabled = !selectedUser || (!text.trim() && !imagePreview)

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handelSendMessage} className='max-w-3xl mx-auto flex space-x-4'>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            settext(e.target.value);
            isSoundEnabled && playRandomKeystrokeSound();
          }}
          disabled={!selectedUser}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={selectedUser ? "Type your message..." : "Select a user to start chatting..."}
        />
        {/* this is hidden basically it when someone wants to share the image */}
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={!selectedUser}
          className='hidden'
        />
        <button
          type='button'
          onClick={()=>fileInputRef.current?.click()}
          disabled={!selectedUser}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            imagePreview ? "text-cyan-500" : ""
          }`}>
          <ImageIcon className='w-5 h-5'/>
        </button>
        <button
          type='submit'
          disabled={isDisabled}
          className='bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 transition-colors'
        >
          Send
        </button>

      </form>



    </div>
  )
}

export default MessaGeInput