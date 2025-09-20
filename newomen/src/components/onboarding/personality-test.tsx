'use client'

import { useState } from 'react'
import { Brain } from 'lucide-react'

const questions = [
  {
    id: 1,
    text: 'How do you typically approach new challenges?',
    options: [
      { value: 'a', text: 'I dive in headfirst and figure it out as I go' },
      { value: 'b', text: 'I carefully plan and prepare before starting' },
      { value: 'c', text: 'I seek advice and collaborate with others' },
      { value: 'd', text: 'I analyze all possible outcomes first' },
    ],
  },
  {
    id: 2,
    text: 'What energizes you the most?',
    options: [
      { value: 'a', text: 'Achieving goals and seeing results' },
      { value: 'b', text: 'Deep conversations and connections' },
      { value: 'c', text: 'Learning and discovering new things' },
      { value: 'd', text: 'Creating and expressing myself' },
    ],
  },
  {
    id: 3,
    text: 'How do you handle emotional situations?',
    options: [
      { value: 'a', text: 'I process them internally first' },
      { value: 'b', text: 'I talk them through with trusted people' },
      { value: 'c', text: 'I channel them into action or creativity' },
      { value: 'd', text: 'I analyze them to understand the root cause' },
    ],
  },
]

const personalityTypes = {
  'aaa': { type: 'Pioneer', traits: ['Bold', 'Action-oriented', 'Independent'] },
  'bbb': { type: 'Strategist', traits: ['Thoughtful', 'Organized', 'Analytical'] },
  'ccc': { type: 'Connector', traits: ['Empathetic', 'Collaborative', 'Intuitive'] },
  'ddd': { type: 'Explorer', traits: ['Curious', 'Creative', 'Adaptable'] },
  // Mixed types would have more nuanced results
}

interface PersonalityTestProps {
  onComplete: (data: { personalityType: string; personalityAnalysis: any }) => void
  initialData: any
}

export function PersonalityTest({ onComplete, initialData }: PersonalityTestProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate personality type
      const answerString = Object.values(newAnswers).join('')
      const personalityType = calculatePersonalityType(answerString)
      
      onComplete({
        personalityType: personalityType.type,
        personalityAnalysis: {
          answers: newAnswers,
          traits: personalityType.traits,
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  const calculatePersonalityType = (answers: string) => {
    // Simplified logic - in production, this would be more sophisticated
    const counts = { a: 0, b: 0, c: 0, d: 0 }
    for (const answer of answers) {
      counts[answer]++
    }
    
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    const typeKey = dominant.repeat(3)
    
    return personalityTypes[typeKey] || personalityTypes['ddd']
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Personality Assessment</h2>
        <p className="text-white/70">Help us understand your unique perspective</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-white/60">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete
          </span>
        </div>
        <div className="glass rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-white mb-4">
          {questions[currentQuestion].text}
        </h3>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full glass rounded-lg p-4 text-left hover:bg-white/10 transition-all"
            >
              <span className="text-white">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {currentQuestion > 0 && (
        <button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className="mt-6 text-white/60 hover:text-white transition-colors"
        >
          ← Previous question
        </button>
      )}
    </div>
  )
}