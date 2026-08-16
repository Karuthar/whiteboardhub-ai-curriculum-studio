import { useEffect } from "react";

export default function useWorkspaceRecovery(studio){

    useEffect(()=>{

        const saved=localStorage.getItem("WB_WORKSPACE");

        if(!saved) return;

        try{

            const workspace=JSON.parse(saved);

            if(studio.restoreWorkspace){

                studio.restoreWorkspace(workspace);

            }

        }

        catch(err){

            console.error(err);

        }

    },[]);

    useEffect(()=>{

        localStorage.setItem(

            "WB_WORKSPACE",

            JSON.stringify({

                workflow:studio.workflow,

                curriculum:studio.curriculum,

                schemes:studio.schemes,

                lessonPlans:studio.lessonPlans,

                lessonPackages:studio.lessonPackages,

                recordsOfWork:studio.recordsOfWork

            })

        );

    });

}