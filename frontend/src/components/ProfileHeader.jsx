
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";

import { useAuthstore } from "../store/useauthstore";
import { useChatStore } from "../store/useChatStore";
const ProfileHeader = () => {
  const { logout, updateProfilePic, authUser } = useAuthstore()
  const { isSoundEnabled, toggledSound } = useChatStore()
  const [selectedImg, setselectedImg] = useState(null)

  const fileInputRef = useRef(null)
  const handelImageUpload = (e) => { }
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* left hand side */}
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="avatar avatar-online">
            <button className="size-14 rounded-full overflow-hidden relative group"
            onClick={()=>fileInputRef.current.click()}>
              <img src={selectedImg || authUser.profilepic || "/avatar.png"} alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute  inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>

              </div>

            </button>
            <input type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handelImageUpload}
              className="hidden"
            />
          </div>

          {/*  */}
          <div>
            {/* username and online text */}
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                {authUser.username}

            </h3>
            {/* */}
            <p className="text-slate-400">Online</p>
          </div>


        </div>

      </div>

    </div>
  )
}

export default ProfileHeader