export interface User {
  userId?: number;
  nameOfUser: string;
  codeMeli: string;
  userName: string;
  birthDate: string;
  password: string;
  profilePicture?: File|null;
  profilePicturePath?: string;
}
