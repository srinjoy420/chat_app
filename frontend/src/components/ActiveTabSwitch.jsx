import React from 'react'
import { useChatStore } from '../store/useChatStore'

export const ActiveTabSwitch = () => {
  const { activeTab, setactiveTab } = useChatStore()
  return (
<div className="tabs tabs-boxed bg-transparent p-2 m-2 flex gap-6">
  <button
    onClick={() => setactiveTab("chats")}
    className={`tab transition-colors ${
      activeTab === "chats"
        ? "tab-active bg-cyan-500/20 text-white border-b-2 border-cyan-400"
        : "text-white/70 hover:text-white"
    }`}
  >
    Chats
  </button>

  <button
    onClick={() => setactiveTab("contacts")}
    className={`tab transition-colors ${
      activeTab === "contacts"
        ? "tab-active bg-cyan-500/20 text-white border-b-2 border-cyan-400"
        : "text-white/70 hover:text-white"
    }`}
  >
    Contacts
  </button>
</div>


  )
}
