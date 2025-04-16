export const getStatusClass = (status: string) => {
  switch (status) {
    case "Waiting for Review":
      return "bg-orange-600";
    case "In Progress":
      return "bg-yellow-600";
    case "Ready to Start":
      return "bg-green-600";
    case "Pending Deploy":
      return "bg-blue-600";
    case "Done":
      return "bg-gray-600";
    case "Stuck":
      return "bg-red-600";
    default:
      return "bg-zinc-800";
  }
};

export const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-700";
    case "High":
      return "bg-orange-600";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    case "Best Effort":
      return "bg-slate-400";
    default:
      return "bg-zinc-800";
  }
};

export const getTypeClass = (type: string) => {
  switch (type) {
    case "Feature Enhancements":
      return "bg-purple-700";
    case "Bug":
      return "bg-red-700";
    case "Other":
      return "bg-blue-700";
    default:
      return "bg-zinc-800";
  }
};
