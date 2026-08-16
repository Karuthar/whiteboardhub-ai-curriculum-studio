import { useState } from "react";
import { useStudioContext } from "../contexts/StudioContext";

export default function useAiPipeline() {

    const studio = useStudioContext();

    const [running, setRunning] = useState(false);
    const [stage, setStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTask, setCurrentTask] = useState("");

    async function run(task) {

        setRunning(true);
        setCurrentTask(task);
        setStage(0);
        setProgress(0);

        try {

            switch (task) {

                case "documents":

                    setStage(1);
                    setProgress(15);
                    await studio.generateScheme();

                    setStage(2);
                    setProgress(30);
                    await studio.generateLessonPlan();

                    setStage(3);
                    setProgress(50);
                    await studio.generateLessonPackage(
                        "learningActivities"
                    );

                    setStage(4);
                    setProgress(65);
                    await studio.generateLessonPackage(
                        "lessonNotes"
                    );

                    setStage(5);
                    setProgress(80);
                    await studio.generateLessonPackage(
                        "assessment"
                    );

                    setStage(6);
                    setProgress(95);
                    await studio.generateRecordOfWork();

                    break;

                case "notes":

                    setStage(1);
                    setProgress(30);
                    await studio.generateScheme();

                    setStage(2);
                    setProgress(55);
                    await studio.generateLessonPlan();

                    setStage(3);
                    setProgress(90);
                    await studio.generateLessonPackage(
                        "lessonNotes"
                    );

                    break;

                case "assessment":

                    setStage(1);
                    setProgress(30);
                    await studio.generateScheme();

                    setStage(2);
                    setProgress(60);
                    await studio.generateLessonPlan();

                    setStage(3);
                    setProgress(90);
                    await studio.generateLessonPackage(
                        "assessment"
                    );

                    break;

                default:
                    throw new Error(
                        `Unknown AI pipeline task: ${task}`
                    );

            }

            setStage(100);
            setProgress(100);

            return {
                success: true,
                task
            };

        }

        catch (error) {

            console.error(
                `AI pipeline failed during "${task}"`,
                error
            );

            throw error;

        }

        finally {

            setRunning(false);
            setCurrentTask("");

        }

    }

    async function runStage(stageName) {

        if (!stageName) {
            throw new Error("Pipeline stage is required.");
        }

        switch (stageName) {

            case "scheme":
                return studio.generateScheme();

            case "lessonPlan":
                return studio.generateLessonPlan();

            case "learningActivities":
                return studio.generateLessonPackage(
                    "learningActivities"
                );

            case "lessonNotes":
                return studio.generateLessonPackage(
                    "lessonNotes"
                );

            case "assessment":
                return studio.generateLessonPackage(
                    "assessment"
                );

            case "recordOfWork":
                return studio.generateRecordOfWork();

            default:
                throw new Error(
                    `Unknown pipeline stage: ${stageName}`
                );

        }

    }

    return {

        run,
        runStage,

        running,
        stage,
        progress,
        currentTask

    };

}