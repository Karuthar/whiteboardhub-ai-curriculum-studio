import {

  uploadCurriculum as uploadCurriculumService,

  parseCurriculum as parseCurriculumService,

  generateScheme as generateSchemeService

} from "./services/curriculum.service";
import useStudio from "./hooks/useStudio";
import useStudioApi from "./hooks/useStudioApi";
import CurriculumStudio from "./pages/CurriculumStudio/CurriculumStudio";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import RichTextEditor from "./components/RichTextEditor";
import useDocumentEngine from "./hooks/useDocumentEngine";
import useResourceEngine from "./hooks/useResourceEngine";
import useLessonEngine from "./hooks/useLessonEngine";
import useComposerEngine from "./hooks/useComposerEngine";
import usePreviewEngine from "./hooks/usePreviewEngine";
import useDownloadEngine from "./hooks/useDownloadEngine";
import useAIEngine from "./hooks/useAIEngine";
import useTemplateEngine from "./hooks/useTemplateEngine";

const API = "http://localhost:7000/api";

function App() {
  const studio = useStudio();
  const documents = useDocumentEngine(studio);
  const resources = useResourceEngine(studio);
  const lessons = useLessonEngine(studio);
  const composer = useComposerEngine(studio);
  const preview = usePreviewEngine(studio);
  const download = useDownloadEngine(studio);
  const ai = useAIEngine(studio);
  const template = useTemplateEngine(studio);

  const {

    generateLessonPlan,

    generateLessonPackage,

    generateRecordOfWork

} = lessons;

const {

    buildComposerDocument,

    buildEditableHtml,

    buildUniversalTemplateHtml,

    renderComposer

} = composer;

const {

    renderDocumentPreview,

    renderEducationHeader,

    renderDocumentDetailsPanel

} = preview;

const {

    completeCustomization,

    downloadSelectedDocument

} = download;

const {

    uploadCurriculum,

    parseCurriculum,

    generateScheme

} = ai;

const {

    buildComposerDocument,

    buildEditableHtml,

    buildUniversalTemplateHtml

} = template;

  const {

    labelType,

    getItemTitle,

    openItem,

    addToTray

} = documents;

const {

    uploadLearningResources,

    insertSelectedResource,

    renderResourceSidePreview

} = resources;

  const resources = useResourceEngine(studio);
  const {

    labelType,

    getItemTitle,

    openItem,

    addToTray

  } = documents;

  const api = useStudioApi(studio);
  const editorRef = useRef(null);

  const [inTray, setInTray] = useState([]);
  const [composerDocs, setComposerDocs] = useState({});
  const [finalPreviewDocs, setFinalPreviewDocs] = useState({});
  const [savedCustomDocumentIds, setSavedCustomDocumentIds] = useState({});

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [activeId, setActiveId] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedSchemeLesson, setSelectedSchemeLesson] = useState(null);

  const [curriculumId, setCurriculumId] = useState("");
  const [schemeId, setSchemeId] = useState("");
  const [lessonPlanId, setLessonPlanId] = useState("");

  const [termNumber, setTermNumber] = useState(1);
  const [weekNumber, setWeekNumber] = useState(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [lessonDuration, setLessonDuration] = useState(40);

  const [documentDetails, setDocumentDetails] = useState({
  schoolName: "",
  teacherName: "",
  classGrade: "",
  academicYear: "",
  term: "",
  week: "",
  lesson: "",
  references: ""
});

  useEffect(() => {

   api.loadDashboard();

}, []);

  function buildEditableHtml(type, item) {
  if (!item) return "";

  const details = `
    <table class="details-table">
      <tr>
        <td><strong>School:</strong> ${documentDetails.schoolName || ""}</td>
        <td><strong>Teacher:</strong> ${documentDetails.teacherName || ""}</td>
      </tr>

      <tr>
        <td><strong>Class:</strong> ${documentDetails.classGrade || ""}</td>
        <td><strong>Academic Year:</strong> ${documentDetails.academicYear || ""}</td>
      </tr>

      <tr>
        <td><strong>Term:</strong> ${documentDetails.term || ""}</td>
        <td><strong>Week/Lesson:</strong> ${documentDetails.week || ""} / ${documentDetails.lesson || ""}</td>
      </tr>
    </table>
  `;

  if (type === "scheme") {
    const lessons = item.lessons || [];

    return `
      <div class="professional-document scheme-document">

        <h1>${item.title || "Scheme of Work"}</h1>

        ${details}

        <table class="professional-table">

          <thead>
            <tr>
              <th>Term</th>
              <th>Week</th>
              <th>Lesson</th>
              <th>Strand</th>
              <th>Sub-Strand</th>
              <th>Specific Learning Outcomes</th>
              <th>Key Inquiry Questions</th>
              <th>Learning Experiences</th>
              <th>Resources</th>
              <th>Assessment</th>
              <th>Reflections</th>
            </tr>
          </thead>

          <tbody>

            ${lessons
              .map(
                (lesson) => `
              <tr>
                <td>${lesson.termNumber || ""}</td>
                <td>${lesson.weekNumber || ""}</td>
                <td>${lesson.lessonNumber || ""}</td>
                <td>${lesson.strand || ""}</td>
                <td>${lesson.subStrand || ""}</td>
                <td>${lesson.objectives || ""}</td>
                <td>${lesson.keyInquiryQuestions || ""}</td>
                <td>${lesson.learningExperiences || ""}</td>
                <td>${lesson.resources || ""}</td>
                <td>${lesson.assessmentMethods || ""}</td>
                <td>${lesson.reflections || ""}</td>
              </tr>
            `
              )
              .join("")}

          </tbody>

        </table>

        <div class="references-section">
          <h3>References</h3>
          <p>${documentDetails.references || ""}</p>
        </div>

      </div>
    `;
  }

  if (type === "lessonPlan") {
    return `
      <div class="professional-document lesson-plan-document">

        <h1>${item.lessonTitle || "Lesson Plan"}</h1>

        ${details}

        <table class="professional-table">

          <tbody>

            <tr>
              <th>Strand</th>
              <td>${item.strand || ""}</td>
            </tr>

            <tr>
              <th>Sub-Strand</th>
              <td>${item.subStrand || ""}</td>
            </tr>

            <tr>
              <th>Specific Learning Outcomes</th>
              <td>${item.objectives || ""}</td>
            </tr>

            <tr>
              <th>Learning Experiences</th>
              <td>${item.learningExperiences || ""}</td>
            </tr>

            <tr>
              <th>Resources</th>
              <td>${item.resources || ""}</td>
            </tr>

            <tr>
              <th>Assessment</th>
              <td>${item.assessmentMethods || ""}</td>
            </tr>

          </tbody>

        </table>

        <div class="references-section">
          <h3>References</h3>
          <p>${documentDetails.references || ""}</p>
        </div>

      </div>
    `;
  }

  return `
    <div class="professional-document">

      <h1>${item.title || "Document"}</h1>

      ${details}

      <div>
        ${
          item.contentHtml ||
          item.content ||
          "<p>No content available.</p>"
        }
      </div>

      <div class="references-section">
        <h3>References</h3>
        <p>${documentDetails.references || ""}</p>
      </div>

    </div>
  `;
}

  function beginCustomization() {
  if (!selectedItem || !activeId) {
    setMessage("Select a document first.");
    return;
  }

  const structuredContent = buildEditableHtml(selectedType, selectedItem) || "";

  setComposerDocs((prev) => ({
    ...prev,
    [activeId]: structuredContent
  }));

  setFinalPreviewDocs((prev) => {
    const copy = { ...prev };
    if (selectedType === "scheme") delete copy[activeId];
    return copy;
  });

  setFinalPreviewDocs((prev) => {
  const copy = { ...prev };

  if (selectedType === "scheme") {
    delete copy[activeId];
  }

  return copy;
});

  setEditMode(true);
  setShowTools(false);

  setMessage(`Edit mode enabled for ${labelType(selectedType)}.`);
}

  function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function updateDocumentDetail(field, value) {
  setDocumentDetails((prev) => ({
    ...prev,
    [field]: value
  }));
}

function selectSchemeLesson(term, week, lesson) {
  setSelectedSchemeLesson({
    termNumber: term.termNumber,
    weekNumber: week.weekNumber,
    lessonNumber: lesson.lessonNumber,

    strand: lesson.strand,

    subStrand: lesson.subStrand,

    learningOutcomes:
      lesson.learningOutcomes || []
  });

  setTermNumber(term.termNumber);

  setWeekNumber(week.weekNumber);

  setLessonNumber(lesson.lessonNumber);

  setMessage(
    `Selected Week ${week.weekNumber} Lesson ${lesson.lessonNumber}`
  );
}

function renderResourceSidePreview() {
  if (!selectedResource) {
    return (
      <div className="resource-side-preview">
        <strong>Resource Preview</strong>
        <p>Select a resource from Active In-Tray or Stored Resources.</p>
      </div>
    );
  }

  const fileUrl =
    selectedResource.url ||
    `http://localhost:7000${selectedResource.previewUrl}`;

  const isImage =
    selectedResource.resourceType === "image" ||
    selectedResource.mimeType?.startsWith("image/");

  const isVideo =
    selectedResource.resourceType === "video" ||
    selectedResource.mimeType?.startsWith("video/");

  const hasExtractedText =
    selectedResource.extractedText &&
    selectedResource.extractedText.trim().length > 0;

  return (
    <div className="resource-side-preview">
      <strong>Resource Preview</strong>

      <p className="resource-title">
        {selectedResource.title || selectedResource.originalFileName || selectedResource.name}
      </p>

      {isImage && (
        <img
          src={fileUrl}
          alt={selectedResource.title || "Learning Resource"}
          className="resource-image-preview"
        />
      )}

      {isVideo && (
        <video
          src={fileUrl}
          controls
          className="resource-video-preview"
        />
      )}

      {hasExtractedText && (
        <div className="resource-text-preview">
          {selectedResource.extractedText}
        </div>
      )}

      {!isImage && !isVideo && !hasExtractedText && (
        <p className="resource-file-preview">
          No extracted preview available yet.
        </p>
      )}
    </div>
  );
}

function renderEditor() {
  return (
    <div className="editor-shell">
      <RichTextEditor
        content={composerDocs[activeId] || ""}
        onChange={(html) =>
          setComposerDocs((prev) => ({
            ...prev,
            [activeId]: html
          }))
        }
        selectedResource={selectedResource}
      />
    </div>
  );
}

  function DockGroup({ title, items, type, label }) {
    return (
      <div className="dock-group">
        <button className="dock-button">{title}</button>
        <div className="dock-menu">
          {items.length === 0 && <div className="dock-item">No saved items.</div>}
          {items.map((item) => (
            <div
              key={item._id}
              className={activeId === item._id ? "dock-item active-item" : "dock-item"}
              onClick={() => openItem(type, item)}
            >
              <strong>{label(item)}</strong>
              <small>
                Type: {labelType(type)}<br />
                Grade/Level: {item.grade || "10"}<br />
                Subject/Learning Area: {item.subject || "Biology"}
              </small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
  <div className="app-page">

    <DashboardPage
      setCurricula={setCurricula}
      setSchemes={setSchemes}
      setLessonPlans={setLessonPlans}
      setLessonPackages={setLessonPackages}
      setRecords={setRecords}
      setResources={setResources}
    />

    <header className="top-header">
      <h1>WhiteboardHub AI Curriculum Studio</h1>

      <p>
        Curriculum → Scheme → Lesson Plan → Notes → Activities → Assessment → Export
      </p>

      <section className="feature-links">
        <button>Curriculum Studio</button>
        <button>Assessment Engine</button>
        <button>Practical Work</button>
        <button>Projects Engine</button>
        <button>AI Resource Index</button>
      </section>
    </header>

    <main className="workspace">
      <section className="left-panel">
        <button onClick={loadDashboard}>Refresh Workspace</button>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <CurriculumStudio
    file={file}
    loading={loading}

    curriculumId={curriculumId}

    setCurriculumId={setCurriculumId}

    setLoading={setLoading}

    setMessage={setMessage}

    addToTray={addToTray}

    loadDashboard={loadDashboard}
/>

        <div className="selector-grid">
  <label>
    Term
    <select
      value={termNumber}
      onChange={(e) => setTermNumber(Number(e.target.value))}
    >
      <option value={1}>Term 1</option>
      <option value={2}>Term 2</option>
      <option value={3}>Term 3</option>
    </select>
  </label>

  <label>
    Week
    <input
      type="number"
      value={weekNumber}
      onChange={(e) => setWeekNumber(Number(e.target.value))}
    />
  </label>

  <label>
    Lesson
    <input
      type="number"
      value={lessonNumber}
      onChange={(e) => setLessonNumber(Number(e.target.value))}
    />
  </label>

  <label>
    Duration
    <select
      value={lessonDuration}
      onChange={(e) => setLessonDuration(Number(e.target.value))}
    >
      <option value={40}>Single - 40 min</option>
      <option value={80}>Double - 80 min</option>
    </select>
  </label>
</div>

{selectedSchemeLesson && (
  <div className="selected-trace-box">
    <strong>Selected Scheme Row</strong>

    <span>
      Term {selectedSchemeLesson.termNumber} • Week{" "}
      {selectedSchemeLesson.weekNumber} • Lesson{" "}
      {selectedSchemeLesson.lessonNumber}
    </span>

    <small>
      {selectedSchemeLesson.subStrand || "Selected lesson"}
    </small>
  </div>
)}

<button
  disabled={!schemeId || loading}
  onClick={generateLessonPlan}
>
  {selectedSchemeLesson
    ? "Generate Lesson Plan from Selected Row"
    : "Generate Lesson Plan"}
</button>

        <button disabled={!lessonPlanId || loading} onClick={generateRecordOfWork}>
          Generate Record of Work
        </button>

        <div className="package-menu">
          <button
            disabled={!lessonPlanId || loading}
            onClick={() => setShowPackageMenu(!showPackageMenu)}
          >
            Lesson Package Generators ▾
          </button>

          {showPackageMenu && (
            <div className="package-dropdown">
              <button onClick={() => generateLessonPackage("lessonNotes")}>
                Generate Lesson Notes
              </button>

              <button onClick={() => generateLessonPackage("learningActivities")}>
                Generate Learning Activities and Resources
              </button>

              <button onClick={() => generateLessonPackage("assessment")}>
                Generate Lesson Assessments
              </button>
            </div>
          )}
        </div>

        <div className="resource-upload">
          <input
            multiple
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.txt"
            onChange={(e) => setResourceFiles(e.target.files)}
          />

          <button onClick={uploadResourcePlaceholder}>
            Upload Learning Resources
          </button>
        </div>

        <div className="tray-panel">
          <strong>Active In-Tray</strong>

          {inTray.length === 0 && <p>No active items yet.</p>}

          {inTray.map((entry) => (
            <button
              key={`${entry.type}-${entry.id}`}
              className={activeId === entry.id ? "tray-item active-button" : "tray-item"}
              onClick={() => openItem(entry.type, entry.item)}
            >
              {entry.title}
            </button>
          ))}
        </div>

        {message && <div className="message">{message}</div>}
      </section>

      <section className="right-panel">
        <div className="preview-panel">
  <div
    className={
      selectedResource
        ? "preview-composer-grid has-resource"
        : "preview-composer-grid no-resource"
    }
  >
    <div
  className="main-document-preview"
  style={{
    width: "100%",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "78vh",
    paddingBottom: "20px",
    background: "#f3f4f6"
  }}
>

  <div
    style={{
      minWidth:
        selectedType === "scheme" ||
        selectedType === "curriculum"
          ? "1900px"
          : "100%",
      padding: "20px"
    }}
  >
    {renderComposer()}
  </div>

</div>

    {selectedResource && renderResourceSidePreview()}
    </div>
    </div>

        <div className="smart-actions">
  <button
    className="customize-btn"
    disabled={!selectedItem || loading}
    onClick={editMode ? completeCustomization : beginCustomization}
  >
    {editMode ? "Complete Customization" : "Customize Selected Document"}
  </button>

  <button
    disabled={!selectedItem || loading}
    onClick={completeCustomization}
  >
    Save Changes
  </button>

  <button
    disabled={editMode || !selectedItem || loading}
    onClick={downloadSelectedDocument}
   >
    Download Selected Document
     </button>
     </div>

        <div className="document-dock">
          <DockGroup
            title="Stored Curricula"
            items={curricula}
            type="curriculum"
            label={(i) => i.title}
          />

          <DockGroup
            title="Stored Schemes"
            items={schemes}
            type="scheme"
            label={(i) => i.title}
          />

          <DockGroup
            title="Stored Lesson Plans"
            items={lessonPlans}
            type="lessonPlan"
            label={(i) => i.lessonTitle}
          />

          <DockGroup
            title="Stored Lesson Notes"
            items={lessonPackages}
            type="lessonNotes"
            label={() => "Lesson Notes"}
          />

          <DockGroup
            title="Stored Learning Activities & Resources"
            items={lessonPackages}
            type="learningActivities"
            label={() => "Activities & Resources"}
          />

          <DockGroup
            title="Stored Resources"
            items={learningResources}
            type="resource"
            label={(i) => i.title || i.originalFileName}
          />

          <DockGroup
            title="Stored Assessments"
            items={lessonPackages}
            type="assessment"
            label={() => "Assessment Items"}
          />

          <DockGroup
            title="Stored Records of Work"
            items={recordsOfWork}
            type="record"
            label={(i) => `Week ${i.weekNumber} • Lesson ${i.lessonNumber}`}
          />
        </div>
      </section>
    </main>
  </div>
);
}

export default App;
