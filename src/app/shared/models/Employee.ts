export type Employee = {
    id?: number;
    name: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    position: string;
    showDelete?: boolean; 
}