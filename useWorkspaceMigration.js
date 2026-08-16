export default function useWorkspaceMigration(studio){

    async function migrateGuestWorkspace(userId){

        if(studio.accessMode!=="guest") return;

        const workspace=localStorage.getItem("WB_WORKSPACE");

        if(!workspace) return;

        try{

            const data=JSON.parse(workspace);

            await fetch("http://localhost:7000/api/workspace/import",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    userId,

                    workspace:data

                })

            });

            localStorage.removeItem("WB_WORKSPACE");

        }

        catch(err){

            console.error(err);

        }

    }

    return{

        migrateGuestWorkspace

    };

}