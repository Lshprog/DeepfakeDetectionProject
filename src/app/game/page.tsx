"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, Video, CheckCircle, XCircle, Play, Target, Image as ImageIcon } from "lucide-react"
import { imageQuestions, voiceQuestions, videoQuestions } from "./questions"
import DetectiveMascot from "@/components/DetectiveMascot";
import Head from "next/head";

type GameSection = "intro" | "image" | "voice" | "video" | "results"
type Answer = "real" | "fake" | null

interface GameState {
  currentSection: GameSection
  score: number
  totalQuestions: number
  currentQuestion: number
  answers: Answer[]
}

export default function GamePage() {
  const router = useRouter()
  useEffect(() => {
    const isAuth = localStorage.getItem("auth")
    if (!isAuth) {
      router.push("/login")
    }
  }, [])

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    currentSection: "intro",
    score: 0,
    totalQuestions: imageQuestions.length + voiceQuestions.length + videoQuestions.length,
    currentQuestion: 0,
    answers: [],
  })

  const [points, setPoints] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("points");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  const incrementPoints = (amount = 1) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      localStorage.setItem("points", newPoints.toString());
      return newPoints;
    });
  }

  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null)
  const [showResult, setShowResult] = useState(false)
  const [videoAbnormalities, setVideoAbnormalities] = useState<{ x: number; y: number; found: boolean }[]>([
    { x: 45, y: 30, found: false }, // Face inconsistency
    { x: 60, y: 45, found: false }, // Lip sync issue
    { x: 35, y: 60, found: false }, // Lighting inconsistency
  ])
  const [mascotReaction, setMascotReaction] = useState<"idle" | "happy" | "sad">("idle");
  const [showHint, setShowHint] = useState(false);

  const getCurrentQuestion = () => {
    const idx = gameState.currentQuestion
    if (idx < imageQuestions.length) {
      return imageQuestions[idx]
    } else if (idx < imageQuestions.length + voiceQuestions.length) {
      return voiceQuestions[idx - imageQuestions.length]
    } else if (idx < imageQuestions.length + voiceQuestions.length + videoQuestions.length) {
      return videoQuestions[idx - imageQuestions.length - voiceQuestions.length]
    }
    return null
  }

  const handleAnswer = (answer: Answer) => {
    setShowHint(false);
    setSelectedAnswer(answer)
    const currentQ = getCurrentQuestion()
    const isCorrect = currentQ ? (answer === "fake") === currentQ.isDeepfake : false
    if (isCorrect) {
      incrementPoints(1)
      setMascotReaction("happy");
    } else {
      setMascotReaction("sad");
    }
    setGameState((prev) => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: [...prev.answers, answer],
    }))
    setShowResult(true)
  }

  const nextQuestion = () => {
    setMascotReaction("idle");
    setShowHint(false);
    setShowResult(false)
    setSelectedAnswer(null)

    setGameState((prev) => {
      const newCurrentQuestion = prev.currentQuestion + 1

      if (newCurrentQuestion >= prev.totalQuestions) {
        return { ...prev, currentSection: "results", currentQuestion: newCurrentQuestion }
      }

      let newSection = prev.currentSection
      if (newCurrentQuestion >= imageQuestions.length + voiceQuestions.length) {
        newSection = "video"
      } else if (newCurrentQuestion >= imageQuestions.length) {
        newSection = "voice"
      }

      return {
        ...prev,
        currentSection: newSection,
        currentQuestion: newCurrentQuestion,
      }
    })
  }

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const clickedAbnormality = videoAbnormalities.find(
      (abnormality) => !abnormality.found && Math.abs(abnormality.x - x) < 5 && Math.abs(abnormality.y - y) < 5,
    )

    if (clickedAbnormality) {
      setVideoAbnormalities((prev) => prev.map((a) => (a === clickedAbnormality ? { ...a, found: true } : a)))
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }))
    }
  }

  const finishVideoGame = () => {
    setGameState((prev) => ({
      ...prev,
      currentSection: "results",
      currentQuestion: prev.totalQuestions,
    }))
  }

  const restartGame = () => {
    setMascotReaction("idle");
    setShowHint(false);
    setGameState({
      currentSection: "intro",
      score: 0,
      totalQuestions: imageQuestions.length + voiceQuestions.length + videoQuestions.length,
      currentQuestion: 0,
      answers: [],
    })
    setVideoAbnormalities((prev) => prev.map((a) => ({ ...a, found: false })))
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const progressPercentage = (gameState.currentQuestion / gameState.totalQuestions) * 100

  if (gameState.currentSection === "intro") {
    return (
      <div className="relative min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col">
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute w-[200%] h-1 bg-white opacity-90 blur-[6px] rotate-[-45deg] top-1/3 left-[-50%]"></div>
        </div>
        <div className="w-full flex justify-end p-4 relative">
          <button
            className="font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            Conan
          </button>
          {showProfileMenu && (
            <div className="absolute right-4 top-14 bg-white rounded shadow-lg w-64 z-50 p-4">
              <div className="mb-4">
                <div className="font-bold text-lg mb-1">Profile</div>
                <div className="text-gray-700">Username: Conan</div>
                <div className="text-gray-700">Points: {points}</div>
              </div>
              <div className="mb-4">
                <button
                  className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/leaderboard");
                  }}
                >
                  Detective Rank
                </button>
                <button
                  className="w-full mb-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/shop");
                  }}
                >
                  Shop
                </button>
              </div>
              <button
                className="w-full mt-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => setShowProfileMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Deepfake Detective</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Learn to identify deepfakes and protect yourself from digital deception. Test your skills across images,
              voice calls, and video calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-6 mb-12 max-w-[900px] mx-auto">
            <Card className="w-[250px] mx-auto border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <ImageIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Image Detection</CardTitle>
                <CardDescription>Identify real and fake images</CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-[250px] mx-auto border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Audio Analysis</CardTitle>
                <CardDescription>Detect fake audios and social engineering</CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-[250px] mx-auto border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <Video className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Video Inspection</CardTitle>
                <CardDescription>Spot visual abnormalities in deepfake videos</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setGameState((prev) => ({ ...prev, currentSection: "image" }))}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              Start Detection Training
            </Button>
          </div>
        </div>
        <img
          src="/wallpapers/Edogawa_Conan.webp"
          alt="Edogawa Conan"
          // className="w-40 md:w-52 fixed bottom-0 right-4 md:right-8 z-40 drop-shadow-lg select-none pointer-events-none"
          className="w-40 md:w-52 fixed bottom-0 right-4 md:right-8 z-40 drop-shadow-lg select-none pointer-events-none animate-mascot-pop"
        />
      </div>
    )
  }

  if (gameState.currentSection === "results") {
    const scorePercentage = (gameState.score / gameState.totalQuestions) * 100
    return (
      <div className="min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col">
        <div className="w-full flex justify-end p-4 relative">
          <button
            className="font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            Conan
          </button>
          {showProfileMenu && (
            <div className="absolute right-4 top-14 bg-white rounded shadow-lg w-64 z-50 p-4">
              <div className="mb-4">
                <div className="font-bold text-lg mb-1">Profile</div>
                <div className="text-gray-700">Username: Conan</div>
                <div className="text-gray-700">Points: {points}</div>
              </div>
              <div className="mb-4">
                <button
                  className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/leaderboard");
                  }}
                >
                  Detective Rank
                </button>
                <button
                  className="w-full mb-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/shop");
                  }}
                >
                  Shop
                </button>
              </div>
              <button
                className="w-full mt-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => setShowProfileMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="bg-red-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                {scorePercentage >= 70 ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Training Complete!</h1>
              <p className="text-xl text-gray-600 mb-6">
                You scored {gameState.score} out of {gameState.totalQuestions} questions correctly
              </p>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-4xl font-bold text-red-600 mb-2">{Math.round(scorePercentage)}%</div>
                <Progress value={scorePercentage} className="mb-4" />
                <Badge variant={scorePercentage >= 70 ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {scorePercentage >= 70 ? "Expert Detective" : "Keep Learning"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <Button onClick={restartGame} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.currentSection === "video") {
    const currentQuestion = getCurrentQuestion();
    return (
      <div className="min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col">
        <div className="w-full flex justify-end p-4 relative">
          <button
            className="font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            Conan
          </button>
          {showProfileMenu && (
            <div className="absolute right-4 top-14 bg-white rounded shadow-lg w-64 z-50 p-4">
              <div className="mb-4">
                <div className="font-bold text-lg mb-1">Profile</div>
                <div className="text-gray-700">Username: Conan</div>
                <div className="text-gray-700">Points: {points}</div>
              </div>
              <button
                className="w-full mt-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => setShowProfileMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
                <Video className="w-6 h-6" />
                Video Call Detection
              </h2>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {gameState.score}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
          </div>
          {currentQuestion && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">Video Analysis</CardTitle>
                <CardDescription>Determine if this is real or a deepfake</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border flex justify-center">
                  {"video" in currentQuestion && (
                    <video
                      src={currentQuestion.video}
                      controls
                      className="rounded-lg max-w-full h-auto"
                      style={{ maxHeight: 400 }}
                    />
                  )}
                </div>
                {!showResult ? (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleAnswer("real")}
                      variant="outline"
                      className="flex-1 py-6 text-lg border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Real
                    </Button>
                    <Button
                      onClick={() => handleAnswer("fake")}
                      variant="outline"
                      className="flex-1 py-6 text-lg border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5 mr-2 text-red-600" />
                      Deepfake
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg ${(selectedAnswer === "fake") === currentQuestion.isDeepfake
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {(selectedAnswer === "fake") === currentQuestion.isDeepfake ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold">
                          {(selectedAnswer === "fake") === currentQuestion.isDeepfake ? "Correct!" : "Incorrect"}
                        </span>
                      </div>
                    </div>
                    <Button onClick={nextQuestion} className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
                      {gameState.currentQuestion + 1 >= gameState.totalQuestions ? "View Results" : "Next Question"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const sectionIcon = gameState.currentSection === "image" ? Target : Phone
  const sectionTitle = gameState.currentSection === "image" ? "Image Detection" : "Voice Call Analysis"

  let questionNumber, totalQuestionsInSection;
  if (gameState.currentSection === 'image') {
    questionNumber = gameState.currentQuestion + 1;
    totalQuestionsInSection = imageQuestions.length;
  } else if (gameState.currentSection === 'voice') {
    questionNumber = gameState.currentQuestion - imageQuestions.length + 1;
    totalQuestionsInSection = voiceQuestions.length;
  }


  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Luckiest Guy', sans-serif; }`}</style>
      </Head>
      <DetectiveMascot
        reaction={mascotReaction}
        hint={currentQuestion?.hint}
        showHint={showHint}
        onClick={() => setShowHint((prev) => !prev)}
      />
      <div className="min-h-screen bg-blue-950 bg-[url('/mascot/detective-pattern.svg')] bg-repeat bg-cover flex flex-col">
        <div className="w-full flex justify-end p-4 relative">
          <button
            className="font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            Conan
          </button>
          {showProfileMenu && (
            <div className="absolute right-4 top-14 bg-white rounded shadow-lg w-64 z-50 p-4">
              <div className="mb-4">
                <div className="font-bold text-lg mb-1">Profile</div>
                <div className="text-gray-700">Username: Conan</div>
                <div className="text-gray-700">Points: {points}</div>
              </div>
              <div className="mb-4">
                <button
                  className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/leaderboard");
                  }}
                >
                  Detective Rank
                </button>
                <button
                  className="w-full mb-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push("/shop");
                  }}
                >
                  Shop
                </button>
              </div>
              <button
                className="w-full mt-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => setShowProfileMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {React.createElement(sectionIcon, { className: "w-6 h-6" })}
                {sectionTitle}
              </h2>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {gameState.score}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4 bg-white [&_[data-slot=progress-indicator]]:bg-red-600" />
            {questionNumber && <p className="text-gray-600">Question {questionNumber} of {totalQuestionsInSection}</p>}
          </div>

          {currentQuestion && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">
                  {gameState.currentSection === "image" ? "Image Analysis" : "Voice Call Analysis"}
                </CardTitle>
                <CardDescription>Determine if this is real or a deepfake/scam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {gameState.currentSection === "image"
                  ? (() => {
                    if ("image" in currentQuestion) {
                      return (
                        <div className="bg-gray-50 p-4 rounded-lg border flex justify-center">
                          <img
                            src={currentQuestion.image}
                            alt="Question"
                            className="rounded-lg max-w-full h-auto"
                            style={{ maxHeight: 400 }}
                          />
                        </div>
                      )
                    }
                    return null
                  })()
                  : (() => {
                    if ("caller" in currentQuestion) {
                      return (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Caller:</strong> {currentQuestion.caller}
                            </div>
                            {/* Only show audio if present, no transcript or explanation */}
                            {gameState.currentSection === "voice" && "audio" in currentQuestion && currentQuestion.audio && (
                              <audio key={currentQuestion.audio} controls className="mt-4 w-full">
                                <source src={currentQuestion.audio} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}

                {!showResult ? (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleAnswer("real")}
                      variant="outline"
                      className="flex-1 py-6 text-lg border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Real
                    </Button>
                    <Button
                      onClick={() => handleAnswer("fake")}
                      variant="outline"
                      className="flex-1 py-6 text-lg border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5 mr-2 text-red-600" />
                      Deepfake/Scam
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg ${(selectedAnswer === "fake") === currentQuestion.isDeepfake
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {(selectedAnswer === "fake") === currentQuestion.isDeepfake ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold">
                          {(selectedAnswer === "fake") === currentQuestion.isDeepfake ? "Correct!" : "Incorrect"}
                        </span>
                      </div>
                      {/* <p className="text-sm text-gray-700">{currentQuestion.explanation}</p> */}
                    </div>
                    <Button onClick={nextQuestion} className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
                      {gameState.currentQuestion + 1 >= gameState.totalQuestions ? "View Results" : "Next Question"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
