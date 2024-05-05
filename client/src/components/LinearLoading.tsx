import {Box, CircularProgress} from "@mui/material"

const LinearLoading = () => {
    return(
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
            <CircularProgress />
        </Box>
    )
}

export default LinearLoading;