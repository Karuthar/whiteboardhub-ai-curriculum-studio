import api from "../api/axios";

export async function exportDocument(

    id,

    type

){

    return api.get(

        `/exports/${type}/${id}`,

        {

            responseType:"blob"

        }

    );

}