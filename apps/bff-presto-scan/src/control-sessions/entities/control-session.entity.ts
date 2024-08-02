import { ControlSessionEntityObjectGQL } from '@lib/data';
import { Field, ObjectType } from '@nestjs/graphql';
import { ControlCameraEventEntity } from '../../camera-events/entities/camera-event.entity';
import { UpsEntity } from '../../ups/entities/ups.entity';

@ObjectType()
export class TerminalStateEntity {
  @Field(() => String)
  name!: string;
  @Field(() => Number)
  terminalId!: number;
  @Field(() => String, { nullable: true })
  startDate?: string | null;
  @Field(() => String, { nullable: true })
  endDate?: string | null;
}

@ObjectType()
export class ControlSessionEntity extends ControlSessionEntityObjectGQL {
  //! Resolver GQL
  @Field(() => TerminalStateEntity)
  terminalState!: TerminalStateEntity;

  //! Resolver GQL
  @Field(() => ControlCameraEventEntity)
  entryEvent!: ControlCameraEventEntity;

  //! Resolver GQL
  @Field(() => ControlCameraEventEntity, { nullable: true })
  exitEvent?: ControlCameraEventEntity | null;

  //! Resolver GQL
  @Field(() => UpsEntity)
  ups!: UpsEntity;

  //! Resolver GQL
  @Field(() => Boolean)
  previousClaimsForUser!: boolean;

  //! Resolver GQL
  @Field(() => Boolean)
  allTerminalsAreAlive!: boolean;
}
