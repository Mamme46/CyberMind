import { useEffect, useState } from "react";

import {

    Paper,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider,
    Box,
    Button,
    Alert,
    CircularProgress

} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useNavigate } from "react-router-dom";

import {
    getUploads,
    uploadLog
} from "../api/upload.api";


function Uploads() {

    const navigate = useNavigate();

    const [uploads, setUploads] = useState([]);

    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");


    // ---------------------------------
    // Charger les uploads
    // ---------------------------------

    async function loadUploads() {

        try {

            const data = await getUploads();

            setUploads(data);

        }

        catch (err) {

            console.error(
                "Unable to load uploads:",
                err
            );

        }

    }


    useEffect(() => {

        loadUploads();

    }, []);


    // ---------------------------------
    // Sélection fichier
    // ---------------------------------

    function handleFileChange(event) {

        const selectedFile =
            event.target.files[0];

        setFile(selectedFile || null);

        setSuccess("");
        setError("");

    }


    // ---------------------------------
    // Upload
    // ---------------------------------

    async function handleUpload() {

        if (!file) {

            setError(
                "Please select a log file."
            );

            return;

        }

        setUploading(true);

        setSuccess("");
        setError("");

        try {

            await uploadLog(file);

            setSuccess(
                "Log file uploaded and analyzed successfully."
            );

            setFile(null);

            /*
             * Recharge la liste afin que
             * le nouveau fichier apparaisse.
             */
            await loadUploads();

        }

        catch (err) {

            console.error(
                "Upload failed:",
                err
            );

            setError(

                err.response?.data?.message ||

                "Unable to upload the log file."

            );

        }

        finally {

            setUploading(false);

        }

    }


    return (

        <Paper sx={{ p: 4 }}>

            {/* --------------------------- */}
            {/* Upload                     */}
            {/* --------------------------- */}

            <Typography
                variant="h4"
                mb={3}
            >
                Uploaded Files
            </Typography>


            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: "#f9fafb"
                }}
            >

                <Typography
                    variant="h6"
                    mb={1}
                >
                    Upload Log File
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                >
                    Select a log file to analyze
                    it with CyberMind.
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    {/* Input caché */}

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={
                            <DescriptionIcon />
                        }
                    >

                        Choose File

                        <input
                            type="file"
                            hidden
                            onChange={
                                handleFileChange
                            }
                        />

                    </Button>


                    {/* Nom du fichier */}

                    {file && (

                        <Typography
                            variant="body2"
                        >
                            {file.name}
                        </Typography>

                    )}


                    {/* Bouton Upload */}

                    <Button
                        variant="contained"
                        startIcon={
                            uploading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : (
                                    <UploadFileIcon />
                                )
                        }
                        disabled={
                            !file || uploading
                        }
                        onClick={
                            handleUpload
                        }
                    >

                        {
                            uploading
                                ? "Uploading..."
                                : "Upload"
                        }

                    </Button>

                </Box>


                {success && (

                    <Alert
                        severity="success"
                        sx={{ mt: 2 }}
                    >
                        {success}
                    </Alert>

                )}


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Alert>

                )}

            </Paper>


            {/* --------------------------- */}
            {/* Liste des fichiers          */}
            {/* --------------------------- */}

            <List>

                {

                    uploads.map(upload => (

                        <div key={upload.id}>

                            <ListItemButton

                                onClick={() =>

                                    navigate(

                                        `/uploads/${upload.id}`

                                    )

                                }

                            >

                                <ListItemIcon>

                                    <DescriptionIcon
                                        color="primary"
                                    />

                                </ListItemIcon>


                                <ListItemText

                                    primary={
                                        upload.original_name
                                    }

                                    secondary={

                                        new Date(

                                            upload.uploaded_at

                                        ).toLocaleString()

                                    }

                                />


                                <Chip

                                    label="Open"

                                    color="success"

                                />

                            </ListItemButton>


                            <Divider />

                        </div>

                    ))

                }

            </List>

        </Paper>

    );

}

export default Uploads;