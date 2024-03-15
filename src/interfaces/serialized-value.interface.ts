export interface SerializedValue {
  dataType: "date" | "class" | "instance" | "object";
  value: unknown;
  metadata?: string;
  instanceId?: string;
}
