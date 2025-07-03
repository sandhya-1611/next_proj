import { hashPassword } from "@/app/utils/hashPassword";

export const usersData = [
    {
      id: "u1",
      email: "admin@dentalflow.com",
      name: "Admin User",
      isAdmin: true,
      hashedPassword: hashPassword("admin123") // NEVER hardcode passwords
    },
    {
      id: "u2",
      email: "john.doe@example.com",
      name: "John Doe",
      isAdmin: false,
      patientId: "p1",
      hashedPassword: hashPassword("patient123")
    },
    {
      id: "u3",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      isAdmin: false,
      patientId: "p2",
      hashedPassword: hashPassword("patient456")
    }
  ];