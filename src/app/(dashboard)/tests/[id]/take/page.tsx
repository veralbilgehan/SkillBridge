"use client";

import { useState } from "react";
import { Database, FileText, Code, Users, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface TestResult {
  score: number;
  total: number;
  passed: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Veritabanı normalizasyonunun temel amacı nedir?",
    options: [
      "Veri tekrarını azaltmak ve veri bütünlüğünü sağlamak",
      "Veritabanı boyutunu artırmak",
      "Sorgu hızını yavaşlatmak",
      "Daha fazla tablo oluşturmak",
    ],
    correctAnswer: 0,
    category: "Database",
  },
  {
    id: 2,
    question: "React'te state yönetimi için hangi hook kullanılır?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    category: "Frontend",
  },
  {
    id: 3,
    question: "REST API'de POST metodu ne için kullanılır?",
    options: [
      "Veri silmek için",
      "Veri güncellemek için",
      "Yeni veri oluşturmak için",
      "Veri sorgulamak için",
    ],
    correctAnswer: 2,
    category: "Backend",
  },
  {
    id: 4,
    question: "Agile metodolojisinde sprint süresi genellikle ne kadardır?",
    options: ["1 gün", "1-4 hafta", "6 ay", "1 yıl"],
    correctAnswer: 1,
    category: "Management",
  },
  {
    id: 5,
    question: "SQL'de INNER JOIN ne işe yarar?",
    options: [
      "Tüm kayıtları getirir",
      "Sadece eşleşen kayıtları getirir",
      "Sadece sol tablodaki kayıtları getirir",
      "Hiçbir kayıt getirmez",
    ],
    correctAnswer: 1,
    category: "Database",
  },
];

function CategoryIcon({ category }: { category: string }) {
  const cls = "w-4 h-4";
  if (category === "Database") return <Database className={cls} />;
  if (category === "Frontend") return <Code className={cls} />;
  if (category === "Backend") return <FileText className={cls} />;
  if (category === "Management") return <Users className={cls} />;
  return <FileText className={cls} />;
}

export default function TestTakePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  function handleAnswerSelect(questionId: number, answerIndex: number) {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  }

  function handleSubmit() {
    let correct = 0;
    QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    setTestResult({
      score: correct,
      total: QUESTIONS.length,
      passed: correct >= QUESTIONS.length * 0.7,
    });
  }

  function handleRestart() {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTestResult(null);
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQ = QUESTIONS[currentQuestion];

  // ── Results screen ────────────────────────────────────────────────────────
  if (testResult) {
    const pct = Math.round((testResult.score / testResult.total) * 100);
    return (
      <div className="flex items-center justify-center py-8">
        <Card className="w-full max-w-2xl">
          {/* Header */}
          <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-2xl py-8 gap-3">
            <div className="flex justify-center">
              {testResult.passed ? (
                <CheckCircle2 className="w-16 h-16 text-white" />
              ) : (
                <XCircle className="w-16 h-16 text-white" />
              )}
            </div>
            <CardTitle className="text-3xl text-white">Test Tamamlandı!</CardTitle>
            <CardDescription className="text-indigo-100 text-base">
              {testResult.passed
                ? "Tebrikler! Testi başarıyla geçtiniz."
                : "Maalesef testi geçemediniz."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Score */}
            <div className="text-center space-y-3">
              <div className="text-6xl font-bold text-white">
                {testResult.score}/{testResult.total}
              </div>
              <p className="text-zinc-400">Başarı Oranı: {pct}%</p>
              <Progress value={pct} className="h-3" />
            </div>

            {/* Answer detail */}
            <div className="space-y-2 bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50">
              <h3 className="font-semibold text-white mb-3">Cevap Detayları</h3>
              {QUESTIONS.map((q, idx) => {
                const correct = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-300">Soru {idx + 1}</span>
                      <Badge variant="outline" className="gap-1">
                        <CategoryIcon category={q.category} />
                        {q.category}
                      </Badge>
                    </div>
                    {correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-2 pb-2">
            <button
              onClick={handleRestart}
              className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Testi Yeniden Başlat
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  return (
    <div className="flex items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-2xl py-6 gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">İşe Alım Testi</CardTitle>
            <Badge variant="secondary" className="bg-white/15 text-white border-white/20 font-semibold">
              {answeredCount}/{QUESTIONS.length} Cevaplandı
            </Badge>
          </div>
          <CardDescription className="text-indigo-100">
            Lütfen tüm soruları dikkatlice cevaplayınız
          </CardDescription>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-indigo-200">
              <span>Soru {currentQuestion + 1} / {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-indigo-400/40" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Category badge */}
          <Badge variant="outline" className="gap-1">
            <CategoryIcon category={currentQ.category} />
            {currentQ.category}
          </Badge>

          {/* Question */}
          <h3 className="text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <RadioGroup
            value={selectedAnswers[currentQ.id]?.toString()}
            onValueChange={(val) => handleAnswerSelect(currentQ.id, parseInt(val))}
            className="space-y-2"
          >
            {currentQ.options.map((option, idx) => {
              const selected = selectedAnswers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selected
                      ? "border-indigo-500 bg-indigo-500/8"
                      : "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700"
                  }`}
                >
                  <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                  <Label
                    htmlFor={`opt-${idx}`}
                    className="flex-1 cursor-pointer text-zinc-300 font-medium"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-zinc-800 pt-5 pb-2">
          <button
            onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm text-zinc-400 border border-zinc-700 rounded-xl hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Önceki
          </button>

          {currentQuestion === QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount !== QUESTIONS.length}
              className="px-6 py-2 text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              Testi Bitir
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((q) => Math.min(QUESTIONS.length - 1, q + 1))}
              className="px-6 py-2 text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-colors"
            >
              Sonraki
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
