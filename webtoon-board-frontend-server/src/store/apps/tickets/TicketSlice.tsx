import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../../Store';
import { getRegisteredNaverWebtoonAllInfoNoOffset } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import { getCookie } from 'cookies-next';
import { LOGIN_COOKIE_NAME } from '@/backend-api/auth/LoginChecker';
interface StateType {
  tickets: any[];
  currentFilter: string;
  ticketSearch: string;
}

const initialState = {
  tickets: [],
  currentFilter: 'naver_webtoon',
  ticketSearch: '',
};

export const TicketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    getTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    SearchTicket: (state, action) => {
      state.ticketSearch = action.payload;
    },
    DeleteTicket: (state: StateType, action) => {
      const index = state.tickets.findIndex((ticket) => ticket.Id === action.payload);
      state.tickets.splice(index, 1);
    }
  },
});

export const { getTickets, setVisibilityFilter, SearchTicket, DeleteTicket } = TicketSlice.actions;

function a() {
  const wakeUpTime = Date.now() + 5000;
  while (Date.now() < wakeUpTime) {}
}

export const fetchTickets = (result: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getTickets(result));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default TicketSlice.reducer;