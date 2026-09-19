import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import { downloadReport } from "../api/reports.api";

import {

    Paper,

    Typography,

    Table,

    TableHead,

    TableBody,

    TableRow,

    TableCell,

    Chip,

    IconButton

} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteIcon from "@mui/icons-material/Delete";

import DownloadIcon from "@mui/icons-material/Download";

import DescriptionIcon from "@mui/icons-material/Description";

import EmptyState from "../components/common/EmptyState";

import { useNavigate } from "react-router-dom";

import {

    getReports,

    deleteReport

} from "../api/reports.api";

function Reports(){

    const [reports,setReports]=useState([]);

    const navigate=useNavigate();

    useEffect(()=>{

        loadReports();

    },[]);

    async function loadReports(){

        const data=await getReports();

        setReports(data);

    }

    async function handleDownload(id) {

    try {

        const blob = await downloadReport(id);

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `CyberMind_Report_${id}.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    }

    catch (error) {

        console.error(error);

    }

}

    async function handleDelete(id){

        await deleteReport(id);

        loadReports();

    }

    return(

        <Layout>

            <Typography

                variant="h4"

                fontWeight="bold"

                mb={4}

            >

                AI Reports

            </Typography>

            <Paper

                variant="outlined"

                sx={{

                    borderRadius:3

                }}

            >

                {

                    reports.length === 0

                        ? (

                            <EmptyState

                                icon={<DescriptionIcon />}

                                title="No reports generated yet"

                                description="Generate an AI report from an alert investigation to see it listed here."

                            />

                        )

                        : (

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Alert

                            </TableCell>

                            <TableCell>

                                Severity

                            </TableCell>

                            <TableCell>

                                Generated

                            </TableCell>

                            <TableCell>

                                Actions

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            reports.map(report=>(

                                <TableRow key={report.id} hover>

                                    <TableCell>

                                        {report.title}

                                    </TableCell>

                                    <TableCell>

                                        <Chip

                                            size="small"

                                            label={report.severity}

                                            color={

                                                report.severity==="critical"

                                                ?

                                                "error"

                                                :

                                                "warning"

                                            }

                                        />

                                    </TableCell>

                                    <TableCell>

                                        {

                                            new Date(

                                                report.created_at

                                            ).toLocaleString()

                                        }

                                    </TableCell>

                                    <TableCell>

                                        <IconButton

                                            onClick={()=>navigate(

                                                `/reports/${report.id}`

                                            )}

                                        >

                                            <VisibilityIcon/>

                                        </IconButton>

                                        <IconButton
                                        
                                            
                                              onClick={()=>handleDownload(report.id)}                            
                                        >

                                            <DownloadIcon/>

                                        </IconButton>

                                        <IconButton

                                            color="error"

                                            onClick={()=>handleDelete(

                                                report.id

                                            )}

                                        >

                                            <DeleteIcon/>

                                        </IconButton>

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

                        )

                }

            </Paper>

        </Layout>

    );

}

export default Reports;