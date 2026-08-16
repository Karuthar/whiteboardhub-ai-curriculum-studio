import api from "../api/apiClient";

export async function loadDashboard(){

    const [

        curricula,

        schemes,

        lessonPlans,

        lessonPackages,

        records,

        resources

    ] = await Promise.all([

        api.get("/curriculum"),

        api.get("/curriculum/schemes"),

        api.get("/lesson-plans"),

        api.get("/lesson-packages"),

        api.get("/records-of-work"),

        api.get("/learning-resources")

    ]);

    return{

        curricula:curricula.data,

        schemes:schemes.data,

        lessonPlans:lessonPlans.data,

        lessonPackages:lessonPackages.data,

        records:records.data,

        resources:resources.data

    };

}