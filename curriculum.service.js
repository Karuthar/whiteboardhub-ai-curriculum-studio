import api from "../api/apiClient";

export async function uploadCurriculum(file) {

    const formData = new FormData();

    formData.append(
        "curriculumFile",
        file
    );

    const response = await api.post(
        "/curriculum/upload",
        formData
    );

    return response.data;

}

export async function parseCurriculum(id) {

    const response = await api.post(
        `/curriculum/${id}/parse`
    );

    return response.data;

}

export async function generateScheme(id) {

    const response = await api.post(
        `/curriculum/${id}/generate-scheme`
    );

    return response.data;

}

export async function getCurricula() {

    const response = await api.get(
        "/curriculum"
    );

    return response.data;

}