export const imageQuestions = [
    {
      id: 1,
      image: "/images/fake_1.jpg",
      isDeepfake: true
    },
    {
      id: 2,
      image: "/images/fake_2.jpg",
      isDeepfake: true
    },
    {
      id: 3,
      image: "/images/real_1.jpg",
      isDeepfake: false
    },
    {
      id: 4,
      image: "/images/real_2.jpg",
      isDeepfake: false
    }
  ]

  export const voiceQuestions = [
    {
      id: 1,
      caller: "Yuen Kuan Moon, Group CEO of Singtel",
      isDeepfake: false,
      audio: "/audios/Singtel_real_1.mp3"
    },
    {
      id: 2,
      caller: "Arthur, Co-worker",
      isDeepfake: true,
      audio: "/audios/fake.mp3"
    }
  ]

  export const videoQuestions = [
    {
      id: 1,
      video: "/videos/deepfake_video.mp4",
      isDeepfake: true
    }
  ]