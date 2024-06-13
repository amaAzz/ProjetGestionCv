export interface Sprint {
    sprintId: number | null;
    sprintNumber: number | null;
    startDate : Date | null;
    endDate : Date | null;
    targetVelocity : number | null;
    achievedVelocity :  number | null;
}