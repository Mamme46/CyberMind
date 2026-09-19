import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {

    Card,

    CardContent,

    Typography,

    Grid,

    Button,

    Divider,

    Box,

    CircularProgress

} from "@mui/material";

import { getUpload } from "../api/upload.api";

import Layout from "../components/layout/Layout";

function UploadDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [upload, setUpload] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getUpload(id);

            setUpload(data);

        }

        load();

    }, [id]);

    if (!upload)

        return (

            <Layout>

                <Box

                    sx={{

                        display: "flex",

                        justifyContent: "center",

                        mt: 10

                    }}

                >

                    <CircularProgress />

                </Box>

            </Layout>

        );

    return (

        <Layout>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>

            <CardContent sx={{ p: 4 }}>

                <Typography variant="h5">

                    {upload.original_name}

                </Typography>

                <Divider sx={{ my: 3 }}/>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 6 }}>

                        <Typography variant="caption" color="text.secondary" display="block">ID</Typography>

                        <Typography variant="body2">{upload.id}</Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography variant="caption" color="text.secondary" display="block">Date</Typography>

                        <Typography variant="body2">

                            {

                                new Date(

                                    upload.uploaded_at

                                ).toLocaleString()

                            }

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography variant="caption" color="text.secondary" display="block">Type</Typography>

                        <Typography variant="body2">{upload.mime_type}</Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography variant="caption" color="text.secondary" display="block">Size</Typography>

                        <Typography variant="body2">{upload.file_size} bytes</Typography>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }}/>

                <Grid container spacing={1.5}>

                    <Grid>

                        <Button

                            variant="contained"

                            onClick={() => navigate(`/uploads/${id}/logs`)}

                        >

                            Logs

                        </Button>

                    </Grid>

                    <Grid>

                        <Button

                            variant="outlined"

                            onClick={() => navigate(`/alerts?uploadId=${id}`)}

                        >

                            Alerts

                        </Button>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

        </Layout>

    );

}

export default UploadDetails;