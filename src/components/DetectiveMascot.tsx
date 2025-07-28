import React from "react";

interface DetectiveMascotProps {
  reaction: "idle" | "happy" | "sad";
  hint?: string;
  showHint?: boolean;
  onClick?: () => void;
}

const avatarImages = {
  idle: "/mascot/Kid_neutral.jpg",
  happy: "/mascot/Kid_happy.jpg",
  sad: "/mascot/Kid_shocked.jpg",
  thinking: "/mascot/Kid_thinking.jpg", // Thinking face
};

const reactionClass = {
  idle: "",
  happy: "animate-bounce",
  sad: "animate-shake",
  thinking: "",
};

// Add a simple shake animation
const style = `
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.5s;
}
`;

const DetectiveMascot: React.FC<DetectiveMascotProps> = ({ reaction, hint, showHint, onClick }) => {
  // If showHint, always use thinking emoji
  const mascotImage = showHint ? avatarImages.thinking : avatarImages[reaction];
  const mascotClass = showHint ? reactionClass.thinking : reactionClass[reaction];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-24 h-24 flex flex-col items-center select-none cursor-pointer ${mascotClass}`}
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))", position: "fixed" }}
      onClick={onClick}
    >
      <style>{style}</style>
      {showHint && hint && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-1 text-sm text-gray-800 flex flex-col items-center">
          <span className="block">💡 <b>Hint:</b> {hint}</span>
          <span className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-4 h-4 bg-white border-l border-b border-gray-300 rotate-45"></span>
        </div>
      )}
      <img
        src={mascotImage}
        alt="Detective Mascot"
        className="rounded-full bg-white border-2 border-gray-300"
        draggable={false}
      />
      <span className="mt-1 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-0.5 rounded shadow">Detective Conan</span>
    </div>
  );
};

export default DetectiveMascot;