import { useMemo, useState } from "react";
import "./WorkflowLauncher.css";
import { findCurriculum } from "../../services/curriculumLibrary";

const EDUCATION = {
  Kenya: {
    CBC: {
      "Pre-Primary": ["PP1", "PP2"],

      "Primary School": [
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6"
      ],

      "Junior School": [
        "Grade 7",
        "Grade 8",
        "Grade 9"
      ],

      "Senior School": [
        "Grade 10",
        "Grade 11",
        "Grade 12"
      ]
    },

    "8-4-4": {
      Primary: [
        "Class 1",
        "Class 2",
        "Class 3",
        "Class 4",
        "Class 5",
        "Class 6",
        "Class 7",
        "Class 8"
      ],

      Secondary: [
        "Form 1",
        "Form 2",
        "Form 3",
        "Form 4"
      ]
    }
  },

  International: {
    Cambridge: {
      Primary: [
        "Year 1",
        "Year 2",
        "Year 3",
        "Year 4",
        "Year 5",
        "Year 6"
      ],

      LowerSecondary: [
        "Year 7",
        "Year 8",
        "Year 9"
      ],

      IGCSE: [
        "Year 10",
        "Year 11"
      ],

      ASALevel: [
        "Year 12",
        "Year 13"
      ]
    },

    IB: {
      PYP: [
        "Year 1",
        "Year 2",
        "Year 3",
        "Year 4",
        "Year 5",
        "Year 6"
      ],

      MYP: [
        "Year 7",
        "Year 8",
        "Year 9",
        "Year 10",
        "Year 11"
      ],

      DP: [
        "Year 12",
        "Year 13"
      ]
    }
  }
};

const SUBJECTS = {

  STEM: [
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Computer Science",
    "Agriculture",
    "Integrated Science"
  ],

  Languages: [
    "English",
    "Kiswahili",
    "French",
    "German",
    "Arabic",
    "Chinese"
  ],

  Humanities: [
    "History",
    "Geography",
    "CRE",
    "IRE",
    "HRE",
    "Business Studies"
  ],

  Creative: [
    "Music",
    "Art & Design",
    "Drama",
    "Home Science"
  ],

  Technical: [
    "Woodwork",
    "Metalwork",
    "Electricity",
    "Aviation",
    "Building Construction"
  ]

};

export default function WorkflowLauncher({ onContinue }) {

  const [country, setCountry] = useState("");

  const [system, setSystem] = useState("");

  const [level, setLevel] = useState("");

  const [grade, setGrade] = useState("");

  const [category, setCategory] = useState("");

  const [subject, setSubject] = useState("");

  const systems = useMemo(() => {

    if (!country) return [];

    return Object.keys(EDUCATION[country]);

  }, [country]);

  const levels = useMemo(() => {

    if (!country || !system) return [];

    return Object.keys(EDUCATION[country][system]);

  }, [country, system]);

  const grades = useMemo(() => {

    if (!country || !system || !level) return [];

    return EDUCATION[country][system][level];

  }, [country, system, level]);

  const subjects = useMemo(() => {

    if (!category) return [];

    return SUBJECTS[category];

  }, [category]);

  async function handleContinue() {

    if (
      !country ||
      !system ||
      !level ||
      !grade ||
      !subject
    ) {

      alert("Complete all fields.");

      return;

    }

    const curriculum = await findCurriculum(

      system,

      grade,

      subject

    );

    onContinue({

      country,

      system,

      level,

      grade,

      subject,

      curriculum

    });

  }

  return (

    <div className="workflow-launcher">

      <div className="launcher-card">

        <h1>WhiteBoard AI Curriculum Studio</h1>

        <p>

          Curriculum Intelligence Platform

        </p>

        <label>Country / Region</label>

        <select
          value={country}
          onChange={(e) => {

            setCountry(e.target.value);

            setSystem("");

            setLevel("");

            setGrade("");

          }}
        >

          <option value="">Select...</option>

          {Object.keys(EDUCATION).map(c => (

            <option key={c}>{c}</option>

          ))}

        </select>

        <label>Education System</label>

        <select
          value={system}
          onChange={(e) => {

            setSystem(e.target.value);

            setLevel("");

            setGrade("");

          }}
        >

          <option value="">Select...</option>

          {systems.map(s => (

            <option key={s}>{s}</option>

          ))}

        </select>

        <label>Level</label>

        <select
          value={level}
          onChange={(e) => {

            setLevel(e.target.value);

            setGrade("");

          }}
        >

          <option value="">Select...</option>

          {levels.map(l => (

            <option key={l}>{l}</option>

          ))}

        </select>

        <label>Grade / Class</label>

        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >

          <option value="">Select...</option>

          {grades.map(g => (

            <option key={g}>{g}</option>

          ))}

        </select>

        <label>Subject Category</label>

        <select
          value={category}
          onChange={(e) => {

            setCategory(e.target.value);

            setSubject("");

          }}
        >

          <option value="">Select...</option>

          {Object.keys(SUBJECTS).map(c => (

            <option key={c}>{c}</option>

          ))}

        </select>

        <label>Learning Area / Subject</label>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >

          <option value="">Select...</option>

          {subjects.map(s => (

            <option key={s}>{s}</option>

          ))}

        </select>

        <button onClick={handleContinue}>

          Continue →

        </button>

      </div>

    </div>

  );

}