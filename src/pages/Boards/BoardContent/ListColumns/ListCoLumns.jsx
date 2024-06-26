import Box from '@mui/material/Box'
import CoLumn from './Column/CoLumn'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { toast } from 'react-toastify'

function ListCoLumns(props) {
  const { columns, createNewColumn, createNewCard, handleDeleteColumnDetails } = props

  const [openNewColumnForm, setopenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setopenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async() => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title')
      return
    }

    const newColumnData = {
      title: newColumnTitle
    }

    await createNewColumn(newColumnData)

    //Dong trang thai them column
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
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
          <CoLumn
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            handleDeleteColumnDetails={handleDeleteColumnDetails}
          />
        ))}
        {
          !openNewColumnForm
            ?<Box onClick={toggleOpenNewColumnForm} sx={{
              minWidth: '250px',
              maxWidth: '250px',
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
            :<Box sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                label="Enter column title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white'
                    },
                    '&:hover fieldset': {
                      borderColor: 'white'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white'
                    }
                  }
                }}/>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Button
                  onClick={ addNewColumn }
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    boder: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main
                  }}
                >Add Column</Button>
                <CloseIcon
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                  fontSize='small'
                  onClick={toggleOpenNewColumnForm}
                />
              </Box>
            </Box>
        }
        {/* Add new column button */}
      </Box>
    </SortableContext>
  )
}

export default ListCoLumns
