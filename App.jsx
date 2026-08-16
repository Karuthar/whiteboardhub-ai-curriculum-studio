import { useState } from "react";
import "./App.css";

import AppShell from "./pages/AppShell/AppShell";
import WorkflowLauncher from "./pages/WorkflowLauncher/WorkflowLauncher";
import CurriculumUploadGateway from "./pages/CurriculumUploadGateway/CurriculumUploadGateway";
import GatewayChoice from "./pages/Auth/GatewayChoice";

import useStudio from "./hooks/useStudio";

import { StudioProvider } from "./contexts/StudioContext";
import { SessionProvider } from "./contexts/SessionContext";

export default function App() {

    const studio = useStudio();

    const [accessMode, setAccessMode] = useState(null);
    const [workflow, setWorkflow] = useState(null);

    /*
    ===========================================================
    STEP 1
    Guest / Member Selection
    ===========================================================
    */

    if (!accessMode) {

        return (

            <GatewayChoice

                onGuest={() => setAccessMode("guest")}

                onRegister={() => setAccessMode("member")}

            />

        );

    }

    /*
    ===========================================================
    STEP 2
    Workflow Launcher
    ===========================================================
    */

    if (!workflow) {

        return (

            <WorkflowLauncher

                onContinue={setWorkflow}

            />

        );

    }

    /*
    ===========================================================
    STEP 3
    Studio
    ===========================================================
    */

    return (

        <StudioProvider

            value={{

                ...studio,

                workflow,

                accessMode

            }}

        >

            <SessionProvider

                value={{

                    accessMode,

                    workflow

                }}

            >

                {

                    workflow.curriculum

                        ? <AppShell />

                        : <CurriculumUploadGateway />

                }

            </SessionProvider>

        </StudioProvider>

    );

}