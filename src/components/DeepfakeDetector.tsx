"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Mail, Phone, Video, CheckCircle, XCircle, Play, Target } from "lucide-react"

type GameSection = "intro" | "email" | "voice" | "video" | "results"
type Answer = "real" | "fake" | null

interface GameState {
  currentSection: GameSection
  score: number
  totalQuestions: number
  currentQuestion: number
  answers: Answer[]
}

export default function DeepfakeDetector() {
  const [gameState, setGameState] = useState<GameState>({
    currentSection: "intro",
    score: 0,
    totalQuestions: 9, // 3 questions per section
    currentQuestion: 0,
    answers: [],
  })

  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null)
  const [showResult, setShowResult] = useState(false)
  const [videoAbnormalities, setVideoAbnormalities] = useState<{ x: number; y: number; found: boolean }[]>([
    { x: 45, y: 30, found: false }, // Face inconsistency
    { x: 60, y: 45, found: false }, // Lip sync issue
    { x: 35, y: 60, found: false }, // Lighting inconsistency
  ])

  const emailQuestions = [
    {
      id: 1,
      subject: "Urgent: Account Verification Required",
      sender: "security@paypal.com",
      content:
        "Dear Customer, Your account has been temporarily suspended. Click here to verify: http://paypal-security.net/verify",
      isDeepfake: true,
      explanation: "Suspicious URL domain and urgent language are red flags for phishing emails.",
    },
    {
      id: 2,
      subject: "Meeting Reminder - Project Review",
      sender: "sarah.johnson@company.com",
      content: "Hi team, Just a reminder about our project review meeting tomorrow at 2 PM in Conference Room B.",
      isDeepfake: false,
      explanation: "This appears to be a legitimate internal company email with normal business communication.",
    },
    {
      id: 3,
      subject: "You've Won $1,000,000!",
      sender: "winner@lottery-international.com",
      content:
        "Congratulations! You've been selected as our grand prize winner. Send your bank details to claim your prize immediately!",
      isDeepfake: true,
      explanation: "Classic scam email with unrealistic claims and requests for sensitive financial information.",
    },
  ]

  const voiceQuestions = [
    {
      id: 1,
      caller: "Your Co-worker",
      transcript:
        "Hi, I need your help urgently. Could you please reset my account. The dashboard is not opening and I must prepare the document before the 4 o'clock meeting. Just give me access now. I will fix everything after. Thank you.",
      isDeepfake: true,
      explanation: "Urgent, emotional language and pressure to bypass protocol are signs of impersonation scams.",
    },
    
    
    {
      id: 2,
      caller: "Co-worker",
      transcript:
        "Hey! Sorry to call so suddenly — I'm stuck outside the dashboard and I really need to get that presentation updated before the 4pm review. Can you help unlock my access? I think my password expired or something. Oh — and don't worry, I'll reset it right after. Let me know if you need anything from me.",
      isDeepfake: false,
      explanation: "Sounds like a typical coworker request with polite tone, no urgency or red flags.",
    },
    

    {
      id: 3,
      caller: "Tech Support",
      transcript:
        "This is Microsoft technical support. Your computer has been infected with viruses. Please download our software immediately to fix the issue.",
      isDeepfake: true,
      explanation: "Microsoft doesn't make unsolicited calls. This is a common tech support scam.",
    },
  ]

  const getCurrentQuestion = () => {
    const questionIndex = gameState.currentQuestion % 3
    if (gameState.currentSection === "email") {
      return emailQuestions[questionIndex]
    } else if (gameState.currentSection === "voice") {
      return voiceQuestions[questionIndex]
    }
    return null
  }

  const handleAnswer = (answer: Answer) => {
    setSelectedAnswer(answer)
    const currentQ = getCurrentQuestion()
    const isCorrect = currentQ ? (answer === "fake") === currentQ.isDeepfake : false

    setGameState((prev) => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: [...prev.answers, answer],
    }))

    setShowResult(true)
  }

  const nextQuestion = () => {
    setShowResult(false)
    setSelectedAnswer(null)

    if (gameState.currentQuestion + 1 >= gameState.totalQuestions) {
      setGameState((prev) => ({ ...prev, currentSection: "results" }))
    } else if ((gameState.currentQuestion + 1) % 3 === 0) {
      // Move to next section
      const nextSection =
        gameState.currentSection === "email" ? "voice" : gameState.currentSection === "voice" ? "video" : "results"
      setGameState((prev) => ({
        ...prev,
        currentSection: nextSection,
        currentQuestion: prev.currentQuestion + 1,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }))
    }
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
    setGameState({
      currentSection: "intro",
      score: 0,
      totalQuestions: 9,
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Deepfake Detective</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn to identify deepfakes and protect yourself from digital deception. Test your skills across emails,
              voice calls, and video calls.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <Mail className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Email Detection</CardTitle>
                <CardDescription>Identify suspicious emails and phishing attempts</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Voice Call Analysis</CardTitle>
                <CardDescription>Detect fake voice calls and social engineering</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200 hover:border-red-300 transition-colors">
              <CardHeader className="text-center">
                <Video className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-red-800">Video Call Inspection</CardTitle>
                <CardDescription>Spot visual abnormalities in deepfake videos</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setGameState((prev) => ({ ...prev, currentSection: "email" }))}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              Start Detection Training
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.currentSection === "results") {
    const scorePercentage = (gameState.score / gameState.totalQuestions) * 100
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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
    const foundCount = videoAbnormalities.filter((a) => a.found).length
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                Click on the abnormalities in this video call
              </CardTitle>
              <CardDescription>
                Found {foundCount} of {videoAbnormalities.length} abnormalities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="relative bg-gray-900 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleVideoClick}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-white text-center z-10">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video Call Simulation</p>
                    <p className="text-sm opacity-75">Click to identify deepfake abnormalities</p>
                  </div>

                  {/* Abnormality markers */}
                  {videoAbnormalities.map((abnormality, index) => (
                    <div
                      key={index}
                      className={`absolute w-4 h-4 rounded-full border-2 ${
                        abnormality.found
                          ? "bg-green-500 border-green-400"
                          : "bg-red-500/30 border-red-400 animate-pulse"
                      }`}
                      style={{
                        left: `${abnormality.x}%`,
                        top: `${abnormality.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-gray-900">Look for these signs:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className={foundCount >= 1 ? "line-through text-green-600" : ""}>
                    • Facial features that don't match lighting conditions
                  </li>
                  <li className={foundCount >= 2 ? "line-through text-green-600" : ""}>
                    • Lip movements that don't sync with speech
                  </li>
                  <li className={foundCount >= 3 ? "line-through text-green-600" : ""}>
                    • Inconsistent shadows or reflections
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setGameState((prev) => ({ ...prev, currentSection: "results" }))}
                >
                  Skip Video Section
                </Button>
                <Button
                  onClick={finishVideoGame}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={foundCount < 3}
                >
                  {foundCount === 3 ? "Complete Training" : `Find ${3 - foundCount} more`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const sectionIcon = gameState.currentSection === "email" ? Mail : Phone
  const sectionTitle = gameState.currentSection === "email" ? "Email Detection" : "Voice Call Analysis"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
              {React.createElement(sectionIcon, { className: "w-6 h-6" })}
              {sectionTitle}
            </h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Score: {gameState.score}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <p className="text-gray-600">Question {(gameState.currentQuestion % 3) + 1} of 3</p>
        </div>

        {currentQuestion && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">
                {gameState.currentSection === "email" ? "Email Analysis" : "Voice Call Analysis"}
              </CardTitle>
              <CardDescription>Determine if this is real or a deepfake/scam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {gameState.currentSection === "email" ? (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>From:</strong> {currentQuestion.sender}
                    </div>
                    <div>
                      <strong>Subject:</strong> {currentQuestion.subject}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p>{currentQuestion.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Caller:</strong> {currentQuestion.caller}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="italic">"{currentQuestion.transcript}"</p>
                    </div>
                  </div>
                </div>
              )}

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
                    className={`p-4 rounded-lg ${
                      (selectedAnswer === "fake") === currentQuestion.isDeepfake
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
                    <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
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