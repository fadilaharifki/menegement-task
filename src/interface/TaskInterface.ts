export interface Task {
  id: number;
  title: string;
  avatar: boolean;
  developer: string;
  status: string;
  statusClass?: string;
  priority: string;
  priorityClass?: string;
  type: string;
  typeClass?: string;
  estimatedSP: string | number;
  actualSP: string | number;
  isDropdownOpen?: boolean;
  newDeveloper?: string;
}
