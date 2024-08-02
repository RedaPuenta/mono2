import { CoverComposeCV } from '@lib/data';
import { Subscribe } from '@lib/decorators';
import { MessagingService, WorkflowService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { DateTime, Interval } from 'luxon';
import { appConfig, cronConfig } from '../common/config/config';
import { AnonymizationService } from '../common/flows/anonymization/anonymization.service';
import { SessionRefreshService } from '../common/flows/session-refresh/session-refresh.service';
import { Paginated, ReadDto, SearchDto } from '../common/types/generic.dto';
import { ParkingRight } from '../common/types/parking-right';
import { UpdateSessionDto } from './dto/update-session';
import { ControlSession } from './entities/controlSession.entity';

@Controller()
export class ControlSessionsController {
  constructor(
    private messagingService: MessagingService,
    private workflowService: WorkflowService,
  ) {}

  @Subscribe(appConfig(), `sessions:read`)
  async read(@Payload() { id }: ReadDto): Promise<ControlSession> {
    const { session } = await this.messagingService.send<{
      session: ControlSession;
    }>({
      app: 'MS_CONTROL',
      pattern: 'sessions:read',
      payload: {
        id,
      },
    });

    return session;
  }

  @Subscribe(appConfig(), `sessions:search`)
  async search(
    searchParams: SearchDto<ControlSession>,
  ): Promise<Paginated<ControlSession>> {
    const { list, paging } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'sessions:search',
      payload: searchParams,
    });

    return { list, paging };
  }

  @Subscribe(appConfig(), `sessions:update`)
  async update(
    @Payload() updateParams: UpdateSessionDto,
  ): Promise<{ session: ControlSession }> {
    const { session } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'sessions:update',
      payload: updateParams,
    });
    return { session };
  }

  async fetchNewSessionTickets(
    session: ControlSession,
  ): Promise<ParkingRight[]> {
    const tickets = await this.messagingService.send<ParkingRight[]>({
      app: 'API_LEGACY',
      pattern: 'parking-rights:search',
      payload: {
        upsId: session.upsId,
        lpn: session.lpn,
        startDate: session.startDate,
      },
    });

    return tickets.filter(
      (ticket: any) =>
        !this.ticketAlreadyExists(
          ticket,
          (session.covers || []).filter(
            (cover: any) => cover.coverType === 'SHORT_TERM',
          ),
        ),
    );
  }

  @Cron(cronConfig().sessionRefresh)
  @Subscribe(appConfig(), `sessions:refresh-tickets`)
  async refreshSessionsTickets() {
    console.log('Refreshing sessions tickets ...', true);
    const start = DateTime.now();

    await this.workflowService.run<any>({}, [SessionRefreshService]);

    console.log(
      `Sessions tickets refreshed in ${Interval.fromDateTimes(
        start,
        DateTime.now(),
      )
        .toDuration()
        .toHuman()}`,
      false,
      true,
    );

    return true;
  }

  @Cron(cronConfig().sessionAnonymization)
  @Subscribe(appConfig(), `sessions:anonymize`)
  async anonymizeUserData() {
    const start = DateTime.now();
    console.log('Launching anonymization workflow ...', true, false);

    await this.workflowService.run<any>({ context: {} }, [
      AnonymizationService,
    ]);

    console.log(
      `Anonymization workflow done in ${Interval.fromDateTimes(
        start,
        DateTime.now(),
      )
        .toDuration()
        .toHuman()}`,
      false,
      true,
    );
    return true;
  }

  periodAndTicketMatches = (period: CoverComposeCV, ticket: ParkingRight) =>
    period.startDate === ticket.startDate && period.endDate === ticket.endDate;

  ticketAlreadyExists = (ticket: ParkingRight, tickets: CoverComposeCV[]) =>
    tickets.some((period) => this.periodAndTicketMatches(period, ticket));
}
