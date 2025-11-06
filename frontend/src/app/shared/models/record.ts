export interface Record {
    id: number;
    name: string;
    record_type_id: number;
    record_type: RecordType;
    created_at: Date;
    updated_at: Date;
}

export interface RecordType {
    id: number;
    name: string;
    description: string;
}