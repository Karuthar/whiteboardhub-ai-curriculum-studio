import { useEffect } from "react";
import { loadDashboard } from "../../services/dashboard.service";

export default function DashboardPage({

    setCurricula,

    setSchemes,

    setLessonPlans,

    setLessonPackages,

    setRecords,

    setResources

}){

    async function refresh(){

        const dashboard =
            await loadDashboard();

        setCurricula(
            dashboard.curricula.curricula || []
        );

        setSchemes(
            dashboard.schemes.schemes || []
        );

        setLessonPlans(
            dashboard.lessonPlans.lessonPlans || []
        );

        setLessonPackages(
            dashboard.lessonPackages.lessonPackages || []
        );

        setRecords(
            dashboard.records.records || []
        );

        setResources(
            dashboard.resources.resources || []
        );

    }

    useEffect(() => {

    props.refresh();

    }, []);

    return null;

}