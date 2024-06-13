import { AccessLevel } from "./access-level";
import { Section } from "./section";
import { TemplateType } from "./template-type";
import { workspace } from "./workspace";

export interface Board {
    boardId: number;
    boardName: string;
    description: string;
    startDate: Date;
    fav:boolean;
    accessLevel:AccessLevel;
    templateType:TemplateType;
    sections:Section[];
    workspace:workspace
}
