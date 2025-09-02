
import Lottie from "lottie-react";
import Notes from "../../assets/animations/Notes.json";

export default function NotesAnimation() {
  return (
    <div
      style={{ height: '100%', width: '100%' }}
      // className="w-full h-full border-rounded-5xl "
    >
      <Lottie animationData={Notes} loop />
    </div>
  )
};

