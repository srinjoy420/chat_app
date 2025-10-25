
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, LoaderIcon } from "lucide-react";

import { useAuthstore } from "../store/useauthstore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound=new Audio("/sounds/mouse-click.mp3")
const ProfileHeader = () => {
  const { logout, updateProfilePic, authUser, isUpdatingProfilepic } = useAuthstore()
  const { isSoundEnabled, toggledSound } = useChatStore()
  const [selectedImg, setselectedImg] = useState(null)

  const fileInputRef = useRef(null)
  
  // Helper function to compress image
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height
              height = maxWidth
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          resolve(compressedBase64)
        }
      }
    })
  }
  
  // Image upload handler with compression
  const handelImageUpload = async (e) => { 
    const file = e.target.files[0]
    if(!file) return

    try {
      // Compress the image first
      const compressedImage = await compressImage(file, 800, 0.8)
      setselectedImg(compressedImage)
      
      // Call the updateProfilePic function to save to the server
      const result = await updateProfilePic(compressedImage)
      
      if(result.success) {
        // Image updated successfully, authUser will be updated automatically
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* left hand side */}
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="avatar avatar-online">
            <button 
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={()=>!isUpdatingProfilepic && fileInputRef.current.click()}
              disabled={isUpdatingProfilepic}
            >
              <img 
                src={selectedImg || authUser?.profilepic || "/avatar.png"} 
                alt="User image"
                className="size-full object-cover"
              />
              {isUpdatingProfilepic && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LoaderIcon className="size-5 text-white animate-spin" />
                </div>
              )}
              {!isUpdatingProfilepic && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              )}
            </button>
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handelImageUpload}
              className="hidden"
              disabled={isUpdatingProfilepic}
            />
          </div>

          {/*  */}
          <div>
            {/* username and online text */}
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                {authUser?.username || "Loading..."}

            </h3>
            {/* */}
            <p className="text-slate-400">Online</p>
          </div>


        </div>

        {/* buttons */}
        <div className="flex gap-4 items-center">
            {/* logout button */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={logout}
            >
              <LogOutIcon className="size-5"/>
            </button>

            {/* sound toggle btn */}
           <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggledSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          

        </div>

      </div>

    </div>
  )
}

export default ProfileHeader