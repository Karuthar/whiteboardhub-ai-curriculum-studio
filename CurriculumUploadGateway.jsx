import { useEffect, useState } from "react";
import { useStudioContext } from "../../contexts/StudioContext";
import { findCurriculum } from "../../services/curriculumLibrary";
import { uploadCurriculum } from "../../services/curriculumLibrary";

export default function CurriculumUploadGateway() {

    const studio = useStudioContext();

    const workflow = studio?.workflow;

    const [loading, setLoading] = useState(true);
    const [uploading,setUploading]=useState(false);

    const [status, setStatus] = useState("Searching curriculum library...");
    
    useEffect(() => {

        detectCurriculum();

    }, []);

    async function detectCurriculum() {

        try {

            setLoading(true);

            const curriculum = await findCurriculum(

                workflow.system,

                workflow.grade,

                workflow.subject

            );

            if (curriculum) {

             workflow.curriculum = curriculum;

             window.location.reload();

              return;

             }

            setStatus("Curriculum not found. Upload required.");

        }

        catch (err) {

            console.error(err);

            setStatus("Unable to search curriculum library.");

        }

        finally {

            setLoading(false);

        }

    }

    async function handleUpload(e){

    const file=e.target.files[0];

    if(!file) return;

    try{

        setUploading(true);

        const curriculum=await uploadCurriculum(

            file,

            studio.workflow

        );

        studio.workflow.curriculum=curriculum;

        window.location.reload();

    }

    finally{

        setUploading(false);

    }

}

    if (loading) {

        return (

            <div className="gateway-screen">

                <h2>{status}</h2>

            </div>

        );

    }

    return (

        <div className="gateway-screen">

            <h2>No curriculum found</h2>

            <p>

                Upload the curriculum design once.

                WhiteBoard AI will permanently adopt it into

                its curriculum library.

            </p>

            <input

    type="file"

    accept=".pdf,.doc,.docx"

    onChange={handleUpload}

    />

    {

uploading &&

<p>

Uploading...

Parsing...

Learning...

Saving permanently...

</p>

}

        </div>

    );

}
