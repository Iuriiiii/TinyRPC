import type { Constructor } from "../types/mod.ts";

export interface MemberMetadata {
  /**
   * Name of the member to be used on the SDK.
   */
  name: string;

  /**
   * Whether the member is optional or not.
   */
  optional: boolean;

  /**
   * Data type of the member.
   * If string, it will be hardcoded to the param type.
   */
  dataType: Constructor | string;

  /**
   * Default value of the member.
   */
  defaultValue?: string;

  /**
   * Whether the member is nullable or not.
   */
  nullable?: boolean;

  /**
   * Whether the member is private or not.
   */
  private?: boolean;

  /**
   * Whether the member is readonly or not.
   */
  readonly?: boolean;

  /**
   * Sync this value on SDK module instance when this member is returned
   * by an exported method.
   */
  autoSync?: boolean;

  /**
   * Set member as constructor param, value will be used as param
   * position.
   */
  constructorParam?: number;
}
