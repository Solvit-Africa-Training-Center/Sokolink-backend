export interface UserInterface {
  name: string;
  email: string;
  roleId: string;
  password: string;
  roleName?: string;
  businessName?: string;       // Only for Wholesaler
  phoneNumber?: string;
  status?: 'pending' | 'approved' | 'rejected';  // Only for Wholesaler
  legalDocument?: string;      // Only for Wholesaler
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}


export interface ProfileInterface {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export type AddUserInterface = Omit<UserInterface, 'createdAt' | 'updatedAt'>;
export interface GetAllUsers {
  users: UserInterface[];
}
