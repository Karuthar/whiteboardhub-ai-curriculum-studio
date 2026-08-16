import api from "../api/apiClient";


/*
=========================================================
NORMALIZE RESPONSE
=========================================================
*/

function getCurriculumFromResponse(
    response
) {

    return (
        response?.data?.curriculum ||
        response?.curriculum ||
        null
    );

}


/*
=========================================================
RESOLVE CURRICULUM
=========================================================
PRIMARY F8 CURRICULUM CONTRACT
=========================================================
*/

export async function resolveCurriculum(
    identity = {}
) {

    const response =
        await api.get(
            "/curriculum/resolve",
            {
                params: {

                    region:
                        identity.region,

                    country:
                        identity.country,

                    countryCode:
                        identity.countryCode,

                    curriculumBody:
                        identity.curriculumBody,

                    educationSystem:
                        identity.educationSystem ||
                        identity.system,

                    educationSystemCode:
                        identity.educationSystemCode,

                    educationLevel:
                        identity.educationLevel ||
                        identity.level,

                    grade:
                        identity.grade,

                    gradeCode:
                        identity.gradeCode,

                    subject:
                        identity.subject,

                    subjectCode:
                        identity.subjectCode,

                    subjectCategory:
                        identity.subjectCategory,

                    curriculumVersion:
                        identity.curriculumVersion ||
                        identity.version ||
                        1

                }
            }
        );


    return {

        found:
            Boolean(
                response?.data?.found
            ),

        matchType:
            response?.data?.matchType ||
            "none",

        confidence:
            response?.data?.confidence ||
            0,

        curriculum:
            getCurriculumFromResponse(
                response
            )

    };

}


/*
=========================================================
LEGACY FIND API
=========================================================
=========================================================
*/

export async function findCurriculum(
    system,
    grade,
    subject
) {

    const result =
        await resolveCurriculum({

            educationSystem:
                system,

            grade,

            subject

        });


    return result.curriculum;

}


/*
=========================================================
UPLOAD CURRICULUM
=========================================================
=========================================================
*/

export async function uploadCurriculum(
    file,
    workflow = {}
) {

    const form =
        new FormData();


    form.append(
        "curriculumFile",
        file
    );


    if (workflow.title) {

        form.append(
            "title",
            workflow.title
        );

    }


    if (workflow.region) {

        form.append(
            "region",
            workflow.region
        );

    }


    if (workflow.country) {

        form.append(
            "country",
            workflow.country
        );

    }


    if (workflow.countryCode) {

        form.append(
            "countryCode",
            workflow.countryCode
        );

    }


    if (
        workflow.curriculumBody ||
        workflow.body
    ) {

        form.append(

            "curriculumBody",

            workflow.curriculumBody ||
            workflow.body

        );

    }


    if (
        workflow.educationSystem ||
        workflow.system
    ) {

        form.append(

            "educationSystem",

            workflow.educationSystem ||
            workflow.system

        );

    }


    if (workflow.educationSystemCode) {

        form.append(
            "educationSystemCode",
            workflow.educationSystemCode
        );

    }


    if (
        workflow.educationLevel ||
        workflow.level
    ) {

        form.append(

            "educationLevel",

            workflow.educationLevel ||
            workflow.level

        );

    }


    if (workflow.grade) {

        form.append(
            "grade",
            workflow.grade
        );

    }


    if (workflow.gradeCode) {

        form.append(
            "gradeCode",
            workflow.gradeCode
        );

    }


    if (workflow.subject) {

        form.append(
            "subject",
            workflow.subject
        );

    }


    if (workflow.subjectCode) {

        form.append(
            "subjectCode",
            workflow.subjectCode
        );

    }


    if (workflow.subjectCategory) {

        form.append(
            "subjectCategory",
            workflow.subjectCategory
        );

    }


    form.append(

        "curriculumVersion",

        workflow.curriculumVersion ||
        workflow.version ||
        1

    );


    if (workflow.year) {

        form.append(
            "year",
            workflow.year
        );

    }


    if (
        workflow.foundational !==
        undefined
    ) {

        form.append(

            "foundational",

            String(
                workflow.foundational
            )

        );

    }


    const response =
        await api.post(

            "/curriculum/upload",

            form

        );


    return getCurriculumFromResponse(
        response
    );

}


/*
=========================================================
GET ALL CURRICULA
=========================================================
=========================================================
*/

export async function getCurricula() {

    const response =
        await api.get(
            "/curriculum"
        );


    return (
        response?.data?.curricula ||
        []
    );

}