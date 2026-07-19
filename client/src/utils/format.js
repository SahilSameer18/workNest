// utils/format.js

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatRole = (role) => {
  if (!role) return '';
  const roleMap = {
    'SUPER_ADMIN': 'Super Admin',
    'HR_MANAGER': 'HR Manager',
    'EMPLOYEE': 'Employee'
  };
  return roleMap[role] || role;
};

export const dateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Returns YYYY-MM-DD
  return date.toISOString().split('T')[0];
};

export const formatSalary = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
