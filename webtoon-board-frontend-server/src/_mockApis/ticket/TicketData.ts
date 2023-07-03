import mock from '../mock';
import { Chance } from 'chance';
import { TicketType } from '../../types/apps/ticket';

const TicketData: TicketType[] = [];

mock.onGet('/api/data/ticket/TicketData').reply(() => {
  return [];
});
export default TicketData;
