import { Contact } from "./contact";

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    dob?: string;
    contact?: Contact
    createdAt: string;
    updatedAt: string;
}