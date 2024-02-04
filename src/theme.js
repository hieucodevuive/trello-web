import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { orange, teal, deepOrange, cyan } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  light: {
    colorSchemes: {
      palette: {
        primary: {
          primary: teal,
          secondary: deepOrange
        }
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  }
  // ...other properties
})

export default theme