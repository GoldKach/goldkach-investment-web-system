"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RISK_QUESTIONS, RiskAnswers } from "@/lib/risk-questionnaire"

interface Props {
  answers: RiskAnswers
  onAnswerChange: (questionId: string, score: number) => void
  disabled?: boolean
  idPrefix?: string
}

export function RiskQuestionnaireForm({ answers, onAnswerChange, disabled, idPrefix = "rq" }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[#193388] dark:text-blue-300">
          GoldKach Investor Risk Questionnaire
        </h3>
        <p className="text-sm text-muted-foreground">
          Please answer all 10 questions. Your answers determine your investor risk profile and suggested strategy.
        </p>
      </div>

      {RISK_QUESTIONS.map((q, idx) => {
        const selected = answers[q.id]
        return (
          <div
            key={q.id}
            className="border border-[#193388]/20 dark:border-[#193388]/30 rounded-lg p-4 space-y-3"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#193388]/50 dark:text-blue-400/50">
                {q.section}
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                {idx + 1}. {q.question}
              </p>
            </div>

            <RadioGroup
              value={selected != null ? String(selected) : ""}
              onValueChange={(v) => onAnswerChange(q.id, Number(v))}
              disabled={disabled}
              className="space-y-1.5"
            >
              {q.options.map((opt, optIdx) => {
                const optId = `${idPrefix}-${q.id}-${optIdx}`
                const isSelected = opt.score === selected
                return (
                  <div
                    key={optIdx}
                    className={`flex items-center space-x-2.5 rounded-md px-3 py-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#193388]/10 dark:bg-[#193388]/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                    onClick={() => !disabled && onAnswerChange(q.id, opt.score)}
                  >
                    <RadioGroupItem value={String(opt.score)} id={optId} />
                    <Label htmlFor={optId} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        )
      })}
    </div>
  )
}
