import axios from 'axios'
import { API_ROOT } from '~/utils/constans'

//Board
export const fetchBoardDetailsAPI = async(boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios se tra ve ket qua thong qua data
  return response.data
}

export const updateBoardDetailsAPI = async(boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //axios se tra ve ket qua thong qua data
  return response.data
}

//Column
export const createNewColumnAPI = async(newColumn) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumn)
  return response.data
}

export const updateColumnDetailsAPI = async(columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  //axios se tra ve ket qua thong qua data
  return response.data
}

//Card
export const createNewCardAPI = async(newCard) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCard)
  return response.data
}

export const moveCardToDiffColumnAPI = async(updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  //axios se tra ve ket qua thong qua data
  return response.data
}


