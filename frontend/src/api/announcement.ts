import api from "src/lib/lib";
import {
  AnnouncementListType,
  AnnouncementQueryType,
  AnnouncementType,
  CreateAnnouncementType,
  UpdateAnnouncementType,
} from "src/types/announcement";
import { buildAnnouncementQueryString } from "src/api/utils/announcementQuery";

export const announcementApi = {
  getAnnouncements: (
    query: AnnouncementQueryType,
  ): Promise<AnnouncementListType> =>
    api.get(`/v1/announcements${buildAnnouncementQueryString(query)}`),
  getAnnouncement: (id: number): Promise<AnnouncementType> =>
    api.get(`/v1/announcements/${id}`),
  createAnnouncement: (
    data: CreateAnnouncementType,
  ): Promise<AnnouncementType> => api.post("/v1/announcements", data),
  updateAnnouncement: (
    id: number,
    data: UpdateAnnouncementType,
  ): Promise<AnnouncementType> => api.patch(`/v1/announcements/${id}`, data),
  deleteAnnouncement: (id: number): Promise<void> =>
    api.delete(`/v1/announcements/${id}`),
};
