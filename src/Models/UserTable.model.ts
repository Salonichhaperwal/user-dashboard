export interface User {
    id: number;
    name: string;
    email: string;
    address: { city: string; street: string; zipcode: string };
    company: { name: string };
  }
  
export interface Props {
    users: User[];
    deleteUser: (id: number) => void;
  }
