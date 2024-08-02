import { ControlAgentComposeInputGQL, FpsEntityInputGQL } from '@lib/data';
import { Field, InputType, PickType } from '@nestjs/graphql';
import { PictureComposeInputGQL } from '../../common/compose/picture';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId } from 'class-validator';

@InputType()
export class CommentsDto {
  @ApiProperty({ type: ControlAgentComposeInputGQL })
  @Field(() => ControlAgentComposeInputGQL)
  agent!: ControlAgentComposeInputGQL;

  @ApiProperty({ type: String })
  @Field()
  @IsDateString()
  creationDatetime!: string;

  @ApiProperty({ type: String })
  @Field()
  text!: string;
}

@InputType()
export class FpsPicture extends PickType(PictureComposeInputGQL, [
  'data',
  'mimeType',
  'description',
  'pictureDatetime',
  'contentURL',
] as const) {}

@InputType()
export class CreateFpsDto extends PickType(FpsEntityInputGQL, [
  'upsId',
  'type',
  'rootFineLegalId',
  'terminalId',
  'licensePlate',
  'vehicle',
  'parkId',
  'statementDatetime',
  'paymentStatus',
] as const) {
  @Field()
  @ApiProperty({ type: String })
  @IsMongoId()
  sessionId!: string;

  @Field()
  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string;

  @Field(() => [CommentsDto])
  @ApiProperty({ type: [CommentsDto] })
  comments!: CommentsDto[];

  @Field(() => [FpsPicture])
  @ApiProperty({ type: [FpsPicture] })
  pictures!: FpsPicture[];
}
