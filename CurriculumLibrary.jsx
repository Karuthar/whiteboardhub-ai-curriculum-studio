import { useStudioContext } from "../../contexts/StudioContext";

export default function CurriculumLibrary(){

    const studio = useStudioContext();

    return(

        <div className="panel">

            <h2>AI Curriculum Library</h2>

            <table className="library-table">

                <thead>

                    <tr>

                        <th>System</th>

                        <th>Grade</th>

                        <th>Subject</th>

                        <th>Version</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {(studio.curricula || []).map(c=>(

                        <tr key={c._id}>

                            <td>{c.system}</td>

                            <td>{c.grade}</td>

                            <td>{c.subject}</td>

                            <td>{c.version || 1}</td>

                            <td>

                                {c.verified ? "Verified" : "Learning"}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}