import {

    Card,

    Box,

    Typography

} from "@mui/material";

function StatCard({

    title,

    value,

    color,

    icon

}) {

    return (

        <Card

            elevation={4}

            sx={{

                background: color,

                color: "white",

                borderRadius: 4,

                height: 95,

                px: 2,

                py: 1.5,

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                transition: ".25s",

                cursor: "pointer",

                "&:hover":{

                    transform:"translateY(-5px)",

                    boxShadow:8

                }

            }}

        >

            <Box>

                <Typography

                    sx={{

                        fontSize:16,

                        opacity:.85

                    }}

                >

                    {title}

                </Typography>

                <Typography

                    sx={{

                        fontSize:30,

                        fontWeight:"bold",

                        mt:.5

                    }}

                >

                    {value}

                </Typography>

                <Typography

                    sx={{

                        opacity:.75,

                        mt:.5,

                        fontSize:11

                    }}

                >

                </Typography>

            </Box>

            <Box

                sx={{

                    opacity:.20

                }}

            >

                {icon}

            </Box>

        </Card>

    );

}

export default StatCard;