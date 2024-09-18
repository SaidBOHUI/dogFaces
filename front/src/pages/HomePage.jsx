import { Box } from '@mui/material'
import React from 'react'
import Banner from '../assets/backgroundDogs.webp'

const HomePage = () => {
  return (
		<Box
		variant="container"
		sx={{
			minHeight: "100vh",
			background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${Banner})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundSize: "cover",
		}}
		>
            {/* <DessinCanvas /> */}
        </Box>
  )
}

export default HomePage