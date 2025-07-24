"use client"

interface ProfileMenuProps {
  points: number
  onClose: () => void
  onGoToLeaderboard: () => void
  onResetPoints: () => void
}

export function ProfileMenu({ points, onClose, onGoToLeaderboard, onResetPoints }: ProfileMenuProps) {
  return (
    <div className="absolute right-4 top-14 bg-white rounded shadow-lg w-64 z-50 p-4">
      <div className="mb-4">
        <div className="font-bold text-lg mb-1">Profile</div>
        <div className="text-gray-700">Username: Alice</div>
        <div className="text-gray-700">Points: {points}</div>
      </div>
      <div className="mb-4">
        <button
          className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={onGoToLeaderboard}
        >
          Leaderboard
        </button>
      </div>
      <button
        className="w-full mb-2 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        onClick={onResetPoints}
      >
        Reset Points
      </button>
      <button className="w-full mt-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition" onClick={onClose}>
        Close
      </button>
    </div>
  )
} 