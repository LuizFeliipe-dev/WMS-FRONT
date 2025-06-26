import { ApiResponse } from '@/types/apiResponse';
import { GetParams } from '@/types/getParams';
import { IZone } from '@/types/zone';
import { request } from './httpService';

type ZonePayload = { name: string };

export const zoneService = {
  getAll: (params?: GetParams): Promise<ApiResponse<IZone>> => {
    return request<ApiResponse<IZone>>('get', '/zone', params);
  },

  getById: (id: string): Promise<IZone> => {
    return request<IZone>('get', `/zone/${id}`);
  },

  create: (data: ZonePayload): Promise<IZone> => {
    return request<IZone>('post', '/zone', data);
  },

  update: (id: string, data: ZonePayload): Promise<IZone> => {
    return request<IZone>('put', `/zone?zoneId=${id}`, data);
  },

  inactivate: (zoneId: string): Promise<IZone> => {
    return request<IZone>('put', '/zone/inactivate', undefined, {
      params: { zoneId },
    });
  },

  reactivate: (zoneId: string): Promise<void> => {
    return request<void>('put', '/zone/reactivate', undefined, {
      params: { zoneId },
    });
  },

};
