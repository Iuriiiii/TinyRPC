export interface BinaryValue {
  dataType: "date" | "class" | "instance" | "object";
  value: unknown;
  reference?: string;
}
