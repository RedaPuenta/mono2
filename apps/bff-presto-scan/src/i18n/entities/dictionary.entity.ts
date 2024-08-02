import { DictionaryEntityObjectGQL } from '@lib/data';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DictionaryEntity extends DictionaryEntityObjectGQL {}
