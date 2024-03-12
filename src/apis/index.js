import axios from 'axios'
import { API_ROOT } from '~/utils/constans'

export const fetchBoardDetailsAPI = async(boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios se tra ve ket qua thong qua data
  return response.data
}