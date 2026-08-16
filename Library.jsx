import "./Library.css";
import CurriculumLibrary from "../CurriculumLibrary/CurriculumLibrary";

export default function Library({

    DockGroup,

    curricula,

    schemes,

    lessonPlans,

    lessonPackages,

    learningResources,

    recordsOfWork

}){

    return(

        <div className="document-dock">

            <CurriculumLibrary />

            <DockGroup
                title="Stored Curricula"
                items={curricula}
                type="curriculum"
                label={(i)=>i.title}
            />

            <DockGroup
                title="Stored Schemes"
                items={schemes}
                type="scheme"
                label={(i)=>i.title}
            />

            <DockGroup
                title="Stored Lesson Plans"
                items={lessonPlans}
                type="lessonPlan"
                label={(i)=>i.lessonTitle}
            />

            <DockGroup
                title="Stored Lesson Notes"
                items={lessonPackages}
                type="lessonNotes"
                label={()=>"Lesson Notes"}
            />

            <DockGroup
                title="Stored Learning Activities"
                items={lessonPackages}
                type="learningActivities"
                label={()=>"Learning Activities"}
            />

            <DockGroup
                title="Stored Resources"
                items={learningResources}
                type="resource"
                label={(i)=>i.title || i.originalFileName}
            />

            <DockGroup
                title="Stored Assessments"
                items={lessonPackages}
                type="assessment"
                label={()=>"Assessment"}
            />

            <DockGroup
                title="Stored Records"
                items={recordsOfWork}
                type="record"
                label={(i)=>`Week ${i.weekNumber} • Lesson ${i.lessonNumber}`}
            />

        </div>

    );

}