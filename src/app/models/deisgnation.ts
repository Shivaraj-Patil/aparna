export interface Designation {
    designation: string;
    add_reportee: boolean;
}

export interface Roles {
    designations: Designation[];
}

export const roles: Roles = {
    designations: [
        {
            designation: "CEO",
            add_reportee: true
        },
        {
            designation: "CTO",
            add_reportee: true
        },
        {
            designation: "Team Lead",
            add_reportee: true
        },
        {
            designation: "Manager",
            add_reportee: true
        },
        {
            designation: "Developer",
            add_reportee: false
        }
    ]
};