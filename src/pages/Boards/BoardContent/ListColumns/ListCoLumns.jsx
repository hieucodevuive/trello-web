import Box from '@mui/material/Box'
import CoLumn from './Column/CoLumn'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

function ListCoLumns(props) {
  const { columns } = props
  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden'
    }}>
      {/* columns */}
      {columns?.map(column => (
        <CoLumn key={column._id} column={column}/>
      ))}

      {/* Add new column button */}
      <Box sx={{
        minWidth: '200px',
        maxWidth: '200px',
        mx: 2,
        borderRadius: '6px',
        height: 'fit-content',
        bgcolor: '#ffffff3d'
      }}>
        <Button
          startIcon={<NoteAddIcon/>}
          sx={{
            color: 'white',
            width: '100%',
            py: 1
          }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListCoLumns
