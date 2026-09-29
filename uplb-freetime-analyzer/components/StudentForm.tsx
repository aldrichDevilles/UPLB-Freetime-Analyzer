"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";

// Define the shape of the data emitted when a student is added
export interface StudentData {
  name: string;
  degree: string;
  imageBase64: string;
}

interface StudentFormProps {
  onAddStudent: (student: StudentData) => void;
  isAnalyzing: boolean;
}

/**
 * Component for adding a student's details and schedule.
 */
export default function StudentForm({
  onAddStudent,
  isAnalyzing,
}: StudentFormProps): React.JSX.Element {
  const [name, setName] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !degree || !file) {
      alert("Please fill out all fields and upload a schedule.");
      return;
    }

    // Read file as base64 for API transmission
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onAddStudent({ name, degree, imageBase64: reader.result });
        // Reset form
        setName("");
        setDegree("");
        setFile(null);
        (e.target as HTMLFormElement).reset();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add Student Schedule</h3>
      <div className="input-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Juan Dela Cruz"
        />
      </div>
      <div className="input-group">
        <label>Degree Program</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="e.g. BS Computer Science"
        />
      </div>
      <div className="input-group">
        <label>Upload Schedule (JPG)</label>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
        />
        <small>
          Upload the schedule where vacant periods are light green and classes
          are dark green.
        </small>
      </div>
      <button type="submit" className="btn" disabled={isAnalyzing}>
        Add Student
      </button>
    </form>
  );
}
