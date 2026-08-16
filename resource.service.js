import api from "../api/apiClient";

export async function uploadResources(files) {

    const formData = new FormData();

    [...files].forEach(file => {

        formData.append(

            "resourceFile",

            file

        );

    });

    const response = await api.post(

        "/learning-resources/upload",

        formData

    );

    return response.data;

}

export async function getResources() {

    const response = await api.get(

        "/learning-resources"

    );

    return response.data;

}

export async function deleteResource(id) {

    const response = await api.delete(

        `/learning-resources/${id}`

    );

    return response.data;

}