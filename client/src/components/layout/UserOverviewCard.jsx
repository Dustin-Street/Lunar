export default function UserOverviewCard({ user }) {
  return (
    <div className=" bg-gray-700/78 rounded-2xl p-6 max-w-2xl text-center text-amber-100 shadow-sm shadow-blue-200 animate-fadeIn md:text-xl lg:text-2xl font-serif">
      <h2 className="m-4">Welcome back, {user?.username}!</h2>
      <p>Here's a quick overview of your recent activity:</p>
      <ul className="text-left m-4 space-y-4">
        <li>You have made 15 journal entries this month.</li>
        <li> Your average mood rating is 3.8/5.</li>
        <li> Your most common mood is "Happy".</li>
        <li> Your most active journaling day is Tuesday.</li>
      </ul>
    </div>
  );
}
