import { Board } from "./board";

export interface BoardPage {
    content: Board[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
