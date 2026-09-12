import React, { useState } from 'react';
import { quizQuestionBank } from '../../data/quizData';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUserData } from '../../context/UserDataContext';

export const DailyQuiz: React.FC = () => {
  const { recordQuizResult } = useUserData();
  // Pick 5 questions for the quiz
  const [questions, setQuestions] = useState(() => quizQuestionBank.slice(0, 5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = isAnswered[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;

    const newSelected = { ...selectedAnswers, [currentIndex]: optionIndex };
    const newAnswered = { ...isAnswered, [currentIndex]: true };

    setSelectedAnswers(newSelected);
    setIsAnswered(newAnswered);

    // If it's the last question and answered, calculate total
    if (Object.keys(newAnswered).length === questions.length) {
      calculateFinal(newSelected);
    }
  };

  const calculateFinal = (answers: Record<number, number>) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    recordQuizResult(score, questions.length);

    if (score >= 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#d97706', '#10b981', '#f97316']
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    const shuffled = [...quizQuestionBank].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswered({});
    setIsFinished(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [idxStr, ans]) => {
    const idx = parseInt(idxStr);
    return ans === questions[idx]?.correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-orange-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>Self-Assessment & Concept Mastery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Daily Bioinformatics Quiz
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-orange-100 border border-orange-300 text-orange-950 font-bold">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-slate-700 hover:text-orange-950 shadow-xs transition-colors cursor-pointer"
            title="Reset / Load New Questions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Category & Difficulty */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300">
              {currentQ.category}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white text-slate-700 border border-orange-200">
              {currentQ.difficulty} Level
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = currentQ.correctAnswerIndex === optIdx;
              let optionStyle = 'bg-white border-orange-200 text-slate-800 hover:border-orange-400 hover:bg-orange-50';

              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs font-bold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs';
                } else {
                  optionStyle = 'bg-white/60 border-orange-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-mono font-extrabold text-orange-950 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed font-semibold">{opt}</span>
                  </div>
                  {hasAnsweredCurrent && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation Panel */}
          {hasAnsweredCurrent && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
                selectedOption === currentQ.correctAnswerIndex
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center space-x-2 font-extrabold text-xs mb-1">
                {selectedOption === currentQ.correctAnswerIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Scientific Rationale:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-800 font-medium mt-1">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-orange-200">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-orange-200 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous Question
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish & View Score' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Complete Results Screen */
        <div className="text-center py-8 space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Quiz Completed!
            </h3>
            <p className="text-sm text-slate-700 font-medium mt-1">
              You scored <strong className="text-orange-700 font-mono text-base font-extrabold">{score} / {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <div className="p-4 max-w-md mx-auto rounded-2xl bg-orange-50 border border-orange-200 text-xs text-slate-800 font-medium leading-relaxed">
            {score === 5 && '🌟 Outstanding! You have mastered these bioinformatics concepts across transcriptomics, structural docking, and genomics.'}
            {score >= 3 && score < 5 && '👍 Great job! Solid foundational knowledge. Review the missed scientific rationales to sharpen your skills.'}
            {score < 3 && '📚 Good effort! We recommend exploring the interactive Learning Pathways to master RNA-seq and structural docking workflows.'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center space-x-2 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake / Load 5 New Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
