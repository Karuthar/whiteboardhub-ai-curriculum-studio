export default function useDocumentEngine(studio) {

    function labelType(type){

        return {

            curriculum:"Curriculum Design",

            scheme:"Scheme of Work",

            lessonPlan:"Lesson Plan",

            lessonNotes:"Lesson Notes",

            learningActivities:"Learning Activities",

            assessment:"Assessment",

            record:"Record of Work",

            resource:"Learning Resource"

        }[type] || "Document";

    }

    function getItemTitle(type,item){

        if(!item) return "Untitled";

        if(type==="record")
            return `Week ${item.weekNumber} • Lesson ${item.lessonNumber}`;

        if(type==="resource")
            return item.title || item.originalFileName || item.name;

        return item.title || item.lessonTitle || "Document";

    }

    function openItem(type,item){

        if(!item) return;

        studio.setSelectedItem(item);

        studio.setSelectedType(type);

        studio.setActiveId(item._id);

        studio.setEditMode(false);

        studio.setShowTools(false);

    }

    function addToTray(type,item){

        if(!item) return;

        studio.setInTray(prev=>{

            const exists=prev.find(x=>x.id===item._id);

            if(exists) return prev;

            return [

                {

                    id:item._id,

                    type,

                    title:getItemTitle(type,item),

                    item

                },

                ...prev

            ];

        });

    }

    return{

        labelType,

        getItemTitle,

        openItem,

        addToTray

    };

}