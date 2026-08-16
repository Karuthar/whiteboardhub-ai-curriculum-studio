import {
    uploadCurriculum,
    parseCurriculum,
    generateScheme
} from "../../services/curriculum.service";

import AICommandCenter from "../../components/AI/AICommandCenter";

export default function CurriculumStudio({

    file,
    loading,

    curriculumId,

    setCurriculumId,

    setLoading,

    setMessage,

    addToTray,

    loadDashboard

}) {

    async function onUpload() {

        if (!file) {

            setMessage("Choose a curriculum file first.");

            return;

        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("curriculumFile", file);
            formData.append("title", "Grade 10 Biology Curriculum");
            formData.append("grade", "10");
            formData.append("subject", "Biology");
            formData.append("year", new Date().getFullYear());

            const result = await uploadCurriculum(formData);

            const curriculum =
                result.curriculum ||
                result.data ||
                result;

            const id =
                curriculum._id ||
                curriculum.id;

            setCurriculumId(id);

            addToTray(
                "curriculum",
                curriculum
            );

            setMessage(
                "Curriculum uploaded successfully."
            );

            await loadDashboard();

        }

        catch (error) {

            setMessage(

                error?.response?.data?.message ||

                "Curriculum upload failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    async function onParse() {

        if (!curriculumId) {

            setMessage(
                "Upload a curriculum first."
            );

            return;

        }

        try {

            setLoading(true);

            await parseCurriculum(curriculumId);

            setMessage(
                "Curriculum parsed successfully."
            );

            await loadDashboard();

        }

        catch (error) {

            setMessage(

                error?.response?.data?.message ||

                "Curriculum parsing failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    async function onGenerateScheme() {

        if (!curriculumId) {

            setMessage(
                "Parse a curriculum first."
            );

            return;

        }

        try {

            setLoading(true);

            const result =
                await generateScheme(curriculumId);

            addToTray(
                "scheme",
                result.scheme
            );

            setMessage(
                "Scheme generated successfully."
            );

            await loadDashboard();

        }

        catch (error) {

            setMessage(

                error?.response?.data?.message ||

                "Scheme generation failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="curriculum-studio">

            <AICommandCenter />

            <div className="legacy-tools">

                <button
                    disabled={!file || loading}
                    onClick={onUpload}
                >
                    Upload Curriculum
                </button>

                <button
                    disabled={!curriculumId || loading}
                    onClick={onParse}
                >
                    Parse Curriculum
                </button>

                {/*
                ===================================================
                Legacy Manual Buttons
                (Temporary until AI Pipeline fully replaces them)
                ===================================================

                <button
                    disabled={!curriculumId || loading}
                    onClick={onGenerateScheme}
                >
                    Generate Scheme
                </button>

                */}

            </div>

        </div>

    );

}