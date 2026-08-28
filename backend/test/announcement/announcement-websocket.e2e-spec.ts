import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { io, Socket } from 'socket.io-client';
import { SetupHelper } from '../testing/helpers/setup.helper';
import { SetupTestingData } from '../testing/interfaces/setup.interface';
import {
  ANNOUNCEMENT_CREATED_MESSAGE,
  ANNOUNCEMENT_GATEWAY_NAMESPACE,
} from 'src/announcement/announcement.events';
import { CreateAnnouncementDto } from 'src/announcement/dto/create-announcement.dto';
import { GetAnnouncementDto } from 'src/announcement/dto/get-announcement.dto';
import { CategoryEntity } from 'src/category/entities/category.entity';

const WEBSOCKET_MESSAGE_TIMEOUT_MS = 10000;

describe('AnnouncementGateway (e2e)', () => {
  let testHelper: SetupHelper;
  let categories: CategoryEntity[];
  let baseUrl: string;
  let socket: Socket;

  const waitForAnnouncementCreated = (): Promise<GetAnnouncementDto> =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('announcementCreated was not received')),
        WEBSOCKET_MESSAGE_TIMEOUT_MS,
      );

      socket.once(
        ANNOUNCEMENT_CREATED_MESSAGE,
        (announcement: GetAnnouncementDto) => {
          clearTimeout(timeout);
          resolve(announcement);
        },
      );
    });

  const connectSocket = (): Promise<void> =>
    new Promise((resolve, reject) => {
      socket = io(`${baseUrl}/${ANNOUNCEMENT_GATEWAY_NAMESPACE}`, {
        transports: ['websocket'],
        reconnection: false,
      });

      socket.once('connect', () => resolve());
      socket.once('connect_error', (error) => reject(error));
    });

  beforeAll(async () => {
    testHelper = new SetupHelper();
    const setupData: SetupTestingData = await testHelper.createSetupApp();

    categories = setupData.categories;

    const port = await testHelper.listenOnRandomPort();
    baseUrl = `http://127.0.0.1:${port}`;

    await connectSocket();
  }, 60000);

  afterAll(async () => {
    socket?.disconnect();
    await testHelper.close();
  });

  beforeEach(async () => {
    await testHelper.truncateAnnouncements();
  });

  it('pushes the created announcement to a subscribed client', async () => {
    const receivedAnnouncement = waitForAnnouncementCreated();

    const createResponse = await request(baseUrl)
      .post('/v1/announcements')
      .send({
        title: 'Storm warning for the weekend',
        body: 'A strong storm front is expected on Saturday evening',
        publicationDate: '2026-08-28T08:55:00.000Z',
        categoryIds: [categories[0].id],
      } as CreateAnnouncementDto)
      .expect(HttpStatus.CREATED);

    const announcement = await receivedAnnouncement;

    expect(announcement.id).toBe(createResponse.body.id);
    expect(announcement.title).toBe('Storm warning for the weekend');
    expect(announcement.categories.map((category) => category.id)).toEqual([
      categories[0].id,
    ]);
  });

  it('does not push anything when the create request is rejected', async () => {
    let receivedMessageCount = 0;
    socket.on(ANNOUNCEMENT_CREATED_MESSAGE, () => {
      receivedMessageCount += 1;
    });

    await request(baseUrl)
      .post('/v1/announcements')
      .send({
        body: 'Missing every other required field',
      } as CreateAnnouncementDto)
      .expect(HttpStatus.BAD_REQUEST);

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(receivedMessageCount).toBe(0);

    socket.off(ANNOUNCEMENT_CREATED_MESSAGE);
  });
});
