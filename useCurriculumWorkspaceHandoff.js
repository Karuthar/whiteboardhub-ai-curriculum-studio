import { useCallback } from "react";

const HANDOFF_STORAGE_KEY =
    "whiteboardhub.curriculum.workspace.handoff";

const HANDOFF_EVENT =
    "whiteboardhub:curriculum-workspace-handoff";

function normalizeHandoff(input = {}) {

    const curriculum =
        input.curriculum ||
        input.resolvedCurriculum ||
        input.data ||
        {};

    return {

        version: "1.0",

        type: "curriculum-workspace-handoff",

        workflow: "document-generation",

        target: "workspace",

        source:
            input.source ||
            "curriculum-auto-resolution",

        resolutionMode:
            input.resolutionMode ||
            (
                curriculum.foundational
                    ? "foundational-auto-resolution"
                    : "resolved-curriculum"
            ),

        curriculumId:
            input.curriculumId ||
            curriculum._id ||
            curriculum.id ||
            null,

        canonicalKey:
            input.canonicalKey ||
            curriculum.canonicalKey ||
            null,

        curriculum: {

            id:
                curriculum._id ||
                curriculum.id ||
                null,

            region:
                curriculum.region ||
                "",

            country:
                curriculum.country ||
                "",

            countryCode:
                curriculum.countryCode ||
                "",

            curriculumBody:
                curriculum.curriculumBody ||
                "",

            educationSystem:
                curriculum.educationSystem ||
                curriculum.system ||
                "",

            educationSystemCode:
                curriculum.educationSystemCode ||
                "",

            educationLevel:
                curriculum.educationLevel ||
                curriculum.level ||
                "",

            grade:
                curriculum.grade ||
                "",

            gradeCode:
                curriculum.gradeCode ||
                "",

            subject:
                curriculum.subject ||
                "",

            subjectCode:
                curriculum.subjectCode ||
                "",

            subjectCategory:
                curriculum.subjectCategory ||
                "",

            curriculumVersion:
                curriculum.curriculumVersion ||
                curriculum.version ||
                "1",

            title:
                curriculum.title ||
                "",

            foundational:
                Boolean(curriculum.foundational),

            status:
                curriculum.status ||
                "",

            structuredCurriculum:
                curriculum.structuredCurriculum ||
                null

        },

        requestedDocuments:
            input.requestedDocuments ||
            [],

        metadata:
            input.metadata ||
            {},

        createdAt:
            new Date().toISOString()

    };

}

export default function useCurriculumWorkspaceHandoff() {

    const createHandoff = useCallback(
        (input = {}) => {

            const handoff =
                normalizeHandoff(input);

            try {

                window.sessionStorage.setItem(
                    HANDOFF_STORAGE_KEY,
                    JSON.stringify(handoff)
                );

            }
            catch (error) {

                console.warn(
                    "Unable to persist curriculum workspace handoff.",
                    error
                );

            }

            try {

                window.dispatchEvent(
                    new CustomEvent(
                        HANDOFF_EVENT,
                        {
                            detail: handoff
                        }
                    )
                );

            }
            catch (error) {

                console.warn(
                    "Unable to dispatch curriculum workspace handoff.",
                    error
                );

            }

            return handoff;

        },
        []
    );

    const readHandoff = useCallback(
        () => {

            try {

                const stored =
                    window.sessionStorage.getItem(
                        HANDOFF_STORAGE_KEY
                    );

                if (!stored) {

                    return null;

                }

                return JSON.parse(stored);

            }
            catch (error) {

                console.warn(
                    "Unable to read curriculum workspace handoff.",
                    error
                );

                return null;

            }

        },
        []
    );

    const clearHandoff = useCallback(
        () => {

            try {

                window.sessionStorage.removeItem(
                    HANDOFF_STORAGE_KEY
                );

            }
            catch (error) {

                console.warn(
                    "Unable to clear curriculum workspace handoff.",
                    error
                );

            }

        },
        []
    );

    const handoffToWorkspace = useCallback(
        (input = {}) => {

            return createHandoff(input);

        },
        [createHandoff]
    );

    return {

        createHandoff,

        handoffToWorkspace,

        readHandoff,

        clearHandoff,

        storageKey:
            HANDOFF_STORAGE_KEY,

        eventName:
            HANDOFF_EVENT

    };

}

export {
    HANDOFF_STORAGE_KEY,
    HANDOFF_EVENT,
    normalizeHandoff
};