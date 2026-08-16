import axios from "axios";

const API = "http://localhost:7000/api";

export default function useStudioApi(studio) {

  async function loadDashboard() {

    try {

      studio.setLoading(true);

      const [

        curricula,

        schemes,

        lessonPlans,

        lessonPackages,

        records,

        resources

      ] = await Promise.all([

        axios.get(`${API}/curriculum`),
        axios.get(`${API}/schemes`),
        axios.get(`${API}/lesson-plans`),
        axios.get(`${API}/lesson-packages`),
        axios.get(`${API}/records-of-work`),
        axios.get(`${API}/learning-resources`)

      ]);

      studio.setCurricula(curricula.data || []);
      studio.setSchemes(schemes.data || []);
      studio.setLessonPlans(lessonPlans.data || []);
      studio.setLessonPackages(lessonPackages.data || []);
      studio.setRecords(records.data || []);
      studio.setResources(resources.data || []);

    } catch (err) {

      console.error(err);

      studio.setMessage("Failed loading dashboard.");

    } finally {

      studio.setLoading(false);

    }

  }

  return {

    loadDashboard

  };

}