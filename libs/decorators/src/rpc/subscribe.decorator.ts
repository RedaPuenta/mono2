import { AppConfigType } from '@lib/configs';
import { appRegistry } from '@lib/registrys';
import { applyDecorators } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

export function Subscribe(
  config: AppConfigType,
  pattern: string,
  type: 'message' | 'event' = 'message',
) {
  const { pattern: patternBase } = appRegistry[config.name];
  const target = `${patternBase}:${pattern}`;
  return applyDecorators(
    type === 'message' ? MessagePattern(target) : EventPattern(target),
  );
}
