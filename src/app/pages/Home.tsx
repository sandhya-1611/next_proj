import Login from "../components/Login";

export default function Home() {
  return (
   <div className="bg-gray-100 flex-col gap-4 min-h-screen flex items-center justify-center">
    <h1 className="text-4xl font-bold">DentalFlow</h1>
    <Login />
   </div>
  );
}