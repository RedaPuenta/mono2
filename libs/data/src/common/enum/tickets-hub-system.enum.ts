import { registerEnumType } from '@nestjs/graphql';

export enum TicketHubSystemEnum {
  iem = 'iem',
  prestopark = 'prestopark',
}

registerEnumType(TicketHubSystemEnum, {
  name: 'TicketHubSystemEnum',
});
