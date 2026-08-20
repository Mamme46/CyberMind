import {

    BrowserRouter,

    Routes,

    Route

} from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Uploads from "./pages/Uploads";
import UploadDetails from "./pages/UploadDetails";
import Alerts from "./pages/Alerts";
import AlertDetails from "./pages/AlertDetails";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import SecurityAssessment
    from "./pages/SecurityAssessment";

function App(){

    return(
      <>
        <CssBaseline />
        <BrowserRouter>

            <Routes>

                <Route

                    path="/"

                    element={<Auth/>}

                />

                <Route

                    path="/dashboard"

                    element={<Dashboard/>}

                />
                <Route

                    path="/uploads"

                    element={<Uploads/>}

                />

                <Route

                    path="/uploads/:id"

                    element={<UploadDetails/>}

                />

                <Route
                    path="/alerts"
                    element={<Alerts />}
                />

                <Route
                    path="/alerts/:id"
                    element={<AlertDetails />}
                />

                <Route

                    path="/ai"

                    element={<AIAssistant/>}

                />

                <Route

                    path="/reports"

                    element={<Reports/>}

                />

                <Route

                    path="/reports/:id"

                    element={<ReportDetails/>}

                />

                <Route
                    path="/security"
                    element={<SecurityAssessment />}
                />

            </Routes>

        </BrowserRouter>
      </>

    );

}

export default App;