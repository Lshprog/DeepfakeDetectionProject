import { Hina_Mincho } from "next/font/google"

export const imageQuestions = [
    {
      id: 1,
      image: "/images/fake_1.jpg",
      isDeepfake: true,
      hint: "Notice anything wrong with the eyes?"
    },
    {
      id: 2,
      image: "/images/fake_2.jpg",
      isDeepfake: true,
      hint: "Look closely at the eyes of the person on the right."
    },
    {
      id: 3,
      image: "/images/real_1.jpg",
      isDeepfake: false, 
      hint: "hmmm... is there anything wrong with this image?"
    },
    {
      id: 4,
      image: "/images/real_2.jpg",
      isDeepfake: false, 
      hint: "Is this image too good to be true? "
    }
  ]

  export const voiceQuestions = [
    {
      id: 1,
      caller: "Yuen Kuan Moon, Group CEO of Singtel",
      isDeepfake: false,
      audio: "/audios/Singtel_real_1.mp3", 
      hint: "Can you recognise your CEO's voice?"
    },
    {
      id: 2,
      caller: "Arthur, Co-worker",
      isDeepfake: true,
      audio: "/audios/fake.mp3", 
      hint: "Come on, this one is too obvious!"
    }
  ]

  export const videoQuestions = [
    {
      id: 1,
      video: "/videos/deepfake_video.mp4",
      isDeepfake: true, 
      hint: "Notice anything wrong with his expressions?"
    }
  ]