export interface Employee {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  managerId: number;
  managerName: string;
  children: Employee[];
}