import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {

    Card,

    CardContent,

    Typography,

    Grid,

    Button,

    Divider

} from "@mui/material";

import { getUpload } from "../api/upload.api";

function UploadDetails() {

    const { id } = useParams();

    const [upload, setUpload] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getUpload(id);

            setUpload(data);

        }

        load();

    }, [id]);

    if (!upload)

        return <Typography>Loading...</Typography>;

    return (

        <Card sx={{ m: 4 }}>

            <CardContent>

                <Typography variant="h4">

                    {upload.original_name}

                </Typography>

                <Divider sx={{ my: 3 }}/>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 6 }}>

                        <Typography>

                            <strong>ID :</strong> {upload.id}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography>

                            <strong>Date :</strong>{" "}

                            {

                                new Date(

                                    upload.uploaded_at

                                ).toLocaleString()

                            }

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography>

                            <strong>Type :</strong>

                            {upload.mime_type}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 6 }}>

                        <Typography>

                            <strong>Size :</strong>

                            {upload.file_size} bytes

                        </Typography>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }}/>

                <Grid container spacing={2}>

                    <Grid>

                        <Button

                            variant="contained"

                        >

                            Logs

                        </Button>

                    </Grid>

                    <Grid>

                        <Button

                            variant="contained"

                            color="warning"

                        >

                            Alerts

                        </Button>

                    </Grid>

                    <Grid>

                        <Button

                            variant="contained"

                            color="success"

                        >

                            Investigation

                        </Button>

                    </Grid>

                    <Grid>

                        <Button

                            variant="contained"

                            color="secondary"

                        >

                            AI Analysis

                        </Button>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}

export default UploadDetails;