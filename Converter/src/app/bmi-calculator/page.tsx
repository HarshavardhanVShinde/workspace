'use client'

import { useState, useEffect } from 'react'
import { Heart, Weight, Ruler, Activity } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, getWebAppJsonLd, siteUrl } from '@/lib/seo'

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>('70')
  const [height, setHeight] = useState<string>('175')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [bmi, setBmi] = useState<number>(0)
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string[]>([])

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) {
      return {
        category: 'Underweight',
        description: 'Below normal weight',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        recommendations: [
          'Consult with a healthcare provider or nutritionist',
          'Focus on nutrient-dense, calorie-rich foods',
          'Include healthy fats like nuts, avocados, and olive oil',
          'Consider strength training to build muscle mass',
          'Eat frequent, smaller meals throughout the day'
        ]
      }
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return {
        category: 'Normal weight',
        description: 'Healthy weight range',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        recommendations: [
          'Maintain your current healthy lifestyle',
          'Continue regular physical activity',
          'Follow a balanced diet with variety',
          'Stay hydrated and get adequate sleep',
          'Regular health check-ups for monitoring'
        ]
      }
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return {
        category: 'Overweight',
        description: 'Above normal weight',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        recommendations: [
          'Aim for gradual, sustainable weight loss',
          'Increase physical activity to 150+ minutes/week',
          'Focus on portion control and mindful eating',
          'Include more fruits, vegetables, and lean proteins',
          'Consider consulting a nutritionist or trainer'
        ]
      }
    } else {
      return {
        category: 'Obese',
        description: 'Significantly above normal weight',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        recommendations: [
          'Consult with healthcare professionals immediately',
          'Create a comprehensive weight management plan',
          'Focus on gradual lifestyle changes',
          'Consider medical supervision for weight loss',
          'Address any underlying health conditions'
        ]
      }
    }
  }

  const calculateBMI = () => {
    const weightNum = parseFloat(weight) || 0
    const heightNum = parseFloat(height) || 0

    if (weightNum === 0 || heightNum === 0) {
      setBmi(0)
      setCategory('')
      setDescription('')
      setRecommendations([])
      return
    }

    let bmiValue: number

    if (unit === 'metric') {
      // BMI = weight (kg) / height (m)²
      const heightInMeters = heightNum / 100
      bmiValue = weightNum / (heightInMeters * heightInMeters)
    } else {
      // BMI = (weight (lbs) / height (inches)²) × 703
      bmiValue = (weightNum / (heightNum * heightNum)) * 703
    }

    const categoryData = getBMICategory(bmiValue)
    
    setBmi(Math.round(bmiValue * 10) / 10)
    setCategory(categoryData.category)
    setDescription(categoryData.description)
    setRecommendations(categoryData.recommendations)
  }

  useEffect(() => {
    calculateBMI()
  }, [weight, height, unit])

  const categoryData = getBMICategory(bmi)

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <StructuredData data={getWebPageJsonLd({
        name: 'BMI Calculator',
        description: 'Calculate your BMI to understand weight status and recommendations.',
        url: `${siteUrl}/bmi-calculator`,
        breadcrumb: ['Home', 'BMI Calculator']
      })} />
      <StructuredData data={getWebAppJsonLd({
        name: 'BMI Calculator',
        description: 'Web-based BMI calculator to compute body mass index and health category.',
        url: `${siteUrl}/bmi-calculator`,
        applicationCategory: 'Health'
      })} />
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 shadow-soft text-white">
          <Heart className="h-10 w-10" />
        </div>
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          BMI Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Calculate your Body Mass Index (BMI) to understand your weight status and get personalized health recommendations.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Input Section */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Your Measurements</h2>

          {/* Unit Toggle */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
              Measurement Unit
            </label>
            <div className="flex bg-white/60 dark:bg-white/10 rounded-xl p-1 border border-white/30">
              <button
                onClick={() => setUnit('metric')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  unit === 'metric'
                    ? 'bg-white dark:bg.white/20 text-gray-900 dark:text-white shadow-soft border border-white/40'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  unit === 'imperial'
                    ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-soft border border-white/40'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Imperial (lbs, in)
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Weight */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                <Weight className="h-4 w-4 mr-2 text-red-500" />
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={unit === 'metric' ? '70' : '154'}
                min="1"
                step="0.1"
              />
            </div>

            {/* Height */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                <Ruler className="h-4 w-4 mr-2 text-red-500" />
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={unit === 'metric' ? '175' : '69'}
                min="1"
                step={unit === 'metric' ? '1' : '0.1'}
              />
            </div>
          </div>
        </GlassCard>

        {/* Results Section */}
        <div className="space-y-8">
          {/* BMI Result Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your BMI</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{bmi || '--'}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-soft">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {category && (
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${categoryData.bgColor} ${categoryData.color} border ${categoryData.borderColor}`}>
                {category}
              </div>
            )}
            
            {description && (
              <p className="text-gray-600 dark:text-gray-400 mt-3">{description}</p>
            )}
          </GlassCard>

          {/* BMI Scale */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">BMI Scale</h3>
            <div className="space-y-3">
              {[
                { label: 'Underweight', range: '< 18.5', color: 'blue' },
                { label: 'Normal weight', range: '18.5 - 24.9', color: 'green' },
                { label: 'Overweight', range: '25.0 - 29.9', color: 'yellow' },
                { label: 'Obese', range: '≥ 30.0', color: 'red' }
              ].map((item) => (
                <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-500/10 border border-${item.color}-200 dark:border-${item.color}-500/30`}>
                  <span className={`text.sm font-medium text-${item.color}-800 dark:text-${item.color}-300`}>{item.label}</span>
                  <span className={`text-sm text-${item.color}-600 dark:text-${item.color}-400`}>{item.range}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Information Section */}
      <GlassCard className="mt-16 p-8">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">About BMI</h3>
        <div className="grid sm:grid-cols-2 gap-10 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What is BMI?</h4>
              <p>Body Mass Index (BMI) is a simple calculation using height and weight to determine if you're in a healthy weight range for your height.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How it's calculated</h4>
              <ul className="space-y-1">
                <li>• Metric: weight (kg) ÷ height (m)²</li>
                <li>• Imperial: (weight (lbs) ÷ height (in)²) × 703</li>
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Important Notes</h4>
              <ul className="space-y-1">
                <li>• BMI doesn't distinguish between muscle and fat</li>
                <li>• It may not be accurate for athletes or very muscular people</li>
                <li>• Age, gender, and ethnicity can affect interpretation</li>
                <li>• Always consult healthcare professionals for medical advice</li>
                <li>• Consider other health factors beyond just BMI</li>
              </ul>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}