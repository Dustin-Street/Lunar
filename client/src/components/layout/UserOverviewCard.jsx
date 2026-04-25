import { useState, useEffect } from "react";
import LunarButton from "./LunarButton";
import { useNavigate } from "react-router-dom";
//must setup state that ties into useAccount Call to userStatistics
export default function UserOverviewCard({ stats, user, statisticsloading }) {
  const [userStatistics, setUserStatistics] = useState(stats);
  const [statsLoading, setStatsLoading] = useState(statisticsloading);
  const navigate = useNavigate();

  useEffect(() => {
    setUserStatistics(stats);
  }, [stats]);

  useEffect(() => {
    setStatsLoading(statisticsloading);
  }, [statisticsloading]);

  console.log(userStatistics);

  if (statsLoading && userStatistics?.statistics.hasStatistics === true) {
    return (
      <div>
        <div className="bg-gray-700/10 rounded-lg p-6 max-w-2xl text-center justify-self-center text-amber-100 md:text-xl lg:text-lg font-serif animate-pulse">
          {/* Username skeleton */}
          <div className="h-12 w-40 bg-gray-800/40 rounded-lg mx-auto mb-4 animate-pulse"></div>

          {/* Activity Report skeleton */}
          <div className="h-8 w-32 bg-gray-800/40 rounded-lg mx-auto mb-6 animate-pulse"></div>

          <ul className="m-6 space-y-4">
            {/* Row 1 */}
            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-34 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>

            {/* Row 2 */}
            <li className="flex justify-between items-center border px-4 py-3 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-42 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>

            {/* Row 3 */}
            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-44 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>
          </ul>
        </div>

        <LunarButton
          text={"Start Journaling"}
          onclick={() => navigate("/JournalSelect")}
        />
      </div>
    );
  }
  return (
    <div>
      {userStatistics?.statistics.hasStatistics === true ? (
        <div className=" bg-gray-700/10 rounded-lg p-6 max-w-2xl text-center justify-self-center text-amber-100  animate-fadeIn md:text-xl lg:text-lg font-serif">
          <h2 className="m-4 md:text-2xl lg:text-3xl">
            {user?.username || "User"}
          </h2>
          <h2>Activity Report</h2>
          <ul className="m-4 space-y-4">
            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span>Entries this month</span>
              <span className="text-blue-200 border px-3 py-1 rounded-2xl m-3  bg-linear-60 from-gray-700 to-gray-900">
                {userStatistics?.statistics.monthlyEntries} Enties
              </span>
            </li>

            <li className="flex justify-between items-center border px-4 py-3 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span>Most common day</span>
              <span className="text-blue-200 border px-3 py-1 rounded-2xl m-2  bg-linear-60 from-gray-700 to-gray-900">
                {userStatistics?.statistics.commonDay}
              </span>
            </li>

            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span>Most common mood is</span>
              <span className="text-blue-200 border px-3 py-1 rounded-2xl m-3  bg-linear-60 from-gray-700 to-gray-900">
                {userStatistics?.statistics.commonMood}
              </span>
            </li>
          </ul>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="m-4 md:text-2xl lg:text-3xl text-center text-amber-100 font-bold">
            {user?.username || "User"}
          </h2>
          <div
            name="welcomeNewUser"
            className="text-amber-100 text-md md:text-lg"
          >
            <p>
              Welcome to Lunar, core journaling feature are free to use get
              started here
            </p>
          </div>
        </div>
      )}

      <LunarButton
        text={"Start Journaling"}
        onclick={() => {
          navigate("/JournalSelect");
        }}
      />
    </div>
  );
}
