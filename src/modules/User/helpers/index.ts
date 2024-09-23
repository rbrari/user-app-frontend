import { z } from 'zod';

export enum UserAction {
  CREATE = 'create'
}

export enum EducationLevel {
  Bachelor = 'Bachelor',
  Master = 'Master',
  HighSchool = 'High School'
}

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  surname: z.string().min(1, 'Surname is required.'),
  email: z.string().email('Invalid email address.'),
  birthday: z.string().refine(
    (val) => {
      const parsedDate = new Date(val);

      const isValidFormat = val.match(/^\d{4}-\d{2}-\d{2}$/);
      const isValidDate =
        parsedDate instanceof Date && !isNaN(parsedDate.getTime());

      const [year, month, day] = val.split('-').map(Number);
      const isCorrectDate =
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() + 1 === month &&
        parsedDate.getUTCDate() === day;

      return isValidFormat && isValidDate && isCorrectDate;
    },
    {
      message: 'Invalid data, age must be between 12 and 100 years old.'
    }
  ),
  education: z.nativeEnum(EducationLevel).optional(),
  id: z.string().optional(),
  lastUpdated: z.string().optional()
});

export type User = z.infer<typeof userSchema>;

export type UserForm = Omit<User, 'id' | 'lastUpdated'>;

export type TableUser = UserForm & { id: string; lastUpdated: string };

export const emptyForm: UserForm = {
  name: '',
  surname: '',
  email: '',
  education: undefined,
  birthday: '2000-09-11'
};
