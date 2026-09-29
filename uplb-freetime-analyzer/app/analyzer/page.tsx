"use client";
import React, { useState } from "react";
import StudentForm, { StudentData } from "../../components/StudentForm";

interface AnalysisResult {
  summary: string;
  available_times: {
    day: string;
    times: string[];
  }[];
}

export default function AnalyzerPage(): React.JSX.Element {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [commonTimes, setCommonTimes] = useState<AnalysisResult | null>(null);

  const handleAddStudent = (studentData: StudentData) => {
    setStudents([...students, studentData]);
  };

  const handleAnalyze = async () => {
    if (students.length < 2) {
      alert("Please add at least 2 students to compare schedules.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze");

      setCommonTimes(data.result);
    } catch (error) {
      console.error(error);
      alert("Error analyzing schedules.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <h2>Freetime Analyzer</h2>

      {!commonTimes && (
        <>
          <StudentForm
            onAddStudent={handleAddStudent}
            isAnalyzing={isAnalyzing}
          />

          <div className="card">
            <h3>Added Students ({students.length})</h3>
            {students.length === 0 && <p>No students added yet.</p>}
            {students.map((std, idx) => (
              <div key={idx} className="student-badge">
                <strong>{std.name}</strong> - {std.degree}
              </div>
            ))}

            {students.length > 0 && (
              <button
                className="btn btn-secondary"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                style={{ marginTop: "10px", width: "100%" }}
              >
                {isAnalyzing ? "Analyzing..." : "Finish & Find Common Time"}
              </button>
            )}
          </div>
        </>
      )}

      {commonTimes && (
        <div className="card">
          <h3 style={{ marginBottom: "15px" }}>Best Meeting Times</h3>

          <div className="results-summary">
            <strong>Summary:</strong> {commonTimes.summary}
          </div>

          <div className="days-grid">
            {commonTimes.available_times.map((dayData, idx) => (
              <div key={idx} className="day-card">
                <h4>{dayData.day}</h4>
                {dayData.times.length > 0 ? (
                  dayData.times.map((time, tIdx) => (
                    <span key={tIdx} className="time-badge">
                      {time}
                    </span>
                  ))
                ) : (
                  <span className="no-times">No common free time</span>
                )}
              </div>
            ))}
          </div>

          <button
            className="btn"
            onClick={() => {
              setStudents([]);
              setCommonTimes(null);
            }}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
