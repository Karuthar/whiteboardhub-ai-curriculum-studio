import { useState } from "react";

export default function useStudio() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [curricula, setCurricula] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [lessonPackages, setLessonPackages] = useState([]);
  const [recordsOfWork, setRecords] = useState([]);
  const [learningResources, setResources] = useState([]);

  return {

    loading,
    setLoading,

    message,
    setMessage,

    curricula,
    setCurricula,

    schemes,
    setSchemes,

    lessonPlans,
    setLessonPlans,

    lessonPackages,
    setLessonPackages,

    recordsOfWork,
    setRecords,

    learningResources,
    setResources

  };

}