import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ANNOUNCEMENT_CREATED_EVENT,
  ANNOUNCEMENT_CREATED_MESSAGE,
  ANNOUNCEMENT_GATEWAY_NAMESPACE,
} from '../announcement.events';
import { GetAnnouncementDto } from '../dto/get-announcement.dto';

@WebSocketGateway({
  namespace: ANNOUNCEMENT_GATEWAY_NAMESPACE,
  cors: { origin: true },
})
export class AnnouncementGateway {
  @WebSocketServer()
  private readonly server: Server;

  @OnEvent(ANNOUNCEMENT_CREATED_EVENT)
  handleAnnouncementCreated(announcement: GetAnnouncementDto): void {
    this.server?.emit(ANNOUNCEMENT_CREATED_MESSAGE, announcement);
  }
}
